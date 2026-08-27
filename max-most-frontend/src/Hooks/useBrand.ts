import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryStringify } from "../Utils/queryString";
import {
  BrandData,
  BrandList,
  BrandResponse,
  BrandSettings,
  PageAllowedToBrand
} from "../Interfaces/brandType";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { toast } from "react-toastify";
import { QueryPagination } from "../Interfaces/global";

/**
 * Custom hook to fetch user brands.
 *
 * @returns {UseMutationResult<BrandList[], Error, { userId: string }>} The mutation result for fetching user brands.
 */
export const useUserBrand = () => {
  return useMutation<BrandList[], Error, { userId: string }>(
    "user-brands",
    async variables => {
      const { userId } = variables;
      if (!userId) {
        return;
      }
      const response = await fetch(
        `${API_URL}/user-brands/${queryStringify({ user_id: userId })}`,
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
 * Custom hook to fetch pages settings for a brand.
 *
 * @param {string | undefined} activeBrand - The ID of the active brand.
 * @returns {UseQueryResult<PageAllowedToBrand[], Error>} The query result for fetching pages settings.
 */
export const usePagesSettings = (activeBrand: string | undefined) => {
  return useQuery<PageAllowedToBrand[], Error>(
    ["pages-settings", activeBrand],
    async () => {
      if (!activeBrand) {
        return;
      }
      const response = await fetch(`${API_URL}/get-brand-settings/${activeBrand}`, {
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
  );
};

/**
 * Custom hook to update pages settings for a brand.
 *
 * @param {string | undefined} activeBrand - The ID of the active brand.
 * @returns {UseMutationResult<void, Error, BrandSettings>} The mutation result for updating pages settings.
 */
export const usePagesSettingsUpdate = (activeBrand: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BrandSettings>(
    "pages-settings-update",
    async variables => {
      if (!activeBrand) {
        return;
      }
      const response = await fetch(`${API_URL}/brand-settings/${activeBrand}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("An error occurred while updating settings.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An error occurred while updating settings.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("pages-settings");
        toast.success("Settings updated successfully.");
        window.location.reload();
      }
    }
  );
};

/**
 * Custom hook to fetch vendor settings for a brand.
 *
 * @param {string | undefined} activeBrand - The ID of the active brand.
 * @returns {UseQueryResult<PageAllowedToBrand[], Error>} The query result for fetching vendor settings.
 */
export const useVendorsSettings = (activeBrand: string | undefined) => {
  return useQuery<PageAllowedToBrand[], Error>(
    ["vendor-settings", activeBrand],
    async () => {
      if (!activeBrand) {
        return;
      }
      const response = await fetch(`${API_URL}/brand-vendor/${activeBrand}`, {
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
  );
};

/**
 * Custom hook to update vendor settings for a brand.
 *
 * @returns {UseMutationResult<void, Error, BrandSettings>} The mutation result for updating vendor settings.
 */
export const useVendorsSettingsUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, BrandSettings>(
    "vendors-setting-update",
    async variables => {
      const response = await fetch(`${API_URL}/brand-vendor/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      if (!response.ok) {
        throw new Error("An error occurred while updating settings.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An error occurred while updating settings.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("vendor-settings");
        toast.success("Settings updated successfully.");
        window.location.reload();
      }
    }
  );
};

/**
 * Custom hook to fetch a list of brands.
 *
 * @param {URLSearchParams} [searchParams] - The search parameters for querying brands.
 * @returns {UseQueryResult<BrandResponse, Error>} The query result for fetching brands.
 */

export const useBrands = (searchParams?: URLSearchParams, isTrash: boolean = false) => {
  return useQuery<BrandResponse, Error>(
    ["brands" + searchParams?.toString()],
    async () => {
      const pagination: Partial<QueryPagination> = {
        count: searchParams?.get("count") || "50",
        page: searchParams?.get("page") || "1"
      };
      const generalParams: Record<string, string> = {
        ...(isTrash ? { is_trash: "True" } : { is_trash: "False" })
      };

      const response = await fetch(
        `${API_URL}/brand${queryStringify({ ...pagination, ...generalParams })}`,
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
    },
    {
      onError() {
        toast.error("Error while fetching brands.");
      }
    }
  );
};

/**
 * Custom hook to fetch a single brand by ID.
 *
 * @param {string} [id] - The ID of the brand.
 * @returns {UseQueryResult<BrandData, Error>} The query result for fetching a single brand.
 */
export const useBrand = (id?: string) => {
  return useQuery<BrandData, Error>(
    ["brand" + id?.toString()],
    async () => {
      if (!id) {
        return;
      }
      console.log("GET METHOD CALLED userBrands");
      const response = await fetch(`${API_URL}/brand/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onError() {
        toast.error("Error while fetching brand.");
      }
    }
  );
};

/**
 * Custom hook to create a new brand.
 *
 * @returns {UseMutationResult<void, Error, Partial<BrandData>>} The mutation result for creating a brand.
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<BrandData>>(
    "create-brand",
    async variables => {
      const response = await fetch(`${API_URL}/brand/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ ...variables })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onError() {
        toast.error("Error while creating brand.");
      },
      onSuccess() {
        toast.success("Brand added successfully.");
        queryClient.invalidateQueries(["brands"]);
      }
    }
  );
};

/**
 * Custom hook to update a brand.
 *
 * @returns {UseMutationResult<void, Error, Partial<BrandData>>} The mutation result for updating a brand.
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<BrandData>>(
    "update-brand",
    async variables => {
      if (!variables.id) {
        return;
      }
      const { id, ...rest } = variables;
      const response = await fetch(`${API_URL}/brand/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...rest })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onError() {
        toast.error("Error while updating brand.");
      },
      onSuccess() {
        toast.success("Brand updated successfully.");
        queryClient.invalidateQueries(["brands"]);
      }
    }
  );
};

//restore
export const useRestoreBrands = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { brand_id?: string }>(
    async variables => {
      if (!variables?.brand_id) {
        return;
      }
      const response = await fetch(`${API_URL}/brand/${variables.brand_id}/restore/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Error in restoring brand.");
      }
    },
    {
      onError: () => {
        toast.error("An error occurred while restoring the brand.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["brands"]);
        toast.success("Brand restored successfully.");
      }
    }
  );
};
