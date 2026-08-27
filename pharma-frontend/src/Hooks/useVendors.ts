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
import { vendorsParamsGeneralKeys } from "Utils/queryParamKeys";
import { VendorData, VendorResponse } from "Interfaces/Vendors";
import { showError, showSuccess } from "Components/Toaster";
import { useBrand } from "Context/BrandContext";

export const useVendors = (
  searchParams?: URLSearchParams,
  filter?: boolean
): UseQueryResult<VendorResponse, Error> => {
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

  vendorsParamsGeneralKeys.forEach(key => {
    if (searchParams?.has(key)) {
      if (key === "search_by_active_vendor") {
        generalParams[key] = searchParams?.get(key) === "1" ? "True" : "False";
      } else {
        generalParams[key] = searchParams?.get(key) as string;
      }
    }
  });

  return useQuery<VendorResponse, Error>(
    ["vendors", searchParams?.toString(), filter],
    async () => {
      if (!activeBrand) {
        throw new Error("Active brand is not available.");
      }
      !filter && delete generalParams["filter"];
      const response = await fetch(
        `${API_URL}/vendor/${queryStringify({
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

export const useVendorsList = () => {
  return useQuery<VendorResponse, Error>("vendorsLists", async () => {
    const response = await fetch(`${API_URL}/vendor/`, {
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

export const useVendorById = (id?: string): UseQueryResult<VendorData, Error> => {
  return useQuery<VendorData, Error>(
    ["vendor", id],
    async () => {
      const response = await fetch(`${API_URL}/vendor/${id}/`, {
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
      enabled: !!id
    }
  );
};

export const useTrashVendor = (id?: string) => {
  // comment
  const queryClient = useQueryClient();
  const { activeBrand } = useBrand();
  return useMutation<void, Error, { vendorId?: string }>(
    async variables => {
      "delete-vendor";

      if (!activeBrand) {
        throw new Error("Active brand is not available.");
      }
      const response = await fetch(
        `${API_URL}/vendor/${id ? id : variables.vendorId}/?brand_id=${activeBrand}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error("Error in deleting vendor.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vendors");
        toast.success("Vendor trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
export const useRestoreVendor = (id?: string) => {
  const queryClient = useQueryClient();
  const { activeBrand } = useBrand();
  return useMutation<void, Error, { vendorId?: string }>(
    "vendor-restoration",

    async variables => {
      if (!activeBrand) {
        throw new Error("Active brand is not available.");
      }
      const response = await fetch(
        `${API_URL}/vendor/${
          id ? id : variables.vendorId
        }/restore/?brand_id=${activeBrand}`,
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
        throw new Error("Error in restoring vendor.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occurred while restoring vendor.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("vendors");
        toast.success("vendor restored successfully.");
      }
    }
  );
};

export const useCreateVendor = (): UseMutationResult<
  Partial<VendorData>,
  Error,
  Partial<VendorData>
> => {
  const queryClient = useQueryClient();
  const { activeBrand } = useBrand();
  return useMutation<Partial<VendorData>, Error, Partial<VendorData>>(
    "create-vendor",
    async (variables: Partial<VendorData>) => {
      if (!activeBrand) {
        throw new Error("Active brand is not available.");
      }
      console.log("activeBrand", activeBrand);

      variables["brand_id"] = activeBrand;
      console.log("variables", variables);
      const response = await fetch(`${API_URL}/vendor/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in Creating Vendor.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vendors");
        queryClient.invalidateQueries("vendorsLists");
        showSuccess("Vendor created successfully");
      },
      onError: () => showError("Error occurred while creating vendor.")
    }
  );
};

export const useEditVendor = (
  id: string | undefined
): UseMutationResult<VendorData, Error, Partial<VendorData>> => {
  const queryClient = useQueryClient();
  const { activeBrand } = useBrand();
  return useMutation<VendorData, Error, Partial<VendorData>>(
    ["editvendor/", id],
    async (variables: Partial<VendorData>) => {
      if (!activeBrand) {
        throw new Error("Active brand is not available.");
      }
      delete variables.id;
      delete variables.created;
      variables["brand_id"] = activeBrand;
      if (variables.updated) delete variables.updated;
      const response = await fetch(`${API_URL}/vendor/update/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });
      if (!response.ok) {
        throw new Error("Error in Creating Product");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vendors");
        showSuccess("Product has been edit Successfully");
      },
      onError: () => showError("Error in editing product")
    }
  );
};
