import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Define the TypeScript types for URL parameters
type URLParams = {
  brand_id?: string;
  status?: string;
  shipment_status?: string;
  website_id?: string;
  website_order_id?: string;
  order_number?: string;
  payment_status?: string;
  company_name?: string;
  product_id?: string;
};

// Utility function to parse URL parameters
const parseURLParams = (search: string): URLParams => {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries()) as URLParams;
};

// Utility function to stringify URL parameters
const stringifyURLParams = (params: URLParams): string => {
  const searchParams = new URLSearchParams(params);
  return searchParams.toString();
};

// Custom hook to manage URL parameters and local storage
export const useURLParams = (): [URLParams, (params: URLParams) => void] => {
  const location = useLocation();
  const navigate = useNavigate();

  // Only update the URL params and local storage when the location is "/orders"
  const isOrdersLocation = location.pathname === "/orders";

  // Get the URL parameters from the current location
  const paramsFromURL = parseURLParams(location.search);

  // Get the stored params from local storage (if available)
  const storedParamsJSON = isOrdersLocation ? localStorage.getItem("ordersFilter") : null;
  //eslint-disable-next-line
  const storedParams = storedParamsJSON ? JSON.parse(storedParamsJSON) : {};

  // Merge the URL params with the stored params to handle changes from both sources
  // const mergedParams: URLParams = { ...storedParams, ...paramsFromURL };
  const mergedParams = useMemo(() => {
    return { ...storedParams, ...paramsFromURL };
  }, [storedParams, paramsFromURL]);

  // Update the URL params and local storage
  const setParams = (params: URLParams) => {
    const updatedParams = { ...mergedParams, ...params };

    // Remove any parameters with empty values
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key as keyof URLParams]) {
        delete updatedParams[key as keyof URLParams];
      }
    });

    const search = stringifyURLParams(updatedParams);
    navigate({ search });
    if (isOrdersLocation) {
      localStorage.setItem("ordersFilter", JSON.stringify(updatedParams));
    }
  };

  // Watch for changes in the URL and update the mergedParams accordingly
  useEffect(() => {
    if (isOrdersLocation) {
      const newParamsFromURL = parseURLParams(location.search);
      const updatedMergedParams = { ...storedParams, ...newParamsFromURL };
      // Update the mergedParams only if they have changed
      if (JSON.stringify(updatedMergedParams) !== JSON.stringify(mergedParams)) {
        localStorage.setItem("ordersFilter", JSON.stringify(updatedMergedParams));
      }
    }
  }, [location.search, storedParams, mergedParams, isOrdersLocation]);

  return [mergedParams, setParams];
};
