import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import BasicMenu from "../ProfileMenu";
import NavMenu from "../Navmenu";
import { useBrandContext } from "../../Contexts/brandContext";
import { IconButton, Stack } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Menu } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";

interface IProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}
const Navbar: React.FC<IProps> = ({ setOpen, open }) => {
  const { brand } = useBrandContext();
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: ({
            palette: {
              common: { black }
            }
          }) => black,
          height: "65px",
          justifyContent: "center"
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <Stack direction="row" gap={1} alignItems="center">
                <img src="/assets/refinelogo.svg" width="40px" alt="" />
                <Box sx={{ flex: "1" }}>
                  <Stack
                    direction={"row"}
                    gap={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
                      {brand ? brand?.name : "Refine Germany"}
                      <br />
                    </Typography>
                    <NavMenu />
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <Box
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" }
              }}
            >
              <img src="/assets/maxeniusLogo.png" alt="" style={{ height: "20px" }} />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => setOpen(!open)}
              >
                {open ? <Menu /> : <MenuOpenIcon />}
              </IconButton>
            </Box>
            <Box
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none"
              }}
            >
              <img src="/assets/maxeniusLogo.png" alt="" style={{ height: "20px" }} />
            </Box>
            <Stack
              direction={"row"}
              gap={1}
              sx={{ alignItems: { sm: "end", xs: "center" } }}
            >
              {/* <Box
                component={"img"}
                src="/assets/profileIcon.png"
                width="40px"
                alt=""
                sx={{ display: { sm: "inline-block", xs: "none" } }}
              /> */}
              <PersonIcon
                sx={{
                  width: "35px",
                  height: "35px"
                }}
              />
              <BasicMenu />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
const drawerWidth = 265;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));
export default Navbar;
