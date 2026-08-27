import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { HelmetProvider } from "react-helmet-async";
import Sidebar from "../Sidebar";
import Drawer from "../Drawer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      background: theme.palette.background.default,
      width: "100%",
      height: "100%",
      padding: `0px !important`,
      margin: 0
    },
    content: {
      backgroundColor: theme.palette.background.default,
      width: "100%"
    }
  })
);

interface Props {
  readonly title?: string;
}
const Layout: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery("(max-width:1280px)");

  return (
    <div className={classes.root}>
      <HelmetProvider>
        {/* <Helmet> */}
        <title>{title}</title>
        {/* </Helmet> */}
      </HelmetProvider>
      {!isSmallScreen ? (
        <Sidebar />
      ) : (
        <Drawer>
          <Sidebar />
        </Drawer>
      )}
      <main className={classes.content}>{children}</main>
    </div>
  );
};

export default Layout;
