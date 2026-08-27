import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import creditCardImage from "../../../../Assets/images/credit.png";
// import offlineImage from "../../../../Assets/images/offline.png";
import authImage from "../../../../Assets/images/authorizepng.png";
import stickyImage from "../../../../Assets/images/sticky.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "30px"
    },
    cardBody: {
      width: "100%",
      height: "125px",
      borderRadius: "6px",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      padding: "16px"
    },
    cardHeading: {
      fontWeight: "bold",
      fontSize: "12px",
      color: `0.5px solid ${theme.palette.gray[500]}`
    },
    cardFoot: {
      justifyContent: "space-between",
      display: "flex",
      color: `0.5px solid ${theme.palette.gray[500]}`
    },
    container: {
      marginTop: "40px",
      marginBottom: "100px"
    }
  })
);

const PaymentMethods: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6">Payment Methods</Typography>
      <Grid className={classes.container} container spacing={1}>
        <Grid item xs={6} lg={4}>
          <div className={classes.cardBody}>
            <div>
              <img alt="" src={creditCardImage} />
            </div>
            <p className={classes.cardHeading}>1234 5678 9012 3456</p>
            <div className={classes.cardFoot}>
              <div>01/22</div>
              <div>321</div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} lg={4}>
          <div className={classes.cardBody}>
            <div>
              <img width="64" alt="" src={authImage} />
            </div>
            <p className={classes.cardHeading}>1234 5678 9012 3456</p>
            <div className={classes.cardFoot}>
              <div>John Doe</div>
              <div>Checking</div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} lg={4}>
          <div className={classes.cardBody}>
            <div>
              <img alt="" src={stickyImage} />
            </div>
            <p className={classes.cardHeading}>1234 5678 9012 3456</p>
            <div className={classes.cardFoot}>
              <div>01/22</div>
              <div>321</div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default PaymentMethods;
