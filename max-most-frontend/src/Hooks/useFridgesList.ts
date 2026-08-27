import { API_URL, getAccessToken } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryStringify } from "../Utils/queryString";
import { FridgePurchase, FridgeResponse, UpdateFridge } from "@interfaces/Fridges";
import { QueryPagination } from "@interfaces/global";
import { toast } from "react-toastify";
import { fridgeParamsGeneralKeys } from "../Utils/queryParamKeys";
import { OrderData } from "../Interfaces/Orders";

export const useFridgesList = (
  brand_id: string,
  searchParams?: URLSearchParams,
  isTrash: boolean = false
) => {
  return useQuery<FridgeResponse, Error>(
    ["fridges", searchParams?.toString(), brand_id],
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
        `${API_URL}/fridge/${queryStringify({
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
export const useTrashFridges = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { fridge_id?: string }>(
    async variables => {
      if (!variables.fridge_id || !id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/fridge/${id ? id : variables.fridge_id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Error in deleting fridge.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fridges");
        toast.success("Fridge trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useRestoreFridge = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { fridge_id?: string }>(
    async variables => {
      if (!variables?.fridge_id) {
        return;
      }
      const response = await fetch(`${API_URL}/fridge/${variables.fridge_id}/restore/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) {
        throw new Error("Error in restoring fridge.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An error occurred while restoring the fridge.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["fridges"]);
        toast.success("Fridge Restored Successfully.");
      }
    }
  );
};

/**
 * Custom Hook to create the fridge purchase order.
 *
 * This hook uses the React Query to create a purchase order for fridge.
 * The hook makes a POST request to '/fridge/' endpoint to create order.
 * The `onSuccess` and `onError` callbacks provide feedback through toast notifications to inform the user
 * of the result of the mutation.
 *
 * @returns {Mutation} A mutation object from React Query that can be used to trigger the mutation, track its status,
 * and handle its result or errors.
 *
 * @example
 * const { mutateAsync: createFridgePurchase, isLoading :isCreating} = useCreateFridge();
 *
 *   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 *      e.preventDefault();
 *   try {
 *     await createFridgePurchase(fridgeData);
 *   } catch (error) {
 *      console.error("Error processing fridge data:", error);
 *   }
 * };
 *
 * @see FridgePurchase - Type representing the structure of the fridge data.
 */

export const useCreateFridge = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, FridgePurchase>(
    async (fridgePurchase: FridgePurchase) => {
      const response = await fetch(`${API_URL}/fridge/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fridgePurchase)
      });
      if (!response.ok) {
        throw new Error("Error in add fridge list.");
      }
      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Fridges list add successfully.");
        queryClient.invalidateQueries(["fridges"]);
      },
      onError: () => {
        toast.error("Error in add fridge list.");
      }
    }
  );
};

/**
 * Custom Hook to update the individual Fridge Record
 *
 * This hook uses the  React Query to udpate record of fridge.
 * The hook makes a PUT request to '/fridge/${id}' endpoint to udpate fridgeRecord.
 * The `onSuccess` and `onError` callbacks provide feedback through toast notifications to inform the user
 * of the result of the mutation.
 *
 * @returns {Mutation} A mutation object from React Query that can be used to trigger the mutation, track its status,
 * and handle its result or errors.
 *
 * @example
 *
 * const { mutateAsync: updateFridgePurchase, isLoading: isUpdating } = useUpdateFridge();
 * const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 *      e.preventDefault();
 *   try {
 *     await updateFridgePurchase(fridgeDatatoUpdate);
 *   } catch (error) {
 *      console.error("Error processing fridge data:", error);
 *   }
 * };
 *
 * @see updateFridge - Type representing the structure of the fridge record to update.
 *
 */

export const useUpdateFridge = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, UpdateFridge>(
    async (fridgeDataToUpdate: UpdateFridge) => {
      const { id, ...payload } = fridgeDataToUpdate;
      const response = await fetch(`${API_URL}/fridge/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Error in updating fridge list.");
      }
      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Fridge list record updated successfully.");
        queryClient.invalidateQueries(["fridges"]);
      },
      onError: () => {
        toast.error("Error in updating fridge list.");
      }
    }
  );
};
