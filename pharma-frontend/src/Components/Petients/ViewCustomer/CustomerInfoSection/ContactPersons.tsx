import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import ViewContactModal from "./ViewContactModal";
import { useModal } from "../../../../Hooks/useModal";
import { PatientResponse } from "Interfaces/Company";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },
    infoSection: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "15px",
      marginTop: "10px",
      height: "312px"
    },
    contactList: {
      maxHeight: "220px",
      overflowY: "scroll",
      overflowX: "hidden"
    },
    activeLabel: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      padding: "5px",
      fontSize: "12px",
      marginTop: "5px",
      marginBottom: "5px"
    },
    label: {
      marginBottom: "8px"
    },
    contactName: {
      color: theme.palette.primary.main,
      marginBottom: theme.spacing(0.5)
    },
    iconSection: {
      display: "flex"
    },
    singleItem: {
      marginBottom: "8px",
      padding: "10px",
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      cursor: "pointer"
    },
    btnSection: {
      padding: "15px"
    },
    listSection: {
      marginRight: "10px"
    }
  })
);
interface IProps {
  patientInfo: PatientResponse | undefined;
}
const ContactPersons = ({ patientInfo }: IProps) => {
  const classes = useStyles();

  //eslint-disable-next-line
  //@ts-ignore
  const contact = get(patientInfo?.results[0].address, "address") as unknown as Contact;

  const { handleSave, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      /* */
    }
  });

  return (
    <div className={classes.root}>
      {contact && (
        <ViewContactModal
          title="Contact Details"
          saveText="Save Customer"
          data={contact}
          handleCloseModal={handleModalClose}
          handleSaveChanges={handleSave}
          openModal={modalOpen}
        />
      )}
      <Typography variant="subtitle1">Prescriber Detail</Typography>
      <div className={classes.infoSection}>
        <div className={classes.contactList}>
          <div className={classes.listSection}>
            <Grid container className={classes.singleItem} alignItems="center">
              <Grid item lg={9} md={9} sm={10} xs={8}>
                <Typography component="div">
                  <Typography component="p" variant="h6">
                    {/* {contact.is_billing && (
                          <span className={classes.activeLabel}>Billing</span>
                        )}
                        {contact.is_shipping && (
                          <span className={classes.activeLabel}>Shipping</span>
                        )} */}
                    {/* <span className={classes.activeLabel}> Prescriber Name</span> */}

                    {patientInfo?.results[0]?.prescriber}
                  </Typography>
                  <Typography component="p" variant="subtitle1">
                    <br />
                    {patientInfo?.results[0]?.prescriber_email}
                  </Typography>
                  <Typography component="p" variant="subtitle1">
                    <br />
                    {patientInfo?.results[0]?.prescriber_phone}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPersons;
