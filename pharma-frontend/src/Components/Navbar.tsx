import * as React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DrawerContext } from "../Context/DrawerContext";
import CustomButton from "../Components/Button";
import MuiIcon from "../Components/icons/MuiIcons";
import Skeleton from "@mui/material/Skeleton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nav: {
      position: "sticky",
      top: 0,
      width: "100%",
      height: 94,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      zIndex: 2,
      justifyContent: "space-between",
      // This value is only being used here so not using a theme color
      boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.08)",
      background: theme.palette.background.default,
      paddingLeft: 30,
      paddingRight: 30,
      color: theme.palette.gray["600"]
    },
    pageTitle: {
      fontSize: 32,
      lineHeight: "48px",
      fontWeight: 500,
      [theme.breakpoints.down("sm")]: {
        fontSize: 25
      }
    },
    childrenContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    iconsContainer: {
      display: "flex",
      alignItems: "center",
      width: "auto",
      justifySelf: "flex-end"
    },
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 36,
      height: 36,
      marginLeft: 8,
      cursor: "pointer"
    },
    icon: {
      color: theme.palette.gray["500"]
    },
    flexAlign: {
      display: "flex",
      alignItems: "center"
    }
  })
);
interface NavProps {
  readonly pageTitle?: string;
  purchaseOrder?: boolean;
}

export const NavBar: React.FC<NavProps> = ({ children, pageTitle, purchaseOrder }) => {
  const styles = useStyles();
  const isSmallScreen = useMediaQuery("(max-width:1280px)");

  const { setDrawerOpen, drawerOpen } = React.useContext(DrawerContext);

  return (
    <nav className={styles.nav}>
      <div className={styles.flexAlign}>
        {isSmallScreen ? (
          <>
            <CustomButton
              icon={<MuiIcon icon="menu" fontSize="small" />}
              onlyIcon={true}
              type="secondary"
              onClick={() => setDrawerOpen(!drawerOpen)}
              size="small"
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </>
        ) : null}

        {pageTitle ? (
          <Typography
            variant="h1"
            classes={{ root: styles.pageTitle }}
            aria-label="page title"
          >
            {pageTitle}
          </Typography>
        ) : (
          <Skeleton
            variant="rectangular"
            width={200}
            height={20}
            aria-label="title loading"
          />
        )}
      </div>

      <div className={styles.iconsContainer}>
        <div className={styles.childrenContainer}>{children}</div>
        {/* <div className={styles.iconsContainer}>
          <div className={styles.iconContainer} aria-label="history">
            <MuiIcon icon="history" className={styles.icon} />
          </div>
          <div className={styles.iconContainer} aria-label="help">
            <MuiIcon icon="help" className={styles.icon} />
          </div>
          <div className={styles.iconContainer} aria-label="notifications">
            <MuiIcon icon="notification" className={styles.icon} />
          </div>
        </div> */}
      </div>
    </nav>
  );
};
