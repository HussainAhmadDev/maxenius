import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  root: {
    top: "5px",
    position: "relative"
  },
  bottom: {
    color: theme.palette.primary.main
  },
  top: {
    color: "white",
    animationDuration: "300ms",
    position: "absolute",
    left: 0
  },
  circle: {
    strokeLinecap: "round"
  }
}));
interface ILoader {
  readonly size?: number;
}
const CustomLoader: React.FC<ILoader> = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={props.size ? props.size : 25}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle
        }}
        size={props.size ? props.size : 25}
        thickness={4}
      />
    </div>
  );
};
export default CustomLoader;
