export type PaymentType = "offline" | "echeck" | "sticky" | "none";

export type AccountType = "checking" | "savings" | "bussiness_checking";

export interface CreditCardPayment {
  card_number: string;
  exp_date: string;
  ccv: string;
}

export interface OfflinePayment {
  amount: number;
  receipt: string;
}

export interface ECheckPayment {
  routing_number: string;
  account_number: string;
  account_name: string;
  type: AccountType;
}

export interface AddOrderPaymentBody {
  type: Omit<PaymentType, "none">;
  data: CreditCardPayment | OfflinePayment | ECheckPayment;
}
