import { useMutation, useQuery, useQueryClient } from "react-query";
import { OrderData } from "Interfaces/Order";
import { AddOrderPaymentBody } from "Interfaces/Payment";
import { API_URL, getAccessToken } from "./api";

export const useAddOrderPayment = (orderId = "") => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, AddOrderPaymentBody & { callback?: () => void }>(
    ["add-order-payment", orderId],
    async ({ callback, ...rest }: AddOrderPaymentBody & { callback?: () => void }) => {
      const response = await fetch(`${API_URL}/order/${orderId}/payment/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(rest)
      });
      callback?.();
      if (!response.ok) {
        throw new Error("Error in creating order payment.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", orderId]);
      }
    }
  );
};

export const usePaymentStatus = (order_payment_id: string, payment_type: string) => {
  return useQuery<{ status?: string }, Error>(
    ["payment_status", order_payment_id],
    async () => {
      if (payment_type === "credit_card") {
        const response = await fetch(`${API_URL}/payment_status/${order_payment_id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        if (response.ok) {
          return response.json();
        }
        throw new Error("could not get payment status");
      }
    },
    {
      enabled: !!order_payment_id
    }
  );
};
