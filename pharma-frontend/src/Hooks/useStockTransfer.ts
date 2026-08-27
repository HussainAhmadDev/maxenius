import { UseQueryResult, useMutation, useQuery } from "react-query";
import { API_URL, getAccessToken } from "./api";
import { ProductData } from "Interfaces/Products";
import { queryStringify } from "Utils/queryString";
import { QueryPagination } from "Interfaces/QueryFilters";
import { VendorResponse } from "Interfaces/Vendors";
import { WarehouseResponse } from "Interfaces/Warehouse";
import { toast } from "react-toastify";
import { useBrand } from "Context/BrandContext";

export interface ToBrandProducts {
  readonly results: Array<ProductData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
export const useToBrandProducts = (
  toBrand: string
): UseQueryResult<ToBrandProducts, Error> => {
  return useQuery<ToBrandProducts, Error>(["toBrandProducts", toBrand], async () => {
    if (!toBrand) {
      return;
    }
    const response = await fetch(
      `${API_URL}/products_by_sku/?brand_id=${toBrand}&count=2000`,
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
  });
};

interface TransferbodyResponse {
  to_brand_id: string;
  from_brand_id: string;
  to_product_id: string;
  from_product_id: string;
  quantity: string;
  warehouse_id: string;
  vendor_id: string;
  website_id: string;
  expiry_date: string;
  batch_number: string;
  stock_transfer: boolean;
}
export const useCreateStockTransfer = () => {
  return useMutation<TransferbodyResponse, Error, TransferbodyResponse>(
    "transfer-products",

    async (variables: TransferbodyResponse) => {
      const response = await fetch(`${API_URL}/stock-transfer-history/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });
      if (!response.ok) {
        toast.error("Error in Stock Transfer");
        throw new Error("Error in Stock Transfer");
      } else {
        toast.success("Stock Transfered!");
      }
      return response.json();
    }
  );
};

export interface StockTransferHistory {
  id: string;
  created: string;
  updated: string;
  to_brand_id: string;
  to_product_id: string;
  from_product_id: string;
  from_brand_id: string;
  quantity: string;
  website_id: string;
}

export interface StockTransferResponse {
  readonly results: Array<StockTransferHistory>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export const useStockTransferHistory = (searchParams: URLSearchParams) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };
  return useQuery<StockTransferResponse, Error>(
    ["stock-transfer-history", searchParams.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/stock-transfer-history/${queryStringify({
          ...pagination,
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

export const useToVendors = (
  searchParams?: URLSearchParams,
  filter?: boolean,
  toBrand?: string
): UseQueryResult<VendorResponse, Error> => {
  const generalParams: Record<string, string> = {
    brand_id: toBrand ? toBrand : "",
    filter: "true",
    ...(searchParams?.has("is_trash") ? { is_trash: "True" } : {})
  };

  return useQuery<VendorResponse, Error>(
    ["to_brand_vendors", toBrand],
    async () => {
      if (!toBrand) {
        return;
      }
      !filter && delete generalParams["filter"];
      const response = await fetch(
        `${API_URL}/vendor/${queryStringify({
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
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      //   enabled: !!organization_id,
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

export const useExpiryAndBatchListToBrand = (
  id: string
  // brand_id: string
): UseQueryResult<any, Error> => {
  const { activeBrand } = useBrand();
  return useQuery<any, Error>(["expiryandbatchToBrand", id, activeBrand], async () => {
    if (!id || !activeBrand) {
      return;
    }
    const response = await fetch(
      `${API_URL}/batch-expiry-of-product/${id}/?brand_id=${activeBrand}`,
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
  });
};

export const useWareHouseToBrand = (
  toBrand?: string
): UseQueryResult<WarehouseResponse, Error> => {
  const generalParams: Record<string, string> = {
    brand_id: toBrand ? toBrand : "",
    filter: "true"
  };

  return useQuery<WarehouseResponse, Error>(
    ["warehouses", toBrand],
    async () => {
      if (!toBrand) {
        return;
      }

      const response = await fetch(
        `${API_URL}/warehouse/${queryStringify({
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
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};
