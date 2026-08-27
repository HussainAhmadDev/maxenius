export interface ShippingReturnInfo {
  shipped_quantity: number | null;
  product_id: string | null;
  ship_date: string | null;
  id?: string | null;
}
export interface IReturnInfo {
  returned_quantity: number | null;
  ordered_product_id: string | null;
}
