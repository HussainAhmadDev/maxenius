import { UserData } from "Interfaces/User";
import React, { useState, useEffect } from "react";
interface URLParams {
  brand_id?: string;
  status?: string;
  shipment_status?: string;
  website_id?: string;
  website_order_id?: string;
  order_number?: string;
  payment_status?: string;
}
export const useFilters = (): URLParams | undefined => {
  const [orderFilters, setOrderFilters] = useState<URLParams>();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("ordersFilter");
      const parsedUser = storedUser ? JSON.parse(storedUser) : undefined;
      setOrderFilters(parsedUser);
    };

    fetchUser();
  }, []);

  return orderFilters;
};
