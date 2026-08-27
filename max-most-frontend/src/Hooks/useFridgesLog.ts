import { API_URL, getAccessToken, getBrandId } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryStringify } from "../Utils/queryString";
import {
  FridgeLogCreate,
  FridgeLogsResponse,
  UpdateFridgeLog
} from "@interfaces/Fridges";
import { QueryPagination } from "@interfaces/global";
import { fridgeParamsGeneralKeys } from "../Utils/queryParamKeys";
import { toast } from "react-toastify";
import { OrderData } from "@interfaces/Orders";

export const useFridgesLog = (
  brand_id: string,
  searchParams: URLSearchParams,
  isTrash: boolean = false
) => {
  return useQuery<FridgeLogsResponse, Error>(
    ["fridge_log", searchParams?.toString(), brand_id],
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
      fridgeParamsGeneralKeys.forEach(key => {
        if (searchParams?.has(key)) {
          generalParams[key] = searchParams?.get(key) as string;
        }
      });
      const response = await fetch(
        `${API_URL}/fridge_log/${queryStringify({
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

export const useAddFridgeLog = () => {
  const queryClient = useQueryClient();
  return useMutation<FridgeLogCreate, Error, FridgeLogCreate>(
    async (fridgePurchase: FridgeLogCreate) => {
      const response = await fetch(`${API_URL}/fridge_log/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fridgePurchase)
      });
      if (!response.ok) {
        throw new Error("Error in adding Temperature Log.");
      }
      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Temperature Log Add Successfully.");
        queryClient.invalidateQueries(["fridge_log"]);
      },
      onError: () => {
        toast.error("Error in creating Temperature Log.");
      }
    }
  );
};

//------updateFridgeLog-------
export const useUpdateFridgeLog = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, UpdateFridgeLog>(
    async (fridgeDataToUpdate: UpdateFridgeLog) => {
      const { id, ...payload } = fridgeDataToUpdate;
      const data = {
        fridge_id: payload?.fridge_id,
        max_temp: payload?.max_temp,
        min_temp: payload?.min_temp,
        notes: payload?.notes,
        room_temp: payload?.room_temp
      };
      const response = await fetch(`${API_URL}/fridge_log/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Error in updating Temperature Log.");
      }
      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Temperature Log record updated successfully.");
        queryClient.invalidateQueries(["fridge_log"]);
      },
      onError: () => {
        toast.error("Error in updating Temperature Log.");
      }
    }
  );
};

//------delete-----
export const useTrashFridgesLog = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { fridge_id?: string }>(
    async variables => {
      if (!variables.fridge_id || !id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/fridge_log/${id ? id : variables.fridge_id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Error in deleting Temperature Log.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fridge_log");
        toast.success("Temperature Log trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

//restore
export const useRestoreFridgeLog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { fridge_id?: string }>(
    async variables => {
      if (!variables?.fridge_id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/fridge_log/${variables.fridge_id}/restore/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: "{}"
        }
      );
      if (!response.ok) {
        throw new Error("Error in restoring Temperature Log.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An error occurred while restoring the Temperature Log.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["fridge_log"]);
        toast.success("Temperature Log Restored Successfully.");
      }
    }
  );
};

//------------ cvs report -----------

export const useReportFridgeLog = (searchParams: URLSearchParams) => {
  return useQuery<string, Error>(
    ["fridge_log", searchParams?.toString()],
    async () => {
      const queryParams: Record<string, string> = {};
      const fridgeNumber = searchParams.get("fridge_number");
      const fromDate = searchParams.get("from_date");
      const toDate = searchParams.get("to_date");

      if (fridgeNumber) {
        queryParams.fridge_number = fridgeNumber;
      }

      if (fromDate && toDate) {
        queryParams.from_date = fromDate;
        queryParams.to_date = toDate;
      }
      const brand = getBrandId();
      const queryString = new URLSearchParams(queryParams).toString();
      const saveStaticPath = `/fridge_log/?brand_id=${brand?.brand_id}&response_type=csv${queryString ? `&${queryString}` : ""}`;

      const response = await fetch(`${API_URL}${saveStaticPath}`, {
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
        throw new Error("Received empty response from the API Temperature Log");
      }

      const csv = new Blob([responseText], { type: "text/csv" });
      const url = URL.createObjectURL(csv);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fridge_log.csv";
      link.click();
      link.remove();

      return "fridge_log";
    },
    {
      enabled: false, // Only fetch on demand
      onError: error => {
        toast.error(`Failed to download report: ${error.message}`);
      }
    }
  );
};
