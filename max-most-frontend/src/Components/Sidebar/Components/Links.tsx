import React, { useState } from "react";
import { SideMenus } from "../../../Interfaces/ui";
import {
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  Skeleton,
  Typography,
  styled,
  useTheme
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const Links: React.FC<{ data: SideMenus[]; title?: string; loading?: boolean }> = ({
  data,
  title,
  loading
}) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const isActive = (item: SideMenus) => {
    if (item?.route) {
      if (item.tabSystem) {
        const path = location.pathname?.split("/");
        path.pop();
        const route = item.route.split("/");
        route.pop();
        if (path.join("/")?.toLowerCase() === route?.join("/")?.toLowerCase()) {
          return true;
        }
      } else {
        return (
          item?.relativeRoutes?.some(el =>
            location?.pathname?.toLowerCase()?.includes(el?.toLowerCase())
          ) || item.route?.toLowerCase() === location?.pathname?.toLowerCase()
        );
      }
    }
    return false;
  };
  return (
    <>
      {title && (
        <ListItem dense>
          <Typography fontSize={16} fontWeight={600}>
            {title}
          </Typography>
          <IconButton onClick={() => setOpen(!open)}>
            {!open ? (
              <KeyboardArrowDown color="primary" />
            ) : (
              <KeyboardArrowUp color="primary" />
            )}
          </IconButton>
        </ListItem>
      )}
      <Collapse in={title ? open : true} unmountOnExit>
        {loading
          ? [...Array(8)]?.map((_, key) => (
              <ListItem
                disablePadding
                sx={{ maxHeight: "50px", overflow: "hidden" }}
                key={key}
              >
                <Skeleton width={"100%"} height={60} animation="wave" />
              </ListItem>
            ))
          : data?.map((item, key) => (
              <StyledListItem disablePadding active={isActive(item) ? 1 : 0} key={key}>
                <Link to={item.route} className={"no-underline"}>
                  <ListItemButton tabIndex={-1}>
                    <ListItemIcon>
                      <Box
                        component={"img"}
                        src={typeof item?.icon === "string" ? item?.icon : ""}
                      />
                    </ListItemIcon>
                    <Typography>{item.title}</Typography>
                  </ListItemButton>
                </Link>
              </StyledListItem>
            ))}
      </Collapse>
    </>
  );
};

interface StyledListItemProps extends ListItemProps {
  active: number;
}

const StyledListItem = styled(ListItem)((props: StyledListItemProps) => {
  const { active } = props;
  const { palette } = useTheme();
  return {
    background: active ? palette.common.black : "inherit",
    borderRadius: "5px",
    transition: "all .25s ease-in-out",
    overflow: "hidden",
    a: {
      color: palette.primary.main,
      width: "100%"
    },
    ".MuiListItemIcon-root": {
      minWidth: "40px !important"
    },
    img: {
      filter: active
        ? `brightness(0) saturate(100%) invert(42%) sepia(67%) saturate(616%) hue-rotate(200deg) brightness(96%) contrast(88%)`
        : `brightness(0) saturate(100%) invert(9%) sepia(0%) saturate(2939%) hue-rotate(297deg) brightness(98%) contrast(86%);`
    },
    ".MuiTypography-body1": {
      color: active ? palette.common.white : palette.common.black
    },
    margin: "3px 0"
  };
});
export default Links;
