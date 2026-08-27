import { useQuery } from "react-query";
import { OrganizationResponse } from "../Interfaces/organizationType";
import { API_URL, getAccessToken } from "./api";
import { toast } from "react-toastify";
import { queryStringify } from "../Utils/queryString";
import { QueryPagination } from "../Interfaces/global";

/**
 * @interface OrganizationAddress
 * @property {string | null} description - The description of the address.
 * @property {string} zip - The ZIP code of the address.
 * @property {string} street1 - The first line of the street address.
 * @property {string} first_name - The first name of the contact person.
 * @property {string | null} email2 - The second email address.
 * @property {string | null} phone2 - The second phone number.
 * @property {string | null} company - The company associated with the address.
 * @property {boolean} is_shipping - Indicates if this is a shipping address.
 * @property {boolean} is_default - Indicates if this is the default address.
 * @property {string} country - The country of the address.
 * @property {boolean} is_billing - Indicates if this is a billing address.
 * @property {boolean} is_residental - Indicates if this is a residential address.
 * @property {string | null} middle_name - The middle name of the contact person.
 * @property {string | null} email - The primary email address.
 * @property {string} city - The city of the address.
 * @property {string | null} phone - The primary phone number.
 * @property {string | null} email4 - The fourth email address.
 * @property {string | null} street2 - The second line of the street address.
 * @property {string | null} label - A label for the address.
 * @property {string | null} fax - The fax number.
 * @property {string} type - The type of address (e.g., office, home).
 * @property {string | null} street3 - The third line of the street address.
 * @property {string | null} state - The state or province of the address.
 * @property {string | null} email3 - The third email address.
 * @property {string} id - The unique identifier for the address.
 * @property {string} last_name - The last name of the contact person.
 * @property {string | null} street4 - The fourth line of the street address.
 */

/**
 * @interface OrganizationData
 * @property {string} id - The unique identifier for the organization.
 * @property {string} created - The creation date of the organization.
 * @property {string | null} updated - The last update date of the organization.
 * @property {OrganizationAddress} address - The address details of the organization.
 * @property {string} address_id - The unique identifier for the address.
 * @property {string} name - The name of the organization.
 * @property {string} description - The description of the organization.
 * @property {string | null} url - The URL of the organization's website.
 * @property {string | null} logo - The URL of the organization's logo.
 * @property {string} email - The primary email address of the organization.
 * @property {string | null} domain - The domain name associated with the organization.
 * @property {string | null} office_phone - The office phone number.
 * @property {string | null} fax_phone - The fax phone number.
 * @property {string | null} ein - The Employer Identification Number (EIN).
 * @property {boolean} is_default - Indicates if this is the default organization.
 * @property {boolean} is_active - Indicates if the organization is active.
 * @property {string | null} twitter - The Twitter handle of the organization.
 * @property {string | null} facebook - The Facebook page of the organization.
 * @property {string | null} linkedin - The LinkedIn profile of the organization.
 * @property {string | null} instagram - The Instagram handle of the organization.
 * @property {string | null} pinterest - The Pinterest page of the organization.
 * @property {string | null} tiktok - The TikTok handle of the organization.
 */

/**
 * @interface OrganizationResponse
 * @property {OrganizationData[]} results - The array of organizations.
 * @property {number} total - The total number of organizations.
 * @property {number} page - The current page number.
 * @property {number} pages - The total number of pages.
 * @property {number} count - The number of organizations in the current page.
 */

/**
 * Hook to fetch a list of organizations based on search parameters and pagination.
 *
 * @param {URLSearchParams} [searchParams] - The search parameters for querying organizations.
 * @returns {UseQueryResult<OrganizationResponse, Error>} The query result containing the organization response.
 */
export const useOrganizations = (searchParams?: URLSearchParams) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams?.get("count") || "50",
    page: searchParams?.get("page") || "1"
  };

  return useQuery<OrganizationResponse, Error>(
    ["organizations" + searchParams?.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/organization/${queryStringify(pagination)}`,
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
        toast.error("Error while fetching organizations");
      }
    }
  );
};
