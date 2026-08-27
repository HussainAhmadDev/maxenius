import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Stack
      width={"100%"}
      minHeight={"100dvh"}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      bgcolor={"primary.main"}
      p={2}
    >
      <Outlet />
    </Stack>
  );
};

export default AuthLayout;
