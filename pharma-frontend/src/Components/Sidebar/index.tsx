import * as React from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuList from "@mui/material/MenuList";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  AdvocacyIcon,
  CustomersIcon,
  OrdersIcon,
  BrandsIcon,
  LogoutIcon
} from "../icons";
import MuiIcons from "../icons/MuiIcons";
import { useModal } from "../../Hooks/useModal";
import SwitchOrgModal from "./SwtichOrgModal";
import BrandPoper from "./BrandPoper";
import { Typography } from "@material-ui/core";
import { UserContext } from "../../Context/AuthContext";
import { DrawerContext } from "../../Context/DrawerContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useBrand } from "Context/BrandContext";
import { BrandSetting } from "Interfaces/Brands";
import { navLinks } from "./data";

export const drawerWidth = 260;

const adminLinks = [
  { to: "/admin/vendors", title: "Vendors", Icon: CustomersIcon, disabled: false },

  { to: "/admin/users", title: "Users", Icon: CustomersIcon, disabled: false },
  { to: "/admin/warehouses", title: "Warehouses", Icon: BrandsIcon, disabled: false },
  {
    to: "/admin/stocksadjustment",
    title: "Stocks Adjustment",
    Icon: BrandsIcon,
    disabled: false
  },
  {
    to: "/admin/stocktransfer",
    title: "Stocks Transfer",
    Icon: BrandsIcon,
    disabled: false
  },
  {
    to: "/admin/warningmessages",
    title: "Warning Messages",
    Icon: OrdersIcon,
    disabled: false
  },
  {
    to: "/admin/brand-settings",
    title: "Brand Settings",
    Icon: CustomersIcon,
    disabled: false
  }
];
const otherLinks = [{ to: "/trash", title: "Trash", Icon: DeleteIcon }];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      position: "sticky",
      top: 0,
      bottom: 0,
      left: 0,
      height: "100vh",
      flexShrink: 0,
      background: theme.palette.gray.grayBg,
      padding: 0,
      overflowY: "hidden",
      overflowX: "hidden"
    },
    truncate: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: "85%",
      textOverflow: "ellipsis"
    },
    content: {
      backgroundColor: theme.palette.background.default,
      width: "100%"
    },
    mainLogo: {
      marginTop: 20,
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    listItemGutters: {
      padding: `8px 20px`
    },
    listItem: {
      height: 42,
      background: "red"
    },
    scrollBar: {
      height: "100%",
      overflowY: "auto"
    },
    scrollBarLg: {
      overflowY: "hidden"
    },
    navigationLink: {
      display: "flex",
      width: "100%",
      height: "100%"
    },
    linkActive: {
      backgroundColor: theme.palette.gray["200"]
    },
    avatarSection: {
      position: "absolute",
      bottom: 0,
      padding: theme.spacing(1.5),
      width: "100%",
      background: theme.palette.gray["200"],
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center"
    },

    orderButton: {
      margin: "30px 20px 20px 10px",
      width: 230
    },
    switchBody: {
      margin: "35px 20px 0px 20px",
      width: 220,
      borderRadius: "5px",
      background: theme.palette.gray[300],
      height: "60px",
      padding: "15px",
      paddingTop: "11px",
      cursor: "pointer"
    },
    selectedIcon: {
      color: theme.palette.primary.main
    },
    badge: {
      background: theme.palette.primary.main,
      borderRadius: "6px",
      padding: "4px",
      width: "20px",
      color: "white",
      textAlign: "center",
      height: "20px",
      fontSize: "10px",
      marginLeft: "auto"
    },
    flex: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    switchDiv: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      height: "35px"
    },
    envDiv: {
      color: theme.palette.text.secondary,
      width: "100%",
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5)
    },
    active: {
      padding: theme.spacing(0.5),
      background: theme.palette.primary.main,
      borderRadius: "6px",
      color: "white",
      cursor: "pointer",
      width: "100px",
      textAlign: "center"
    },
    notActive: {
      width: "100px",
      textAlign: "center",
      cursor: "pointer",
      marginRight: "5px"
    },
    drawerPaper: {
      width: 240
    },
    adminSection: {
      paddingBottom: theme.spacing(15)
    },

    storeOption: {
      display: "flex",
      height: "40px",
      alignItems: "center",
      width: "100%"
    },
    storeLogo: {
      padding: "3%",
      borderRadius: "100px",
      backgroundColor: theme.palette.gray[200]
    },
    storeName: {
      padding: "5%",
      width: "100%"
    },
    storeSubHeading: {
      fontSize: "12px",
      color: "black",
      marginTop: "3px"
    },
    storeHeading: {
      color: "black",
      marginBottom: "0px"
    },
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    brandDropdown: {
      backgroundColor: "#E2E8F0"
    },
    userMenuIcons: {
      color: theme.palette.gray[400]
    },
    root: {
      height: "calc(100vh - 22em)"
    }
  })
);

const Sidebar: React.FC = () => {
  const matches = useMediaQuery("(min-width:1710px)");
  const { pathname } = useLocation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, logout } = React.useContext(UserContext);
  const { logout: logoutAuth } = useAuth0();
  const { setDrawerOpen } = React.useContext(DrawerContext);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [searchParams] = useSearchParams();
  const { brandDetail } = useBrand();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const { handleSave, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });

  return (
    <div>
      <div className={classes.drawer}>
        <div>
          <>
            <Link to="/" className={classes.mainLogo} aria-label="advocacy logo">
              <AdvocacyIcon />
            </Link>
            <div style={{ width: "90%", margin: "auto" }}>
              <BrandPoper />
            </div>

            <div className={classes.root}>
              <div className={matches ? classes.scrollBarLg : classes.scrollBar}>
                <List>
                  {navLinks.map(({ to, title, Icon, brandSetting }) => {
                    const brandSettingValue = brandDetail?.brandSettings?.[
                      brandSetting as keyof BrandSetting
                    ] as boolean | undefined;

                    if (brandSettingValue) {
                      return (
                        <ListItemButton
                          key={title}
                          classes={{
                            gutters: classes.listItemGutters,
                            selected: classes.linkActive
                          }}
                          className={`${classes.listItem}`}
                          selected={
                            to === "/" ? pathname === to : pathname.startsWith(to)
                          }
                          onClick={() => {
                            setDrawerOpen(false);
                            if (pathname.startsWith(to)) {
                              navigate({ pathname: to, search: searchParams.toString() });
                            } else {
                              navigate(to);
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Icon color={to === pathname ? "red" : "gray"} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="subtitle1">{title}</Typography>}
                          >
                            {title}
                          </ListItemText>
                        </ListItemButton>
                      );
                    }
                    return null; // or an alternative if needed
                  })}
                </List>

                {/* Admin Section */}
                {user?.is_superuser && (
                  <List>
                    <ListItem key="Admin">
                      <Typography variant="body1">Admin</Typography>
                    </ListItem>
                    {adminLinks.map(({ to, title, Icon, disabled }) => (
                      <ListItem
                        button
                        key={title}
                        disabled={disabled}
                        classes={{
                          gutters: classes.listItemGutters
                        }}
                        className={`${classes.listItem} ${
                          pathname.startsWith(to) ? classes.linkActive : ""
                        }`}
                        onClick={() => {
                          if (pathname.startsWith(to)) {
                            navigate({ pathname: to, search: searchParams.toString() });
                          } else {
                            navigate(to);
                          }
                          setDrawerOpen(false);
                        }}
                      >
                        <ListItemIcon>
                          <Icon color={to === pathname ? "red" : "gray"} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{title}</Typography>}
                        >
                          {title}
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                )}
                {/* Admin Section */}
                {/* Others Section */}
                {user?.is_superuser && (
                  <List className={classes.adminSection}>
                    <ListItem key="Others">
                      <Typography variant="body1">Others</Typography>
                    </ListItem>
                    {otherLinks.map(({ to, title, Icon }) => (
                      <ListItem
                        button
                        key={title}
                        classes={{
                          gutters: classes.listItemGutters
                        }}
                        className={`${classes.listItem} ${
                          pathname.startsWith(to) ? classes.linkActive : ""
                        }`}
                        onClick={() => {
                          if (pathname.startsWith(to)) {
                            navigate({ pathname: to, search: searchParams.toString() });
                          } else {
                            navigate(to);
                          }
                          setDrawerOpen(false);
                        }}
                      >
                        <ListItemIcon>
                          <Icon style={{ color: to === pathname ? "red" : "#64748b" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{title}</Typography>}
                        >
                          {title}
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                )}
                {/* Admin Section */}
              </div>
            </div>
          </>
        </div>
        <div className={classes.avatarSection} aria-label="sidebar drawer">
          <Avatar
            // src={placeholderSvg}
            imgProps={{
              "aria-label": "user avatar",
              alt: "user avatar"
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 12,
              width: "60%"
            }}
          >
            <Typography
              aria-label="username"
              variant="body1"
              className={classes.truncate}
            >
              {user.first_name} {user.last_name}
            </Typography>
            <Typography
              aria-label="user email"
              variant="body2"
              className={classes.truncate}
            >
              {user.email}
            </Typography>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          </div>

          <Popover
            style={{ marginTop: "-65px", marginLeft: "-75px", maxWidth: "270px" }}
            id="simple-popover"
            aria-label="drawer popover"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <MenuList style={{ paddingTop: 10, paddingBottom: 10 }}>
              <MenuItem aria-label="profile">
                <ListItemIcon>
                  <MuiIcons icon="user" className={classes.userMenuIcons} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle1">Profile</Typography>}
                >
                  Profile
                </ListItemText>
              </MenuItem>

              <MenuItem
                onClick={async () => {
                  await logoutAuth({
                    logoutParams: { returnTo: window.location.origin }
                  });
                  logout();
                }}
                aria-label="logout"
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle1">Logout</Typography>}
                >
                  Logout
                </ListItemText>
              </MenuItem>
            </MenuList>
          </Popover>
        </div>
      </div>

      <SwitchOrgModal
        saveText="Confirm Switch"
        title="Switch Organization"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
      />
    </div>
  );
};

export default Sidebar;
