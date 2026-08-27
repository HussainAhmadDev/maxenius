import * as React from "react";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../Button";
import MuiIcon from "../../icons/MuiIcons";
import { useParams, useNavigate } from "react-router";
import { useCompanyContacts, useDeleteCompanyContact } from "Hooks/useCompanies";
import { Contact, Address } from "Interfaces/Company";
import Prompt from "Components/Prompt";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noContact: {
      width: "100%",
      height: "90px",
      borderRadius: "2px",
      background: theme.palette.gray[100],
      color: theme.palette.text.secondary,
      textAlign: "center",
      paddingTop: "37px",
      marginTop: "20px"
    },
    contactBody: {
      width: "100%",
      padding: "20px",
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      marginTop: "10px"
    },
    contactName: {
      fontSize: "12px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    nameChip: {
      background: theme.palette.gray[200],
      padding: "5px",
      borderRadius: "4px",
      fontWeight: "bold",
      marginLeft: "7px"
    },
    actionButtons: {
      display: "flex",
      justifyContent: "flex-end"
    }
  })
);

const Contacts = () => {
  const classes = useStyles();
  const { id: companyId } = useParams<string>();
  const { data, refetch } = useCompanyContacts(companyId || "");

  const hasContacts = Boolean(data?.results?.length);

  return (
    <Grid container>
      <Grid item xs={12} lg={12}>
        {!hasContacts && <div className={classes.noContact}>No Contact</div>}
        {data?.results.map(({ contact, id }) => (
          <ContactItem
            contact={contact}
            key={id}
            contactId={id}
            refetchContacts={refetch}
          />
        ))}
      </Grid>
    </Grid>
  );
};

const ContactItem: React.FC<{
  contact: Contact;
  contactId: string;
  refetchContacts: () => void;
}> = ({ contact, contactId, refetchContacts }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: companyId } = useParams<string>();
  const { mutateAsync } = useDeleteCompanyContact(companyId || "");
  const [contactInfo, setContactInfo] = React.useState({} as Address);
  const [contactType, setContactType] = React.useState("");
  const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);

  React.useEffect(() => {
    if (contact.is_billing) {
      setContactInfo(contact.billing_address ?? {});
      setContactType("billing");
    } else {
      setContactInfo(contact.shipping_address ?? {});
      setContactType("shipping");
    }
  }, [contact]);

  const getFullName = () => {
    const { first_name = "", last_name = "" } = contactInfo;

    return `${first_name} ${last_name}`;
  };

  const getAddress = () => {
    const { city = "", state = "", zip = "" } = contactInfo;

    return `${city} ${state} ${zip}`;
  };

  const getStreet = (name: keyof Address) => {
    if (contactType === "billing") {
      return contact.billing_address[name];
    }
    return contact.shipping_address[name];
  };

  const editContact = () => {
    navigate(`contact/${contactId}`, { state: { contactId } });
  };

  return (
    <div className={classes.contactBody}>
      <Prompt
        promptMsg={"This will trash the contact."}
        title={`Delete contact`}
        openModal={showDeleteWarning}
        onCancel={() => setShowDeleteWarning(false)}
        onProceed={() => {
          setShowDeleteWarning(false);
          mutateAsync(contactId).then(refetchContacts);
        }}
      />
      <Grid container>
        <Grid item xs={6} lg={6}>
          <span className={classes.contactName}>{getFullName()}</span>
          {contact.is_billing && <span className={classes.nameChip}>Billing</span>}
          {contact.is_shipping && <span className={classes.nameChip}>Shipping</span>}
        </Grid>
        <Grid item xs={6} lg={6}>
          <div className={classes.actionButtons}>
            <Button
              icon={<MuiIcon icon="edit" fontSize="small" />}
              size="small"
              onClick={editContact}
              onlyIcon={true}
              type="secondary"
            />{" "}
            &nbsp;
            <Button
              icon={<MuiIcon icon="delete" fontSize="small" />}
              size="small"
              onlyIcon={true}
              type="secondary"
              onClick={() => setShowDeleteWarning(true)}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          {contact.title} <br />
          {getStreet("street1")} <br />
          {getStreet("street2")} <br />
          {getAddress()}
        </Grid>
      </Grid>
    </div>
  );
};

export default Contacts;
