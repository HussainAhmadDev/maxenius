import { API_URL, getAccessToken, getBrandId } from "./api";
import { useMutation } from "react-query";
import { ProductTransactionResponse } from "../Interfaces/productTransactionType";
// import { useBrand } from "./useBrand";
import { QueryPagination } from "../Interfaces/global";
import { queryStringify } from "../Utils/queryString";

/**
 * @interface ProductTransaction
 * @property {string} ordered - The date when the product was ordered.
 * @property {string} name - The name of the product.
 * @property {string} number - The number associated with the product transaction.
 * @property {string} batch_number - The batch number of the product.
 * @property {string} expiry_date - The expiry date of the product.
 * @property {number} quantity - The quantity of the product in the transaction.
 * @property {number} running_total - The running total of the product quantity.
 * @property {string} type_t - The type of transaction.
 * @property {boolean} is_adjustment - Indicates if the transaction is an adjustment.
 */

/**
 * @interface ProductTransactionResponse
 * @property {ProductTransaction[]} results - An array of `ProductTransaction` items.
 * @property {number} total - The total number of transactions.
 * @property {string} page - The current page number.
 * @property {number} pages - The total number of pages.
 * @property {string} count - The number of items returned in the response.
 */

/**
 * Interface representing a product with an ID.
 * @interface IProduct
 * @property {string} product_id - The ID of the product.
 */

/**
 * Custom hook to fetch product transactions.
 * @param {URLSearchParams} searchParams - The search parameters for pagination and filtering.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 * @returns {UseMutationResult<ProductTransactionResponse, Error, IProduct>} - The mutation result for fetching product transactions.
 *  @example
 * // Usage in a component
 * const searchParams = new URLSearchParams(window.location.search);
 * const { mutate: fetchProductTransaction, isLoading, isError, data } = useProductTransaction(searchParams);
 */
export const useProductTransaction = (searchParams: URLSearchParams) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  return useMutation<ProductTransactionResponse, Error, { product_id: string }>(
    ["productsTransaction", searchParams.toString()],
    async variables => {
      const response = await fetch(
        `${API_URL}/transaction-history/${queryStringify({
          ...pagination,
          product_id: variables.product_id,
          ...getBrandId() // Corrected here
        })}`,

        {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${getAccessToken()}`
          }
          // body: JSON.stringify({ product_id: variables.product_id })
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
