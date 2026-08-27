import { useQuery } from "react-query";
import { API_URL, getAccessToken } from "./api";
import { queryStringify } from "../Utils/queryString";
import { lowStockProducts, nearExpiry, outOfStockProducts } from "@interfaces/nearExpiry";
import { QueryPagination } from "@interfaces/global";

/**
 * @interface LowStockProduct
 * @property {string} product_name - The name of the product.
 * @property {string} product_sku - The SKU of the product.
 * @property {number} available_quantity - The available quantity of the product in stock.
 * @property {string} batch_number - The batch number of the product.
 * @property {string} brand_name - The name of the brand of the product.
 * @property {string} expiry_date - The expiry date of the product.
 */

/**
 * @interface NearExpiry
 * @property {string} product_name - The name of the product.
 * @property {string} product_sku - The SKU of the product.
 * @property {number} available_quantity - The available quantity of the product.
 * @property {string} batch_number - The batch number of the product.
 * @property {string} brand_name - The name of the brand of the product.
 * @property {string} expiry_date - The expiry date of the product.
 */

/**
 * @interface Result
 * @property {NearExpiry[]} results - An array of near expiry products.
 */

/**
 * @interface nearExpiry
 * @property {LowStockProduct[]} products - An array of low stock products.
 * @property {NearExpiry[]} results - An array of near expiry products.
 * @property {NearExpiry[]} result - An array of near expiry products.
 * @property {number} available_quantity - The available quantity of a specific product.
 * @property {string} batch_number - The batch number of the product.
 * @property {string} brand_name - The name of the brand of the product.
 * @property {string} expiry_date - The expiry date of the product.
 * @property {string} message - A message related to the response.
 * @property {number} number - A numerical value related to the response.
 * @property {string} product_name - The name of the product.
 * @property {string} product_sku - The SKU of the product.
 * @property {number} total - The total number of items.
 * @property {number} count - The count of items in the response.
 * @property {number} [pages] - The number of pages in the response (optional).
 * @property {number} [page] - The current page number (optional).
 */

export const useNearExpiry = (brand_id: string, pagination: QueryPagination) => {
  return useQuery<nearExpiry, Error>(
    ["near-expiry", pagination.rowsPerPage, pagination.page, brand_id],
    async () => {
      if (!brand_id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/near_expiry/${queryStringify({
          ...pagination,
          brand_id: brand_id
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
 *
 */
/**
 * Custom hook to fetch Near Expiry with optional pagination and brand_id parameters.
 *
 * @param {URLSearchParams} [searchParams] - Optional search parameters to filter and paginate the Orders.
 *   - `count` (number): Number of Orders per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `Website Order id` (string): the key of the website order is website_order_id.
 *   - `Order number` (string): the key of the Order number is order_number.
 *   - `Customer name` (string): the key of the Customer name is company_name.
 *   - `Website` (string): the key of the Website is website_id.
 *   - `Status` (string): the key of the Status is status.
 *   - `Shipment Status :` (string): the key of the Shipment Status :
 *   - `Count` (string): the key of the Payment Status is count.
 *
 *
 *
 * @returns {UseQueryResult<nearExpiry, Error>} The query result containing the fetched Orders and metadata.
 *
 * @see {@link nearExpiry} - Type representing the structure of the response data.

 */

export const useLowStockProducts = (brand_id: string, pagination: QueryPagination) => {
  return useQuery<lowStockProducts, Error>(
    ["low-stock-products", pagination.rowsPerPage, pagination.page, brand_id],
    async () => {
      if (!brand_id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/low_stock_products/${queryStringify({
          ...pagination,
          brand_id: brand_id
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
 * Fetches low stock products for the given brand and pagination.
 *
 * @param {QueryPagination} pagination - The pagination parameters.
 * @param {string} [brand_id] - The ID of the brand. If not provided, it will use the default brand ID.
 * @returns {object} - The query result containing the low stock products.
 */
export const useOutOfStockProducts = (
  brand_id: string,
  searchParams: URLSearchParams
) => {
  return useQuery<outOfStockProducts, Error>(
    ["out-of-stock-products", searchParams?.toString(), brand_id],
    async () => {
      if (!brand_id) {
        return;
      }
      const generalParams: Record<string, string> = {
        brand_id: brand_id
      };
      const pagination: Partial<QueryPagination> = {
        count: searchParams?.get("count") || "20",
        page: searchParams?.get("page") || "1"
      };
      const response = await fetch(
        `${API_URL}/out_of_stock_products/${queryStringify({
          ...pagination,
          ...generalParams
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
 * Fetches out of stock products for the given brand and search parameters.
 *
 * @param {URLSearchParams} [searchParams] - The search parameters.
 * @param {string} [brand_id] - The ID of the brand. If not provided, it will use the default brand ID.
 * @returns {object} - The query result containing the out of stock products.
 */
