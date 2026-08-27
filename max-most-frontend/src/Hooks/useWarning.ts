import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_URL, getAccessToken, getBrandId } from "./api";

import { queryStringify } from "../Utils/queryString";
import {
  WarningMessageBody,
  WarningMessageList,
  WarningMessageResponse
} from "../Interfaces/warningMessageType";
export interface ISYNCWarningPayload {
  to_brand: string;
  from_brand: string;
  message: string;
}
/**
 * @interface WarningMessageBody
 * @property {string | number} warningNumber - The unique identifier for the warning message.
 * @property {string} message - The content of the warning message.
 * @property {string} [warning_id] - An optional identifier for the warning message.
 */

/**
 * @interface WarningMessageResponse
 * @property {string} id - The unique identifier for the warning message response.
 * @property {string} created - The creation date of the warning message response.
 * @property {string} updated - The last updated date of the warning message response.
 * @property {string} warningNumber - The unique identifier for the warning message.
 * @property {string} brand_id - The ID of the brand associated with the warning message.
 * @property {string} message - The content of the warning message.
 * @property {boolean} is_trash - A flag indicating if the warning message is marked as trash.
 */

/**
 * @interface WarningMessageList
 * @property {string} id - The unique identifier for the warning message.
 * @property {string} created - The creation date of the warning message.
 * @property {string | null} updated - The last updated date of the warning message (can be null).
 * @property {string} warningNumber - The unique identifier for the warning message.
 * @property {string} brand_id - The ID of the brand associated with the warning message.
 * @property {string} message - The content of the warning message.
 * @property {boolean} is_trash - A flag indicating if the warning message is marked as trash.
 */

export type { WarningMessageBody, WarningMessageResponse, WarningMessageList };

/**
 * Fetches the list of warning messages for the active brand.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of warning messages.
 * It constructs a URL with the active brand ID and sorting parameter set to "-created" to fetch the latest messages first.
 * The request includes the access token for authentication.
 *
 * @returns A react-query hook for fetching warning messages.
 */
export const useWarnings = () => {
  return useQuery<WarningMessageList[], Error>(["warning-messages"], async () => {
    if (!getBrandId().brand_id) {
      throw new Error("Active brand is not available.");
    }
    const response = await fetch(
      `${API_URL}/warning-message/${queryStringify({
        brand_id: getBrandId().brand_id,
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
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

/**
 * Creates a new warning message.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the creation of warning messages.
 * It constructs a POST request to the warning message endpoint with the provided variables and the active brand ID.
 * The request includes the access token for authentication.
 *
 * @returns A react-query hook for creating warning messages.
 */
export const useCreateWarningMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<WarningMessageResponse, Error, WarningMessageBody>(
    "create-warning-message",
    async (variables: WarningMessageBody) => {
      const response = await fetch(`${API_URL}/warning-message/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error?.message);
        throw new Error(error?.message);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Created successfully");
        queryClient.invalidateQueries(["warning-messages"]);
      }
    }
  );
};

/**
 * Updates an existing warning message.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the update of warning messages.
 * It constructs a PUT request to the warning message endpoint with the provided variables, the active brand ID, and the warning ID.
 * The request includes the access token for authentication.
 *
 * @returns A react-query hook for updating warning messages.
 */
export const useUpdateWarningMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<WarningMessageResponse, Error, WarningMessageBody>(
    "update-warning-message",
    async (variables: WarningMessageBody) => {
      const warning_id = variables.warning_id;
      delete variables.warning_id;
      const response = await fetch(`${API_URL}/warning-message/${warning_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error?.message);
        throw new Error(error?.message);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Updated successfully");
        queryClient.invalidateQueries(["warning-messages"]);
      }
    }
  );
};
export const useSyncMessages = () => {
  const queryClient = useQueryClient();

  return useMutation<ISYNCWarningPayload, Error, ISYNCWarningPayload>(
    ["sync-warnings"],
    async variables => {
      const response = await fetch(`${API_URL}/sync_warning_messages/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      const responseData = await response.json();

      if (responseData.error || responseData.status === "error") {
        const errorMessage = responseData.error || "An unknown error occurred.";
        throw new Error(errorMessage);
      }

      return responseData;
    },
    {
      onSuccess: data => {
        const successMessage = data.message || "Warning Synced successfully.";
        queryClient.invalidateQueries("warning-messages");
        toast.success(successMessage);
      },
      onError: (error: Error) => {
        // Display the error message received from the API
        toast.error(error.message);
      }
    }
  );
};
