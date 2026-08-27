import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { API_URL, getAccessToken } from "./api";
import { CompanyContactsResponse, Contact, UserData } from "@interfaces/Company";
import { Address } from "@interfaces/companyType";
import { useNavigate } from "react-router-dom";

export type ContactRequest = Omit<
  Contact,
  "user" | "billing_address" | "shipping_address"
> & {
  user: Omit<UserData, "id">;
  billing_address: Omit<Address, "id">;
  shipping_address: Omit<Address, "id">;
};
export const useCreateContact = () => {
  // const { activeOrg: organization_id } = useOrg();

  return useMutation<Contact, Error, Partial<ContactRequest>>(
    ["create-contact"],
    async variables => {
      delete variables.id;
      const response = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(variables)
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
        toast.success("Contact Successfully Created");
      }
    }
  );
};

export const useSaveContact = (customerID: string | null) => {
  const navigate = useNavigate();

  return useMutation<
    Contact,
    Error,
    {
      brand_id: string;
      contact_id: string;
      organization_id: string;
    }
  >(
    ["create-contact"],
    async variables => {
      if (!customerID) {
        return;
      }

      const response = await fetch(`${API_URL}/company/${customerID}/contact/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(variables)
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
        navigate(`/edit-customer/${customerID}`);
      },
      onError: () => {
        toast.error("Something went wrong");
      }
    }
  );
};

export const useContactList = (customer_id: string) => {
  return useQuery<CompanyContactsResponse, Error>(
    ["contact-list", customer_id],
    async () => {
      if (!customer_id) {
        return [];
      }

      const response = await fetch(`${API_URL}/company/${customer_id}/contact`, {
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
export const useTrashContactByID = (customerID?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { contactID?: string }>(
    async variables => {
      if (!variables.contactID) {
        return;
      }
      const response = await fetch(
        `${API_URL}/company/${customerID}/contact/${variables?.contactID}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error("Error in deleting order.");
      }
    },
    {
      onSuccess: () => {
        toast.success("Order trashed successfully");
        queryClient.invalidateQueries("contact-list");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
