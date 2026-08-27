import { AccessLogResponse } from "@interfaces/AccessLogs";
import { QueryPagination } from "@interfaces/global";
import { useQuery } from "react-query";
import { accessLogParamsGeneralKeys } from "../Utils/queryParamKeys";
import { queryStringify } from "../Utils/queryString";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { toast } from "react-toastify";

export const useAccessLog = (
  brand_id: string,
  searchParams: URLSearchParams,
  isTrash: boolean = false
) => {
  return useQuery<AccessLogResponse, Error>(
    ["access_log", searchParams?.toString(), brand_id],
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
      accessLogParamsGeneralKeys.forEach(key => {
        if (searchParams?.has(key)) {
          generalParams[key] = searchParams?.get(key) as string;
        }
      });
      const response = await fetch(
        `${API_URL}/access_log/${queryStringify({
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

//csv report
export const useReportAccessLog = (searchParams: URLSearchParams) => {
  return useQuery<string, Error>(
    ["access_log", searchParams.toString()],

    async () => {
      const queryParams: Record<string, string> = {};
      const first_name = searchParams.get("first_name");
      const last_name = searchParams.get("last_name");
      const fromDate = searchParams.get("from_date");
      const toDate = searchParams.get("to_date");

      if (first_name) queryParams.first_name = first_name;
      if (last_name) queryParams.last_name = last_name;
      if (fromDate) queryParams.from_date = fromDate;
      if (toDate) queryParams.to_date = toDate;

      const brand = getBrandId();
      if (!brand) {
        throw new Error("Brand ID is required");
      }

      const queryString = new URLSearchParams(queryParams).toString();
      const apiPath = `/access_log/?brand_id=${brand.brand_id}&response_type=csv${queryString ? `&${queryString}` : ""}`;

      const response = await fetch(`${API_URL}${apiPath}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const responseText = await response.text();

      if (!responseText) {
        throw new Error("Received empty response from the API Access Log");
      }

      const csvBlob = new Blob([responseText], { type: "text/csv" });
      const csvUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = csvUrl;
      link.download = "access_log.csv";
      link.click();
      link.remove();

      return "access_log";
    },
    {
      enabled: false, // Only fetch on demand
      onError: (error: Error) => {
        toast.error(`Failed to download report: ${error.message}`);
      }
    }
  );
};
