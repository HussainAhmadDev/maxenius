import { UseQueryResult, useMutation, useQuery } from "react-query";

import { API_URL, getAccessToken, getBrandId } from "./api";
import { QueryPagination } from "../Interfaces/global";

import { queryStringify } from "../Utils/queryString";
import { CompanyResponse } from "../Interfaces/companyType";

import {
  customerParamsContactKeys,
  customerParamsGeneralKeys
} from "../Utils/queryParamKeys";
import { CustomerReport } from "@interfaces/reportsTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**
 * @interface  Address
 * @property {string} id - The unique identifier for the address.
 * @property {string} first_name - The first name associated with the address.
 * @property {string} [middle_name] - The middle name associated with the address.
 * @property {string} last_name - The last name associated with the address.
 * @property {string} [description] - A description of the address.
 * @property {string} [label] - A label for the address.
 * @property {string} street1 - The first line of the address.
 * @property {string} [street2] - The second line of the address.
 * @property {string} [street3] - The third line of the address.
 * @property {string} [street4] - The fourth line of the address.
 * @property {string} city - The city of the address.
 * @property {string} state - The state of the address.
 * @property {string} zip - The ZIP code of the address.
 * @property {string} country - The country of the address.
 * @property {boolean} [is_default] - Whether this address is the default.
 * @property {boolean} [is_shipping] - Whether this address is for shipping.
 * @property {boolean} [is_billing] - Whether this address is for billing.
 * @property {boolean} [is_residental] - Whether this address is residential.
 * @property {string} [phone] - The phone number associated with the address.
 * @property {string} [phone2] - An additional phone number.
 * @property {string} [email] - The email address associated with the address.
 * @property {string} [email2] - An additional email address.
 * @property {string} [email3] - A third email address.
 * @property {string} [email4] - A fourth email address.
 * @property {string} [type] - The type of address.
 * @property {string} [fax] - The fax number associated with the address.
 * @property {string} [company] - The company associated with the address.
 */

/**
 * @interface  Contact
 * @property {string} id - The unique identifier for the contact.
 * @property {string} [email] - The email address of the contact.
 * @property {boolean} is_billing - Whether this contact is for billing.
 * @property {boolean} is_shipping - Whether this contact is for shipping.
 * @property {string} [title] - The title of the contact.
 * @property {string} [website] - The website associated with the contact.
 * @property {string} [first_name] - The first name of the contact.
 * @property {string} [middle_name] - The middle name of the contact.
 * @property {string} [last_name] - The last name of the contact.
 * @property {string} [organization_id] - The organization ID associated with the contact.
 * @property {boolean} [authorize_to_purchase] - Whether the contact is authorized to purchase.
 * @property {string} [billing_address_id] - The billing address ID.
 * @property {Address} billing_address - The billing address.
 * @property {string} [billing_phone] - The billing phone number.
 * @property {Address} shipping_address - The shipping address.
 * @property {string} [shipping_address_id] - The shipping address ID.
 * @property {boolean} [is_active] - Whether the contact is active.
 * @property {boolean} [do_not_call] - Whether the contact should not be called.
 * @property {boolean} [do_not_email] - Whether the contact should not be emailed.
 * @property {boolean} [do_not_mail] - Whether the contact should not be mailed.
 * @property {boolean} [do_not_text] - Whether the contact should not be texted.
 * @property {boolean} [is_department] - Whether the contact is a department.
 * @property {string} [office_phone] - The office phone number.
 * @property {Note[]} [private_note] - Private notes associated with the contact.
 * @property {string} [created] - The creation date of the contact.
 * @property {string} [updated] - The last update date of the contact.
 * @property {UserData} user - The user associated with the contact.
 */

/**
 * @interface  ContactFormValidation
 * @property {string} first_name - The first name for validation.
 * @property {string} last_name - The last name for validation.
 * @property {string} email - The email for validation.
 * @property {boolean} is_billing - Whether the contact is for billing.
 * @property {boolean} is_shipping - Whether the contact is for shipping.
 * @property {string} title - The title for validation.
 * @property {string} website - The website for validation.
 * @property {string} companyName - The company name for validation.
 * @property {string} fax - The fax number for validation.
 * @property {string} label - The label for validation.
 * @property {string} office_phone - The office phone number for validation.
 * @property {string} billing_phone - The billing phone number for validation.
 * @property {boolean} [authorize_to_purchase] - Whether the contact is authorized to purchase.
 * @property {string} address_first_name - The first name for the address validation.
 * @property {string} address_last_name - The last name for the address validation.
 * @property {string} address_fax - The fax number for the address validation.
 * @property {string} billing_address_1 - The first line of the billing address.
 * @property {string} billing_address_2 - The second line of the billing address.
 * @property {string} billing_city - The city of the billing address.
 * @property {string} billing_zip - The ZIP code of the billing address.
 * @property {string} billing_state - The state of the billing address.
 * @property {boolean} billing_is_billing - Whether the address is for billing.
 * @property {boolean} billing_is_default - Whether the billing address is default.
 * @property {string} billing_country - The country of the billing address.
 * @property {string} [billing_phone1] - An additional billing phone number.
 * @property {string} [billing_phone2] - Another additional billing phone number.
 * @property {string} [billing_email1] - An additional billing email address.
 * @property {string} [billing_email2] - Another additional billing email address.
 * @property {string} [billing_email3] - A third additional billing email address.
 * @property {string} [billing_email4] - A fourth additional billing email address.
 * @property {string[]} [billing_emails] - An array of billing email addresses.
 * @property {string[]} [billing_phones] - An array of billing phone numbers.
 * @property {boolean} [billing_residential] - Whether the billing address is residential.
 * @property {string} [billing_company] - The company associated with the billing address.
 * @property {string} [shipping_company] - The company associated with the shipping address.
 * @property {boolean} [shipping_residential] - Whether the shipping address is residential.
 * @property {string} shipping_address_1 - The first line of the shipping address.
 * @property {string} shipping_address_2 - The second line of the shipping address.
 * @property {string} shipping_city - The city of the shipping address.
 * @property {string} shipping_zip - The ZIP code of the shipping address.
 * @property {string} shipping_state - The state of the shipping address.
 * @property {string} shipping_country - The country of the shipping address.
 * @property {string} [shipping_phone1] - An additional shipping phone number.
 * @property {string} [shipping_phone2] - Another additional shipping phone number.
 * @property {string} [shipping_email1] - An additional shipping email address.
 * @property {string} [shipping_email2] - Another additional shipping email address.
 * @property {string} [shipping_email3] - A third additional shipping email address.
 * @property {string} [shipping_email4] - A fourth additional shipping email address.
 * @property {string[]} [shipping_emails] - An array of shipping email addresses.
 * @property {string[]} [shipping_phones] - An array of shipping phone numbers.
 * @property {boolean} shipping_is_shipping - Whether the address is for shipping.
 * @property {boolean} shipping_is_default - Whether the shipping address is default.
 * @property {boolean} [do_not_call] - Whether the contact should not be called.
 * @property {boolean} [do_not_email] - Whether the contact should not be emailed.
 * @property {boolean} [do_not_mail] - Whether the contact should not be mailed.
 * @property {boolean} [do_not_text] - Whether the contact should not be texted.
 */

/**
 * @interface  Note
 * @property {string} id - The unique identifier for the note.
 * @property {string} text - The content of the note.
 * @property {string} type - The type of note (e.g., public or private).
 * @property {string} created - The creation date of the note.
 * @property {string} updated - The last update date of the note.
 */

/**
 * @interface  CompanyData
 * @property {unknown} billing_address - The billing address (type unknown).
 * @property {string} id - The unique identifier for the company.
 * @property {string} name - The name of the company.
 * @property {Address} address - The address of the company.
 * @property {string} address_id - The ID of the address.
 * @property {string} number - The company number.
 * @property {string} brand_id - The brand ID associated with the company.
 * @property {string} billing_contact_id - The billing contact ID.
 * @property {string} shipping_contact_id - The shipping contact ID.
 * @property {Contact} billing_contact - The billing contact.
 * @property {Contact} shipping_contact - The shipping contact.
 * @property {string} external_id - The external ID for the company.
 * @property {Note[]} notes - An array of notes associated with the company.
 * @property {Note[]} private_note - An array of private notes.
 * @property {string} tax_exempt_id - The tax exempt ID.
 * @property {boolean} is_individual - Whether the company is an individual.
 * @property {boolean} is_tax_exempt - Whether the company is tax exempt.
 * @property {boolean} is_active - Whether the company is active.
 * @property {string} created - The creation date of the company.
 * @property {string} updated - The last update date of the company.
 * @property {boolean} is_trash - Whether the company is marked as trash.
 */
/**
 * @interface  CompanyResponse
 * @property {CompanyData[]} results - The array of company data.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface  CompanyContact
 * @property {string} id - The unique identifier for the company contact.
 * @property {string} contact_id - The contact ID associated with the company contact.
 * @property {string} brand_id - The brand ID associated with the company contact.
 * @property {string} organization_id - The organization ID associated with the company contact.
 * @property {Contact} contact - The contact details.
 */

/**
 * @interface  CompanyContactsResponse
 * @property {Array<{id: string, contact_id: string, brand_id: string, contact: Contact, organization_id: string}>} results - The array of company contacts.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface  CreateCompanyData
 * @property {string} name - The name of the company.
 * @property {string} type - The type of the company.
 * @property {string} number - The company number.
 */

/**
 * @interface  CreateCompanyNote
 * @property {"public" | "private"} type - The type of note.
 * @property {string} text - The content of the note.
 * @property {string} source - The source of the note.
 * @property {string} note_username - The username associated with the note.
 */

/**
 * @interface  EditCompanyNote
 * @property {string} companyId - The ID of the company.
 * @property {string} noteId - The ID of the note.
 */

/**
 * @interface CreateCompanyResponse
 * @property {string} brand_id - The brand ID associated with the company.
 * @property {string} name - The name of the company.
 * @property {boolean} is_tax_exempt - Whether the company is tax exempt.
 * @property {string} id - The unique identifier for the company.
 * @property {unknown[]} notes - An array of notes associated with the company.
 * @property {boolean} is_individual - Whether the company is an individual.
 * @property {string} address_id - The ID of the address.
 * @property {string} shipping_contact_id - The shipping contact ID.
 * @property {string} billing_contact_id - The billing contact ID.
 * @property {string} tax_exempt_id - The tax exempt ID.
 * @property {boolean} is_active - Whether the company is active.
 * @property {string} external_id - The external ID for the company.
 */

/**
 * @interface  PatientResponse
 * @property {PatientData[]} results - The array of patient data.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface  CompanyNotesResponse
 * @property {Note[]} results - The array of notes.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface  ProductTransaction
 * @property {string} running_total - The running total of the transaction.
 * @property {string} ordered - The ordered quantity.
 * @property {string} name - The name of the product.
 * @property {string} number - The product number.
 * @property {string} batch_number - The batch number of the product.
 * @property {Date | string} expiry_date - The expiry date of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {string} type_t - The type of transaction.
 * @property {boolean} is_adjustment - Whether the transaction is an adjustment.
 */
/**
 * @interface  ProductTransactionResponse
 * @property {ProductTransaction[]} results - The array of product transactions.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface  Website
 * @property {string} [authorization_key] - The authorization key.
 * @property {string | null} [consumer_key] - The consumer key.
 * @property {string | null} [consumer_secret] - The consumer secret.
 * @property {string} id - The unique identifier for the website.
 * @property {string} site_url - The URL of the website.
 * @property {string} title - The title of the website.
 * @property {string} [value] - An optional value associated with the website.
 * @property {string} [label] - An optional label for the website.
 * @property {boolean | null} [is_trash] - Whether the website is marked as trash.
 */

/**
 * @interface  WebsiteResponse
 * @property {Website[]} results - The array of websites.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * Hook to fetch companies based on search parameters.
 *
 * @param {URLSearchParams} searchParams - The search parameters to filter the companies.
 * @returns {UseQueryResult<CompanyResponse, Error>} The query result containing company data or error.
 */
export const useCompanies = (
  searchParams: URLSearchParams
): UseQueryResult<CompanyResponse, Error> => {
  const activeBrand = getBrandId();
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "100",
    page: searchParams.get("page") || "1"
  };
  const billingParams: Record<string, string> = {};
  const shippingParams: Record<string, string> = {};
  const generalParams: Record<string, string> = {
    brand_id: (searchParams.get("brand_id") as string) || activeBrand?.brand_id,
    // If on the trash page, send the is_trash query param.
    ...(searchParams.has("is_trash") ? { is_trash: "1" } : {})
  };

  customerParamsContactKeys.forEach(key => {
    if (searchParams.has("search_by_bill_to") && searchParams.has(key)) {
      billingParams[`billing_contact__${key}`] = searchParams.get(key) as string;
    }
    if (searchParams.has("search_by_ship_to") && searchParams.has(key)) {
      shippingParams[`shipping_contact__${key}`] = searchParams.get(key) as string;
    }
  });

  customerParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<CompanyResponse, Error>(
    ["companies", searchParams.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/company/${queryStringify({
          ...pagination,
          ...generalParams,
          ...billingParams,
          ...shippingParams,
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
      const json = await response.json();
      localStorage.setItem("rand_company_id", json.results[0].id);
      return json;
    }
  );
};

export const useCompaniesList = (customer_id: string) => {
  return useQuery<CompanyResponse, Error>(
    ["line-items-listing", customer_id],
    async () => {
      if (!customer_id) {
        return [];
      }

      const response = await fetch(`${API_URL}/company/${customer_id}/contact/`, {
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

export const useUpdateCustomer = (customerID: string | null) => {
  const navigate = useNavigate();
  return useMutation<
    CustomerReport,
    Error,
    {
      name: string;
      is_individual: boolean;
      is_tax_exempt: boolean;
      tax_exempt_id: string;
    }
  >(
    async variables => {
      const response = await fetch(`${API_URL}/company/${customerID}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(variables)
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Note has been updated successfully");
        navigate("/create-order");
      },
      onError: error => {
        toast.error(`An error occurred: ${error?.message}`);
      }
    }
  );
};
