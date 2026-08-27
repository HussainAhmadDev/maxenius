// import { useOrg } from "Context/OrgContext";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "react-query";
import { queryStringify } from "Utils/queryString";
import { API_URL, getAccessToken } from "./api";
import { QueryPagination } from "Interfaces/QueryFilters";
import { toast } from "react-toastify";
import { warehouseParamsGeneralKeys } from "Utils/queryParamKeys";
import { WarehouseData, WarehouseResponse } from "Interfaces/Warehouse";
import { showError, showSuccess } from "Components/Toaster";
import { useBrand } from "Context/BrandContext";

interface UpdateWarehouseParams {
  id: string;
}
export const useWarehouses = (
  searchParams?: URLSearchParams,
  filter?: boolean
): UseQueryResult<WarehouseResponse, Error> => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams?.get("count") || "50",
    page: searchParams?.get("page") || "1"
  };
  if (
    window?.location?.href?.includes("purchase-orders") ||
    window?.location?.href?.includes("stocksadjustment")
  ) {
    delete pagination["count"];
    delete pagination["page"];
  }
  const { activeBrand } = useBrand();

  //   const { activeOrg: organization_id } = useOrg();
  const generalParams: Record<string, string> = {
    brand_id: (searchParams?.get("brand_id") as string) || activeBrand,
    filter: "true",
    // organization_id: (searchParams?.get("organization_id") as string) || organization_id,
    // If on the trash page, send the is_trash query param.
    ...(searchParams?.has("is_trash") ? { is_trash: "True" } : {})
  };

  warehouseParamsGeneralKeys.forEach(key => {
    if (searchParams?.has(key)) {
      generalParams[key] = searchParams?.get(key) as string;
    }
  });

  return useQuery<WarehouseResponse, Error>(
    ["warehouses", searchParams?.toString(), filter],
    async () => {
      if (!activeBrand) {
        throw new Error("Active brand is not available.");
      }
      !filter && delete generalParams["filter"];
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
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      //   enabled: !!organization_id,
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

export const useWarehousesList = () => {
  return useQuery<WarehouseResponse, Error>("warehousesLists", async () => {
    const response = await fetch(`${API_URL}/warehouse/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

export const useWarehouseById = (id?: string): UseQueryResult<WarehouseData, Error> => {
  return useQuery<WarehouseData, Error>(
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

export const useTrashWarehouse = (id?: string) => {
  //comment
  const queryClient = useQueryClient();
  return useMutation<void, Error, { warehouseId?: string }>(
    async variables => {
      "delete-warehouse";
      const response = await fetch(
        `${API_URL}/warehouse/${id ? id : variables.warehouseId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error("Error in deleting warehouse.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("warehouses");
        toast.success("Warehouse trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
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
      onError: error => {
        toast.error("An Error occurred while restoring warehouse.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("warehouses");
        toast.success("warehouse restored successfully.");
      }
    }
  );
};

export const useCreateWarehouse = (): UseMutationResult<
  Partial<WarehouseData>,
  Error,
  Partial<WarehouseData>
> => {
  const queryClient = useQueryClient();
  const { activeBrand } = useBrand();
  return useMutation<Partial<WarehouseData>, Error, Partial<WarehouseData>>(
    "create-warehouse",
    async (variables: Partial<WarehouseData>) => {
      variables["brand_id"] = activeBrand;
      const response = await fetch(`${API_URL}/warehouse/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
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
        showSuccess("Warehouse created successfully");
      },
      onError: () => showError("Error occurred while creating Warehouse.")
    }
  );
};

export const useUpdateWarehouse = ({
  id
}: UpdateWarehouseParams): UseMutationResult<
  Partial<WarehouseData>,
  Error,
  Partial<WarehouseData>
> => {
  // eslint-disable-next-line no-console

  const queryClient = useQueryClient();
  return useMutation<Partial<WarehouseData>, Error, Partial<WarehouseData>>(
    "create-warehouse",
    async (variables: Partial<WarehouseData>) => {
      // eslint-disable-next-line no-console

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
        showSuccess("Warehouse Updated successfully");
      },
      onError: () => showError("Error occurred while Updating Warehouse.")
    }
  );
};
