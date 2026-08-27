export interface AccessLog {
  "AM/PM": string;
  time: string;
  date: string;
  first_name: string;
  last_name: string;
  action: string;
  note: string;
}

export interface AccessLogResponse {
  total: number;
  count: number;
  pages: number;
  page: number;
  results: AccessLog[];
}
