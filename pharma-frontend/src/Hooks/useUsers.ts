import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient
} from "react-query";
import { UserData, UserResponse } from "../Interfaces/User";
import { API_URL, getAccessToken } from "./api";
import { QueryPagination } from "Interfaces/QueryFilters";
import { queryStringify } from "Utils/queryString";
import { showSuccess, showError } from "../Components/Toaster";
import { IFormik } from "Pages/Login/ForgetPassword/ForgetPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBrand } from "Context/BrandContext";
import { userParmasKey } from "Utils/queryParamKeys";
export const AUTH_AUDEINCE = import.meta.env.VITE_AUTH_AUDEINCE;

export const useUsers = (
  searchParams: URLSearchParams
): UseQueryResult<UserResponse, Error> => {
  const location = useLocation();
  const searchParamss = new URLSearchParams(location.search);
  const isTrash = searchParamss.get("is_trash") === "1";
  const { activeBrand } = useBrand();

  const generalParams: Record<string, string> = {
    brand_id: (searchParams?.get("brand_id") as string) || activeBrand,
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
    ["users", searchParams?.toString()],
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

export const useUserByID = (
  userID: string | undefined
): UseQueryResult<UserData, Error> => {
  return useQuery<UserData, Error>(["userbyID", userID], async () => {
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

export const useCreateUser = (): UseMutationResult<
  Partial<UserData>,
  Error,
  Partial<UserData>
> => {
  const queryClient = useQueryClient();
  // const { activeBrand } = useBrand();
  return useMutation<Partial<UserData>, Error, Partial<UserData>>(
    "create-user",
    async (variables: Partial<UserData>) => {
      // variables["brand_id"] = activeBrand;
      const response = await fetch(`${API_URL}/user/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      if (response.status === 400) {
        throw new Error("Email Already Exists But we updated user password and role");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        showSuccess("User created successfully");
      },
      onError: error => showError(error.message)
    }
  );
};

export const useEditUser = (
  userID: string | undefined
): UseMutationResult<Partial<UserData>, Error, Partial<UserData>> => {
  const queryClient = useQueryClient();
  return useMutation<Partial<UserData>, Error, Partial<UserData>>(
    "edit-user",
    async (variables: Partial<UserData>) => {
      variables?.password?.length === 0 && delete variables["password"];
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
        showSuccess("User update successfully");
      },
      onError: () => showError("Error occured while creating user")
    }
  );
};

export const useForgetPassword = (): UseMutationResult<
  Partial<IFormik>,
  Error,
  Partial<IFormik>
> => {
  const navigate = useNavigate();
  return useMutation<Partial<IFormik>, Error, Partial<IFormik>>(
    ["forgetPasswords"],
    async (variables: Partial<IFormik>) => {
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
        navigate("/");
        showSuccess("Email Found and token successfully sent");
      },
      onError: () => showError("User Not Found")
    }
  );
};
export const useVerifyToken = (): UseMutationResult<
  Partial<IFormik>,
  Error,
  Partial<IFormik>
> => {
  return useMutation<Partial<IFormik>, Error, Partial<IFormik>>(
    ["verify-token"],
    async (variables: Partial<IFormik>) => {
      const response = await fetch(`${API_URL}/token_verify/`, {
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
        showSuccess("Token Verification Successfully");
      },
      onError: () => showError("Token Verification failed")
    }
  );
};
export const useResetPassword = (): UseMutationResult<
  Partial<IFormik>,
  Error,
  Partial<IFormik>
> => {
  return useMutation<Partial<IFormik>, Error, Partial<IFormik>>(
    ["reset-password"],
    async (variables: Partial<IFormik>) => {
      const response = await fetch(`${API_URL}/reset_password/`, {
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
        showSuccess("Password Reset Successfully");
      },
      onError: () => showError("Something Went Wrong")
    }
  );
};

export const useTrashUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>(
    async ({ id }) => {
      ("delete-user");
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

export const useAuth0User = (): UseMutationResult<
  Partial<UserData>,
  Error,
  Partial<UserData>
> => {
  // const { activeBrand } = useBrand();
  const auth0Config = {
    clientId: "fQx35N4OLA01hKnnjQNhSVxOs58BaTYS",
    clientSecret: "U8QcuEYMdDGxd8qMmVEHjqyGfeb1BqmDmXUmQrU-TkriYxFZ1oK7OunRIo9xD-Op",
    audience: "https://dev-2ju2c1oah8r17jn5.us.auth0.com/api/v2/",
    domain: "dev-2ju2c1oah8r17jn5.us.auth0.com"
  };

  return useMutation<Partial<UserData>, Error, Partial<UserData>>(
    "create-auth0-user",
    async (variables: Partial<UserData>) => {
      // variables["brand_id"] = activeBrand;
      const response = await fetch(`https://${auth0Config.domain}/dbconnections/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          connection: "mostpharma",
          username: `${variables?.first_name}-${variables.middle_name}-${variables?.last_name}`,
          password: variables.password,
          email: variables.email,

          user_metadata: {
            is_superuser: variables?.is_superuser?.toString(),
            is_staff: variables?.is_staff?.toString(),
            mobile_phone: variables.mobile_phone,
            office_phone: variables.office_phone
          },
          client_id: auth0Config.clientId,
          client_secret: auth0Config.clientSecret
        })
      });

      if (response.status === 400) {
        toast.error("Email Already Exist!");
      }
      if (response.status !== 400 && response.status !== 200) {
        toast.error("Something Went Wrong Please Try Again!");
      }

      if (response.status === 200) {
        showSuccess("User created successfully");
      }
      return response.json();
    }
  );
};

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
