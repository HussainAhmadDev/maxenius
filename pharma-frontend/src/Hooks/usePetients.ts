import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBrand } from "Context/BrandContext";
import { useOrg } from "Context/OrgContext";
import { QueryPagination } from "Interfaces/QueryFilters";
import { queryStringify } from "Utils/queryString";
import {
  CompanyData,
  CompanyNotesResponse,
  CompanyResponse,
  CreateCompanyNote,
  Contact,
  CreateCompanyResponse,
  CompanyContactsResponse,
  Address
} from "Interfaces/Company";
import { API_URL, getAccessToken } from "./api";
import { showSuccess, showError } from "Components/Toaster";
import {
  customerParamsContactKeys,
  customerParamsGeneralKeys
} from "Utils/queryParamKeys";
import { UserData } from "Interfaces/User";
// import { Results } from "Components/Customer/CustomerFilters";

interface EditContactProps {
  data: Partial<ContactRequest>;
  company_id?: string;
  contact_id?: string;
}
export const useCompanies = (
  searchParams: URLSearchParams
): UseQueryResult<CompanyResponse, Error> => {
  const { activeBrand } = useBrand();
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "100",
    page: searchParams.get("page") || "1"
  };
  const billingParams: Record<string, string> = {};
  const shippingParams: Record<string, string> = {};
  const generalParams: Record<string, string> = {
    brand_id: (searchParams.get("brand_id") as string) || activeBrand,
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

export const useCompany = (id: string) => {
  return useQuery<CompanyData, Error>(
    ["companies", id],
    async () => {
      const response = await fetch(`${API_URL}/company/${id}/`, {
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
      enabled: !!id
    }
  );
};

type CreateCompany = Partial<Omit<CreateCompanyResponse, "id">>;

export const useUpdateCompany = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation<CreateCompanyResponse, Error, CreateCompany>(
    ["edit-company", companyId],
    async company => {
      const response = await fetch(`${API_URL}/company/${companyId}/`, {
        method: "PUT",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(company)
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
      onError: error => {
        toast.error("We apologize. Couldn't create customer.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["edit-company", companyId]);
        toast.success("Customer has been created.");
      }
    }
  );
};

export const useCompanyNotes = (id = "") => {
  return useQuery<CompanyNotesResponse, Error>(
    ["company-notes", id],
    async () => {
      const response = await fetch(`${API_URL}/company/${id}/note/`, {
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
      enabled: !!id
    }
  );
};

export const useCreateCompanyNote = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation<CompanyNotesResponse, Error, CreateCompanyNote>(
    ["create-company-note", companyId],
    async ({ type, text }) => {
      const response = await fetch(`${API_URL}/company/${companyId}/note/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ type, text })
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
        queryClient.invalidateQueries(["company-notes", companyId]);
        toast.success("New popup note created for customer.");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useEditCompanyNote = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation<CompanyNotesResponse, Error, { text: string; noteId: string }>(
    ["edit-company-notes", companyId],
    async ({ text, noteId }) => {
      const response = await fetch(`${API_URL}/company/${companyId}/note/${noteId}/`, {
        method: "PUT",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ text })
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
      onError: error => {
        toast.error("We apologize. Couldn't save your changes to the edited note.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["company-notes", companyId]);
        toast.success("Changes to the popup note have been saved.");
      }
    }
  );
};

export const useDeleteCompanyNote = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>(
    ["delete-company-notes", companyId],
    async noteId => {
      const response = await fetch(`${API_URL}/company/${companyId}/note/${noteId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok && response.status !== 204) {
        if (response.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }
        throw new Error(response.statusText);
      }
    },
    {
      onError: error => {
        toast.error("There was an error deleting the note. Please try again. ");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["company-notes", companyId]);
        toast.success("Successfully deleted the customer popup note.");
      }
    }
  );
};

export const useCreateCompany = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<CreateCompanyResponse, Error, string>(
    "create-company",
    async brand_id => {
      const response = await fetch(`${API_URL}/company/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ brand_id })
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
      onSuccess: company => {
        queryClient.invalidateQueries("companies");
        navigate(`/customers/${company?.id}`, { state: { companyId: company.id } });
      }
    }
  );
};
export type ContactRequest = Omit<
  Contact,
  "user" | "billing_address" | "shipping_address"
> & {
  user: Omit<UserData, "id">;
  billing_address: Omit<Address, "id">;
  shipping_address: Omit<Address, "id">;
};
export const useCreateContact = () => {
  const { activeOrg: organization_id } = useOrg();
  return useMutation<Contact, Error, Partial<ContactRequest>>(
    ["create-contact"],
    async variables => {
      const response = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          ...variables,
          organization_id
        })
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
        showSuccess("Contact Successfully Created");
      },
      onError: error => {
        showError("Something went wrong");
      }
    }
  );
};

export const useEditContact = () => {
  const { activeOrg: organization_id } = useOrg();
  const queryClient = useQueryClient();
  return useMutation<Contact, Error, EditContactProps>(
    ["edit-contact"],
    async variables => {
      const response = await fetch(`${API_URL}/contact/${variables.contact_id}/`, {
        method: "PUT",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          ...variables.data,
          organization_id
        })
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
        queryClient.invalidateQueries("companies");
        toast.success("Contact Successfully Updated");
      },
      onError: error => {
        showError("Something went wrong");
      }
    }
  );
};

export const useAddContactToCompany = (companyId: string) => {
  const { activeOrg: organization_id } = useOrg();
  const { activeBrand: brand_id } = useBrand();
  return useMutation<Contact, Error, { id: string }>(
    ["add-contact-to-company"],
    async ({ id: contact_id }) => {
      const response = await fetch(`${API_URL}/company/${companyId}/contact/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          brand_id,
          contact_id,
          organization_id
        })
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
      onError: error => {
        showError("Something went wrong while adding contact to customer.");
      }
    }
  );
};

export const useContactById = (id: string) => {
  return useQuery<Contact, Error>(
    ["contacts", id],
    async () => {
      const response = await fetch(`${API_URL}/contact/${id}/`, {
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
      enabled: !!id
    }
  );
};

export const useCompanyContacts = (companyId: string) => {
  return useQuery<CompanyContactsResponse, Error>(
    ["company-contacts", companyId],
    async () => {
      const response = await fetch(`${API_URL}/company/${companyId}/contact/`, {
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
      enabled: !!companyId
    }
  );
};

export const useDeleteCompanyContact = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>(
    ["delete-company-contact", companyId],
    async contactId => {
      const response = await fetch(
        `${API_URL}/company/${companyId}/contact/${contactId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        }
      );
      if (!response.ok && response.status !== 204) {
        throw new Error("Error deleting order note.");
      }
    },
    {
      onError: error => {
        toast.error("There was an error deleting the contact. Please try again. ");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["delete-company-contact", companyId]);
        toast.success("Successfully deleted the contact.");
      }
    }
  );
};

export const useContact = (companyId: string, companyContactId: string) => {
  return useQuery<CompanyContactsResponse, Error>(
    ["companies", companyId, "contacts", companyContactId],
    async () => {
      const response = await fetch(
        `${API_URL}/company/${companyId}/contact/${companyContactId}/`,
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
      enabled: !!companyContactId
    }
  );
};

export const useTrashCompany = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { customerId?: string }>(
    async variables => {
      "delete-company";
      const response = await fetch(
        `${API_URL}/company/${id ? id : variables.customerId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok || response.status !== 204) {
        throw new Error("Error in deleting company.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("companies");
        toast.success("Company trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useRestoreCustomer = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { customerId?: string }>(
    "company-restoration",

    async variables => {
      const response = await fetch(
        `${API_URL}/customer/${id ? id : variables.customerId}/restore/`,
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
        throw new Error("Error in restoring customer.");
      }
      return response.json();
    },
    {
      onError: error => {
        toast.error("An Error occured while restoring customer.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("companies");
        toast.success("Order restored successfully.");
      }
    }
  );
};

//Get all WebSites

export const useWebsites = () => {
  return useQuery<any, Error>(["websites"], async () => {
    // const { activeBrand } = useBrand();
    const activeBrand = localStorage.getItem("brand");
    console.log("activeBrand", activeBrand);
    const response = await fetch(`${API_URL}/website/brand_id${activeBrand}`, {
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
  });
};
