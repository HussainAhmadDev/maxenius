export type FormAction =
  | {
      type: "HANDLE_INPUT_TEXT";
      field: string;
      payload: string | boolean;
    }
  | { type: "RESET" };

export const createFormReducer =
  <T>(initialState: T) =>
  (state = initialState, action: FormAction): T => {
    switch (action.type) {
      case "HANDLE_INPUT_TEXT":
        return {
          ...state,
          [action.field]: action.payload
        };
      case "RESET":
        return initialState;
      default:
        throw new Error("Action not supported.");
    }
  };
