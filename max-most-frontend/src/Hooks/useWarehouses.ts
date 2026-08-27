import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from "react-query";
import { queryStringify } from "../Utils/queryString";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { Warehouse, WarehouseResponse } from "../Interfaces/warehouseType";
import { QueryPagination } from "../Interfaces/global";
import { warehouseParamsGeneralKeys } from "../Utils/queryParamKeys";
import { toast } from "react-toastify";

/**
 * @interface Warehouse
 * @property {string} id - The unique identifier for the warehouse.
 * @property {string} created - The creation date of the warehouse record.
 * @property {string} updated - The last updated date of the warehouse record.
 * @property {string} name - The name of the warehouse.
 * @property {string} description - The description of the warehouse.
 * @property {string} address_line_1 - The first line of the warehouse address.
 * @property {string} address_line_2 - The second line of the warehouse address (optional).
 * @property {string} city - The city where the warehouse is located.
 * @property {string} region - The region or state where the warehouse is located.
 * @property {string} post_code - The postal code of the warehouse location.
 * @property {string} country - The country where the warehouse is located.
 * @property {"True" | "False"} is_active - A flag indicating if the warehouse is active.
 * @property {"True" | "False"} is_trash - A flag indicating if the warehouse is marked as trash.
 * @property {string} user_id - The ID of the user associated with the warehouse.
 * @property {string} brand_id - The ID of the brand associated with the warehouse.
 */

/**
 * @interface WarehouseResponse
 * @property {Warehouse[]} results - The list of warehouses.
 * @property {number} total - The total number of warehouses.
 * @property {number} page - The current page number in the paginated results.
 * @property {number} pages - The total number of pages in the paginated results.
 * @property {number} count - The number of warehouses in the current page.
 */

/**
 * Fetches the list of warehouses based on provided URLSearchParams and isTrash flag.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of warehouses.
 * It constructs a pagination object from the provided `searchParams` and a set of general parameters including brand_id, is_trash, and sorting.
 * The request includes pagination parameters and sorting by creation date in descending order.
 *
 * @param searchParams - URLSearchParams object containing query parameters.
 * @param isTrash - Boolean indicating if the warehouses are in the trash.
 * @returns A react-query hook for fetching warehouses.
 */
export const useWarehouses = (
  searchParams?: URLSearchParams,
  isTrash: boolean = false
) => {
  return useQuery<WarehouseResponse, Error>(
    ["warehouses" + searchParams, isTrash],
    async () => {
      const pagination: Partial<QueryPagination> = {
        count: searchParams?.get("count") || "50",
        page: searchParams?.get("page") || "1"
      };

      const generalParams: Record<string, string> = {
        ...getBrandId(),
        ...(isTrash ? { is_trash: "True" } : { is_trash: "False" })
      };

      warehouseParamsGeneralKeys.forEach(key => {
        if (searchParams?.has(key)) {
          generalParams[key] = searchParams?.get(key) as string;
        }
      });
      const response = await fetch(
        `${API_URL}/warehouse/${queryStringify({
          ...pagination,
          ...generalParams,
          sorting: "-created"
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

/**
 * Initiates a mutation to create a warehouse.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of creating a warehouse.
 * It sends a POST request to the `/warehouse/` endpoint with the provided `variables` object.
 * The `variables` object is modified to convert `post_code` to a string and includes the brand ID from `getBrandId()` and the access token from `getAccessToken()`.
 * The hook also handles the caching and error handling for the mutation.
 *
 * @returns A mutation function that can be used to initiate the warehouse creation process.
 */
export const useCreateWarehouse = (): UseMutationResult<
  Partial<Warehouse>,
  Error,
  Partial<Warehouse>
> => {
  const queryClient = useQueryClient();

  return useMutation<Partial<Warehouse>, Error, Partial<Warehouse>>(
    "create-warehouse",
    async (variables: Partial<Warehouse>) => {
      variables.post_code = variables.post_code?.toString();

      const response = await fetch(`${API_URL}/warehouse/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      if (!response.ok) {
        throw new Error("Error in Creating warehouse.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("warehouses");

        queryClient.invalidateQueries("warehousesLists");
        toast.success("Warehouse created successfully");
      },
      onError: () => {
        toast.error("Error occurred while creating Warehouse.");
      }
    }
  );
};
/**
 * Initiates a mutation to update a warehouse.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of updating a warehouse.
 * It sends a PUT request to the `/warehouse/${id}/` endpoint with the provided `variables` object.
 * The `variables` object is modified to convert `post_code` to a string and includes the access token from `getAccessToken()`.
 * The hook also handles the caching and error handling for the mutation.
 *
 * @param {Pick<Warehouse, "id">} { id } - The ID of the warehouse to be updated.
 * @returns A mutation function that can be used to initiate the warehouse update process.
 */
export const useUpdateWarehouse = ({
  id
}: Pick<Warehouse, "id">): UseMutationResult<
  Partial<Warehouse>,
  Error,
  Partial<Warehouse>
> => {
  const queryClient = useQueryClient();
  return useMutation<Partial<Warehouse>, Error, Partial<Warehouse>>(
    "update-warehouse", // Corrected mutation key to "update-warehouse" for clarity
    async (variables: Partial<Warehouse>) => {
      variables.post_code = variables.post_code?.toString();
      const response = await fetch(`${API_URL}/warehouse/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in Updating warehouse.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("warehouse");
        queryClient.invalidateQueries("WarehousesLists");
        toast.success("Warehouse Updated successfully");
      },
      onError: () => {
        toast.error("Error occurred while Updating Warehouse.");
      }
    }
  );
};
/**
 * Fetches a warehouse by its ID.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of a warehouse by its ID.
 * It sends a GET request to the `/warehouse/${id}/` endpoint with the provided `id`.
 * The hook includes the access token from `getAccessToken()` in the request headers.
 * The hook also handles the caching and error handling for the query.
 * If `id` is not provided, the query is disabled.
 *
 * @param {string} [id] - The ID of the warehouse to be fetched.
 * @returns A query result that can be used to access the warehouse data.
 */
export const useWarehouseById = (id?: string): UseQueryResult<Warehouse, Error> => {
  return useQuery<Warehouse, Error>(
    ["warehouse", id],
    async () => {
      if (id) {
        const response = await fetch(`${API_URL}/warehouse/${id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }
    },

    {
      enabled: !!id
    }
  );
};
/**
 * Initiates a mutation to delete a warehouse.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of deleting a warehouse.
 * It sends a DELETE request to the `/warehouse/${id}/` endpoint with the provided `id` to delete the warehouse.
 * The hook includes the access token from `getAccessToken()` in the request headers.
 * The hook also handles the caching and error handling for the mutation.
 * If `id` is not provided, the mutation is not executed.
 *
 * @param {string} id - The ID of the warehouse to be deleted.
 * @returns A mutation function that can be used to initiate the warehouse deletion process.
 */
export const useDeleteWarehouse = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>(
    ["delete-warehouse", id],
    async () => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/warehouse/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok && response.status !== 204) {
        throw new Error("Error deleting warehouse.");
      }
    },
    {
      onError: () => {
        toast.error("There was an error deleting the warehouse. Please try again.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["delete-warehouse", id]);
        toast.success("Successfully deleted the warehouse.");
      }
    }
  );
};
/**
 * Initiates a mutation to restore a warehouse.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of restoring a warehouse.
 * It sends a POST request to the `/warehouse/${id}/restore/` endpoint with the provided `id` to restore the warehouse.
 * If `id` is not provided, it uses the `warehouseId` from the mutation variables.
 * The request includes the access token from `getAccessToken()` in the headers.
 * The hook also handles the caching and error handling for the mutation.
 * If `id` is not provided, the mutation is not executed.
 *
 * @param id - The ID of the warehouse to restore.
 * @returns A mutation function that can be used to initiate the warehouse restoration process.
 */
export const useRestoreWarehouse = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { warehouseId?: string }>(
    "warehouse-restoration",
    async variables => {
      const response = await fetch(
        `${API_URL}/warehouse/${id ? id : variables.warehouseId}/restore/`,
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
        throw new Error("Error in restoring warehouse.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occurred while restoring warehouse.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("warehouses");
        toast.success("warehouse restored successfully.");
      }
    }
  );
};
