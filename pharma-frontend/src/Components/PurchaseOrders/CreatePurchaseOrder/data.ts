export interface Product {
  exchange_price: string;
  exchange_total: string;
  price: string;
  product_name: string;
  quantity: number;
  total: string;
}

export interface Receiving {
  batch_number: string;
  expiry_date: string;
  product_name: string;
  received_quantity: number;
}

export interface StaticData {
  exchange_rate: string;
  invoicing_currency: string;
  location: string;
  order_date: string;
  order_number: number;
  products: Product[];
  receivings: Receiving[];
  vendor_name: string;
  purchase_order_number?: number;
}

// export const staticData: StaticData = {
//   exchange_rate: "£1 = 1.00",
//   invoicing_currency: "€",
//   location: "Main WH",
//   order_date: "23/05/2024",
//   order_number: 388,
//   products: [
//     {
//       exchange_price: "5.00",
//       exchange_total: "25.00",
//       price: "5.00",
//       product_name: "Belotero Revive ( 1ml )",
//       quantity: 5,
//       total: "25.00"
//     }
//   ],
//   receivings: [
//     {
//       batch_number: "RC0026210",
//       expiry_date: "Fri, 07 Jun 2024 00:00:00 GMT",
//       product_name: "Belotero Revive ( 1ml )",
//       received_quantity: 4
//     },
//     {
//       batch_number: "RC0026210-001",
//       expiry_date: "Sun, 07 Jun 2026 00:00:00 GMT",
//       product_name: "Belotero Revive ( 1ml )",
//       received_quantity: 1
//     }
//   ],
//   vendor_name: "rr nm iii"
// };
