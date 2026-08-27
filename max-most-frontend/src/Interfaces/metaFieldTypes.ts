export interface FieldOptions {
  field_name?: boolean;
  field_description?: boolean;
  types?: boolean;
  list_of_values?: boolean;
  one_value?: boolean;
  brand_id?: boolean;
  char_count?: boolean;
  min_characters?: boolean;
  max_characters?: boolean;
  decimal_places?: boolean;
  required?: boolean;
  options?: ["not_started", "in_progress", "completed"];
  file_specific?: boolean;
  date_specific?: boolean;
  is_multi?: boolean;
}

export const fieldTypes: { [key: string]: FieldOptions } = {
  "Text Field": {
    field_name: true,
    field_description: true,
    types: true,
    min_characters: true,
    max_characters: true,
    required: true,
    is_multi: true
  },
  "Multi-line": {
    field_name: true,
    field_description: true,
    types: true,
    min_characters: true,
    max_characters: true,
    required: true
  },
  "Drop Down": {
    field_name: true,
    field_description: true,
    types: true,
    required: true,
    options: ["not_started", "in_progress", "completed"],
    list_of_values: true,
    one_value: false,
    is_multi: true
  },
  Numeric: {
    field_name: true,
    field_description: true,
    types: true,
    min_characters: true,
    max_characters: true,
    required: true,
    is_multi: true
  },
  "Date and time": {
    field_name: true,
    field_description: true,
    types: true,
    date_specific: true,
    required: true,
    is_multi: true
  },
  Date: {
    field_name: true,
    field_description: true,
    types: true,
    date_specific: true,
    required: true,
    is_multi: true
  }
};

export interface MetaFieldTypes {
  field_name: string;
  field_description: string;
  min_characters: string;
  max_characters: string;
  file_specific: string;
  date_specific: string;
  brand_id: string;
  options: [string];
  types: string;
  one_value?: boolean;
  list_of_values?: boolean;
  is_multi?: boolean;
}

export interface MetaFieldDetail {
  filter(arg0: (val: string) => boolean): unknown;
  options_id?: string | number | (string | number)[];
  value?: string | number | (string | number)[];
  id: string;
  created: string;
  updated: string;
  field_name: string;
  field_description?: string;
  types:
    | "text_field"
    | "drop_down"
    | "multi-line"
    | "numeric"
    | "date_and_time"
    | "date"
    | "multi_line";
  brand_id?: string;
  char_count: string;
  min_characters: string;
  max_characters: string;
  decimal_places: string;
  required: "True" | "False";
  one_value: "True" | "False";
  list_of_values: "True" | "False";
  is_multi: "True" | "False";
  options?: { option_id: string; value: string }[];
  custom_fields?: {
    option_value: (string | number)[];
    id?: string;
    value?: (string | number)[];
    option_id?: (string | number)[];
  }[];
}

export interface MetaFieldItmes {
  filter(arg0: (val: string) => boolean): unknown;
  options_id?: string | number | (string | number)[];
  value?: string | number | (string | number)[];
  id: string;
  created: string;
  updated: string;
  field_name: string;
  field_description?: string;
  types: "text_field" | "drop_down" | "multi_line" | "numeric" | "date_and_time" | "date";
  brand_id?: string;
  char_count: string;
  min_characters: string;
  max_characters: string;
  decimal_places: string;
  required: "True" | "False";
  one_value: "True" | "False";
  list_of_values: "True" | "False";
  is_multi: "True" | "False";
  options?: { option_id: string; value: string }[];
}

export interface MetaOption {
  option_id: string | number | readonly string[] | undefined;
  value?: string | number | (string | number)[];
}
export interface Dropdowns {
  [key: string]: string | number | string[];
}
export interface MetaFieldResponse {
  results: MetaFieldDetail[];
}
export interface MetaFieldListResponse {
  results: MetaFieldDetail[];
  count: number;
  total: number;
  pages: number;
  page: number;
}
export interface ProductMetaFieldState {
  [id: string]: {
    id?: string | number | (string | number)[];
    value: string | number | (string | number)[];
  };
}
export interface ProductMetaFieldErrors {
  [id: string]: {
    error: string;
  };
}
export interface ProductMetaFieldInputState {
  [id: string]: {
    value: string;
  };
}

export interface MetaFieldLog {
  field_name: string;
  field_description: string;
  types: string;
  options?: { value: string; option_id: string }[];
}

export interface MetaFieldLogResponse {
  total: number;
  count: number;
  pages: number;
  page: number;
  results: MetaFieldLog[];
}
