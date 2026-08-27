import { API_URL, getAccessToken, getBrandId } from "./api";
import { queryStringify } from "../Utils/queryString";
import { QueryPagination } from "../Interfaces/global";
import { useQuery, UseQueryResult } from "react-query";
import {
  AdjustmentBatch,
  StockHistoryResults
} from "../Interfaces/stocksAdjustmentTypes";

/**
 * Represents stock history.
 * @interface StockHistory
 * @property {string} id - The ID of the stock history.
 * @property {string} created - The creation date of the stock history.
 * @property {string} updated - The last update date of the stock history.
 * @property {string} brand_id - The brand ID associated with the stock history.
 * @property {string} reason - The reason for the stock adjustment.
 * @property {string} action_id - The ID of the action.
 * @property {string} action_name - The name of the action.
 * @property {string} created_by - The user who created the stock history.
 * @property {number} ordered_quantity - The ordered quantity.
 * @property {string} ordered_product - The ordered product.
 */

/**
 * Represents an adjustment product.
 * @interface  AdjustmentProduct
 * @property {number} price - The price of the product.
 * @property {Object} product - The product details.
 * @property {number} product.cost_price - The cost price of the product.
 * @property {string} product.label - The label of the product.
 * @property {string} product.value - The value of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {number} tax - The tax on the product.
 * @property {number} total - The total cost.
 * @property {string} id - The ID of the product.
 * @property {number} stock_quantity - The stock quantity.
 * @property {string} sku - The SKU of the product.
 * @property {string} name - The name of the product.
 * @property {string} batchNumber - The batch number.
 * @property {string} expiry_date - The expiry date.
 * @property {number} less_quantity - The quantity less after adjustment.
 * @property {number} after_adjustment_qty - The quantity after adjustment.
 * @property {string} batch_id - The batch ID.
 * @property {string} adjustmentQty - The adjustment quantity.
 */

/**
 * Represents stock history results.
 * @interface  StockHistoryResults
 * @property {number} count - The total number of results.
 * @property {number} page - The current page.
 * @property {number} pages - The total number of pages.
 * @property {StockHistory[]} results - The stock history results.
 * @property {number} total - The total number of items.
 */

/**
 * Represents an adjustment batch.
 * @interface  AdjustmentBatch
 * @property {string} batch_number - The batch number.
 * @property {string} expiry_date - The expiry date.
 * @property {number} received_quantity - The received quantity.
 * @property {number} id - The batch ID.
 */

/**
 * Represents the form for increasing stock.
 * @interface  IncreaseStockForm
 * @property {string} vendor_id - The vendor ID.
 * @property {string} reason - The reason for increasing stock.
 * @property {string} warehouse_id - The warehouse ID.
 * @property {IncreaseStockFormProduct[]} products - The products in the form.
 */

/**
 * Represents a product in the form for increasing stock.
 * @interface  IncreaseStockFormProduct
 * @property {string} batch_number - The batch number.
 * @property {string} expiry_date - The expiry date.
 * @property {string} product_id - The product ID.
 * @property {string} product_name - The product name.
 * @property {number} quantity - The quantity.
 * @property {string} sku - The SKU.
 * @property {number|string} stock_quantity - The stock quantity.
 */

/**
 * Represents the form for increasing stock with specific product properties omitted.
 * @interface  IncreaseStcock
 * @property {string} vendor_id - The vendor ID.
 * @property {string} reason - The reason for increasing stock.
 * @property {string} warehouse_id - The warehouse ID.
 * @property {IncreaseStockFormProduct[]} products - The products in the form.
 */

/**
 * Represents the form for decreasing stock.
 * @interface  DecreaseStockForm
 * @property {string} expiry_date - The expiry date.
 * @property {string} batch_number - The batch number.
 * @property {string} received_quantity - The received quantity.
 * @property {IncreaseStockFormProduct[]} products - The products in the form.
 */

/**
 * Represents a product in the form for decreasing stock.
 * @interface  DecreaseStockFormProduct
 * @property {string} product_id - The product ID.
 * @property {string} batch_number - The batch number.
 * @property {string} id - The ID.
 * @property {string} received_quantity - The received quantity.
 * @property {number} adjustmentQty - The adjustment quantity.
 * @property {number} afterQty - The quantity after adjustment.
 * @property {string} batchNumber - The batch number.
 * @property {string} expiry_date - The expiry date.
 * @property {number} after_adjustment_qty - The quantity after adjustment.
 * @property {number} less_quantity - The quantity less after adjustment.
 * @property {string} batch_id - The batch ID.
 * @property {number} price - The price.
 * @property {string} product_label - The product label.
 * @property {number} quantity - The quantity.
 * @property {number} stock_quantity - The stock quantity.
 * @property {string} sku - The SKU.
 * @property {string} product_name - The product name.
 * @property {Object} product - The product details.
 * @property {number} product.cost_price - The cost price.
 * @property {string} product.label - The label.
 * @property {string} product.value - The value.
 */

/**
 * Represents the product in the decrease stock body.
 * @interface  DecreaseStockProduct
 * @property {string} product_id - The product ID.
 * @property {string} sku - The SKU.
 * @property {number} quantity - The quantity.
 * @property {string} batch_number - The batch number.
 * @property {string} expiry_date - The expiry date.
 * @property {DecreaseStockProduct} product - The product details.
 */

/**
 * Represents the body for decreasing stock.
 * @interface  DecreaseStockBody
 * @property {string} brand_id - The brand ID.
 * @property {string} reason - The reason for decreasing stock.
 * @property {string} website_id - The website ID.
 * @property {DecreaseStockProduct[]} products - The products in the decrease stock body.
 */

/**
 * Represents the response for decreasing stock.
 * @interface  DecreaseStockResponse
 * @property {string} message - The response message.
 */

/**
 * Custom hook to fetch stock adjustment history.
 *
 * @param {URLSearchParams} searchParams - The search parameters for pagination.
 * @returns {UseQueryResult<StockHistoryResults, Error>} The query result containing stock adjustment history data.
 */
export const useStockHistory = (
  searchParams: URLSearchParams
): UseQueryResult<StockHistoryResults, Error> => {
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
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
};

/**
 * Custom hook to fetch expiry and batch list for a specific product.
 *
 * @param {string} [id] - The ID of the product.
 * @param {string} [brand_id] - The brand ID.
 * @returns {UseQueryResult<AdjustmentBatch[], Error>} The query result containing expiry and batch list data.
 */
export const useExpiryAndBatchList = (
  id?: string,
  brand_id?: string
): UseQueryResult<AdjustmentBatch[], Error> => {
  return useQuery<AdjustmentBatch[], Error>(
    ["expiryandbatch", id, brand_id],
    async () => {
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
    }
  );
};
