import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { styled } from "@mui/material";
import { adminMenus, asideMenus, otherMenus } from "../../Constants";
import React, { useMemo } from "react";
import { useBrandContext } from "../../Contexts/brandContext";
import { BrandSetting } from "../../Interfaces/brandType";
import { useUser } from "../../Contexts/userContext";
import Links from "./Components/Links";

interface Props {
  open: boolean;
}

const Sidebar: React.FC<Props> = ({ open }) => {
  const { brand, brandLoading } = useBrandContext();
  const { user } = useUser();
  const contionalLinks = useMemo(() => {
    return asideMenus?.filter(el =>
      el.key !== "none"
        ? brand?.brandSettings &&
          brand?.brandSettings?.[el?.key as keyof BrandSetting] === true
        : true
    );
  }, [brand]);
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <List sx={{ py: "29px", px: "16px", width: "100%" }}>
        <Links data={contionalLinks} loading={brandLoading} />
        {user?.is_superuser && <Links data={adminMenus} title="Admin" />}
        {user?.is_superuser && <Links data={otherMenus} title="Other" />}
      </List>
    </Drawer>
  );
};

const Drawer = styled(MuiDrawer)(({ open }) => {
  return {
    width: 265,
    ".MuiDrawer-paper": {
      marginTop: "63px",
      height: "calc(100% - 63px)"
    },
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      "& .MuiDrawer-paper": {
        left: "0 !important"
      }
    }),
    "& .MuiDrawer-paper": {
      transition: "all .25s ease-in-out",
      width: 265,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      overflowX: "hidden"
    },
    "@media (max-width: 900px)": {
      "& .MuiDrawer-paper": {
        left: !open && "-300px"
      },
      marginLeft: "-247px"
    }
  };
});
export default Sidebar;
