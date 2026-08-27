import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { getAccessToken, getTokenRemainingTime } from "../Hooks/api";
import { User } from "../Interfaces/usersType";

const localStorageKey = "user";

const UserContext = createContext<
  | {
      user: User | null;
      updateUser: (user: User) => void;
      logout(): void;
      updateAccessToken(token: string): void;
      accessToken: string | null;
    }
  | undefined
>(undefined);
/* eslint-disable react-refresh/only-export-components */

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
/* eslint-enable react-refresh/only-export-components */

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(localStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = getAccessToken();
    return storedToken ? storedToken : null;
  });
  const updateUser = (userDetail: User) => {
    localStorage.setItem(localStorageKey, JSON.stringify(userDetail));
    setUser(userDetail);
  };
  const updateToken = (token: string) => {
    setToken(token);
    localStorage.setItem("accessToken", token);
  };
  const logout = () => {
    if (token) {
      localStorage.clear();
      setUser(null);
      setToken(null);
    }
  };
  const time = useMemo(() => {
    if (token) {
      return getTokenRemainingTime(token);
    } else {
      return null;
    }
  }, [token]);
  useEffect(() => {
    if (time) {
      const timeout = setTimeout(() => {
        logout();
      }, time);
      return () => clearTimeout(timeout);
    } else if (token && !time) {
      logout();
    }
    //eslint-disable-next-line
  }, [time, token]);

  useEffect(() => {
    const storedUser = localStorage.getItem(localStorageKey);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [localStorageKey]);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        logout,
        updateAccessToken: updateToken,
        accessToken: token
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
