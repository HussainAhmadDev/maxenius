import {
  // UseMutationResult,
  useQuery,
  useMutation,
  useQueryClient
  // UseQueryResult,
  // useQueryClient
} from "react-query";

import { PurchaseOrderResponse, PurchaseOrderData } from "Interfaces/PurchaseOrder";
import { API_URL, getAccessToken } from "./api";
import { showSuccess, showError } from "../Components/Toaster";
import { useBrand } from "Context/BrandContext";

//   import { toast } from "react-toastify";
// import { QueryPagination } from "Interfaces/QueryFilters";
import { purchaseOrderParamsGeneralKeys } from "Utils/queryParamKeys";
import { queryStringify } from "Utils/queryString";
import { QueryPagination } from "Interfaces/QueryFilters";
import { OrderNote, OrderNoteResponse } from "Interfaces/Order";
import { toast } from "react-toastify";

export const useCreateProduct = () => {
  return useMutation<PurchaseOrderData, Error, Partial<PurchaseOrderData>>(
    "create-product",

    async (variables: Partial<PurchaseOrderData>) => {
      delete variables.status;
      const response = await fetch(`${API_URL}/purchase-order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, brand_id: 0 })
      });
      if (!response.ok) {
        throw new Error("Error in Creating Product");
      }
      return response.json();
    },
    {
      onSuccess: () => showSuccess("Product Created Successfully"),
      onError: () => showError("Error in creating product")
    }
  );
};

export const usePurchaseOrders = (searchParams: URLSearchParams) => {
  const { activeBrand: brand_id } = useBrand();

  const generalParams: Record<string, string> = {
    brand_id: (searchParams.get("brand_id") as string) || brand_id,
    // If we're on the trash page, include the is_trash query param to search for trashed products.
    ...(searchParams.has("is_trash") ? { is_trash: "true" } : {})
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

//Notes
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

interface ReportBody {
  purchase_order_id: string;
}
export const useGeneratePOReport = () => {
  return useMutation<any, Error, ReportBody>(
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
