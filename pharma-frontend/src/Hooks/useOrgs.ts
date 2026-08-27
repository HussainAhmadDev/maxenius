import { OrganizationQueryFilters } from "Interfaces/QueryFilters";
import { useQuery, UseQueryResult, useQueryClient, useMutation } from "react-query";
import { ListOrganizationResult, Organization } from "Interfaces/Org";
import { API_URL, getAccessToken } from "Hooks/api";
import { queryStringify } from "Utils/queryString";
import { toast } from "react-toastify";
import { Address } from "Interfaces/Company";

export const useOrganizations = (
  queryFilters?: OrganizationQueryFilters
): UseQueryResult<ListOrganizationResult, Error> => {
  return useQuery<ListOrganizationResult, Error>(
    ["organizations", queryFilters],
    async () => {
      const response = await fetch(
        `${API_URL}/organization/${queryStringify({
          ...queryFilters,
          sorting: "-created"
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        }
      );
      if (response.ok) {
        return response.json();
      }
      throw new Error("msg from the api");
    },
    {
      // Organizations don't change often. We'll manually invalidate the cache if new a organization
      // is created
      enabled: !!getAccessToken(),
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

export const useOrgById = (id?: string): UseQueryResult<Organization, Error> => {
  return useQuery<Organization, Error>(
    ["organizations", id],
    async () => {
      const response = await fetch(`${API_URL}/organization/${id}/`, {
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

export const useTrashOrganization = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { organizationId?: string }>(
    async variables => {
      "delete-organization";
      const response = await fetch(
        `${API_URL}/organization/${id ? id : variables.organizationId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok || response.status !== 204) {
        throw new Error("Error in deleting organization.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("organization");
        toast.success("Organization trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useRestoreOrganization = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { organizationId?: string }>(
    "organization-restoration",

    async variables => {
      const response = await fetch(
        `${API_URL}/organization/${id ? id : variables.organizationId}/restore/`,
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
        throw new Error("Error in restoring organization.");
      }
      return response.json();
    },
    {
      onError: error => {
        toast.error("An Error occured while restoring organization.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("organizations");
        toast.success("Organization restored successfully.");
      }
    }
  );
};

type OrganizationRequest = Omit<Organization, "address"> & {
  address: Omit<Address, "id">;
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation<Organization, Error, Partial<OrganizationRequest>>(
    "create-organization",
    async variables => {
      const response = await fetch(`${API_URL}/organization/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating organization.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("organizations");
        toast.success("Contact Successfully Updated");
      },
      onError: () => {
        toast.error("Error in creating organization.");
      }
    }
  );
};
