import { ProductActiveLogResponse } from "@interfaces/productActiveLogType";
import { API_URL, getAccessToken } from "./api";
import { productActiveLogParamsGeneralKeys } from "../Utils/queryParamKeys";
import { useQuery } from "react-query";
import { queryStringify } from "../Utils/queryString";
import { QueryPagination } from "@interfaces/global";

export const useProductsActivityLog = (
  brand_id: string,
  searchParams?: URLSearchParams,
  isTrash: boolean = false
) => {
  return useQuery<ProductActiveLogResponse, Error>(
    ["product_activity_log", searchParams?.toString(), brand_id],
    async () => {
      if (!brand_id) {
        return;
      }
      const pagination: Partial<QueryPagination> = {
        count: searchParams?.get("count") || "20",
        page: searchParams?.get("page") || "1"
      };
      const generalParams: Record<string, string> = {
        ...(isTrash ? { is_trash: "True" } : { is_trash: "False" })
      };
      productActiveLogParamsGeneralKeys.forEach(key => {
        if (searchParams?.has(key)) {
          generalParams[key] = searchParams?.get(key) as string;
        }
      });
      const response = await fetch(
        `${API_URL}/product_activity_log/${queryStringify({
          brand_id: brand_id,
          ...pagination,
          ...generalParams
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
};
