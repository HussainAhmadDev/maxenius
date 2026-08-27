// useAuth.js
import { UseMutationResult, useMutation, useQueryClient } from "react-query";
import { AuthResponse } from "../Interfaces/global";
import { API_URL } from "./api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AuthData {
  username: string;
  password: string;
}

const baseUrl = import.meta.env.VITE_BASE_URL;

/**
 * Custom hook for handling authentication.
 *
 * @returns {object} An object containing the postData function, loading state, error state, and any error encountered.
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const endpoint = `${baseUrl}/token-auth`;

  /**
   * Function to create a post request for authentication.
   *
   * @param {AuthData} postData - The data for authentication.
   * @returns {Promise<AuthResponse>} The response data for authentication.
   */
  const createPost = async (postData: AuthData): Promise<AuthResponse> => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const resp = await response.json();
      throw new Error((resp as { error: string })?.error);
    }

    return response.json();
  };

  const mutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
    onError: err => {
      if (err instanceof Error) {
        if (err?.message === "No User Found for this Username") {
          toast.error("Invalid Credentials");
        } else {
          toast.error(err?.message);
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  });

  /**
   * Function to post authentication data.
   *
   * @param {AuthData} data - The data for authentication.
   * @returns {Promise<AuthResponse>} The response data for authentication.
   */
  const postData = async (data: AuthData): Promise<AuthResponse> => {
    const response = await mutation.mutateAsync(data);
    return response;
  };

  return {
    postData,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error
  };
};

interface CreateUserBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
interface CreateUserResponse {
  message: string;
}

/**
 * Custom hook for creating a new user.
 *
 * @returns {UseMutationResult<Partial<CreateUserResponse>, Error, CreateUserBody>} The mutation result for creating a new user.
 */
export const useCreateUser = (): UseMutationResult<
  Partial<CreateUserResponse>,
  Error,
  CreateUserBody
> => {
  const navigate = useNavigate();
  return useMutation<Partial<CreateUserResponse>, Error, CreateUserBody>(
    "create-user",
    async (variables: CreateUserBody) => {
      const response = await fetch(`${API_URL}/user/`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      if (response.status === 400) {
        throw new Error("Something went wrong");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        navigate("/login");
        toast.success("User Created Successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
