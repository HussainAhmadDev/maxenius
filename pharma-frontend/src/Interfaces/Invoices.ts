export interface Invoice {
  name: string;
  url: string;
}

export interface InvoiceResponse {
  invoices: Invoice[];
}
