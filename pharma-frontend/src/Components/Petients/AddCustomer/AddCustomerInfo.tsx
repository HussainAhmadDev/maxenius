import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import Tooltip from "@material-ui/core/Tooltip";
import MuiIcon from "Components/icons/MuiIcons";
import CheckBox from "Components/CheckBox";
import TextInput from "Components/Form/TextInput";
import PopupNotes from "../PopupNotes";
import { useModal } from "Hooks/useModal";
import { useParams } from "react-router";
import Button from "Components/Button";
import { FormikProps } from "formik";
import { CompanyData } from "Interfaces/Company";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex"
    },
    markActiveDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    iconLabel: {
      display: "flex",
      alignItems: "center"
    },
    TypeSection: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(6),
      [theme.breakpoints.down("md")]: {
        marginLeft: 0
      }
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px",
      padding: "0px 13px"
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      padding: "0px 13px",
      color: theme.palette.gray[400]
    },
    infoIcon: {
      marginLeft: 4,
      color: theme.palette.gray[400]
    },
    pointer: {
      cursor: "pointer"
    },
    radioButton: {
      padding: "7px"
    }
  })
);

const AddCustomerInfo: React.FC<{ formik: FormikProps<CompanyData> }> = ({ formik }) => {
  const classes = useStyles();
  const { id: companyId } = useParams<"id">();
  const notesModal = useModal({});
  const showMarkAsActive = false;

  return (
    <>
      <Grid container alignItems="center">
        <Grid
          item
          lg={8}
          md={10}
          sm={12}
          xs={12}
          style={!showMarkAsActive && { marginBottom: 16 }}
        >
          <Typography variant="h6">Basic Information</Typography>
        </Grid>
        {showMarkAsActive && (
          <Grid item lg={4} md={4} sm={12} xs={12} alignItems="center">
            <div className={classes.markActiveDiv}>
              <p>
                <CheckBox
                  name="is_active"
                  checked={formik.values.is_active}
                  handleChange={formik.handleChange}
                />
              </p>
              &nbsp;
              <Typography variant="body2">Mark as Not-Active</Typography>
            </div>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={6} lg={6} md={6}>
          <Grid container alignItems="center">
            <Typography variant="subtitle1">Customer Number</Typography>
            <Tooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">
                    Each customer will have a unique customer number.
                  </Typography>
                </React.Fragment>
              }
              placement="right-end"
            >
              <div>
                <MuiIcon icon="info" fontSize="small" className={classes.infoIcon} />
              </div>
            </Tooltip>
          </Grid>
          <Grid item>
            <TextInput
              inputProps={{ "aria-label": "Customer Number" }}
              value={formik.values.number}
              name="number"
              type="number"
              disabled
            />
          </Grid>
        </Grid>
        <Grid item xs={6} sm={6} lg={6} md={6}>
          <Grid container alignItems="center">
            <Typography variant="subtitle1" style={{ marginBottom: 3 }}>
              Type
            </Typography>
            <Tooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">
                    Customer type can be an indvidual or a company.
                  </Typography>
                </React.Fragment>
              }
              placement="top"
            >
              <div>
                <MuiIcon icon="info" fontSize="small" className={classes.infoIcon} />
              </div>
            </Tooltip>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            style={{ paddingTop: "5px" }}
          >
            <Grid item lg={6} md={6}>
              <div
                className={`${
                  !formik.values.is_individual
                    ? classes.checkedType
                    : classes.unCheckedType
                } ${classes.pointer}`}
                aria-label="company"
                onClick={() => {
                  formik.setFieldValue("is_individual", false);
                }}
              >
                <Radio
                  size="small"
                  checked={!formik.values.is_individual}
                  onClick={() => {
                    formik.setFieldValue("is_individual", false);
                  }}
                  className={classes.radioButton}
                  value={false}
                  name="is_individual"
                  inputProps={{ "aria-label": "customer type company" }}
                />
                Company
              </div>
            </Grid>
            <Grid item md={6} lg={6}>
              <div
                className={`${
                  formik.values.is_individual
                    ? classes.checkedType
                    : classes.unCheckedType
                } ${classes.pointer}`}
                aria-label="individual"
                onClick={() => {
                  formik.setFieldValue("is_individual", true);
                }}
              >
                <Radio
                  size="small"
                  onClick={() => {
                    formik.setFieldValue("is_individual", true);
                  }}
                  className={classes.radioButton}
                  checked={formik.values.is_individual}
                  value={true}
                  name="is_individual"
                  inputProps={{ "aria-label": "customer type individual" }}
                />
                Individual
              </div>
            </Grid>
          </Grid>
        </Grid>

        {/* //chck */}
        <Grid item xs={8} sm={8} lg={8} md={8}>
          <Grid container alignItems="center">
            <Typography variant="subtitle1">Name</Typography>
            <Tooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">Enter the customer name.</Typography>
                </React.Fragment>
              }
              placement="right-end"
            >
              <div>
                <MuiIcon icon="info" fontSize="small" className={classes.infoIcon} />
              </div>
            </Tooltip>
          </Grid>
          <TextInput
            onChange={formik.handleChange}
            value={formik.values.name}
            name="name"
            type="text"
            placeholder="Company Pvt.Ltd"
            inputProps={{ "aria-label": "Customer Name" }}
          />
        </Grid>

        <Grid item xs={4} sm={4} lg={3} md={4} alignSelf="flex-end">
          <Button
            size="small"
            text="Add Popup Notes"
            variant="contained"
            onClick={notesModal.handleModalOpen}
            style={{ marginBottom: 8 }}
          />
        </Grid>
      </Grid>
      <PopupNotes
        companyId={companyId as string}
        handleSaveChanges={notesModal.handleSave}
        handleCloseModal={notesModal.handleModalClose}
        openModal={notesModal.modalOpen}
        saveText=""
        title="Add Popup Notes"
      />
      <br />
      <hr />
    </>
  );
};

export default AddCustomerInfo;
