import { ProductTransactionResponse } from "Interfaces/Company";
import { API_URL, getAccessToken } from "./api";
import { useMutation } from "react-query";
import { useBrand } from "Context/BrandContext";
import { queryStringify } from "Utils/queryString";
import { QueryPagination } from "Interfaces/QueryFilters";

interface IProduct {
  product_id: string;
}
export const useProductTransaction = (searchParams: URLSearchParams) => {
  const { activeBrand } = useBrand();

  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  return useMutation<ProductTransactionResponse, Error, IProduct>(
    ["productsTranstion", searchParams],
    async variables => {
      const response = await fetch(
        `${API_URL}/transaction-history/${queryStringify({
          ...pagination,
          product_id: variables.product_id,
          brand_id: activeBrand
        })}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify({ product_id: variables.product_id })
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
};

//testing
