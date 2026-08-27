import { useQuery } from "react-query";
import { getAccessToken } from "./api";

const baseUrl = import.meta.env.VITE_BASE_URL;

/**
 * Custom hook to fetch a single order.
 * @param {string | null} id - The ID of the order to fetch.
 * @returns {Object} - The order data, loading state, error state, and error message.
 */
const useSingleOrder = (id: string | null) => {
  const token = getAccessToken();

  const endpoint = `${baseUrl}/order/${id}/`;

  const query = useQuery(
    [`single-orders`, id?.toString()],
    async () => {
      // Check for the presence of the token
      if (!token || !id) {
        // Handle token absence or missing id
        throw new Error("No access token found or order ID missing");
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        // Invalidate relevant queries on success if needed
        // queryClient.invalidateQueries('someOtherQueryKey');
      }
    }
  );

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  };
};

export default useSingleOrder;
