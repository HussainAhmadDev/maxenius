import { useMutation } from "react-query";
import { API_URL, getAccessToken } from "./api";
import { QueryPagination } from "../Interfaces/global";
import { ProductExpiryResponse } from "../Interfaces/productExpiryType";
import { queryStringify } from "../Utils/queryString";

/**
 * @interface ProductExpiry
 * @property {number} available_quantity - The quantity of the product available.
 * @property {string} batch_number - The batch number of the product.
 * @property {string} brand_name - The name of the brand associated with the product.
 * @property {string} expiry_date - The expiry date of the product.
 * @property {number} number - A numeric identifier or additional information related to the product.
 * @property {string} product_name - The name of the product.
 * @property {string} product_sku - The SKU (Stock Keeping Unit) of the product.
 */

/**
 * @interface ProductExpiryResponse
 * @property {string} count - The number of items returned in the response.
 * @property {string} page - The current page number.
 * @property {number} pages - The total number of pages available.
 * @property {ProductExpiry[]} results - The array of `ProductExpiry` items.
 * @property {number} total - The total number of items available.
 */

/**
 * Interface to define a custom date range.
 * @property {Date | string} startDate - The start date of the range.
 * @property {Date | string} endDate - The end date of the range.
 */
interface CustomRange {
  startDate: Date | string;
  endDate: Date | string;
}

/**
 * Interface to define the data required for product expiry.
 * @property {string} brand_id - The brand ID.
 * @property {(Date | string | CustomRange)} date_range - The date range or a custom range object.
 */
interface ExpiryData {
  brand_id: string;
  date_range: Date | string | CustomRange;
}
/**
 * @interface ExpiryData
 * @property {string} brand_id - The ID of the brand.
 * @property {string} product_id - The ID of the product.
 * @property {number} expiry_date - The expiry date of the product.
 */

/**
 * Custom hook to handle the mutation for fetching product expiry data.
 *
 * This hook uses react-query's useMutation to handle the mutation for fetching product expiry data.
 * It constructs the pagination parameters from the provided URLSearchParams, and then sends a POST request
 * to the API with the variables. It checks the response status and throws an error if the response is not OK.
 *
 * @param {URLSearchParams} searchParams - The search parameters for pagination.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 * @returns {UseMutationResult<ProductExpiryResponse, Error>} The mutation result.
 *
 * @example
 * // Usage in a component
 * const searchParams = new URLSearchParams(window.location.search);
 * const { mutate: fetchProductExpiry, isLoading, isError, data } = useProductExpiry(searchParams);
 *
 * const handleFetchProductExpiry = (expiryData: ExpiryData) => {
 *   fetchProductExpiry(expiryData);
 * };
 *
 * @see ProductExpiryResponse
 * @see ExpiryData
 * 

 */

export const useProductExpiry = (searchParams: URLSearchParams) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  return useMutation<ProductExpiryResponse, Error, ExpiryData>(
    "product-expiry-list",

    async (variables: ExpiryData) => {
      if (!variables?.brand_id) return;
      const response = await fetch(
        `${API_URL}/expiry_list/${queryStringify({
          ...pagination
        })}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(variables)
        }
      );
      if (!response.ok) {
        throw new Error("Error in Fetching Expiry Product");
      }
      return response.json();
    },
    {
      // onError: () => showError("Error in Fetching Expiry Product")
    }
  );
};
