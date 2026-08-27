// stockTransferReducer.ts
export interface State {
  fromProduct: string | null;
  fromBatch: string | null;
  fromQuantity: string;
  fromWebsite: string | null;
  toBrand: string | null;
  toProduct: string | null;
  toVendor: string | null;
  toWarehouse: string | null;
}

export type Action =
  | { type: "SET_FROM_PRODUCT"; payload: string }
  | { type: "SET_FROM_BATCH"; payload: string }
  | { type: "SET_FROM_QUANTITY"; payload: string }
  | { type: "SET_FROM_WEBSITE"; payload: string }
  | { type: "SET_TO_BRAND"; payload: string }
  | { type: "SET_TO_PRODUCT"; payload: string }
  | { type: "SET_TO_VENDOR"; payload: string }
  | { type: "SET_TO_WAREHOUSE"; payload: string }
  | { type: "RESET_TO_PRODUCT" }
  | { type: "RESET_ALL" };

export const initialState: State = {
  fromProduct: null,
  fromBatch: null,
  fromQuantity: "0",
  fromWebsite: null,
  toBrand: null,
  toProduct: null,
  toVendor: null,
  toWarehouse: null
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FROM_PRODUCT":
      return {
        ...state,
        fromProduct: action.payload,
        fromBatch: null,
        fromQuantity: "0"
      };
    case "SET_FROM_BATCH":
      // Ensure fromProduct is set before setting batch
      if (state.fromProduct) {
        return { ...state, fromBatch: action.payload, fromQuantity: "0" };
      }
      return state;
    case "SET_FROM_QUANTITY":
      // Ensure fromProduct is set before setting quantity
      if (state.fromProduct) {
        return { ...state, fromQuantity: action.payload };
      }
      return state;
    case "SET_FROM_WEBSITE":
      return { ...state, fromWebsite: action.payload };
    case "SET_TO_BRAND":
      return {
        ...state,
        toBrand: action.payload,
        // Reset dependent field when changing brand
        toProduct: null,
        toVendor: null,
        toWarehouse: null
      };
    case "SET_TO_PRODUCT":
      // Ensure toBrand is set before setting product
      if (state.toBrand) {
        return { ...state, toProduct: action.payload };
      }
      return state;
    case "SET_TO_VENDOR":
      return { ...state, toVendor: action.payload };
    case "SET_TO_WAREHOUSE":
      return { ...state, toWarehouse: action.payload };
    case "RESET_TO_PRODUCT":
      return { ...state, toProduct: null };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
};
