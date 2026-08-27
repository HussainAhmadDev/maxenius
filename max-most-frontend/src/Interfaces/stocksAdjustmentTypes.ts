/**
 * Represents a stock history record.
 * @typedef {Object} StockHistory
 * @property {string} id - Unique identifier of the stock history.
 * @property {string} created - Creation date of the stock history.
 * @property {string} updated - Update date of the stock history.
 * @property {string} brand_id - ID of the associated brand.
 * @property {string} reason - Reason for the stock change.
 * @property {string} action_id - ID of the action performed.
 * @property {string} action_name - Name of the action performed.
 * @property {string} created_by - User who created the stock history.
 * @property {number} ordered_quantity - Quantity ordered.
 * @property {string} ordered_product - Ordered product.
 */

/**
 * Represents an adjustment product.
 * @typedef {Object} AdjustmentProduct
 * @property {number} price - Price of the product.
 * @property {Object} product - Product details.
 * @property {number} product.cost_price - Cost price of the product.
 * @property {string} product.label - Label of the product.
 * @property {string} product.value - Value of the product.
 * @property {number} quantity - Quantity of the product.
 * @property {number} tax - Tax amount.
 * @property {number} total - Total amount.
 * @property {string} id - Unique identifier of the adjustment product.
 * @property {number} stock_quantity - Stock quantity of the product.
 * @property {string} sku - SKU of the product.
 * @property {string} name - Name of the product.
 * @property {string} batchNumber - Batch number of the product.
 * @property {string} expiry_date - Expiration date of the product.
 * @property {number} less_quantity - Reduced quantity.
 * @property {number} after_adjustment_qty - Quantity after adjustment.
 * @property {string} batch_id - ID of the batch.
 * @property {string} adjustmentQty - Adjustment quantity.
 */

/**
 * Represents a paginated result of stock history records.
 * @typedef {Object} StockHistoryResults
 * @property {number} count - Total number of records.
 * @property {number} page - Current page number.
 * @property {number} pages - Total number of pages.
 * @property {Array<StockHistory>} results - Array of stock history records.
 * @property {number} total - Total number of records.
 */

/**
 * Represents an adjustment batch.
 * @typedef {Object} AdjustmentBatch
 * @property {string} batch_number - Batch number.
 * @property {string} expiry_date - Expiration date.
 * @property {number} received_quantity - Received quantity.
 * @property {number} id - Unique identifier of the batch.
 */

/**
 * Represents a form for increasing stock.
 * @typedef {Object} IncreaseStockForm
 * @property {string} vendor_id - ID of the vendor.
 * @property {string} reason - Reason for increasing stock.
 * @property {string} warehouse_id - ID of the warehouse.
 * @property {Array<IncreaseStockFormProduct>} products - Array of products to increase stock for.
 */

/**
 * Represents a product in an increase stock form.
 * @typedef {Object} IncreaseStockFormProduct
 * @property {string} batch_number - Batch number of the product.
 * @property {string} expiry_date - Expiration date of the product.
 * @property {string} product_id - ID of the product.
 * @property {string} product_name - Name of the product.
 * @property {number} quantity - Quantity to increase.
 * @property {string} sku - SKU of the product.
 * @property {number|string} stock_quantity - Stock quantity of the product.
 */

/**
 * Represents a form for decreasing stock.
 * @typedef {Object} DecreaseStockForm
 * @property {string} expiry_date - Expiration date.
 * @property {string} batch_number - Batch number.
 * @property {string} received_quantity - Received quantity.
 * @property {Array<IncreaseStockFormProduct>} products - Array of products to decrease stock for.
 */

/**
 * Represents a product in a decrease stock form.
 * @typedef {Object} DecreaseStockFormProduct
 * @property {string} product_id - ID of the product.
 * @property {string} batch_number - Batch number of the product.
 * @property {string} id - Unique identifier of the product.
 * @property {string} received_quantity - Received quantity.
 * @property {number} adjustmentQty - Adjustment quantity.
 * @property {number} afterQty - Quantity after adjustment.
 * @property {string} batchNumber - Batch number of the product.
 * @property {string} expiry_date - Expiration date of the product.
 * @property {number} after_adjustment_qty - Quantity after adjustment.
 * @property {number} less_quantity - Reduced quantity.
 * @property {string} batch_id - ID of the batch.
 * @property {number} price - Price of the product.
 * @property {string} product_label - Label of the product.
 * @property {number} quantity - Quantity of the product.
 * @property {number} stock_quantity - Stock quantity of the product.
 * @property {string} sku - SKU of the product.
 * @property {string} product_name - Name of the product.
 * @property {Object} product - Product details.
 * @property {number} product.cost_price - Cost price of the product.
 * @property {string} product.label - Label of the product.
 * @property {string} product.value - Value of the product.
 */

/**
 * Represents an increased stock object.
 * @typedef {Object} IncreaseStcock
 * @property {string} vendor_id - ID of the vendor.
 * @property {string} reason - Reason for increasing stock.
 * @property {string} warehouse_id - ID of the warehouse.
 * @property {Array<Omit<IncreaseStockFormProduct, 'product_name' | 'stock_quantity'>>} products - Array of products to increase stock for.
 */

/**
 * Represents a decrease stock product.
 * @typedef {Object} DecreaseStockProduct
 * @property {Object} product - Product details.
 * @property {string} product_id - ID of the product.
 * @property {string} sku - SKU of the product.
 * @property {number} quantity - Quantity to decrease.
 * @property {string} batch_number - Batch number of the product.
 * @property {string} expiry_date - Expiration date of the product.
 */

/**
 * Represents a decrease stock body.
 * @typedef {Object} DecreaseStockBody
 * @property {string} brand_id - ID of the brand.
 * @property {string} reason - Reason for decreasing stock.
 * @property {string} website_id - ID of the website.
 * @property {Array<DecreaseStockProduct>} products - Array of products to decrease stock for.
 */

/**
 * Represents a decrease stock response.
 * @typedef {Object} DecreaseStockResponse
 * @property {string} message - Response message.
 */

interface StockHistory {
  id: string;
  created: string;
  updated: string;
  brand_id: string;
  reason: string;
  action_id: string;
  action_name: string;
  created_by: string;
  ordered_quantity: number;
  ordered_product: string;
}
interface AdjustmentProduct {
  price: number;
  product: {
    cost_price: number;
    label: string;
    value: string;
  };
  quantity: number;
  tax: number;
  total: number;
  id: string;
  stock_quantity: number;
  sku: string;
  name: string;
  batchNumber: string;
  expiry_date: string;
  less_quantity: number;
  after_adjustment_qty: number;
  batch_id: string;
  adjustmentQty: string;
}

interface StockHistoryResults {
  count: number;
  page: number;
  pages: number;
  results: StockHistory[];
  total: number;
}
interface AdjustmentBatch {
  batch_number: string;
  expiry_date: string;
  received_quantity: number;
  id: number;
}

interface IncreaseStockForm {
  vendor_id: string;
  reason: string;
  warehouse_id: string;
  products: IncreaseStockFormProduct[];
}

interface IncreaseStockFormProduct {
  batch_number: string;
  expiry_date: string;
  product_id: string;
  product_name: string;
  quantity: number;
  sku: string;
  stock_quantity: number | string;
}
interface DecreaseStockForm {
  expiry_date: string;
  batch_number: string;
  received_quantity: string;
  products: IncreaseStockFormProduct[];
}
interface DecreaseStockFormProduct {
  product_id: string;
  batch_number: string;
  id: string;
  received_quantity: string;
  adjustmentQty: number;
  afterQty: number;
  batchNumber: string;
  expiry_date: string;
  after_adjustment_qty: number;
  less_quantity: number;
  batch_id: string;
  price: number;
  product_label: string;
  quantity: number;
  stock_quantity: number;
  sku: string;
  product_name: string;
  product: {
    cost_price: number;
    label: string;
    value: string;
  };
}

interface IncreaseStcock extends Omit<IncreaseStockForm, "products"> {
  products: Omit<IncreaseStockFormProduct, "product_name" | "stock_quantity">[];
}
export type {
  StockHistoryResults,
  StockHistory,
  AdjustmentProduct,
  AdjustmentBatch,
  IncreaseStockForm,
  IncreaseStockFormProduct,
  IncreaseStcock,
  DecreaseStockForm,
  DecreaseStockFormProduct
};

export interface DecreaseStockProduct {
  product: DecreaseStockProduct;
  product_id: string;
  sku: string;
  quantity: number;
  batch_number: string;
  expiry_date: string;
}

export interface DecreaseStockBody {
  brand_id: string;
  reason: string;
  website_id: string;
  products: DecreaseStockProduct[];
}
export interface DecreaseStockResponse {
  message: string;
}
