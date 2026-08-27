import { API_URL, getAccessToken, getBrandId } from "./api";
import { queryStringify } from "../Utils/queryString";
import { QueryPagination } from "../Interfaces/global";
import { useMutation, useQuery } from "react-query";
import {
  AdjustmentBatch,
  DecreaseStockBody,
  DecreaseStockResponse,
  IncreaseStcock,
  StockHistoryResults
} from "../Interfaces/stocksAdjustmentTypes";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";

/**
 * Fetches stock history based on provided URLSearchParams.
 *
 * @param searchParams - URLSearchParams object containing query parameters.
 * @returns A react-query hook for fetching stock history.
 */
export const useStockHistory = (searchParams: URLSearchParams) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  const generalParams: Record<string, string> = {
    ...getBrandId()
  };

  return useQuery<StockHistoryResults, Error>(
    ["stockhistoryAdjustment", pagination.count, pagination.page],
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
        throw new Error(response?.statusText);
      }
      return response?.json();
    }
  );
};

/**
 * Fetches the list of expiry and batch details for a given product ID and brand ID.
 *
 * @param id - The ID of the product.
 * @param brand_id - The ID of the brand.
 * @returns A react-query hook for fetching the expiry and batch list.
 */
export const useExpiryAndBatchList = (
  id?: string,
  brand_id?: string
): UseQueryResult<AdjustmentBatch[], Error> => {
  return useQuery<AdjustmentBatch[], Error>(
    ["expiryandbatch", id, brand_id],
    async () => {
      if (!id || !brand_id) {
        return [];
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
    }
  );
};

/**
 * Custom hook to increase stock adjustment.
 *
 * This hook is used to increase the stock adjustment for a given product. It sends a POST request to the API with the adjustment details and brand ID.
 *
 * @returns {UseMutationResult} - The mutation result for increasing stock adjustment.
 */
export const useIncreaseAdjustment = () => {
  return useMutation<
    {
      message: string;
    },
    Error,
    IncreaseStcock
  >(
    "create-order",
    async variables => {
      const response = await fetch(`${API_URL}/stock-adjustments-purchase-order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      if (!response.ok) {
        throw new Error("Error while Adding Stock Adjustment!");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        toast.success(data?.message);
      },
      onError: () => {
        toast.error("Error while Adding Stock Adjustment!");
      }
    }
  );
};

/**
 * Custom hook to create a decrease stock adjustment.
 * @returns {UseMutationResult<DecreaseStockResponse, Error, DecreaseStockBody>} - The mutation result for creating a decrease stock adjustment.
 */
export const useCreateDescreaseAdjustment = () => {
  return useMutation<DecreaseStockResponse, Error, DecreaseStockBody>(
    "create-order",
    async (variables: DecreaseStockBody) => {
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
      onSuccess: () => {
        toast.success("Successfully Added!");
      },
      onError: () => {
        toast.error("Error while Adding Stock Adjustment!");
      }
    }
  );
};
