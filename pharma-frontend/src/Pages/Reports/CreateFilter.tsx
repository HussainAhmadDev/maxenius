import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";
import MuiIcon from "Components/icons/MuiIcons";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateFilter from "Components/Reports/Filters/CreateFilter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: 22
    },
    backArrow: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  })
);

export const CreateFilterPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Layout title="Create Report">
      <NavBar pageTitle="Create Filter"></NavBar>
      <div className={classes.container}>
        <div style={{ alignItems: "center" }}>
          <Typography variant="body2">
            <div onClick={() => navigate(-1)} className={classes.backArrow}>
              <p>
                <MuiIcon icon="backArrow" fontSize="small" />
              </p>{" "}
              &nbsp;
              <p>Report_name_here</p>
            </div>
          </Typography>
        </div>
        <CreateFilter />
      </div>
    </Layout>
  );
};

export default CreateFilterPage;
