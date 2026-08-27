interface Warehouse {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  region: string;
  post_code: string;
  country: string;
  is_active: "True" | "False";
  is_trash: "True" | "False";
  user_id: string;
  brand_id: string;
}

interface WarehouseResponse {
  results: Warehouse[];
  total: number;
  page: number;
  pages: number;
  count: number;
}

export type { Warehouse, WarehouseResponse };
