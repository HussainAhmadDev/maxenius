import { useAuth } from "Context/AuthContext";
import { useRefreshToken } from "Hooks/useLogin";
import React from "react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AdminWrapperProps {
  children: ReactNode;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  const { user: contextUser, logout, setToken } = useAuth();
  const location = useLocation();

  const {
    data: refreshTokenData,
    isError: isRefreshTokenError,
    isLoading: isRefreshTokenLoading
  } = useRefreshToken();

  // Update token from the backend API
  React.useEffect(() => {
    if (refreshTokenData && !isRefreshTokenError && !isRefreshTokenLoading) {
      setToken({ type: "access_token", token: refreshTokenData?.access_token });
      setToken({ type: "refresh_token", token: refreshTokenData?.refresh_token });
    }
    if (isRefreshTokenError) {
      logout();
    }
  }, [refreshTokenData, isRefreshTokenError, isRefreshTokenLoading, logout, setToken]);

  // Check user role and token existence
  if (contextUser && contextUser.is_superuser && refreshTokenData?.access_token) {
    return <>{children}</>;
  } else if (
    !contextUser ||
    (contextUser &&
      !contextUser.is_superuser &&
      refreshTokenData?.access_token &&
      !isRefreshTokenLoading)
  ) {
    return <Navigate to="/non-authorized-route" replace />;
  } else if (!isRefreshTokenLoading) {
    // For non-superuser, redirect to non-authorized route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Default return to handle all other cases
  return null;
};

export default AdminWrapper;
