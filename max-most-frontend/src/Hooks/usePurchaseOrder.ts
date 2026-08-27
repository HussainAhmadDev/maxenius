import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  QueryClient
} from "react-query";
import { API_URL, getAccessToken, getBrandDetails, getBrandId, getUserId } from "./api";
import { toast } from "react-toastify";
import {
  EditPurchaseOrderData,
  EditPurchaseOrderProduct,
  PurchaseOrderData,
  PurchaseOrderForm,
  PurchaseOrderPDFResponse,
  PurchaseOrderResponse,
  ReceivingHistorySchema
} from "../Interfaces/PurchaseOrder";
import { QueryPagination } from "../Interfaces/global";
import { purchaseOrderParamsGeneralKeys } from "../Utils/queryParamKeys";
import { queryStringify } from "../Utils/queryString";
import { OrderNote, OrderNoteResponse } from "../Interfaces/Orders";

/**
 * @interface PurchaseOrderForm
 * @property {SelectOption} warehouse - The selected warehouse option.
 * @property {SelectOption} supplier - The selected supplier option.
 * @property {PurchaseOrderProduct[]} products - The list of products in the purchase order.
 * @property {string} vendor_id - The ID of the vendor.
 * @property {string} warehouse_id - The ID of the warehouse.
 * @property {string} unit_cost_amounts - The unit cost amounts.
 * @property {string} invoicing_currency - The currency used for invoicing.
 * @property {string | number} exchange_rate - The exchange rate for currency conversion.
 * @property {string} [currency] - Optional currency field.
 */
/**
 * @interface OrderNoteResponse
 * @property {OrderNote[]} notes - An array of notes associated with the purchase order.
 * @property {number} count - The total number of notes available for the purchase order.
 */

/**
 * @interface OrderNote
 * @property {string} id - The unique identifier for the note.
 * @property {string} created - The date and time when the note was created.
 * @property {string} type - The type of the note (e.g., "comment", "reminder").
 * @property {string} content - The content of the note.
 * @property {string} createdBy - The ID of the user who created the note.
 */

/**
 @interface IuseUpdateReceiving 
  @property {string} id 
  @property {string} purchase_order_id 
  @property {string} product_id 
  @property {string} sku 
  @property {string} is_fully_received
  @property {string} batch_number 
  @property {string} expiry_date 
  @property {number} received_quantity 
  @property {string} invoice_number
 */

/**
 * @interface PurchaseOrderPDFResponse
 * @property {string} exchange_rate - The exchange rate used.
 * @property {string} invoicing_currency - The currency used for invoicing.
 * @property {string} location - The location of the purchase order.
 * @property {string} order_date - The date of the order.
 * @property {number} order_number - The order number.
 * @property {Object[]} products - The list of products in the order.
 * @property {string} products.exchange_price - The exchange price of the product.
 * @property {string} products.exchange_total - The exchange total for the product.
 * @property {string} products.price - The price of the product.
 * @property {string} products.product_name - The name of the product.
 * @property {number} products.quantity - The quantity of the product.
 * @property {string} products.total - The total amount for the product.
 * @property {Object[]} receivings - The list of received items.
 * @property {string} receivings.batch_number - The batch number of the received product.
 * @property {string} receivings.expiry_date - The expiry date of the received product.
 * @property {string} receivings.product_name - The name of the received product.
 * @property {number} receivings.received_quantity - The quantity received.
 * @property {string} vendor_name - The name of the vendor.
 * @property {number} [purchase_order_number] - Optional purchase order number.
 */

/**
 * @interface PurchaseOrderProductForm
 * @property {number} quantity - The quantity of the product.
 * @property {number} price - The price of the product.
 * @property {number} tax - The tax amount for the product.
 * @property {Object} product - The product details.
 * @property {string} product.value - The value of the product.
 * @property {string} product.label - The label of the product.
 * @property {number} product.cost_price - The cost price of the product.
 * @property {number} total - The total amount for the product.
 * @property {string | number} [exchangePrice] - Optional exchange price.
 * @property {string | number} [exchangeTotal] - Optional exchange total.
 * @property {string} product_id - The ID of the product.
 * @property {string} [id] - Optional ID for the product.
 */

/**
 * @interface PurchaseOrderProduct
 * @property {string} receive_quantity - The quantity received.
 * @property {string | null} product_variation_id - The ID of the product variation.
 * @property {string} id - The ID of the purchase order product.
 * @property {string} product_id - The ID of the product.
 * @property {string | null} product_attribute_id - The ID of the product attribute.
 * @property {string | null} shipped_quantity - The quantity shipped.
 * @property {number} tax_rate - The tax rate for the product.
 * @property {number} unit_price - The unit price of the product.
 * @property {boolean} is_fully_shipped - Indicates if the product is fully shipped.
 * @property {Object} product - The product details.
 * @property {string | null} product.shipping_rate - The shipping rate of the product.
 * @property {string} product.status - The status of the product.
 * @property {string | null} product.number - The product number.
 * @property {string} product.id - The product ID.
 * @property {number} product.quantity_per_pack - The quantity per pack of the product.
 * @property {boolean} product.is_trash - Indicates if the product is marked as trash.
 * @property {string} product.brand_id - The ID of the product brand.
 * @property {number} product.retail_price - The retail price of the product.
 * @property {string} product.name - The name of the product.
 * @property {number} product.cost_price - The cost price of the product.
 * @property {string} product.sku - The SKU of the product.
 * @property {boolean} product.is_back_order - Indicates if the product is on back order.
 * @property {string} product.barcode - The barcode of the product.
 * @property {string} sku - The SKU of the product.
 * @property {number} quantity - The quantity of the product.
 */

/**
 * @interface PurchaseOrderMain
 * @extends PurchaseOrderForm
 */

/**
 * @interface PurchaseItems
 * @property {string} id - The ID of the purchase item.
 * @property {string} product_id - The ID of the product.
 * @property {ProductData} product - The product data.
 */

/**
 * @interface PurchaseOrderData
 * @property {string} id - The ID of the purchase order.
 * @property {string} user_id - The ID of the user who created the order.
 * @property {string | null} company_id - The ID of the company (optional).
 * @property {string} created_by_id - The ID of the user who created the order.
 * @property {string} trashed_by_id - The ID of the user who trashed the order.
 * @property {string} ordered - The date when the order was placed.
 * @property {string} vendor_id - The ID of the vendor.
 * @property {string} warehouse_id - The ID of the warehouse.
 * @property {boolean} is_trash - Indicates if the order is marked as trash.
 * @property {string} status - The status of the purchase order.
 * @property {string} status_display - The display status of the purchase order.
 * @property {string} payment_status - The payment status of the order.
 * @property {string} currency - The currency used.
 * @property {string} purchase_order_id - The ID of the purchase order (optional).
 * @property {string} [exchange_total_amount] - Optional exchange total amount.
 * @property {string} [product_name] - Optional product name.
 * @property {string} invoicing_currency - The currency used for invoicing.
 * @property {string | null} exchange_rate - The exchange rate for currency conversion.
 * @property {string} shipping_status - The shipping status of the order.
 * @property {string | null} sales_tax - The sales tax amount.
 * @property {string | null} prices_include_tax - Indicates if prices include tax.
 * @property {string} type - The type of the purchase order.
 * @property {string} external_id - The external ID for the purchase order.
 * @property {string} number - The number of the purchase order.
 * @property {PurchaseOrderProduct[]} products - The list of products in the purchase order.
 * @property {string | null} shipping_cost - The shipping cost.
 * @property {string | null} sub_total - The subtotal amount.
 * @property {number} total_amount - The total amount of the purchase order.
 * @property {string | null} paid_amount - The amount paid.
 * @property {string | null} due_amount - The amount due.
 * @property {boolean} has_custom_tax_rate - Indicates if there is a custom tax rate.
 * @property {number} custom_tax_percentage - The custom tax percentage.
 * @property {string} unit_cost_amounts - The unit cost amounts.
 * @property {string} brand_id - The ID of the brand.
 * @property {boolean} is_adjustment - Indicates if the order is an adjustment.
 */

/**
 * @interface EditPurchaseOrderProduct
 * @property {Object} product - The product details.
 * @property {string} product.label - The label of the product.
 * @property {string} product.value - The value of the product.
 * @property {string} sku - The SKU of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {number} price - The price of the product.
 * @property {number} tax - The tax amount for the product.
 * @property {string} barcode - The barcode of the product.
 * @property {number} received - The quantity received.
 * @property {string} id - The ID of the product.
 * @property {number} total - The total amount for the product.
 * @property {number} exchangePrice - The exchange price of the product.
 * @property {number} exchangeTotal - The exchange total for the product.
 * @property {string} [product_id] - Optional product ID.
 * @property {number} [unit_price] - Optional unit price.
 */

/**
 * @interface EditPurchaseOrderData
 * @property {string} id - The ID of the purchase order.
 * @property {string} user_id - The ID of the user who created the order.
 * @property {string | null} company_id - The ID of the company (optional).
 * @property {string} created_by_id - The ID of the user who created the order.
 * @property {string} trashed_by_id - The ID of the user who trashed the order.
 * @property {string} ordered - The date when the order was placed.
 * @property {string} vendor_id - The ID of the vendor.
 * @property {string} warehouse_id - The ID of the warehouse.
 * @property {boolean} is_trash - Indicates if the order is marked as trash.
 * @property {string} status - The status of the purchase order.
 * @property {string} status_display - The display status of the purchase order.
 * @property {string} payment_status - The payment status of the order.
 * @property {string} currency - The currency used.
 * @property {string} invoicing_currency - The currency used for invoicing.
 * @property {number} exchange_rate - The exchange rate used.
 * @property {string} shipping_status - The shipping status of the order.
 * @property {string | null} sales_tax - The sales tax amount.
 * @property {string | null} prices_include_tax - Indicates if prices include tax.
 * @property {string} type - The type of the purchase order.
 * @property {string} external_id - The external ID for the purchase order.
 * @property {string} number - The number of the purchase order.
 * @property {EditPurchaseOrderProduct[]} products - The list of products in the purchase order.
 * @property {string | null} shipping_cost - The shipping cost.
 * @property {string | null} sub_total - The subtotal amount.
 * @property {number} total_amount - The total amount of the purchase order.
 * @property {string | null} paid_amount - The amount paid.
 * @property {string | null} due_amount - The amount due.
 * @property {boolean} has_custom_tax_rate - Indicates if there is a custom tax rate.
 * @property {number} custom_tax_percentage - The custom tax percentage.
 * @property {string} unit_cost_amounts - The unit cost amounts.
 * @property {string} brand_id - The ID of the brand.
 * @property {boolean} is_adjustment - Indicates if the order is an adjustment.
 */

/**
 * @interface ReceivingHistoryData
 * @property {string} id - The ID of the receiving history item.
 * @property {string} purchase_order_id - The ID of the associated purchase order.
 * @property {string} sku - The SKU of the product.
 * @property {string} product_id - The ID of the product.
 * @property {string} product_name - The name of the product.
 * @property {number} ordered_quantity - The quantity ordered.
 * @property {number} received_quantity - The quantity received.
 * @property {string} created - The date when the item was created.
 * @property {string} status - The status of the receiving history item.
 * @property {string} batch_number - The batch number of the product.
 * @property {string} expiry_date - The expiry date of the product.
 * @property {string} invoice_number - The invoice number associated with the receiving.
 */

/**
 * @interface ReceivingHistorySchema
 * @property {string} count - The count of items.
 * @property {string} page - The current page number.
 * @property {number} pages - The total number of pages.
 * @property {number} total - The total number of items.
 * @property {ReceivingHistoryData[]} results - The list of receiving history items.
 */

/**
 * @interface PurchaseOrderResponse
 * @property {PurchaseOrderData[]} results - The list of purchase orders.
 * @property {number} [page] - The current page number (optional).
 * @property {number} [count] - The count of items (optional).
 * @property {number} [total] - The total number of items (optional).
 * @property {number} [pages] - The total number of pages (optional).
 */

/**
 * Fetches purchase orders based on provided parameters.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of purchase orders.
 * It constructs a set of general parameters including brand_id, filter, and is_trash based on the provided arguments.
 * The request includes sorting by creation date in descending order.
 *
 * @param {URLSearchParams} searchParams - URLSearchParams object containing query parameters.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `Purchase #` (Number): Purchase # is a number with key number.
 *   - `Location ` (string): Location  is a string with key warehouseID.
 *   - `Vendor` (string): Vendor is a  string with key vendorID.

 * @param {boolean} isTrash - Boolean indicating if the purchase orders are in the trash.
 * @returns {UseQueryResult<PurchaseOrderResponse, Error>} The result of the query.
 * @see PurchaseOrderResponse
 * @see PurchaseOrderData
 */
export const usePurchaseOrders = (
  searchParams: URLSearchParams,
  isTrash: boolean = false
) => {
  const generalParams: Record<string, string> = {
    ...getBrandId(),
    // If we're on the trash page, include the is_trash query param to search for trashed products.
    ...(isTrash ? { is_trash: "true" } : {})
  };
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  purchaseOrderParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<PurchaseOrderResponse, Error>(
    ["purchase_order", searchParams.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/purchase_order/${queryStringify({
          ...pagination,
          ...generalParams,
          sorting: "-created"
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }
  );
};

export const useCreatePurchaseOrder = (): UseMutationResult<
  Partial<PurchaseOrderForm>,
  Error,
  Partial<PurchaseOrderForm>
> => {
  return useMutation<Partial<PurchaseOrderForm>, Error, Partial<PurchaseOrderForm>>(
    "create-purchase-order",
    async (variables: Partial<PurchaseOrderForm>) => {
      const brand = getBrandDetails();

      if (!brand?.id || !brand.currency || !getUserId()) {
        return;
      }
      const response = await fetch(`${API_URL}/full_purchase_order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          ...variables,
          brand_id: brand?.id,
          currency: brand?.currency,
          ...getUserId()
        })
      });

      if (response.status === 400) {
        throw new Error("Something went wrong");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Purchase Order created successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Custom hook to create a purchase order.
 *
 * This hook sends a POST request to the server to create a purchase order.
 * It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @returns {UseMutationResult<Partial<PurchaseOrderForm>, Error, Partial<PurchaseOrderForm>>} The result of the mutation.
 * @see PurchaseOrderForm
 */

export const useUpdatePurchaseOrder = (): UseMutationResult<
  Partial<EditPurchaseOrderData>,
  Error,
  Partial<EditPurchaseOrderData>
> => {
  const queryClient = new QueryClient();
  return useMutation<
    Partial<EditPurchaseOrderData>,
    Error,
    Partial<EditPurchaseOrderData>
  >(
    "update-purchase-order",
    async (variables: Partial<EditPurchaseOrderData>) => {
      const brand = getBrandDetails();

      if (!brand?.id || !brand.currency || !getUserId()) {
        return;
      }
      const response = await fetch(`${API_URL}/full_purchase_order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          ...variables,
          status: variables.status_display,
          products: variables?.products
            ? variables?.products.map(product => ({
                ...product,
                total: Number(
                  product.tax
                    ? (
                        product.quantity *
                        product.price *
                        (1 + product.tax / 100)
                      ).toFixed(2) || 0
                    : product.quantity * product.price || 0
                ),
                product_id: product.product.value
              }))
            : [],
          vendor_id: variables?.vendor_id,
          warehouse_id: variables?.warehouse_id,
          unit_cost_amounts: "tax exclusive",
          brand_id: brand.id,
          invoicing_currency: variables.invoicing_currency,
          exchange_rate:
            Number(variables.exchange_rate) === 0 ? 1 : Number(variables.exchange_rate),
          currency: brand.currency
        })
      });
      if (response.status === 400) {
        throw new Error("Someting wents wrong");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Purchase Order updated successfully");
        queryClient.invalidateQueries("edit-purchase-order");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Updates an existing purchase order.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the update of a purchase order.
 * It manages the mutation process, including error handling and success notifications.
 *
 * @returns {UseMutationResult<Partial<EditPurchaseOrderData>, Error, Partial<EditPurchaseOrderData>>} The result of the mutation, which includes:
 *   - `mutate`: A function to trigger the mutation with the purchase order data.
 *   - `isLoading`: A boolean indicating if the mutation is currently in progress.
 *   - `isError`: A boolean indicating if an error occurred during the mutation.
 *   - `error`: Any error that occurred during the mutation process.
 *   - `data`: The updated purchase order data, structured as per the `EditPurchaseOrderData` interface.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 *
 * @see EditPurchaseOrderData
 */

interface IuseReceiveOrder {
  purchase_order_id: string;
  is_fully_received: true;
  product_id: string;
  sku?: string | undefined;
  batch_number?: string | undefined;
  expiry_date?: string | undefined;
  received_quantity?: number | undefined;
  invoice_number?: string | undefined;
}

interface IuseUpdateReceiving {
  id: string;
  purchase_order_id: string;
  product_id: string;
  sku: string;
  is_fully_received?: boolean;
  batch_number: string;
  expiry_date: string;
  received_quantity: number;
  invoice_number?: string;
}

export const useReceiveOrder = (): UseMutationResult<
  Partial<IuseReceiveOrder>,
  Error,
  Partial<IuseReceiveOrder>
> => {
  const queryClient = new QueryClient();
  return useMutation<Partial<IuseReceiveOrder>, Error, Partial<IuseReceiveOrder>>(
    "update-purchase-order",
    async (variables: Partial<IuseReceiveOrder>) => {
      const res = await fetch(`${API_URL}/purchase_order_received/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      return res.json();
    },
    {
      onSuccess: () => {
        toast.success("Item received successfully");
        queryClient.invalidateQueries("reciving-history");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useUpdateReceiving = (): UseMutationResult<
  Partial<IuseUpdateReceiving>,
  Error,
  Partial<IuseUpdateReceiving>
> => {
  const queryClient = new QueryClient();
  return useMutation<Partial<IuseUpdateReceiving>, Error, Partial<IuseUpdateReceiving>>(
    "update-purchase-order",
    async (variables: Partial<IuseUpdateReceiving>) => {
      const { id, ...updatedObj } = variables;

      const res = await fetch(`${API_URL}/purchase_order_receive_update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedObj)
      });
      return await res.json();
    },
    {
      onSuccess: () => {
        toast.success("Item received successfully");
        queryClient.invalidateQueries("edit-purchase-order");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Returns a mutation hook that updates a receiving purchase order.
 *
 * @return {UseMutationResult<Partial<IuseUpdateReceiving>, Error, Partial<IuseUpdateReceiving>>} A mutation hook that updates a receiving purchase order.
 * @see IuseUpdateReceiving
 */

export const usePurchaseOrder = (
  id: string | undefined
): UseQueryResult<PurchaseOrderData, Error> => {
  return useQuery<PurchaseOrderData, Error>(["single-purchase-order", id], async () => {
    if (!id) {
      return;
    }
    const response = await fetch(`${API_URL}/purchase_order/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("TOKEN_EXPIRED");
      }
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

export const useEditPurchaseOrder = (
  id: string | undefined
): UseQueryResult<EditPurchaseOrderData, Error> => {
  return useQuery<EditPurchaseOrderData, Error>(["edit-purchase-order", id], async () => {
    if (!id) {
      return;
    }
    const response = await fetch(`${API_URL}/purchase_order/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("TOKEN_EXPIRED");
      }
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return {
      ...data,
      id: data?.id,
      vendor_id: data?.vendor_id,
      ordered: data?.ordered,
      status: data?.status_display,
      status_display: data?.status_display,
      warehouse_id: data?.warehouse_id,
      products: data.products.map(
        (p: {
          product: { name: string; id: string; barcode: string; sku: string };
          quantity: string;
          unit_price: string;
          tax_rate: string;
          receive_quantity: string;
          id: string;
        }) => ({
          product: { label: p.product.name, value: p.product.id },
          sku: p.product.sku,
          quantity: p.quantity,
          price: p.unit_price,
          tax: p.tax_rate,
          barcode: p.product.barcode,
          received: Number(p.receive_quantity),
          id: p.id,
          total: p.tax_rate
            ? Number(p.quantity) * Number(p.unit_price) * (1 + Number(p.tax_rate) / 100)
            : Number(p.quantity) * Number(p.unit_price),
          exchangePrice: Number(p?.unit_price) * Number(data?.exchange_rate) || 0,
          exchangeTotal: p.tax_rate
            ? Number(p.quantity) * Number(p.unit_price) * (1 + Number(p.tax_rate) / 100)
            : Number(p.quantity) * Number(p.unit_price) * Number(data?.exchange_rate)
        })
      )
    };
  });
};

export const usePurchaseOrderRecivingHistory = (
  id: string | undefined,
  searchParams?: URLSearchParams
): UseQueryResult<ReceivingHistorySchema, Error> => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams?.get("count") || "10",
    page: searchParams?.get("page") || "1"
  };

  return useQuery<ReceivingHistorySchema, Error>(
    ["reciving-history", id, searchParams?.toString()],
    async () => {
      if (!id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/purchase_order_receive_product_list/${id}${queryStringify(pagination)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
};
/**
 * Fetches the receiving history of a purchase order.
 *
 * This hook retrieves the receiving history associated with a specific purchase order ID.
 * It uses the `useQuery` hook from `react-query` to manage the fetching and caching of data.
 *
 * @param {string | undefined} id - The ID of the purchase order. This is required to fetch the receiving history.
 * @param {URLSearchParams | undefined} searchParams - Optional search parameters for pagination.
 *   - `count` (number): The number of items to retrieve per page (default: 10).
 *   - `page` (number): The page number to retrieve (default: 1).
 *
 * @returns {UseQueryResult<ReceivingHistorySchema, Error>} The result of the query, which includes:
 *   - `data`: The receiving history data, structured as per the `ReceivingHistorySchema` interface.
 *   - `error`: Any error that occurred during the fetching process.
 *   - `isLoading`: A boolean indicating if the query is currently loading.
 *   - `isError`: A boolean indicating if an error occurred during the query.
 *
 * @see ReceivingHistorySchema
 * @see ReceivingHistoryData
 */

interface ReportBody {
  purchase_order_id: string;
}

export const useGeneratePOReport = () => {
  return useMutation<PurchaseOrderPDFResponse, Error, ReportBody>(
    "po-report-generation",
    async (variables: ReportBody) => {
      const response = await fetch(`${API_URL}/purchase_order_pdf/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });
      return response.json();
    }
  );
};

export const useNotes = (purchaseOrderID: string) => {
  return useQuery<OrderNoteResponse, Error>(
    ["list_PO_Notes", purchaseOrderID],

    async () => {
      const response = await fetch(`${API_URL}/purchase_order/${purchaseOrderID}/note/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }
  );
};

/**
 * Fetches the notes associated with a specific purchase order.
 *
 * This hook retrieves the notes related to a given purchase order ID using the `useQuery` hook from `react-query`.
 * It manages the fetching and caching of data, providing a simple interface for accessing the notes.
 *
 * @param {string} purchaseOrderID - The ID of the purchase order for which notes are to be fetched.
 *   This parameter is required and should be a valid purchase order ID.
 *
 * @returns {UseQueryResult<OrderNoteResponse, Error>} The result of the query, which includes:
 *   - `data`: The notes data, structured as per the `OrderNoteResponse` interface.
 *   - `error`: Any error that occurred during the fetching process.
 *   - `isLoading`: A boolean indicating if the query is currently loading.
 *   - `isError`: A boolean indicating if an error occurred during the query.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 *
 * @see OrderNoteResponse
 */

export const useCreateOrderNote = (purchaseOrderID: string) => {
  const queryClient = useQueryClient();
  return useMutation<OrderNote, Error, Omit<OrderNote, "id" | "created">>(
    async variables => {
      const response = await fetch(`${API_URL}/purchase_order/${purchaseOrderID}/note/`, {
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
        queryClient.invalidateQueries(["list_PO_Notes", purchaseOrderID]);
        toast.success(`A ${data.type} note has been added to the order.`);
      }
    }
  );
};
/**
 * Creates a new note for a specific purchase order.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the creation of a note associated with a purchase order.
 * It manages the mutation process, including error handling and success notifications.
 *
 * @param {string} purchaseOrderID - The ID of the purchase order to which the note will be added.
 *   This parameter is required and should be a valid purchase order ID.
 *
 * @param {Object} OrderNote - The data for the note to be created.
 * @param {string} OrderNote.type - The type of the note.
 * @param {string} [OrderNote.updated] - The date when the note was last updated. Optional.
 * @param {string} OrderNote.created - The date when the note was created.
 * @param {string} OrderNote.id - The unique ID of the note.
 * @param {string} OrderNote.text - The text content of the note.
 * @param {string} [OrderNote.source] - The source of the note. Optional.
 * @param {string} [OrderNote.note_username] - The username associated with the note. Optional.
 *
 * @returns {UseMutationResult<OrderNote, Error, Omit<OrderNote, "id" | "created">>} The result of the mutation, which includes:
 *   - `mutate`: A function to trigger the mutation with the note data.
 *   - `isLoading`: A boolean indicating if the mutation is currently in progress.
 *   - `isError`: A boolean indicating if an error occurred during the mutation.
 *   - `error`: Any error that occurred during the mutation process.
 *   - `data`: The created note data, structured as per the `OrderNote` interface.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 * @see OrderNote
 */

export const useTrashPurchaseOrder = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { productId?: string }>(
    async variables => {
      "delete-purchase-order";
      const response = await fetch(
        `${API_URL}/purchase_order/${id ? id : variables.productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Error in deleting Purchase Order.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchase_order");
        toast.success("Purchase Order trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useRestorePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: string }>(
    "purchaseOrder-restoration",
    async variables => {
      const response = await fetch(
        `${API_URL}/purchase_order/${variables.orderId}/restore/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: "{}"
        }
      );
      if (!response.ok) {
        throw new Error("Error in restoring purchase order.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while restoring purchase order.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["purchase_order"]);
        toast.success("purchase order restored successfully.");
      }
    }
  );
};
export const useAddPurchaseOrderProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<EditPurchaseOrderProduct>>(
    async variables => {
      const { id, ...rest } = variables;
      const response = await fetch(`${API_URL}/purchase_order/${id}/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(rest)
      });

      if (!response.ok) {
        throw new Error("Error in adding purchase Order product.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("edit-purchase-order");
        toast.success("Product added successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Adds a new product to a specific purchase order.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the addition of a product to a purchase order.
 * It manages the mutation process, including error handling and success notifications.
 *
 * @returns {UseMutationResult<void, Error, Partial<EditPurchaseOrderProduct>>} The result of the mutation, which includes:
 *   - `mutate`: A function to trigger the mutation with the product data.
 *   - `isLoading`: A boolean indicating if the mutation is currently in progress.
 *   - `isError`: A boolean indicating if an error occurred during the mutation.
 *   - `error`: Any error that occurred during the mutation process.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 *
 * @see EditPurchaseOrderProduct
 */

export const useUpdatePurchaseOrderProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<EditPurchaseOrderProduct>>(
    async variables => {
      const { id, product_id, ...rest } = variables;
      const response = await fetch(
        `${API_URL}/purchase_order/${id}/product/${product_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(rest)
        }
      );

      if (!response.ok) {
        throw new Error("Error in updating purchase Order product.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("edit-purchase-order");
        toast.success("Product updated successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Updates an existing product in a specific purchase order.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the update of a product associated with a purchase order.
 * It manages the mutation process, including error handling and success notifications.
 *
 * @returns {UseMutationResult<void, Error, Partial<EditPurchaseOrderProduct>>} The result of the mutation, which includes:
 *   - `mutate`: A function to trigger the mutation with the product data.
 *   - `isLoading`: A boolean indicating if the mutation is currently in progress.
 *   - `isError`: A boolean indicating if an error occurred during the mutation.
 *   - `error`: Any error that occurred during the mutation process.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 *
 * @see EditPurchaseOrderProduct
 */
