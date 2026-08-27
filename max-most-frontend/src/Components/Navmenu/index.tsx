import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { BrandList } from "../../Interfaces/brandType";
import { useBrandContext } from "../../Contexts/brandContext";
import LoadingIconButton from "../LoadingIconButton";

export default function NavMenu() {
  const { updateBrand, brands, brandLoading, brand } = useBrandContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (brand: BrandList) => {
    updateBrand(brand);
    setAnchorEl(null);
    window.location.reload();
  };

  const handleClose: () => void = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LoadingIconButton loading={brandLoading} onClick={handleClick}>
        <MoreVertIcon htmlColor="white" />
      </LoadingIconButton>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox"
        }}
      >
        {brands?.length ? (
          brands?.map((item, key) => {
            return (
              <MenuItem
                key={key}
                selected={item?.id === brand?.id}
                onClick={() => handleMenuItemClick(item)}
              >
                <img src="/assets/refinelogo.svg" width="40px" alt="" /> &nbsp;&nbsp;{" "}
                {item?.name}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem disabled>No Data Found</MenuItem>
        )}
      </Menu>
    </>
  );
}
