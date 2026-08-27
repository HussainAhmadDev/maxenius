export interface Filter {
  id: string;
  brand_id: string;
  template_id: string;
  field_value: boolean | number | string | string[];
  field_name: string;
  exclude: boolean;
  company_id: string;
  created: string;
  type: string;
}

export interface FilterResponse {
  readonly results: Array<Filter>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface ReportTemplate {
  id: string;
  created: string;
  updated: string | null;
  name: string;
  company_id: string;
  brand_id: string;
}

export interface ReportTemplateRequest {
  name: string;
}

export interface ReportTemplateResponse {
  readonly results: Array<ReportTemplate>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface TemplateFilter {
  id: string;
  company_id: string;
  brand_id: string;
  template_id: string;
  filter_id: string;
}

export interface TemplateFilterRequest {
  company_id: string;
  brand_id: string;
  template_id: string;
  filter_id: string;
}

export interface TemplateFilterResponse {
  readonly results: Array<TemplateFilter>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
