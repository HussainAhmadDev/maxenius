import { Backdrop, Box, styled, useMediaQuery } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  marginTop: "10px",
  ...theme.mixins.toolbar
}));
interface Props {
  children?: React.ReactNode;
}
const DefaultLayout: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const isMd = useMediaQuery("(max-width:900px)");
  useMemo(() => isMd && setOpen(false), [isMd]);
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Navbar setOpen={setOpen} open={open} />
      <Sidebar open={open} />
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          width: { xs: "100%", md: "calc(100% - 265px)" }
        }}
        height={"100%"}
        p={3}
      >
        <DrawerHeader />
        {children ? (
          <Box sx={{ pb: 3 }}>{children}</Box>
        ) : (
          <Box sx={{ pb: 3, height: "100%" }}>
            <Outlet />
          </Box>
        )}
      </Box>
      {isMd && <Backdrop onClick={() => setOpen(false)} open={open}></Backdrop>}
    </Box>
  );
};

export default DefaultLayout;
