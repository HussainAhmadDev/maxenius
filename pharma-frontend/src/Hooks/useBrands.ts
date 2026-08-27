import { useOrg } from "Context/OrgContext";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";
import { queryStringify } from "Utils/queryString";
import { BrandsData, BrandsResponse } from "../Interfaces/Brands";
import { API_URL, getAccessToken } from "./api";
import { QueryPagination } from "Interfaces/QueryFilters";
import { toast } from "react-toastify";
import { brandParamsGeneralKeys } from "Utils/queryParamKeys";
import { useAuth } from "Context/AuthContext";
import { useBrand } from "Context/BrandContext";

export const useBrands = (
  searchParams?: URLSearchParams
): UseQueryResult<BrandsResponse, Error> => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams?.get("count") || "100",
    page: searchParams?.get("page") || "1"
  };
  const { activeOrg: organization_id } = useOrg();
  const generalParams: Record<string, string> = {
    organization_id: (searchParams?.get("organization_id") as string) || organization_id,
    // If on the trash page, send the is_trash query param.
    ...(searchParams?.has("is_trash") ? { is_trash: "1" } : {})
  };

  brandParamsGeneralKeys.forEach(key => {
    if (searchParams?.has(key)) {
      generalParams[key] = searchParams?.get(key) as string;
    }
  });

  return useQuery<BrandsResponse, Error>(
    ["brands", searchParams?.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/brand/${queryStringify({
          ...pagination,
          ...generalParams,
          sorting: "name"
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
      enabled: !!organization_id,
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

export const useBrandsByOrganization = (
  orgId?: string,
  queryFilters?: Partial<QueryPagination>
) => {
  const qParams = queryStringify({ organization_id: orgId || "", ...queryFilters });
  return useQuery<BrandsResponse, Error>(
    ["brands", { orgId }],
    async () => {
      const response = await fetch(`${API_URL}/brand/${qParams}`, {
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
      enabled: !!orgId,
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

export const useBrandsList = () => {
  return useQuery<BrandsResponse, Error>("brandsLists", async () => {
    const response = await fetch(`${API_URL}/brand/`, {
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

export const useTrashBrand = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { brandId?: string }>(
    async variables => {
      "delete-brand";
      const response = await fetch(`${API_URL}/brand/${id ? id : variables.brandId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });
      if (!response.ok || response.status !== 204) {
        throw new Error("Error in deleting brand.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("brands");
        toast.success("Brand trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useRestoreBrand = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { brandId?: string }>(
    "brand-restoration",

    async variables => {
      const response = await fetch(
        `${API_URL}/brand/${id ? id : variables.brandId}/restore/`,
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
        throw new Error("Error in restoring brand.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while restoring brand.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("brands");
        toast.success("Brands restored successfully.");
      }
    }
  );
};

export const useBrandByUserId = () => {
  const {
    user: { id: userId }
  } = useAuth();

  const qParams = queryStringify({ user_id: userId || "" });

  return useQuery<BrandsData[], Error>(
    ["brands", { userId }],
    async () => {
      const response = await fetch(`${API_URL}/user-brands/${qParams}`, {
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
      enabled: !!userId,
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

export interface PageAllowedToBrand {
  vendor_id: string;
  is_active: boolean;
  id: number;
  key: string;
  value: string;
}

//pages Settings
export const usePagesSetting = (activeBrand: string | undefined) => {
  return useQuery<PageAllowedToBrand[], Error>(
    ["pagesSetting", activeBrand],
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

type BrandSettings = {
  [key: string]: string | boolean;
};

export const usePagesSettingUpdate = () => {
  const { activeBrand } = useBrand();
  const queryClient = useQueryClient();

  return useMutation<void, Error, BrandSettings>(
    "pages-setting-update",

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
        throw new Error("An Error occured while Updating Settings");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while Updating Settings.");
      },
      onSuccess: () => {
        window.location.reload();
        queryClient.invalidateQueries("pagesSetting");

        toast.success("Settings Updated  successfully.");
      }
    }
  );
};

//Vendors Settings

export const useVendorsSetting = (activeBrand: string | undefined) => {
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

export const useVendorsSettingUpdate = () => {
  const { activeBrand } = useBrand();
  const queryClient = useQueryClient();

  return useMutation<void, Error, BrandSettings>(
    "vendors-setting-update",

    async variables => {
      if (!activeBrand) {
        return;
      }
      variables.brand_id = activeBrand;
      const response = await fetch(`${API_URL}/brand-vendor/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("An Error occured while Updating Settings");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while Updating Settings.");
      },
      onSuccess: () => {
        window.location.reload();
        queryClient.invalidateQueries("vendor-settings");

        toast.success("Settings Updated  successfully.");
      }
    }
  );
};
