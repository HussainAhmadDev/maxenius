import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { BrandProvider } from "Context/BrandContext";
import { OrgProvider } from "Context/OrgContext";
import { useAuth } from "Context/AuthContext";
import { useRefreshToken } from "Hooks/useLogin";

export const ProtectedPage: React.FC = ({ children }) => {
  const location = useLocation();
  const { user, logout, setToken } = useAuth();

  const {
    data: refreshTokenData,
    isError: isRefreshTokenError,
    isLoading: isRefreshTokenLoading
  } = useRefreshToken();

  //update from the backend api
  React.useEffect(() => {
    if (refreshTokenData && !isRefreshTokenError && !isRefreshTokenLoading) {
      setToken({ type: "access_token", token: refreshTokenData?.access_token });
      setToken({ type: "refresh_token", token: refreshTokenData?.refresh_token });
    }
    if (isRefreshTokenError) {
      logout();
    }
  }, [refreshTokenData, isRefreshTokenError, isRefreshTokenLoading, logout, setToken]);

  if (!user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return (
    <OrgProvider>
      <BrandProvider>
        <Outlet />
      </BrandProvider>
    </OrgProvider>
  );
};

// import * as React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { BrandProvider } from "Context/BrandContext";
// import { OrgProvider } from "Context/OrgContext";
// import { useAuth } from "Context/AuthContext";
// import { useRefreshToken } from "Hooks/useLogin";

// export const ProtectedPage: React.FC = ({ children }) => {
//   const location = useLocation();
//   const { user, logout, setToken } = useAuth();

//   const {
//     data: refreshTokenData,
//     isError: isRefreshTokenError,
//     isLoading: isRefreshTokenLoading
//   } = useRefreshToken();

//   React.useEffect(() => {
//     if (refreshTokenData && !isRefreshTokenError && !isRefreshTokenLoading) {
//       setToken({ type: "access_token", token: refreshTokenData?.access_token });
//       setToken({ type: "refresh_token", token: refreshTokenData?.refresh_token });
//     }
//     if (isRefreshTokenError) {
//       logout();
//     }
//   }, [refreshTokenData, isRefreshTokenError, isRefreshTokenLoading, logout, setToken]);

//   if (!user.email) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
//   return (
//     <OrgProvider>
//       <BrandProvider>
//         <Outlet />
//       </BrandProvider>
//     </OrgProvider>
//   );
// };
