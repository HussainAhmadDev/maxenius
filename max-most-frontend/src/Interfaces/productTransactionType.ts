export interface ProductTransaction {
  ordered: string;
  name: string;
  number: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  running_total: number;
  type_t: string;
  is_adjustment: boolean;
}

export interface ProductTransactionResponse {
  results: ProductTransaction[];
  total: number;
  page: string;
  pages: number;
  count: string;
}
