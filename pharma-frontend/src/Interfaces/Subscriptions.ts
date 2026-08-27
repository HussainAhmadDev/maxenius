export interface Form {
  readonly id: string;
  readonly icon?: "person" | "persons" | "city";
  readonly title: "individual" | "teams" | "enterprise" | "renewSubscription";
  readonly description?: string;
  fields: Array<Field>;
}

export interface Field {
  label: string;
  type: string;
  name: string;
  value?: string | number | boolean;
}

export interface Subscription {
  subscription: string;
  firstName: string;
  lastName: string;
  currency: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddress1: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  phone: string;
  email: string;
  creditCardType: string;
  creditCardNumber: string;
  expirationDate: string;
  CVV: string;
  shippingAddress1: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  expiration_date: string;
  subscriber_count: number;
  is_auto_renew: boolean;
  product_id: string;
  brand_id: string;
  order_id: string;
  company_id: string;
  user_id: string;
  created_from_advocacy: boolean;
  shipping_address_id: string;
  number_of_seats: number;
  customer_price: number;
}
