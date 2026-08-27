// Define a TypeScript interface for the shipping and return information

// Define the context
import { IReturnInfo, ShippingReturnInfo } from "Interfaces/ShippingReturn";
import React, { createContext, useState } from "react";

// Create a new context
const ShippingReturnContext = createContext<{
  shippingInfo: ShippingReturnInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingReturnInfo>>;

  returnInfo: IReturnInfo | null;
  setReturnInfo: React.Dispatch<React.SetStateAction<IReturnInfo | null>>;
}>({
  shippingInfo: {
    shipped_quantity: null,
    ship_date: null,
    product_id: null,
    id: null
  },
  //eslint-disable-next-line
  setShippingInfo: () => {},
  returnInfo: {
    returned_quantity: null,
    ordered_product_id: null
  },
  //eslint-disable-next-line
  setReturnInfo: () => {}
});

export const ShippingReturnProvider: React.FC = ({ children }) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingReturnInfo>({
    shipped_quantity: null,
    ship_date: null,
    product_id: null,
    id: null
  });

  const [returnInfo, setReturnInfo] = useState<IReturnInfo | null>({
    returned_quantity: null,
    ordered_product_id: null
  });

  return (
    <ShippingReturnContext.Provider
      value={{ shippingInfo, setShippingInfo, returnInfo, setReturnInfo }}
    >
      {children}
    </ShippingReturnContext.Provider>
  );
};

export default ShippingReturnContext;
