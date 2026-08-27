import * as React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Layout from "../layout";
import { NavBar } from "../Navbar";

// styles

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      padding: "20px",
      marginTop: "50px"
    }
  })
);

const Fallback: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <Layout>
      <NavBar pageTitle="" />

      <div className={classes.body}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
            </Stack>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        <Grid container spacing={1}>
          <Grid item xs={12} lg={12}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Fallback;
