import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Button from "../../Button";
import MuiIcon from "../../icons/MuiIcons";
import ContactsList from "./ContactsList";
import ContactModal from "./ContactModal";
import { useModal } from "../../../Hooks/useModal";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const navigate = useNavigate();
  const { handleSave, handleModalClose, modalOpen } = useModal();
  const handleAddContact = () => {
    navigate("contact");
  };

  return (
    <Grid style={{ padding: 30, paddingTop: 10 }} container>
      <ContactModal
        title="Contact"
        saveText="Add Contact"
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        openModal={modalOpen}
      />
      <Grid item xs={12} lg={8}>
        <Grid container justifyContent="space-between">
          <Grid item xs={3}>
            <Typography variant="h6">Contacts</Typography>
          </Grid>
          <Grid item xs={1}>
            <Button
              ariaLabel="add contact"
              icon={<MuiIcon icon="add" />}
              onClick={handleAddContact}
              text="Add"
              type="secondary"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} lg={12}>
            <ContactsList />
          </Grid>
        </Grid>
        <br />
        <hr />
      </Grid>
    </Grid>
  );
};

export default Contacts;
