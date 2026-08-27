import { useNavigate } from "react-router-dom";

import { UseQueryResult, useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import { API_URL, getAccessToken } from "./api";
import { queryStringify } from "Utils/queryString";
import { QueryPagination } from "Interfaces/QueryFilters";

export const useCreateIncreaseAdjustment = () => {
  const navigate = useNavigate();
  return useMutation<any, Error, any>(
    "create-order",
    async (variables: any) => {
      const response = await fetch(`${API_URL}/stock-adjustments-purchase-order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error while Adding Stock Adjustment!");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        toast.success("Successfully Added!");
      },
      onError: () => {
        toast.error("Error while Adding Stock Adjustment!");
      }
    }
  );
};

export const useCreateDescreaseAdjustment = () => {
  const navigate = useNavigate();
  return useMutation<any, Error, any>(
    "create-order",
    async (variables: any) => {
      const response = await fetch(`${API_URL}/stock-adjustments-sale-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error while Adding Stock Adjustment!");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        toast.success("Successfully Added!");
      },
      onError: () => {
        toast.error("Error while Adding Stock Adjustment!");
      }
    }
  );
};

export const useExpiryAndBatchList = (
  id: string,
  brand_id: string
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>(["expiryandbatch", id, brand_id], async () => {
    if (!id || !brand_id) {
      return;
    }
    const response = await fetch(
      `${API_URL}/batch-expiry-of-product/${id}/?brand_id=${brand_id}`,
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

interface ColumnsProps {
  id: string;
  created: string;
  updated: string;
  brand_id: string;
  reason: string;
  action_id: string;
  action_name: string;
  ordered_quantity: number;
  ordered_product: string;
}

interface IStockHistoryResults {
  count: number;
  page: number;
  pages: number;
  results: ColumnsProps[];
  total: number;
}

export const useStockHistory = (brand_id: string, pageDetail: QueryPagination) => {
  const pagination: Partial<QueryPagination> = {
    count: pageDetail.count,
    page: pageDetail.page
  };

  const generalParams: Record<string, string> = {
    brand_id: brand_id as string
  };

  return useQuery<IStockHistoryResults, Error>(
    ["stockhistoryAdjustment", brand_id, pagination.count, pagination.page],
    async () => {
      const response = await fetch(
        `${API_URL}/stock-adjustment-history/${queryStringify({
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
