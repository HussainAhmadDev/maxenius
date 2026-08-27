import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useCompany } from "Hooks/useCompanies";
import { format } from "date-fns";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },
    infoSection: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "15px",
      marginTop: "10px"
    },
    activeLabel: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      padding: "5px",
      fontSize: "12px",
      position: "relative",
      top: "-4px"
    },
    iconSection: {
      display: "flex",
      alignItems: "center"
    },
    customerDetailSection: {
      marginTop: "20px"
    },
    label: {
      marginBottom: "8px"
    }
  })
);
const CustomerInfo: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { id: companyId } = useParams<"id">();
  const { data: company } = useCompany(companyId as string);

  const handleEditCompany = () => {
    navigate(`/customers/${companyId}`, {
      state: {
        companyId: companyId,
        from: `/customers-details/${companyId}`,
        isEdit: true
      }
    });
  };
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">Basic Information</Typography>
      <div className={classes.infoSection}>
        <Grid container>
          <Grid item lg={10} md={9} sm={9} xs={12}>
            <Typography variant="h6">
              {company?.name || "-- --"}{" "}
              <span className={classes.activeLabel}>
                {company?.is_active ? "Active" : "In Active"}
              </span>
            </Typography>
          </Grid>
          <Grid item lg={2} md={3} sm={3} xs={12}>
            <div className={classes.iconSection}>
              <Button
                text="Edit"
                onClick={handleEditCompany}
                icon={<MuiIcon icon="edit" />}
                type="secondary"
              />
              &nbsp; &nbsp;
              <Button
                onlyIcon={true}
                size="small"
                icon={<MuiIcon icon="dots" fontSize="small" />}
                type="secondary"
                disabled
              />
            </div>
          </Grid>
        </Grid>
        <Grid container className={classes.customerDetailSection} alignItems="center">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Date Created
            </Typography>
            <Typography variant="subtitle1">
              {company?.created ? format(new Date(company?.created), "d/MM/yyyy") : "--"}
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Date Updated
            </Typography>
            <Typography variant="subtitle1">
              {company?.updated ? format(new Date(company?.updated), "d/MM/yyyy") : "--"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.customerDetailSection} alignItems="center">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Customer Number
            </Typography>
            <Typography variant="subtitle1">{company?.number}</Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Type
            </Typography>
            <Typography variant="subtitle1">
              {company?.is_individual ? "Individual" : "Company"}{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.customerDetailSection} alignItems="center">
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Private Notes
            </Typography>
            {company?.notes && company?.notes?.length > 0 ? (
              company?.notes?.map(note => (
                <Typography variant="subtitle1">{note?.text}</Typography>
              ))
            ) : (
              <Typography variant="subtitle1">No notes added yet</Typography>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CustomerInfo;
