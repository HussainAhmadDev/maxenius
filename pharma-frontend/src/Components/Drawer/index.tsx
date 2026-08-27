import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { DrawerContext } from "../../Context/DrawerContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    closeBtn: {
      top: "1%",
      width: "100%",
      background: theme.palette.gray.grayBg
    }
  })
);

interface Props {
  readonly children: React.ReactNode;
}
const TemporaryDrawer: React.FC<Props> = ({ children }) => {
  const { drawerOpen, setDrawerOpen } = React.useContext(DrawerContext);
  const classes = useStyles();

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)}>
      <div className={classes.root}>
        <div>{children}</div>
      </div>
    </Drawer>
  );
};

export default TemporaryDrawer;
