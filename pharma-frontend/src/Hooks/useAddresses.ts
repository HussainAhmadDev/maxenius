import { showError, showSuccess } from "Components/Toaster";
import { Address } from "Interfaces/Company";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { API_URL, getAccessToken } from "./api";

export const useEditAddress = (
  id: string | undefined,
  orderId: string
): UseMutationResult<Partial<Address>, Error, Partial<Address>> => {
  const queryClient = useQueryClient();

  return useMutation<Partial<Address>, Error, Partial<Address>>(
    ["addresses", id],
    async (variables: Partial<Address>) => {
      delete variables.id;
      const response = await fetch(`${API_URL}/address/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in updating address");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
        showSuccess("Address has been edited Successfully");
      },
      onError: () => showError("Error in editing address")
    }
  );
};

export const useCreateBillingShippingAddress = (
  orderId: string,
  type: "billing" | "shipping"
): UseMutationResult<Partial<Address>, Error, Partial<Address>> => {
  const queryClient = useQueryClient();

  return useMutation<Partial<Address>, Error, Partial<Address>>(
    ["edit-billing-addresses"],
    async (variables: Partial<Address>) => {
      delete variables.id;
      const response = await fetch(`${API_URL}/order/${orderId}/${type}/address/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in updating address");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
        showSuccess("Address has been edited Successfully");
      },
      onError: () => showError("Error in editing address")
    }
  );
};
