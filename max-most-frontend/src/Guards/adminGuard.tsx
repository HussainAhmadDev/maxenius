import { useUser } from "../Contexts/userContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const { user } = useUser();
  if (user && user.is_superuser) {
    return <Outlet />;
  } else {
    return <Navigate to={"/unauthorized"} />;
  }
};

export default AdminGuard;
