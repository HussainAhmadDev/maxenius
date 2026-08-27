import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "react-query";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { Vendor, VendorResponse } from "../Interfaces/vendorsType";
import { QueryPagination } from "../Interfaces/global";
import { vendorsParamsGeneralKeys } from "../Utils/queryParamKeys";
import { queryStringify } from "../Utils/queryString";
import { useUser } from "../Contexts/userContext";
import { toast } from "react-toastify";

/**
 * Represents a vendor.
 * @interface Vendor
 * @property {string} id - Unique identifier of the vendor.
 * @property {string} name - Name of the vendor.
 * @property {string} contact_name - Contact name of the vendor.
 * @property {string} address - Vendor address.
 * @property {string} alternative_address - Alternative vendor address.
 * @property {string} city - Vendor city.
 * @property {string} region - Vendor region.
 * @property {string} post_code - Vendor postal code.
 * @property {string} country - Vendor country.
 * @property {string} contact_phone - Vendor contact phone number.
 * @property {string} secondary_phone - Vendor secondary phone number.
 * @property {string} fax - Vendor fax number.
 * @property {string} email - Vendor email address.
 * @property {string} webpage - Vendor website.
 * @property {string} currency - Vendor currency.
 * @property {boolean} is_trash - Indicates if the vendor is trashed.
 * @property {Date} [created] - Creation date of the vendor.
 * @property {Date} [updated] - Update date of the vendor.
 * @property {boolean} [is_active] - Indicates if the vendor is active.
 * @property {string} [brand] - Associated brand.
 * @property {string} [user] - Associated user.
 */

/**
 * Represents form values for a vendor.
 * @interface VendorFormValues
 * @property {string} name - Name of the vendor.
 * @property {string} contact_name - Contact name of the vendor.
 * @property {string} address - Vendor address.
 * @property {string} alternative_address - Alternative vendor address.
 * @property {string} city - Vendor city.
 * @property {string} region - Vendor region.
 * @property {string} post_code - Vendor postal code.
 * @property {string} country - Vendor country.
 * @property {string} contact_phone - Vendor contact phone number.
 * @property {string} secondary_phone - Vendor secondary phone number.
 * @property {string} fax - Vendor fax number.
 * @property {string} email - Vendor email address.
 * @property {string} webpage - Vendor website.
 * @property {string} currency - Vendor currency.
 * @property {boolean} is_active - Indicates if the vendor is active.
 */

/**
 * Represents a paginated response containing an array of vendors.
 * @interface VendorResponse
 * @property {Array<Vendor>} results - Array of vendor objects.
 * @property {number} [page] - Current page number.
 * @property {number} [count] - Number of items per page.
 * @property {number} [total] - Total number of items.
 * @property {number} [pages] - Total number of pages.
 */

/**
 * Interface representing the data structure for generating barcodes.
 * @interface Vendor
 */

/**
 *
 */

/**
 * Fetches vendors based on provided parameters.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of vendors.
 * It constructs a set of general parameters including brand_id, filter, and is_trash based on the provided arguments.
 * The request includes sorting by creation date in descending order.
 *
 * @param {URLSearchParams} searchParams - URLSearchParams object containing query parameters.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `Name` (string): Name is a string with key "name".
 *   - `City Town` (string): City Town  is a string with key "cityOrTown" .
 *   - `Post code` (string): Post code  is a string with key "postCode" .
 *   - `Country` (string): Country  is a string with key "country" .
 *   - `Email` (string): Email  is a string with key "email" .
 *
 * @param {boolean} filter - Boolean indicating if filtering is required.
 * @param {boolean} [isTrash=false] - Boolean indicating if the vendors are in the trash.
 * @returns {UseQueryResult<VendorResponse, Error>} The result of the query.
 * @see VendorResponse
 * @see Vendor
 */
export const useVendors = (
  searchParams?: URLSearchParams,
  filter?: boolean,
  isTrash: boolean = false
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

  const generalParams: Record<string, string> = {
    ...getBrandId(),
    filter: "true",
    // organization_id: (searchParams?.get("organization_id") as string) || organization_id,
    // If on the trash page, send the is_trash query param.
    ...(isTrash ? { is_trash: "true" } : { is_trash: "false" })
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
    ["vendors", searchParams?.toString(), JSON.stringify(generalParams)],
    async () => {
      if (!getBrandId().brand_id) {
        return;
        // throw new Error("Active brand is not available.");
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

export const useVendorById = (id?: string): UseQueryResult<Vendor, Error> => {
  /**
   * Fetches a vendor by its ID.
   *
   * @param {string | undefined} id - The ID of the vendor to fetch.
   * @returns {UseQueryResult<Vendor, Error>} The result of the query.
   * @see Vendor
   */
  return useQuery<Vendor, Error>(
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

/**
 * Initiates a mutation to trash a vendor.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of trashing a vendor.
 * It sends a DELETE request to the `/vendor/${id}/` endpoint with the provided `id` to trash the vendor.
 * If `id` is not provided, it uses the `vendorId` from the mutation variables.
 *
 * @param id - The ID of the vendor to trash.
 * @returns A mutation function that can be used to initiate the vendor trashing process.
 */
export const useTrashVendor = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { vendorId?: string }>(
    async variables => {
      const response = await fetch(`${API_URL}/vendor/${id ? id : variables.vendorId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });
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
/**
 * Initiates a mutation to restore a vendor.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of restoring a vendor.
 * It sends a POST request to the `/vendor/${id}/restore/` endpoint with the provided `id` to restore the vendor.
 * If `id` is not provided, it uses the `vendorId` from the mutation variables.
 *
 * @param id - The ID of the vendor to restore.
 * @returns A mutation function that can be used to initiate the vendor restoration process.
 */
export const useRestoreVendor = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { vendorId?: string }>(
    "vendor-restoration",
    async variables => {
      const response = await fetch(
        `${API_URL}/vendor/${id ? id : variables.vendorId}/restore/`,
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
        toast.success("Vendor restored successfully.");
      }
    }
  );
};
/**
 * Initiates a mutation to create a vendor.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of creating a vendor.
 * It sends a POST request to the `/vendor/` endpoint with the provided `variables` object.
 *
 * @returns A mutation function that can be used to initiate the vendor creation process.
 */
export const useCreateVendor = (): UseMutationResult<
  Partial<Vendor>,
  Error,
  Partial<Vendor>
> => {
  const user = useUser();
  const queryClient = useQueryClient();
  return useMutation<Partial<Vendor>, Error, Partial<Vendor>>(
    "create-vendor",
    async (variables: Partial<Vendor>) => {
      variables.post_code = variables.post_code?.toString();
      const response = await fetch(`${API_URL}/vendor/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId(), user_id: user.user?.id })
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
        toast.success("Vendor created successfully");
      },
      onError: () => {
        toast.error("Error occurred while creating vendor.");
      }
    }
  );
};
/**
 * Initiates a mutation to update a vendor.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of updating a vendor.
 * It sends a PUT request to the `/vendor/update/${id}/` endpoint with the provided `variables` object.
 * The `variables` object is modified to convert `post_code` to a string and remove the `updated` field if present.
 * The request includes the brand ID from `getBrandId()` and the access token from `getAccessToken()`.
 *
 * @param id - The ID of the vendor to update.
 * @returns A mutation function that can be used to initiate the vendor update process.
 */
export const useUpdateVendor = (
  id: string | undefined
): UseMutationResult<Vendor, Error, Partial<Vendor>> => {
  const queryClient = useQueryClient();

  return useMutation<Vendor, Error, Partial<Vendor>>(
    ["updatevendor/", id],
    async (variables: Partial<Vendor>) => {
      variables.post_code = variables.post_code?.toString();

      if (variables.updated) delete variables.updated;
      const response = await fetch(`${API_URL}/vendor/update/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      if (!response.ok) {
        throw new Error("Error in updating Vendor");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vendors");
        toast.success("Vendor has been edited Successfully");
      },
      onError: () => {
        toast.error("Error in updating vendor");
      }
    }
  );
};
