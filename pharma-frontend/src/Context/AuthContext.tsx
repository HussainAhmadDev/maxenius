/* eslint-disable */
import * as React from "react";
import { User } from "../Interfaces/User";
import { useAuth0 } from "@auth0/auth0-react";

type TokenType = "refresh_token" | "access_token";

interface TokenInfo {
  type: TokenType;
  token: string;
}
interface IUserContext {
  user: User;
  setUser(token: string): void;
  setToken(token: TokenInfo): void;
  getToken(): void;

  logout(): void;
}

export interface AuthUserDetail {
  app_metadata: {
    //eslint-disable-next-line
    app_metadata: any;
    created: string;
    created_at: string;
    date_joined: string;
    email: string;
    email_verified: boolean;
    first_name: string;
    identities: {
      connection: string;
      isSocial: boolean;
      provider: string;
      userId: string;
      user_id: string;
    }[];
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    is_trash: boolean;
    last_name: string;
    middle_name: string;
    mobile_phone: string;
    //eslint-disable-next-line
    multifactor: any[];
    name: string;
    nickname: string;
    office_phone: string;
    picture: string;
    profilePic: string;
    type: string;
    updated_at: string;
    user_id: string;
    //eslint-disable-next-line
    user_metadata: any;
    username: string;
  };
  middle_name: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  sub: string;
}

export const UserContext = React.createContext<IUserContext>({} as IUserContext);

export const AuthProvider: React.FC = ({ children }) => {
  // Check if the user is stored in localStorage
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  const [user, setUserValue] = React.useState<User>(parsedUser as User);
  const {
    user: authUser,
    isAuthenticated,
    getAccessTokenSilently,
    logout: auth0Logout
  } = useAuth0();

  React.useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      if (authUser && token && isAuthenticated) {
        getToken();
      }
    })();
    //eslint-disable-next-line
  }, [authUser]);

  React.useEffect(() => {
    if (!user.id) {
      localStorage.clear();
    }
  }, [user.id]);

  const logout = async () => {
    await auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });

    setUserValue({} as User);
    localStorage.clear();
  };

  const parseJwt = (
    token: string
  ): {
    data: User;
  } => {
    const base64Url = token?.split(".")[1];
    const base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const setUser = (token: string, firstLoad?: boolean) => {
    const user = !firstLoad && parseJwt(token).data;

    firstLoad ? setUserValue(token as unknown as User) : setUserValue(user as User);

    localStorage.setItem("user", JSON.stringify(user));
    //   const user = {
    //     id: userDetail.app_metadata.identities[0].userId,
    //     first_name: userDetail.app_metadata.first_name,
    //     last_name: userDetail.app_metadata.last_name,
    //     middle_name: userDetail.app_metadata.middle_name,
    //     password: '',
    //     email: userDetail.email,
    //     mobile_phone: userDetail.app_metadata.mobile_phone,
    //     office_phone: userDetail.app_metadata.office_phone,
    //     date_joined: userDetail.app_metadata.date_joined,
    //     last_login: userDetail.app_metadata.last_name,
    //     external_id: userDetail.sub,
    //     type: userDetail.app_metadata.type,
    //     created: userDetail.app_metadata.created,
    //     updated: userDetail.app_metadata.updated_at,
    //     is_trash: userDetail.app_metadata.is_trash,
    //     is_active: userDetail.app_metadata.is_active,
    //     is_staff: userDetail.app_metadata.is_staff,
    //     is_superuser: userDetail.app_metadata.is_superuser,
    //     is_supersuper: userDetail.app_metadata.is_superuser,
    //     profilePic: userDetail.picture,
    //     brand_id: '',
    //   }
    //   setUserValue(user);
    //   localStorage.setItem("user", JSON.stringify(user));
  };

  const setToken = (tokenInfo: TokenInfo): void => {
    localStorage.setItem(tokenInfo.type, tokenInfo.token);
  };

  const getToken = () => {
    const token = localStorage.getItem("access_token");

    return token;
  };

  return (
    <UserContext.Provider value={{ user, setUser, setToken, logout, getToken }}>
      {children}
    </UserContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(UserContext);
}

// import * as React from "react";
// import { User } from "../Interfaces/User";

// type TokenType = "refresh_token" | "access_token";

// interface TokenInfo {
//   type: TokenType;
//   token: string;
// }
// interface IUserContext {
//   user: User;
//   setUser(user: string): void;
//   setToken(tokenInfo: TokenInfo): void;
//   logout(): void;
// }

// export const UserContext = React.createContext<IUserContext>({} as IUserContext);

// export const AuthProvider: React.FC = ({ children }) => {
//   // Check if the user is stored in localStorage
//   const storedUser = localStorage.getItem("user");
//   const parsedUser = storedUser ? JSON.parse(storedUser) : {};
//   const [user, setUserValue] = React.useState<User>(parsedUser as User);

//   React.useEffect(() => {
//     if (!user.id) {
//       localStorage.clear();
//     }
//   }, [user.id]);

//   const logout = () => {
//     setUserValue({} as User);
//     localStorage.clear();
//   };

//   const parseJwt = (
//     token: string
//   ): {
//     data: User;
//   } => {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map(function (c) {
//           return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//         })
//         .join("")
//     );

//     return JSON.parse(jsonPayload);
//   };

//   const setUser = (token: string) => {
//     const user = parseJwt(token).data;
//     setUserValue(user);
//     localStorage.setItem("user", JSON.stringify(user));
//   };

//   const setToken = (tokenInfo: TokenInfo): void => {
//     localStorage.setItem(tokenInfo.type, tokenInfo.token);
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, setToken, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export function useAuth() {
//   return React.useContext(UserContext);
// }
