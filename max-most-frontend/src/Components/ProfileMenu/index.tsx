import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useUser } from "../../Contexts/userContext";
import LogoutPharmacist from "./LogoutPharmacist";
import { User } from "@interfaces/usersType";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { user, logout } = useUser();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isLogoutDialogOpen, setLogoutDialogOpen] = React.useState<boolean>(false);
  const openLogoutPharmacistDialog = () => {
    setLogoutDialogOpen(true);
    handleClose();
  };
  return (
    <div>
      <Button
        variant="contained"
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              color: theme => theme.palette.common.white
            }}
          />
        }
        onClick={handleClick}
      >
        My Profile
      </Button>
      <Menu sx={{ mt: "10px" }} anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem> */}
        {/* <MenuItem onClick={logout}>Logout</MenuItem> */}
        <MenuItem
          onClick={() =>
            (user as User)?.is_pharmacist === true
              ? openLogoutPharmacistDialog()
              : logout()
          }
        >
          Logout
        </MenuItem>
      </Menu>
      <LogoutPharmacist
        user={user}
        open={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
}
