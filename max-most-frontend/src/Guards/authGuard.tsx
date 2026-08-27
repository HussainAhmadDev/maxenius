import { useUser } from "../Contexts/userContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const { user, accessToken } = useUser();
  if (user?.id && accessToken) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default AuthGuard;
