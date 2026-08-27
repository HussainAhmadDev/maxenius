import { UseQueryResult, useMutation, useQuery } from "react-query";
import { API_URL, getAccessToken, getBrandId } from "./api";

import { toast } from "react-toastify";

import { WarehouseResponse } from "../Interfaces/warehouseType";
import { VendorResponse } from "../Interfaces/vendorsType";
import { QueryPagination } from "../Interfaces/global";
import { queryStringify } from "../Utils/queryString";

import {
  InventoryItem,
  StockTransferResponse,
  ToBrandProducts,
  TransferbodyResponse
} from "../Interfaces/stockTransferType";

/**
 * @interface ToBrandProducts
 * @property {ProductData[]} results - The list of products to be transferred to the brand.
 * @property {number} [page] - The current page number in the paginated results.
 * @property {number} [count] - The total number of items in the current page.
 * @property {number} [total] - The total number of items across all pages.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface TransferbodyResponse
 * @property {string} to_brand_id - The ID of the brand receiving the stock.
 * @property {string} from_brand_id - The ID of the brand sending the stock.
 * @property {string} to_product_id - The ID of the product being transferred to.
 * @property {string} from_product_id - The ID of the product being transferred from.
 * @property {string} quantity - The quantity of stock being transferred.
 * @property {string} warehouse_id - The ID of the warehouse where the stock is stored.
 * @property {string} vendor_id - The ID of the vendor associated with the stock transfer.
 * @property {string} website_id - The ID of the website managing the stock.
 * @property {string} expiry_date - The expiry date of the product being transferred.
 * @property {string} batch_number - The batch number of the product being transferred.
 * @property {boolean} stock_transfer - A flag indicating if it is a stock transfer.
 */

/**
 * @interface StockTransferHistory
 * @property {string} id - The unique identifier for the stock transfer history record.
 * @property {string} created - The creation date of the record.
 * @property {string} updated - The last updated date of the record.
 * @property {string} to_brand_id - The ID of the brand receiving the stock.
 * @property {string} to_product_id - The ID of the product being transferred to.
 * @property {string} from_product_id - The ID of the product being transferred from.
 * @property {string} from_brand_id - The ID of the brand sending the stock.
 * @property {string} quantity - The quantity of stock transferred.
 * @property {string} website_id - The ID of the website managing the stock transfer.
 */

/**
 * @interface StockTransferResponse
 * @property {StockTransferHistory[]} results - The list of stock transfer history records.
 * @property {number} [page] - The current page number in the paginated results.
 * @property {number} [count] - The total number of items in the current page.
 * @property {number} [total] - The total number of items across all pages.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface InventoryItem
 * @property {number} id - The unique identifier for the inventory item.
 * @property {string} batch_number - The batch number of the inventory item.
 * @property {string} expiry_date - The expiry date of the inventory item.
 * @property {number} received_quantity - The quantity of the item received.
 */

/**
 * Fetches products by brand ID for stock transfer.
 *
 * @param toBrand - The brand ID to fetch products for.
 * @returns A UseQueryResult object containing the fetched products or an error.
 */
export const useToBrandProducts = (
  toBrand: string | null
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

/**
 * Initiates a mutation to create a stock transfer.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of creating a stock transfer.
 * It sends a POST request to the `/stock-transfer-history/` endpoint with the provided `variables` object.
 *
 * @returns A mutation function that can be used to initiate the stock transfer creation process.
 */
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

/**
 * Fetches the stock transfer history based on provided URLSearchParams.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of stock transfer history.
 * It constructs a pagination object from the provided `searchParams` and sends a GET request to the `/stock-transfer-history/` endpoint.
 * The request includes pagination parameters and sorting by creation date in descending order.
 *
 * @param searchParams - URLSearchParams object containing query parameters.
 * @returns A react-query hook for fetching stock transfer history.
 */
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
/**
 * Fetches vendors based on provided parameters.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of vendors.
 * It constructs a set of general parameters including brand_id, filter, and is_trash based on the provided arguments.
 * The request includes sorting by creation date in descending order.
 *
 * @param searchParams - URLSearchParams object containing query parameters.
 * @param filter - Boolean indicating if filtering is required.
 * @param toBrand - The brand ID to filter vendors by.
 * @returns A react-query hook for fetching vendors.
 */
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
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

/**
 * Fetches the list of expiry and batch details for a given product ID and brand ID.
 *
 * @param id - The ID of the product.
 * @returns A react-query hook for fetching the expiry and batch list.
 */
export const useExpiryAndBatchListToBrand = (
  id: string | null
): UseQueryResult<InventoryItem[], Error> => {
  const activeBrand = getBrandId()?.brand_id;

  return useQuery<InventoryItem[], Error>(
    ["expiryandbatchToBrand", id, activeBrand],
    async () => {
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
    }
  );
};

/**
 * Fetches the list of warehouses for a given brand ID.
 *
 * @param toBrand - The ID of the brand to fetch warehouses for.
 * @returns A react-query hook for fetching the list of warehouses.
 */
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
