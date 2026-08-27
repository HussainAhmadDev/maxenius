import { PaymentType } from "Interfaces/Payment";

export interface PaymentMethod {
  number: string;
  exp: string;
  code?: string;
  amount?: string;
  logo: string;
  type: PaymentType;
}

export type CardInputType = "card_number" | "csc" | "exp_date";

export interface CreditCardState {
  card_number: string;
  exp_date: string;
  csc: string;
}

export interface OfflineState {
  amount: number | string;
  receipt: string;
}

export interface ECheckState {
  routing: string;
  number: string;
  name: string;
  type: string;
}
