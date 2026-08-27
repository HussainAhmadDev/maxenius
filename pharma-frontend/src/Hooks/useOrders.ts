import { useNavigate } from "react-router-dom";
import { InvoiceResponse } from "Interfaces/Invoices";
import { QueryPagination } from "Interfaces/QueryFilters";
import { useQuery, useMutation, UseQueryResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { queryStringify } from "Utils/queryString";
import {
  OrderResponse,
  OrderData,
  OrderNote,
  OrderProduct,
  OrderShipmentResponse,
  OrderProductShipping,
  OrderRefund,
  BulkShipment,
  UpdateDirection,
  FetchOrderProductBatchExpiry,
  ResponseOrderBatch
} from "Interfaces/Order";
import { API_URL, getAccessToken } from "./api";
import { orderCompanyParamKeys, orderParamsGeneralKeys } from "Utils/queryParamKeys";
import { useBrand } from "Context/BrandContext";
import { useContext } from "react";
import ShippingReturnContext from "Context/ShippingReturnContext";
import { IReturnInfo } from "Interfaces/ShippingReturn";

export const useOrders = (searchParams: URLSearchParams) => {
  const { activeBrand } = useBrand();
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  const companyParams: Record<string, string> = {};
  const billingShippingParams: Record<string, string> = {};
  const generalParams: Record<string, string> = {
    brand_id: (searchParams.get("brand_id") as string) || activeBrand,
    // If we're on the trash page, include the is_trash query param to search for trashed orders.
    ...(searchParams.has("is_trash") ? { is_trash: "True" } : { is_trash: "False" })
  };

  orderParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });

  orderCompanyParamKeys.forEach(key => {
    if (searchParams.has(key)) {
      companyParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<OrderResponse, Error>(["orders", searchParams.toString()], async () => {
    if (!activeBrand) {
      throw new Error("Active brand is not available.");
    }
    const response = await fetch(
      `${API_URL}/orders/list/${queryStringify({
        ...pagination,
        ...generalParams,
        ...billingShippingParams,
        ...companyParams,
        sorting: "-created"
      })}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );
    // const response = await fetch(`${API_URL}/orders/list/`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${getAccessToken()}`
    //   }
    // });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

export const useOrder = (id: string): UseQueryResult<OrderData, Error> => {
  return useQuery<OrderData, Error>(
    ["orders", id],
    async () => {
      const response = await fetch(`${API_URL}/custom_order_raw/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      enabled: !!id,
      staleTime: 60000 // 1 minute, adjust this value as needed
    }
  );
};

interface OrderRequest {
  readonly company_id: string;
  readonly brand_id: string;
  readonly contact_id: string;
  readonly website_id: string;
}

export const useCreateOrder = () => {
  const navigate = useNavigate();
  return useMutation<OrderData, Error, OrderRequest>(
    "create-order",
    async (variables: OrderRequest) => {
      const response = await fetch(`${API_URL}/order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating order.");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        localStorage.setItem("current_order", data.id);

        navigate(`/orders/${data.id}`, {
          state: { customerId: data.company_id }
        });
      },
      onError: () => {
        toast.error(
          "Error in creating order. Customer might not have billing and shipping contacts."
        );
      }
    }
  );
};

interface SendInvoiceInterface {
  email_subject: string;
  email_body: string;
  email_to: string[];
  email_cc: string[];
  email_bcc: string[];
}
export const useSendEmailInvoice = (id: string) => {
  return useMutation<SendInvoiceInterface, Error, SendInvoiceInterface>(
    "create-order",
    async (variables: SendInvoiceInterface) => {
      const response = await fetch(`${API_URL}/order/${id}/send/invoice/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Email Invoice Sent Successfully");
      },
      onError: () => {
        toast.error("Couldn't send Email Invoice ");
      }
    }
  );
};

interface AddOrderProps {
  product_id: string;
}
interface AddOrderProducts {
  product_ids: string[];
}
//testing

export const useAddOrderProducts = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, AddOrderProducts>(
    async (variables: AddOrderProducts) => {
      const response = await fetch(`${API_URL}/order/${id}/products/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in adding products in order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", id]);
        toast.success("Products successfully added to the order.");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useAddOrderProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, AddOrderProps>(
    async (variables: AddOrderProps) => {
      const response = await fetch(`${API_URL}/order/${id}/product/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in adding product in order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", id]);
        toast.success("Product successfully added to the order.");
      },
      onError: () => {
        toast.error("Couldn't add product to the order.");
      }
    }
  );
};

export const useEditOrder = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    OrderData,
    Error,
    {
      source?: string;
      shipping_cost?: number;
      is_standing_order?: boolean;
      category?: string;
      tax_rate?: number;
      company_id?: string;
      contact_id?: string;
      status?: string;
      quickbook_reference_number?: string;
    }
  >(
    async variables => {
      const response = await fetch(`${API_URL}/order/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in adding products in order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", id]);
        toast.success("Order Edit Successfully");
      },
      onError: () => {
        toast.error("Couldn't edit the order.");
      }
    }
  );
};

interface customTaxRate {
  has_custom_tax_rate: boolean;
  custom_tax_percentage: number;
}

export const useEditOrderTaxRate = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<customTaxRate, Error, customTaxRate>(
    "edit-order-tax",
    async variables => {
      const response = await fetch(`${API_URL}/order/${orderId}/tax/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in editing order tax rate.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
        toast.success("Order tax rate updated successfully.");
      },
      onError: () => {
        toast.error("Error in editing order tax rate.");
      }
    }
  );
};

export const useEditOrderProduct = (orderId: string, productId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, Partial<OrderProduct>>(
    "add-order-product",
    async variables => {
      const { id = "" } = variables;
      const withoutId = { ...variables };
      delete withoutId?.id;
      delete withoutId.product_id;
      const response = await fetch(
        `${API_URL}/order/${orderId}/product/${id ? id : productId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(withoutId)
        }
      );
      if (!response.ok) {
        throw new Error("Error in editing products in order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
        toast.success("Line item updated successfully.");
      },
      onError: () => {
        toast.error("Error in Editing line item.");
      }
    }
  );
};

export const useDeleteOrderProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, AddOrderProps>(
    async variables => {
      "delete-order-products";
      const response = await fetch(
        `${API_URL}/order/${id}/product/${variables?.product_id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error("Error in deleting line item.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", id]);
        toast.success("Line item deleted from the order.");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useCreateOrderNote = (orderID: string) => {
  const queryClient = useQueryClient();
  return useMutation<OrderNote, Error, Omit<OrderNote, "id" | "created">>(
    async variables => {
      const response = await fetch(`${API_URL}/order/${orderID}/note/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating order.");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(["orders", orderID]);
        toast.success(`A ${data.type} note has been added to the order.`);
      }
    }
  );
};

export const useGetBatchAndExpiry = () => {
  // const queryClient = useQueryClient();
  return useMutation<ResponseOrderBatch[], Error, FetchOrderProductBatchExpiry>(
    async variables => {
      const response = await fetch(`${API_URL}/ordered_product_batch_details`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in Getting Batch and Expiry ");
      }
      return response.json();
    }
  );
};

export const useUpdateBatchAndExpiry = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseOrderBatch[], Error, ResponseOrderBatch>(
    async variables => {
      const id = variables.id;
      //eslint-disable-next-line
      //@ts-ignore
      delete variables.id;
      const response = await fetch(`${API_URL}/purchase_order_receive_update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        toast.error("Error in Update Batch and Expiry ");
        throw new Error("Error in Getting Batch and Expiry ");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);
      }
    }
  );
};

export const useDeleteOrderNote = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { noteId: string }>(
    async variables => {
      "delete-order-note";
      const response = await fetch(`${API_URL}/order/${id}/note/${variables?.noteId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok && response.status !== 204) {
        throw new Error("Error deleting order note.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", id]);
        toast.success("Order Note deleted successfully.");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useOrderShipment = (orderId: string) => {
  return useQuery<OrderShipmentResponse, Error>(
    ["order-shipments", orderId],
    async () => {
      const response = await fetch(`${API_URL}/order/${orderId}/shipping/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      enabled: !!orderId
    }
  );
};

export const useGetInvoices = (orderId: string) => {
  return useQuery<InvoiceResponse, Error>("order-invoices", async () => {
    const response = await fetch(`${API_URL}/order/${orderId}/invoice/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

export const useAddOrderReturn = (orderId: string) => {
  const { setReturnInfo } = useContext(ShippingReturnContext);

  setReturnInfo(null);
  const queryClient = useQueryClient();
  return useMutation<
    IReturnInfo,
    Error,
    { quantity: number | undefined; ordered_product_id: string }
  >(
    ["create-order-return", orderId],
    async variables => {
      const response = await fetch(
        `${API_URL}/order/${orderId}/return/${variables.ordered_product_id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({ quantity: variables.quantity })
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: data => {
        setReturnInfo(data);
        queryClient.invalidateQueries(["orders", orderId]);
        toast.success("Return added successfully");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  );
};

export const useUpdateOrderReturn = (orderId: string) => {
  const { setReturnInfo } = useContext(ShippingReturnContext);

  setReturnInfo(null);
  const queryClient = useQueryClient();
  return useMutation<
    IReturnInfo,
    Error,
    { quantity: number; ordered_product_id: string; return_id?: string }
  >(
    ["update-order-return", orderId],
    async variables => {
      const response = await fetch(
        `${API_URL}/order/${orderId}/return/${variables.ordered_product_id}/${variables.return_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({ quantity: variables.quantity })
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: data => {
        setReturnInfo(data);
        queryClient.invalidateQueries(["orders", orderId]);
        toast.success("Return added successfully");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  );
};

export const useAddOrderRefund = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    OrderRefund,
    Error,
    {
      payment_id?: string;
      user_id: string;
      brand_id: string;
      company_id: string;
      order_id: string;
      payment_provider: string;
      total: number;
      receipt?: string;
    }
  >(
    ["create-order-refund", orderId],
    async variables => {
      const withoutId = { ...variables };
      delete withoutId.payment_id;
      const response = await fetch(
        `${API_URL}/order/${orderId}/refund/${variables.payment_id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(withoutId)
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
        toast.success("Refund added successfully");
      },
      onError: error => {
        toast.error(error.message || "something went wrong.");
      }
    }
  );
};

export const useAddOrderShipment = (orderId: string) => {
  // const { setShippingInfo } = useContext(ShippingReturnContext);
  const queryClient = useQueryClient();
  return useMutation<
    OrderShipmentResponse,
    Error,
    Omit<OrderProductShipping, "id" | "created">
  >(
    ["create-order-shipment", orderId],
    async variables => {
      delete variables["total_quantity"];
      delete variables["returned_quantity"];

      const response = await fetch(`${API_URL}/order/${orderId}/shipping/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
        // setShippingInfo({
        //   shipped_quantity: data.quantity,
        //   product_id: data.ordered_product_id,
        //   ship_date: data.ship_date ?? null,
        //   id: data?.id
        // });
        toast.success("Shipment added successfully");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  );
};

export const useEditOrderProductShipping = (orderId: string) => {
  // const { setShippingInfo } = useContext(ShippingReturnContext);

  const queryClient = useQueryClient();
  return useMutation<
    OrderProductShipping,
    Error,
    {
      ordered_product_id: string;
      quantity?: number;
      ship_date?: string;
      shipmentId?: string;
    }
  >(
    async variables => {
      const { shipmentId = "" } = variables;
      const withoutId = { ...variables };
      delete withoutId.shipmentId;

      const updatedObject = {
        ...withoutId,
        ship_date: withoutId?.ship_date?.length
          ? new Date(withoutId?.ship_date)
          : withoutId?.ship_date
      };

      const response = await fetch(
        `${API_URL}/order/${orderId}/shipping/${shipmentId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(updatedObject)
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message);
        throw new Error(data?.message);
      } else {
        toast.success(data?.message);
      }

      return data;
    },
    {
      onSuccess: async data => {
        queryClient.invalidateQueries(["orders"]);
        queryClient.invalidateQueries(["order-shipments", orderId]);

        toast.success("Order's product's shipping edited successfully");
        // setShippingInfo({
        //   shipped_quantity: data.quantity,
        //   product_id: data.ordered_product_id,
        //   ship_date: data.ship_date ?? null,
        //   id: data?.id
        // });
        return data;
      }
    }
  );
};

export const useTrashOrder = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { orderId?: string }>(
    async variables => {
      "delete-order";

      const response = await fetch(`${API_URL}/order/${id ? id : variables.orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });
      if (!response.ok || response.status === 204) {
        throw new Error("Error in deleting order.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
        toast.success("Order trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useRestoreOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: string }>(
    "order-restoration",
    async variables => {
      const response = await fetch(`${API_URL}/order/${variables.orderId}/restore/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) {
        throw new Error("Error in restoring order.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while restoring order.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);
        toast.success("Order restored successfully.");
      }
    }
  );
};

export const useBulkShipment = () => {
  const { activeBrand } = useBrand();

  return useMutation<void, Error, BulkShipment>(
    "bulk-shipment",
    async variables => {
      const response = await fetch(
        `${API_URL}/orders/${activeBrand}/products/mark_shipped/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(variables)
        }
      );
      if (response.ok) {
        if (response.headers.get("content-type") === "application/zip") {
          const file = await response.blob();
          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = "Bulk shipments";
          link.click();
          link.remove();
        } else {
          throw new Error("No orders Changed.");
        }
      }
      if (!response.ok) {
        throw new Error("An error occured while adding bulk shipment.");
      }
    },
    {
      onError: error => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Shipments added.");
      }
    }
  );
};

export const useUdpateDirection = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateDirection,
    Error,
    {
      productOrderID?: string;
      direction?: string | undefined;
    }
  >(
    async variables => {
      const { productOrderID } = variables;
      const withoutId = { ...variables };
      delete withoutId.productOrderID;

      const response = await fetch(`${API_URL}/order/${productOrderID}/directions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(withoutId)
      });
      if (!response.ok) {
        throw new Error("Error editing order's product's direction.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);

        toast.success("Order's product's direction edited successfully");
        // Access the response data here and do something with it
      },
      onError: () => {
        toast.error("Couldn't edit the order's product's direction.");
      }
    }
  );
};

export interface ISelector {
  label: string;
  value: string;
}
export interface IServiceAndProduct {
  network: ISelector[];
  product: ISelector[];
  service: ISelector[];
  shipmentId: number;
  tracking_link: string;
  parcelNumbers: string;
  delivery_instruction: string;
}

export const useServiceAndProductSelect = (
  order_id: number | undefined,
  authorization: string,
  website: string
) => {
  return useQuery<IServiceAndProduct, Error>(
    ["serviceAndProduct", order_id, authorization],
    async () => {
      if (!order_id || !authorization) {
        return []; // Return an empty array or handle this case accordingly.
      }

      if (window?.location?.origin?.includes("localhost" || "stage")) {
        return;
      }

      const response = await fetch(
        `${website}/wp-json/inventory/v1/dpd_status?order_id=${order_id}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization
          }
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
    {
      enabled: order_id !== undefined && authorization.length > 0,

      retry: 2, // Retry exactly two times in case of an error.
      staleTime: 600000 // Cache data for 10 minutes (adjust as needed).
    }
  );
};

interface PrintShipping {
  order_id: number | undefined;
  authorization: string;
  website: string;
}
// export const usePrintShipingLabel = (
//   order_id: number | undefined,
//   authorization: string,
//   website: string
// ) => {
//   return useQuery<any, Error>(
//     ["printShipingLabel", order_id, authorization],
//     async () => {
//       if (!order_id || !authorization) {
//         return []; // Return an empty array or handle this case accordingly.
//       }

//       const response = await fetch(
//         `${website}/wp-json/inventory/v1/dpd_print_shipping_label/?order_id=${order_id}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: authorization
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(response.statusText);
//       }

//       return response.json();
//     },
//     {
//       enabled: order_id !== undefined && authorization.length > 0,
//       // Only enable the query when order_id is defined and authorization is not empty.
//       retry: 2 // Retry exactly two times in case of an error.
//     }
//   );
// };

interface ShippingData {
  shippingRef1: string | number;
  shippingRef2: string;
  shippingRef3: string;
  deliveryInstructions: string;
  parcelDescription: string;
  networkCode: string;
}

export const usePrintShipingLabel = (
  order_id: number | undefined,
  authorization: string,
  website: string
) => {
  const mutation = useMutation<PrintShipping, Error, PrintShipping>(
    "post-shipping-data",
    async data => {
      const response = await fetch(
        `${website}/wp-json/inventory/v1/dpd_print_shipping_label/?order_id=${order_id}`,
        {
          method: "POST",
          headers: {
            Authorization: authorization,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post shipping data");
      } else {
        toast.success("Shipping Detail added successfully!");
      }

      return response.json();
    }
  );

  return mutation;
};

const usePostShippingData = (
  order_id: number | undefined,
  authorization: string,
  website: string
) => {
  const mutation = useMutation<ShippingData, Error, ShippingData>(
    "post-shipping-data",
    async data => {
      const response = await fetch(
        `${website}/wp-json/inventory/v1/post_dpd_shipping?order_id=${order_id}`,
        {
          method: "POST",
          headers: {
            Authorization: authorization,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post shipping data");
      } else {
        toast.success("Shipping Detail added successfully!");
      }

      return response.json();
    }
  );

  return mutation;
};

export default usePostShippingData;

interface BarcodeScaning {
  barcode: string;
}
export const useBarcodeScaning = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation<OrderData, Error, BarcodeScaning>(
    "barcode-scaning",
    async (variables: BarcodeScaning) => {
      const response = await fetch(`${API_URL}/order/${orderId}/shipping-by-barcode/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product Added successfully");
        queryClient.invalidateQueries(["orders"]);
      } else {
        toast.error(data.error || "Failed to add product");
        throw new Error(data.error || "Failed to add product");
      }
      return data;
    }
  );
};
