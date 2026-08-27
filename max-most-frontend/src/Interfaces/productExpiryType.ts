export interface ProductExpiry {
  available_quantity: number;
  batch_number: string;
  brand_name: string;
  expiry_date: string;
  number: number;
  product_name: string;
  product_sku: string;
}

// Define the interface for the overall response
export interface ProductExpiryResponse {
  count: string;
  page: string;
  pages: number;
  results: ProductExpiry[];
  total: number;
}
