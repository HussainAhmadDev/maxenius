import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient
} from "react-query";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { QueryPagination } from "../Interfaces/global";
import { userParmasKey } from "../Utils/queryParamKeys";
import {
  LogoutData,
  LogoutResponse,
  User,
  UserResponse,
  UserWithBrands
} from "../Interfaces/usersType";
import { queryStringify } from "../Utils/queryString";
import { toast } from "react-toastify";

export const AUTH_AUDEINCE = import.meta.env.VITE_AUTH_AUDEINCE;
/**
 * @interface User
 * @property {string} id - The unique identifier for the user.
 * @property {string} created - The creation date of the user record.
 * @property {string} updated - The last updated date of the user record.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} middle_name - The middle name of the user.
 * @property {string} password - The password of the user.
 * @property {boolean} is_staff - A flag indicating if the user is a staff member.
 * @property {boolean} is_superuser - A flag indicating if the user has superuser status.
 * @property {boolean} is_manager - A flag indicating if the user is a manager.
 * @property {boolean} is_associate - A flag indicating if the user is an associate.
 * @property {string} email - The email address of the user.
 * @property {string} mobile_phone - The mobile phone number of the user.
 * @property {string} office_phone - The office phone number of the user.
 * @property {string} last_login - The last login date and time of the user.
 * @property {string} date_joined - The date when the user joined.
 * @property {string} is_active - A flag indicating if the user is active.
 * @property {string} username - The username of the user.
 * @property {string} token - The authentication token of the user.
 * @property {string} token_expiry - The expiration date of the user's token.
 * @property {string} type - The type of user (e.g., "admin", "regular").
 * @property {string} profilePic - The URL of the user's profile picture.
 * @property {string} auth0_user_id - The Auth0 user ID.
 * @property {string} auth0_blocked_status - The Auth0 blocked status.
 * @property {string} is_trash - A flag indicating if the user is marked as trash.
 */

/**
 * @interface Brand
 * @property {string} id - The unique identifier for the brand.
 * @property {string} name - The name of the brand.
 */

/**
 * @interface UserWithBrands
 * @extends User
 * @property {Brand[]} brands - The list of brands associated with the user.
 */

/**
 * @interface UserData
 * @property {string} id - The unique identifier for the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} [middle_name] - The middle name of the user.
 * @property {string} [password] - The password of the user.
 * @property {string} email - The email address of the user.
 * @property {string} [mobile_phone] - The mobile phone number of the user.
 * @property {string} [office_phone] - The office phone number of the user.
 * @property {string} [date_joined] - The date when the user joined.
 * @property {string} [last_login] - The last login date and time of the user.
 * @property {string} [external_id] - An external ID associated with the user.
 * @property {("organization" | "brand" | "company" | "contact" | "user")} [type] - The type of user.
 * @property {string} [created] - The creation date of the user record.
 * @property {string} [updated] - The last updated date of the user record.
 * @property {boolean | string} [is_trash] - A flag indicating if the user is marked as trash.
 * @property {boolean} [is_active] - A flag indicating if the user is active.
 * @property {boolean} [is_staff] - A flag indicating if the user is a staff member.
 * @property {boolean} [is_superuser] - A flag indicating if the user has superuser status.
 * @property {boolean} [is_supersuper] - A flag indicating if the user has supersuper status.
 * @property {boolean} [is_manager] - A flag indicating if the user is a manager.
 * @property {string} [profilePic] - The URL of the user's profile picture.
 * @property {boolean} [is_associate] - A flag indicating if the user is an associate.
 * @property {string} [brand_id] - The ID of the brand associated with the user.
 * @property {Brand[]} [brands] - The list of brands associated with the user.
 * @property {boolean} [auth0_blocked_status] - The Auth0 blocked status.
 * @property {string} [auth0_user_id] - The Auth0 user ID.
 */

/**
 * @interface UserResponse
 * @property {User[]} results - The list of users.
 * @property {number} [page] - The current page number in the paginated results.
 * @property {number} [count] - The total number of items in the current page.
 * @property {number} [total] - The total number of items across all pages.
 * @property {number} [pages] - The total number of pages.
 */
/**
 * Fetches users based on search parameters and optional isTrash flag.
 *
 * @param searchParams - URLSearchParams object containing query parameters for the request.
 * @param isTrash - Optional boolean indicating if the request should include users marked as trash. Defaults to false.
 * @returns A UseQueryResult object containing the response data or error.
 */
export const useUsers = (
  searchParams: URLSearchParams,
  isTrash: boolean = false
): UseQueryResult<UserResponse, Error> => {
  const generalParams: Record<string, string> = {
    ...getBrandId(),
    ...(isTrash ? { is_trash: "True" } : {})
  };
  const userParams: Record<string, string> = {};
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };
  userParmasKey.forEach(key => {
    if (searchParams.has(key)) {
      userParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<UserResponse, Error>(
    ["users", searchParams?.toString(), isTrash],
    async () => {
      const response = await fetch(
        `${API_URL}/user/${queryStringify({
          ...generalParams,
          ...pagination,
          ...userParams,
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
      return response.json();
    },
    {
      enabled: !!getAccessToken(),
      staleTime: Infinity,
      cacheTime: Infinity
    }
  );
};
/**
 * Fetches a user by their ID.
 *
 * This hook uses the `useQuery` hook from `react-query` to handle the fetching of a user by their ID.
 * It sends a GET request to the `/user/${userID}/` endpoint with the provided `userID`.
 *
 * @param userID - The ID of the user to fetch.
 * @returns A react-query hook for fetching a user by their ID.
 */
export const useUserByID = (
  userID: string | undefined
): UseQueryResult<UserWithBrands, Error> => {
  return useQuery<UserWithBrands, Error>(["userbyID", userID], async () => {
    if (!userID) {
      return;
    }
    const response = await fetch(`${API_URL}/user/${userID}/`, {
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

/**
 * Initiates a mutation to create a new user.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of creating a new user.
 * It sends a POST request to the `/user/` endpoint with the provided `variables` object.
 * On success, it invalidates the "users" query and displays a success toast notification.
 * On error, it displays an error toast notification with the error message.
 *
 * @returns A mutation function that can be used to initiate the user creation process.
 */
export const useCreateUser = (): UseMutationResult<
  Partial<User>,
  Error,
  Partial<User>
> => {
  const queryClient = useQueryClient();

  return useMutation<Partial<User>, Error, Partial<User>>(
    "create-user",
    async (variables: Partial<User>) => {
      const response = await fetch(`${API_URL}/user/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });

      if (response.status === 400) {
        throw new Error("Email Already Exists But we updated user password and role");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        toast.success("User created successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Initiates a mutation to update a user.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of updating a user.
 * It sends a PUT request to the `/user/:userID/` endpoint with the provided `variables` object.
 * On success, it invalidates the "users" query and displays a success toast notification.
 * On error, it displays an error toast notification with the error message.
 *
 * @param {string | undefined} userID - The ID of the user to update.
 * @returns A mutation function that can be used to initiate the user update process.
 */
export const useUpdateUser = (
  userID: string | undefined
): UseMutationResult<Partial<User>, Error, Partial<User>> => {
  const queryClient = useQueryClient();
  return useMutation<Partial<User>, Error, Partial<User>>(
    "update-user",
    async (variables: Partial<User>) => {
      if (!userID) {
        return;
      }
      const response = await fetch(`${API_URL}/user/${userID}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in Creating User");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        toast.success("User update successfully");
      },
      onError: () => {
        toast.error("Error occured while creating user");
      }
    }
  );
};
/**
 * Initiates a mutation to send a password reset email.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of sending a password reset email.
 * It sends a POST request to the `/forgot_password/` endpoint with the provided `variables` object containing the email.
 * On success, it displays a success toast notification indicating that the reset email has been sent.
 * On error, it displays an error toast notification indicating that the user was not found.
 *
 * @returns A mutation function that can be used to initiate the password reset email process.
 */
interface ForgotPassword {
  email: string;
  password: string;
  token: string;
  origin: string;
}
export const useForgetPassword = (): UseMutationResult<
  Partial<ForgotPassword>,
  Error,
  Partial<ForgotPassword>
> => {
  return useMutation<Partial<ForgotPassword>, Error, Partial<ForgotPassword>>(
    ["forgetPasswords"],
    async (
      variables: Partial<{
        email: string;
      }>
    ) => {
      const response = await fetch(`${API_URL}/forgot_password/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      if (!response.ok) {
        throw new Error("Error in Creating User");
      }

      return response.json();
    },

    {
      onSuccess: () => {
        toast.success("Reset email successfully sent");
      },
      onError: () => {
        toast.error("User Not Found");
      }
    }
  );
};

/**
 * Initiates a mutation to reset a user's password.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of resetting a user's password.
 * It sends a POST request to the `/reset_password/` endpoint with the provided `variables` object containing the email, password, and token.
 *
 * @returns A mutation function that can be used to initiate the password reset process.
 */
export const useResetPassword = (): UseMutationResult<
  Partial<ForgotPassword>,
  Error,
  Partial<ForgotPassword>
> => {
  return useMutation<Partial<ForgotPassword>, Error, Partial<ForgotPassword>>(
    ["resetPassword"],
    async (
      variables: Partial<{
        email: string;
        password: string;
        token: string;
      }>
    ) => {
      const { email, password, token } = variables;
      if (!password || !email || !token) {
        return;
      }
      const response = await fetch(`${API_URL}/reset_password/${email}/${token}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      if (!response.ok) {
        throw new Error("Error in Reseting User Password");
      }

      return response.json();
    },

    {
      onSuccess: () => {
        toast.success("Password Reset successfully");
      },
      onError: () => {
        toast.error("User Not Found");
      }
    }
  );
};
/**
 * Initiates a mutation to trash a user.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of trashing a user.
 * It sends a DELETE request to the `/user/${id}/` endpoint with the provided `id` to trash the user.
 *
 * @returns A mutation function that can be used to initiate the user trashing process.
 */
export const useTrashUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>(
    async ({ id }) => {
      const response = await fetch(`${API_URL}/user/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error in deleting User.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        toast.success("User trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Initiates a mutation to restore a user.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of restoring a user.
 * It sends a POST request to the `/user/${userID}/restore/` endpoint with the provided `userID` to restore the user.
 *
 * @returns A mutation function that can be used to initiate the user restoration process.
 */
export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { userID: string }>(
    "user-restoration",
    async variables => {
      const response = await fetch(`${API_URL}/user/${variables.userID}/restore/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) {
        throw new Error("Error in restoring user.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while restoring user.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        toast.success("User restored successfully.");
      }
    }
  );
};

/**
 * Initiates a mutation to is_pharmacist a new user.
 *
 * This hook uses the `useMutation` hook from `react-query` to handle the mutation of creating a new user.
 * It sends a POST request to the `/user logout/` endpoint with the provided `variables` object.
 * On success, it invalidates the "users" query and displays a success toast notification.
 * On error, it displays an error toast notification with the error message.
 *
 * @returns A mutation function that can be used to initiate the user creation process.
 */

export const usePharmacistLogout = () => {
  return useMutation<LogoutResponse, Error, LogoutData>(async ({ user_id, note }) => {
    if (!user_id) {
      throw new Error("User ID is required");
    }

    const data = {
      user_id: user_id,
      note: note ?? ""
    };

    const token = getAccessToken();
    if (!token) {
      throw new Error("Access token is required");
    }

    const response = await fetch(`${API_URL}/user_logout/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    const result = await response.json();
    if (!result) {
      throw new Error("Received empty response from the server");
    }

    return result;
  });
};
