import authImage from "Assets/images/authorizepng.png";
import creditCardImage from "Assets/images/credit.png";
import offlineImage from "Assets/images/offline.png";
import stickyImage from "Assets/images/sticky.png";

import { CreditCardState, ECheckState, OfflineState, PaymentMethod } from "./types";

export const initialCardState: CreditCardState = {
  card_number: "",
  exp_date: "",
  csc: ""
};

export const initialOfflineState: OfflineState = {
  receipt: "",
  amount: ""
};

export const initialEcheckState: ECheckState = {
  number: "",
  name: "",
  routing: "",
  type: ""
};

export const paymentHistory: PaymentMethod[] = [
  {
    number: "4241 **** **** 7842",
    exp: "01/22",
    logo: creditCardImage,
    type: "sticky"
  },
  {
    number: "1242 **** **** 1042",
    exp: "01/22",
    logo: offlineImage,
    type: "offline"
  },
  {
    number: "7092 **** **** 1012",
    exp: "01/22",
    logo: authImage,
    type: "echeck"
  },
  {
    number: "4242 **** **** 4242",
    exp: "01/22",
    logo: stickyImage,
    type: "sticky"
  },
  {
    number: "4242 **** **** 4242",
    exp: "01/22",
    logo: stickyImage,
    type: "sticky"
  }
];
