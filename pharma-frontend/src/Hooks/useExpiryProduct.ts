import { useMutation } from "react-query";
import { API_URL, getAccessToken } from "./api";
import { showError } from "Components/Toaster";

import { ExpiryDataResponse } from "Interfaces/ExpiryProduct";
import { QueryPagination } from "Interfaces/QueryFilters";
import { queryStringify } from "Utils/queryString";

interface CustomRange {
  startDate: Date | string;
  endDate: Date | string;
}

interface ExpiryData {
  brand_id: string;
  date_range: Date | string | CustomRange;
}

export const useProductExpiry = (searchParams: URLSearchParams) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  return useMutation<ExpiryDataResponse, Error, ExpiryData>(
    "product-expiry-list",

    async (variables: ExpiryData) => {
      // if (variables.brand_id.length === 0) variables.brand_id = activeBrand.activeBrand;
      if (!variables?.brand_id) return;
      const response = await fetch(
        `${API_URL}/expiry_list/${queryStringify({
          ...pagination
        })}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(variables)
        }
      );
      if (!response.ok) {
        throw new Error("Error in Fetching Expiry Product");
      }
      return response.json();
    },
    {
      onError: () => showError("Error in Fetching Expiry Product")
    }
  );
};
