interface ICustomRange {
  startDate: string;
  endDate: string;
}

type TDateRange = ICustomRange | string;

interface CustomerReport {
  staticPath: string;
  brand_id: string;
  product_id?: string;
  product_ids?: string[];
  website_ids?: string[];
  payment_method?: string[] | string;
  date_range?: TDateRange | null;
  at_date?: string;
  batch_number?: string;
}

export type { TDateRange, ICustomRange, CustomerReport };
