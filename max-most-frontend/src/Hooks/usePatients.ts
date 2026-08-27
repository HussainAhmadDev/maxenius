import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { Website, WebsiteResponse } from "../Interfaces/Company";
import { QueryPagination } from "../Interfaces/global";
import { productParamsGeneralKeys } from "../Utils/queryParamKeys";
import { queryStringify } from "../Utils/queryString";
import { HistoryResponse } from "../Interfaces/Orders";
import { PatientResponse } from "../Interfaces/patientTypes";

/**
 * @interface Patient
 * @property {string} id - The unique identifier for the patient.
 * @property {string} name - The name of the patient.
 * @property {string} date_of_birth - The date of birth of the patient.
 * @property {string} address - The address of the patient.
 * @property {string} prescriber - The name of the prescriber.
 * @property {string} prescriber_email - The email address of the prescriber.
 * @property {string} prescriber_phone - The phone number of the prescriber.
 */

/**
 * @interface PatientResponse
 * @property {number | undefined} [page] - The current page number (optional).
 * @property {number} count - The number of patients in the current page.
 * @property {number} pages - The total number of pages.
 * @property {string} total - The total number of patients.
 * @property {Patient[] | undefined} [results] - The array of patients (optional).
 */

/**
 * Custom hook to fetch patients with optional search and filter parameters.
 *
 * @param {URLSearchParams} [searchParams] - Optional search parameters to filter and paginate the products.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `Patient name` (string): Patient Name is a string getting through params.
 *   - `Website` (website_id): website_id is a  string getting through params.
 *
 *   - Other parameters can be used to filter products based on specific attributes.
 *
 * @param {boolean} [isTrash] - Flag indicating whether to fetch trashed products (`true`) or active products (`false`).
 *
 * @returns {UseQueryResult<PatientResponse, Error>} The query result containing the fetched products and metadata.
 *
 * @see {@link PatientResponse} - Type representing the structure of the response data.
 * @see {@link Patient} - Type representing individual product details.
 */

export const usePatients = (
  siteUrl: string | undefined | null,
  authorization_key: string | undefined,
  searchParams: URLSearchParams
): UseQueryResult<PatientResponse, Error> => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  const generalParams: Record<string, string> = {
    ...(searchParams.has("is_trash") ? { is_trash: "1" } : {})
  };

  productParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<PatientResponse, Error>(
    ["patients", siteUrl, searchParams.toString(), authorization_key],

    async () => {
      if (!authorization_key || !siteUrl || !searchParams.get("website_id")) {
        return;
      }
      const response = await fetch(
        `${siteUrl}/wp-json/inventory/v1/patient_list/${queryStringify({
          ...pagination,
          ...generalParams,
          sorting: "-created"
        })}`,
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*", // Set the appropriate allowed origins
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            Authorization: authorization_key ? authorization_key : ""
          }
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      const json = await response.json();

      return json;
    }
  );
};

export const usePatient = (
  siteUrl: string | undefined | null,
  authorization_key: string | undefined,
  id?: string
): UseQueryResult<PatientResponse, Error> => {
  return useQuery<PatientResponse, Error>(
    ["patients", siteUrl, authorization_key, id],
    async () => {
      if (!authorization_key || !siteUrl || !id) {
        return;
      }
      const response = await fetch(
        `${siteUrl}/wp-json/inventory/v1/patient_list/${queryStringify({
          id: id,
          sorting: "-created"
        })}`,
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*", // Set the appropriate allowed origins
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            Authorization: authorization_key ? authorization_key : ""
          }
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      const json = await response.json();

      return json;
    }
  );
};
/**
 * Custom hook to fetch a single patient based on their ID.
 *
 * @param {string} siteUrl - The URL of the site.
 * @param {string} authorization_key - The authorization key.
 * @param {string} id - The ID of the patient.
 * @returns {UseQueryResult<PatientResponse, Error>} The query result containing the patient response.
 * @see {@link PatientResponse}
 */

export const usePatientHistory = (
  siteUrl: string | undefined | null,
  authorization_key: string,
  searchParams: URLSearchParams
): UseQueryResult<HistoryResponse, Error> => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "100",
    page: searchParams.get("page") || "1"
  };

  // test

  const generalParams: Record<string, string> = {
    ...(searchParams.has("is_trash") ? { is_trash: "1" } : {})
  };

  productParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });
  return useQuery<HistoryResponse, Error>(
    ["pthistory", siteUrl, searchParams.toString()],
    async () => {
      const response = await fetch(
        `${siteUrl}/${queryStringify({
          ...pagination,
          ...generalParams,
          sorting: "-created"
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization_key
          }
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
      const json = await response.json();

      return json;
    }
  );
};

/**
 * Custom hook to fetch patient history based on search parameters.
 * @param {URLSearchParams} [searchParams] - Optional search parameters to filter and paginate the Patient History.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `Product name` (string): product_name is a string getting through params.
 *   - `Order Number` (string): order_number is a  string getting through params.
 *
 *   - Other parameters can be used to filter products based on specific attributes.
 *
 * @param {boolean} [isTrash] - Flag indicating whether to fetch trashed products (`true`) or
 * @param {string} [siteUrl] - The URL of the site.
 * @param {string} [authorization_key] - The authorization key.
 * @returns {UseQueryResult<HistoryResponse, Error>} The query result containing the history response.
 * @see {@link HistoryResponse}
 */

export const useLazyPatientHistory = () => {
  return async (
    siteUrl: string,
    authorization_key: string,
    id: string,
    searchParams: URLSearchParams
  ) => {
    /**
     * Function to lazily fetch patient history based on search parameters.
     *
     * @returns {Function} A function that takes siteUrl, authorization_key, id, and searchParams as arguments and returns a promise of the history response.
     */
    const pagination: Partial<QueryPagination> = {
      count: searchParams.get("count") || "50",
      page: searchParams.get("page") || "1"
    };
    const generalParams: Record<string, string> = {
      ...(searchParams.has("is_trash") ? { is_trash: "1" } : {})
    };
    productParamsGeneralKeys.forEach(key => {
      if (searchParams.has(key)) {
        generalParams[key] = searchParams.get(key) as string;
      }
    });

    try {
      const response = await fetch(
        `${siteUrl}/wp-json/inventory/v1/patient_purchased_products${queryStringify({
          id: id,
          ...pagination,
          ...generalParams,
          ...getBrandId()
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization_key
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      throw console.log("error", error);
    }
  };
};

/**
 * Custom hook to fetch websites associated with a brand.
 *
 * @returns {UseQueryResult<WebsiteResponse, Error>} The query result containing the website response.
 */

export const useWebsites = () => {
  const queryClient = useQueryClient();

  const activeBrand = getBrandId();

  return useQuery<WebsiteResponse, Error>(
    ["websites"],
    async () => {
      if (!activeBrand?.brand_id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/brand_website/${queryStringify({
          brand_id: activeBrand?.brand_id,
          sorting: "title"
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
      onSuccess: () => {
        queryClient.invalidateQueries(["patients"]);
      }
    }
  );
};

/**
 * Custom hook to fetch a website by its ID.
 *
 * @param {string} id - The ID of the website.
 * @returns {UseQueryResult<Website, Error>} The query result containing the website response.
 */
export const useWebsiteByID = (id: string) => {
  const queryClient = useQueryClient();

  const brand = getBrandId();
  return useQuery<Website, Error>(
    ["websiteByID", id],
    async () => {
      if (!API_URL || !id || !brand?.brand_id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/website/${queryStringify({
          brand_id: brand?.brand_id,
          id
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
      onSuccess: () => {
        queryClient.invalidateQueries(["patients"]);
      }
    }
  );
};

/**
 * Custom hook to fetch a single website by its ID.
 *
 * @param {string} id - The ID of the website.
 * @returns {UseQueryResult<Website, Error>} The query result containing the website response.
 */
export const useSingleWebsite = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery<Website, Error>(
    ["singleWebsite"],
    async () => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/website/${id}/`, {
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
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patients"]);
      }
    }
  );
};

/**
 * Custom hook to fetch a patient by their ID.
 *
 * @param {string} siteUrl - The URL of the site.
 * @param {string} authorization_key - The authorization key.
 * @returns {UseQueryResult<PatientResponse, Error>} The query result containing the patient response.
 */

export const usePatientById = (
  siteUrl: string | undefined | null,
  authorization_key: string | undefined
): UseQueryResult<PatientResponse, Error> => {
  return useQuery<PatientResponse, Error>(["patientById", siteUrl], async () => {
    if (!siteUrl || !authorization_key) {
      return;
    }
    const response = await fetch(`${siteUrl ? siteUrl : null}`, {
      method: "GET",
      headers: {
        Authorization: authorization_key ? authorization_key : ""
      }
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("TOKEN_EXPIRED");
      }
      throw new Error(response.statusText);
    }
    const json = await response.json();

    return json;
  });
};
