import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../../Interfaces/ModalInterface";
import MuiIcon from "../../../icons/MuiIcons";
import ModalPopup from "../../../ModalPopup";
import { format } from "date-fns";
import Button from "../../../Button";
// import ContactPreferences from "../../Contacts/ContactForm/ContactPreferences";
import PaymentMethods from "../../Contacts/ContactForm/PaymentMethods";
import { useModal } from "../../../../Hooks/useModal";
import MergeList from "./MergeModals/MergeList";
import { dateFormat } from "Utils/datesFormat";
// import { Contact } from "Interfaces/Company";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },
    root2: {
      marginTop: "20px"
    },
    activeLabel: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      padding: "5px",
      fontSize: "14px",
      fontweight: "bold"
    },
    infoSection: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "15px",
      marginTop: "10px"
    },
    customerDetailSection: {
      margin: "10px"
    },
    label: {
      marginBottom: "8px"
    },
    singleSection: {
      marginBottom: "20px"
    },
    authPurchase: {
      display: "flex",
      alignItems: "center"
    },
    redText: {
      color: theme.palette.primary.main
    },

    tagsDiv: {
      display: "flex",
      justifyContent: "space-between",
      color: "black",
      fontSize: "16px",
      marginBottom: "10px"
    }
  })
);
const ViewContactModal: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      /* */
    }
  });
  // just declared any because don't know the api response , will add interface in future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerData: any = {
    dateCreated: {
      label: "Date Created",
      value: props?.data?.created && format(new Date(props?.data?.created), dateFormat)
    },
    lastUpdated: {
      label: "Last Created",
      value: props?.data?.updated && format(new Date(props?.data?.updated), dateFormat)
    },
    status: {
      label: "Status",
      value: "Active"
    },
    firstName: {
      label: "First Name",
      value: props?.data?.user?.first_name
    },
    middleName: {
      label: "Middle Name",
      value: "--"
    },
    lastName: {
      label: "Last Name",
      value: props?.data?.user?.last_name
    },
    title: {
      label: "Title",
      value: props?.data?.title
    },
    company: {
      label: "Company",
      value: props?.data?.is_department
    },
    website: {
      label: "Website",
      value: props?.data?.website
    },
    officePhone: {
      label: "Office Phone",
      value: props?.data?.office_phone
    },
    billingPhone: {
      label: "Billing Phone",
      value: props?.data?.billing_phone
    },
    authorized: props?.data?.authorize_to_purchase,
    privateNote: {
      label: "Private Note",
      value: props?.data?.private_note
    }
  };

  const openMergeModal = () => {
    props.handleCloseModal();
    handleModalOpen();
  };

  return (
    <div>
      <MergeList
        title="Merge Contacts"
        saveText="Merge"
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        openModal={modalOpen}
      />
      <ModalPopup
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        footerButton={
          <Button
            type="secondary"
            onClick={openMergeModal}
            icon={<MuiIcon icon="merge" />}
            text="Merge Contacts"
          />
        }
        {...props}
      >
        <div className={classes.root}>
          <Typography variant="h6">
            {props?.data?.title} &nbsp;
            {props?.data?.is_active && (
              <span className={classes.activeLabel}>Active</span>
            )}
          </Typography>
          <div className={classes.infoSection}>
            <Grid
              container
              className={classes.customerDetailSection}
              alignItems="center"
              justifyContent="center"
            >
              {Object.keys(customerData).map(function (key, index) {
                return (
                  <Grid
                    key={index}
                    item
                    lg={customerData[key].label === "Private Note" ? 12 : 4}
                    md={customerData[key].label === "Private Note" ? 12 : 4}
                    sm={12}
                    xs={12}
                    className={classes.singleSection}
                  >
                    {key === "authorized" ? (
                      <div className={classes.authPurchase}>
                        <MuiIcon icon="checkOutlined" color="primary" />
                        &nbsp;&nbsp;
                        <Typography variant="subtitle1">
                          Authorized to Purchase
                        </Typography>
                      </div>
                    ) : (
                      <div>
                        <Typography variant="body2" className={classes.label}>
                          {customerData[key].label}
                        </Typography>
                        <Typography variant="subtitle1">
                          {customerData[key].value}{" "}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
        <div className={classes.root2}>
          <Typography variant="h6">Address</Typography>
          <div className={classes.infoSection}>
            <Grid container justifyContent="space-between" alignContent="center">
              <Grid item lg={6}>
                {props?.data?.is_billing && (
                  <>
                    <div className={classes.tagsDiv}>
                      <span className={classes.redText}>
                        <span className={classes.activeLabel}>Billing Contact</span>
                      </span>
                      &nbsp;&nbsp;
                      {props?.data?.billing_address?.is_billing && (
                        <span className={classes.redText}>
                          <span className={classes.activeLabel}>Residential</span>
                        </span>
                      )}
                    </div>
                    <Typography variant="subtitle1">
                      {props?.data?.title} {props?.data?.is_department}
                    </Typography>
                    <Typography variant="subtitle1">
                      {props?.data?.billing_address?.street1}
                    </Typography>
                    <Typography variant="subtitle1">
                      {props?.data?.billing_address?.street2}
                    </Typography>
                    <Typography variant="subtitle1">
                      {props?.data?.billing_address?.country}{" "}
                      {props?.data?.billing_address?.state}{" "}
                      {props?.data?.billing_address?.city}{" "}
                      {props?.data?.billing_address?.zip}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item lg={6}>
                {props?.data?.is_shipping && (
                  <>
                    <div className={classes.tagsDiv}>
                      <div>
                        <span className={classes.redText}>
                          <span className={classes.activeLabel}>Shipping Contact</span>
                        </span>
                        &nbsp;&nbsp;
                        {props?.data?.billing_address?.is_shipping && (
                          <span className={classes.redText}>
                            <span className={classes.activeLabel}>Residential</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <Typography variant="subtitle1">
                      {props?.data?.title} Company Name
                    </Typography>
                    <Typography variant="subtitle1">
                      {props?.data?.shipping_address?.street1}
                    </Typography>
                    <Typography variant="subtitle1">
                      {props?.data?.shipping_address?.street2}
                    </Typography>
                    <Typography variant="subtitle1">
                      {props?.data?.shipping_address?.country}{" "}
                      {props?.data?.shipping_address?.state}{" "}
                      {props?.data?.shipping_address?.city}{" "}
                      {props?.data?.shipping_address?.zip}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
        <PaymentMethods />
        {/* <ContactPreferences  /> */}
      </ModalPopup>
    </div>
  );
};

export default ViewContactModal;
