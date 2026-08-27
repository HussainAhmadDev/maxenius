import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@mui/material";
import Button from "Components/Button";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: "6px",
    padding: "20px",
    "&:hover": {
      boxShadow: "0px 12px 14px rgba(0, 0, 0, 0.04)"
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  icons: {
    marginBottom: 10
  },
  title: {
    color: theme.palette.gray[1200]
  },
  count: {
    color: theme.palette.primary.main,
    fontWeight: "bold"
  },
  button: {
    marginTop: "8px"
  }
}));
interface Props {
  readonly title: string;
  readonly buttonText: string;
  readonly count?: number;
  readonly icon: React.ReactNode;
  readonly routePath?: string;
  handleOpen?: () => void | undefined;
}
const StatusCard: React.FC<Props> = ({
  title,
  buttonText,
  count,
  icon,
  routePath,
  handleOpen
}) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const navigationHandler = () => {
    if (!routePath) {
      handleOpen && handleOpen();
    } else {
      navigate(`/${routePath}`);
    }
  };
  return (
    <div className={classes.root}>
      <div className={classes.icons}>{icon}</div>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <Typography className={classes.count} variant="h4">
        {count}
      </Typography>
      <div className={classes.button}>
        <Button type="secondary" text={buttonText} onClick={navigationHandler} />
      </div>
    </div>
  );
};
export default StatusCard;
