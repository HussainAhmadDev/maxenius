import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../../Button";
import get from "lodash/get";
import MuiIcon from "../../../icons/MuiIcons";
import ViewContactModal from "./ViewContactModal";
import { useModal } from "../../../../Hooks/useModal";
import { useNavigate, useParams } from "react-router";
import {
  useCompanyContacts,
  useContact,
  useDeleteCompanyContact
} from "Hooks/useCompanies";
import { Address, Contact } from "Interfaces/Company";

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
      marginTop: "5px"
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

const ContactPersons: React.FC = () => {
  const classes = useStyles();
  const { id: companyId } = useParams<"id">();
  const [companyContactId, setCompanyContactId] = React.useState("");
  const navigate = useNavigate();
  const { data: contacts, refetch: refetchContacts } = useCompanyContacts(
    companyId as string
  );

  const { data: companyContact } = useContact(
    companyId as string,
    companyContactId as string
  );
  const contact = get(companyContact, "contact") as unknown as Contact;
  const { mutateAsync } = useDeleteCompanyContact(companyId as string);

  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      /* */
    }
  });
  const handleDeleteContact = (contactId: string) => {
    mutateAsync(contactId).then(() => refetchContacts());
  };

  const handleAddContact = () => {
    navigate(`/customers/${companyId}/contact`, { state: { customerDetails: true } });
  };
  const editContact = (contactId: string) => {
    navigate(`/customers/${companyId}/contact/${contactId}`, {
      state: { contactId, customerDetails: true }
    });
  };
  const openModal = (id: string) => {
    setCompanyContactId(id);
    handleModalOpen();
  };
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
      <Typography variant="subtitle1">Contact Persons</Typography>
      <div className={classes.infoSection}>
        <div className={classes.contactList}>
          <div className={classes.listSection}>
            {contacts?.results?.map(({ contact, id, contact_id }) => {
              const contactInfo: Address = contact.is_billing
                ? contact.billing_address
                : contact.shipping_address;
              return (
                <Grid
                  key={id}
                  container
                  className={classes.singleItem}
                  alignItems="center"
                >
                  <Grid item lg={9} md={9} sm={10} xs={8}>
                    <Typography onClick={() => openModal(id)}>
                      <Typography variant="subtitle1" className={classes.contactName}>
                        {contactInfo.first_name} {contactInfo.last_name}
                      </Typography>
                      <Typography variant="subtitle1">
                        {contact.is_billing && (
                          <span className={classes.activeLabel}>Billing</span>
                        )}
                        {contact.is_shipping && (
                          <span className={classes.activeLabel}>Shipping</span>
                        )}
                        <span className={classes.activeLabel}> Contact</span>
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item lg={3} md={3} sm={2} xs={4}>
                    <div className={classes.iconSection}>
                      <Button
                        onlyIcon={true}
                        icon={<MuiIcon icon="edit" />}
                        type="secondary"
                        size="small"
                        onClick={() => editContact(id)}
                      />
                      &nbsp;&nbsp;
                      <Button
                        onlyIcon={true}
                        icon={<MuiIcon icon="delete" />}
                        type="secondary"
                        size="small"
                        onClick={() => handleDeleteContact(id)}
                      />
                    </div>
                  </Grid>
                </Grid>
              );
            })}
          </div>
        </div>
        <div className={classes.btnSection}>
          <Button
            text="Add Contact"
            icon={<MuiIcon icon="add" />}
            type="secondary"
            style={{ width: "100%" }}
            onClick={handleAddContact}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPersons;
