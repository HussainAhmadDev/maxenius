import { UserData } from "Interfaces/User";
import React, { useState, useEffect } from "react";

export const useUser = (): UserData | undefined => {
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : undefined;
      setUser(parsedUser);
    };

    fetchUser();
  }, []);

  return user;
};
