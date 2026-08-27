// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AuthResponse, UserResponse } from "../Interfaces/AuthToken";
// import { useAuth } from "Context/AuthContext";
// import { API_URL, getAccessToken, getRefreshToken } from "./api";
// import { ILocation } from "Interfaces/Router";
// import { useAuth0 } from "@auth0/auth0-react";

// interface LoginCredentials {
//   username: string;
//   password: string;
// }

// interface AuthToken {
//   accessToken: string;
// }

// export const useAuthToken = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation() as ILocation;
//   const { setUser, setToken } = useAuth();
//   const previousLocation = state?.from || "/";

//   return useMutation<AuthResponse, Error, LoginCredentials>(
//     "auth-token",
//     async (variables: LoginCredentials) => {
//       const response = await fetch(`${API_URL}/token-auth/`, {
//         method: "POST",
//         headers: {
//           "content-type": "application/json;charset=UTF-8"
//         },
//         body: JSON.stringify(variables)
//       });
//       if (!response.ok) {
//         throw new Error("Username or password not correct.");
//       }

//       return response.json();
//     },
//     {
//       onSuccess: async data => {
//         setToken({ type: "access_token", token: data.access_token });
//         setToken({ type: "refresh_token", token: data.refresh_token });
//         setUser(data.refresh_token);
//         navigate("/");
//       }
//     }
//   );
// };

// export const useUsers = () => {
//   return useMutation<UserResponse, Error, AuthToken>("user-login", async variables => {
//     const response = await fetch(`${API_URL}/user/`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${variables.accessToken}`
//       }
//     });
//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }
//     return response.json();
//   });
// };

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { AuthResponse, UserResponse } from "../Interfaces/AuthToken";
import { useAuth } from "Context/AuthContext";
import { API_URL, getAccessToken } from "./api";
// import { ILocation } from "Interfaces/Router";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthToken {
  accessToken: string;
}

export const useAuthToken = () => {
  const navigate = useNavigate();
  // const { state } = useLocation() as ILocation;
  const { setUser, setToken } = useAuth();
  // const previousLocation = state?.from || "/";

  return useMutation<AuthResponse, Error, LoginCredentials>(
    "auth-token",
    async (variables: LoginCredentials) => {
      const response = await fetch(`${API_URL}/token-auth/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Username or password not correct.");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        setToken({ type: "access_token", token: data.access_token });
        setToken({ type: "refresh_token", token: data.refresh_token });
        //eslint-disable-next-line
        //@ts-ignore
        setUser(data?.refresh_token);

        navigate("/");
      }
    }
  );
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useQuery<AuthResponse, Error>("refresh-token", async () => {
    // Check if the token is available in the cache

    // Fetch a new token if not in cache
    const response = await fetch(`${API_URL}/token-refresh/`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",

        Authorization: `Bearer ${getAccessToken()}`
      }
    });
    if (!response.ok) {
      throw new Error("TOKEN_EXPIRED");
    }
    const data = await response.json();

    // Save the new token to the cache
    queryClient.setQueryData("refresh-token", data);

    return data;
  });
};

export const useUsers = () => {
  return useMutation<UserResponse, Error, AuthToken>("user-login", async variables => {
    const response = await fetch(`${API_URL}/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${variables.accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

interface ISetRemoveUser {
  email: string;
}

export const useGetUserToken = () => {
  const { setToken, setUser } = useAuth();

  return useMutation<AuthResponse, Error, ISetRemoveUser>(
    "get-user-token-by-id",

    async (variables: ISetRemoveUser) => {
      const response = await fetch(`${API_URL}/get-user-token-by-id/`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(variables)
      });
      // console.log("response333", response);
      // if(response.status == 200){
      //   response.a && setToken({ type: "access_token", token: token });
      //   token && setToken({ type: "refresh_token", token: token });
      // }
      if (!response.ok) {
        throw new Error("Username or password not correct.");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        const { access_token, refresh_token } = data;
        access_token && setToken({ type: "access_token", token: access_token });
        refresh_token && setToken({ type: "refresh_token", token: refresh_token });
        refresh_token && setUser(access_token);
      },
      onError: (error, variables, context) => {
        const typedContext = context as { retry: () => void };

        if (typedContext.retry) {
          // Retry the mutation
          typedContext.retry();
        }
      },
      // retries: 3, // Number of retries before giving up
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );
};
