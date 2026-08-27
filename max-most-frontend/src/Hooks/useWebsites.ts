import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient
} from "react-query";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { QueryPagination } from "../Interfaces/global";
import { websitesParamsGeneralKeys } from "../Utils/queryParamKeys";

import { queryStringify } from "../Utils/queryString";
import { toast } from "react-toastify";
import {
  WebsiteCreateBody,
  WebsiteCreateResponse,
  WebsiteResponse
} from "../Interfaces/webstiteType";

export const AUTH_AUDEINCE = import.meta.env.VITE_AUTH_AUDEINCE;

/**
 * Custom hook to fetch websites based on search parameters and whether to include trashed websites.
 *
 * @param {URLSearchParams} searchParams - The search parameters to filter the websites.
 * @param {boolean} [isTrash=false] - Flag to indicate if trashed websites should be included in the result.
 * @returns {UseQueryResult<WebsiteResponse, Error>} The result of the query.
 */
export const useWebsites = (
  searchParams: URLSearchParams,
  isTrash: boolean = false
): UseQueryResult<WebsiteResponse, Error> => {
  const generalParams: Record<string, string> = {
    ...getBrandId(),
    ...(isTrash ? { is_trash: "True" } : {})
  };
  const websiteParams: Record<string, string> = {};
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };
  websitesParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      websiteParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<WebsiteResponse, Error>(
    ["websites-listing", searchParams?.toString(), isTrash],
    async () => {
      const response = await fetch(
        `${API_URL}/website/${queryStringify({
          ...generalParams,
          ...pagination,
          ...websiteParams,
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
      enabled: !!getAccessToken(),
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};

/**
 * Custom hook to fetch a website by its ID.
 *
 * This hook sends a GET request to the server to fetch a website by its ID. It uses the `useQuery` hook from `react-query` to handle the query and caching.
 *
 * @param {string | undefined} websiteID - The ID of the website to fetch.
 * @returns {UseQueryResult<WebsiteCreateResponse, Error>} The result of the query.
 */
export const useWebsiteByID = (
  websiteID: string | undefined
): UseQueryResult<WebsiteCreateResponse, Error> => {
  return useQuery<WebsiteCreateResponse, Error>(
    ["get-website-id", websiteID],
    async () => {
      if (!websiteID) {
        return;
      }
      const response = await fetch(`${API_URL}/website/${websiteID}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
};

/**
 * Custom hook to create a new website.
 *
 * This hook sends a POST request to the server to create a new website. It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @returns {UseMutationResult<WebsiteCreateResponse, Error, WebsiteCreateBody>} The result of the mutation.
 */
export const useCreateWebsite = (): UseMutationResult<
  WebsiteCreateResponse,
  Error,
  WebsiteCreateBody
> => {
  const queryClient = useQueryClient();
  const activeBrand = getBrandId();

  return useMutation<WebsiteCreateResponse, Error, WebsiteCreateBody>(
    "create-website",
    async (variables: WebsiteCreateBody) => {
      variables.brand_id = activeBrand.brand_id;
      const response = await fetch(`${API_URL}/website/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });

      if (response.status === 400) {
        throw new Error("Unable to create website");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites-listing");
        toast.success("website created successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Custom hook to update a website.
 *
 * This hook sends a PUT request to the server to update a website. It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @param {string | undefined} websiteID - The ID of the website to update.
 * @returns {UseMutationResult<WebsiteCreateResponse, Error, WebsiteCreateBody>} The result of the mutation.
 */
export const useUpdateWebsite = (
  websiteID: string | undefined
): UseMutationResult<WebsiteCreateResponse, Error, WebsiteCreateBody> => {
  const queryClient = useQueryClient();
  const activeBrand = getBrandId();
  return useMutation<WebsiteCreateResponse, Error, WebsiteCreateBody>(
    "update-website",
    async (variables: Partial<WebsiteCreateBody>) => {
      variables.brand_id = activeBrand.brand_id;
      if (!websiteID) {
        return;
      }
      const response = await fetch(`${API_URL}/website/${websiteID}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in Updating Website");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites-listing");
        toast.success("Website update successfully");
      },
      onError: () => {
        toast.error("Error occured while creating Website");
      }
    }
  );
};

/**
 * Custom hook to trash a website.
 *
 * This hook sends a DELETE request to the server to trash a website. It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @returns {UseMutationResult<void, Error, { id: string }>} The result of the mutation.
 */
export const useTrashWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>(
    async ({ id }) => {
      const response = await fetch(`${API_URL}/website/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error in deleting Website.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites-listing");
        toast.success("Website trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Initiates a mutation to restore a website.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of restoring a website.
 * It sends a POST request to the `/website/${websiteID}/restore/` endpoint with the provided `websiteID` to restore the website.
 * The request includes the access token for authentication.
 *
 * @returns A mutation function that can be used to initiate the website restoration process.
 */
export const useRestoreWebsite = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { websiteID?: string }>(
    async ({ websiteID }: { websiteID?: string }) => {
      const response = await fetch(`${API_URL}/website/${websiteID}/restore/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Error in restoring website.");
      }
      return response.json();
    },
    {
      onError: (error: Error) => {
        toast.error(`An error occurred while restoring website: ${error.message}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries("websites-listing");
        toast.success("Website restored successfully.");
      }
    }
  );
};
