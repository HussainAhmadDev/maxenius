import { Subscription } from "Interfaces/Subscriptions";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_URL, getAccessToken } from "./api";

export const useCreateGovBuddySubscription = (
  order_id: string
): UseMutationResult<string, Error, Subscription> => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, Subscription>(
    ["create-subscription"],
    async variables => {
      const response = await fetch(`${API_URL}/subscription/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error creating subscription");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", order_id]);
        toast.success("Successfully added a new subscription");
      },
      onError: () => {
        toast.error("An error occured while adding subscription");
      }
    }
  );
};

interface ExtendSubscription {
  sticky_order_id: string;
  order_id: string;
  extension_date: string;
}

export const useExtendGovBuddySubscription = (
  order_id: string
): UseMutationResult<string, Error, ExtendSubscription> => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, ExtendSubscription>(
    ["create-subscription"],
    async variables => {
      const response = await fetch(`${API_URL}/subscription/extend/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in extending subscription");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", order_id]);
        toast.success("Successfully extended subscription");
      },
      onError: () => {
        toast.error("An error occured while extending subscription");
      }
    }
  );
};

export const useVoidStickySubscription = (
  ordered_product_id: string,
  order_id: string
) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>(
    async () => {
      "delete-order-products";
      const response = await fetch(
        `${API_URL}/subscription/${ordered_product_id}/void/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (response.ok) {
        const delresponse = await fetch(
          `${API_URL}/order/${order_id}/product/${ordered_product_id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              "content-type": "application/json"
            }
          }
        );
        if (!delresponse.ok) {
          throw new Error("Error in deleting line item.");
        }
      }
      if (!response.ok) {
        throw new Error("Error in voiding subscription.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", order_id]);
        toast.success("Voided subscription and deleted the product from order");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

interface UpgradeSubscription {
  subscription: string;
  sticky_order_id: string;
  order_id: string;
  subscriber_count: number;
  is_auto_renew: boolean;
  yearly_cost: number;
  product_id: string;
}

export const useUpgradeSubscription = (
  order_id: string
): UseMutationResult<string, Error, UpgradeSubscription> => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, UpgradeSubscription>(
    ["upgrade-subscription"],
    async variables => {
      const response = await fetch(`${API_URL}/subscription/upgrade/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in upgrading subscription");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", order_id]);
        toast.success("Successfully upgrading subscription");
      },
      onError: () => {
        toast.error("An error occured while upgrading subscription");
      }
    }
  );
};
