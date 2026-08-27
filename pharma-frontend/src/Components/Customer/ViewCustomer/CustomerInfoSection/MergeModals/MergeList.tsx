import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../../../Interfaces/ModalInterface";
import ModalPopup from "../../../../ModalPopup";
import Checkbox from "../../../../CheckBox";
import MergeChanges from "./MergeChanges";

import { useModal } from "../../../../../Hooks/useModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },
    contactBody: {
      width: "100%",
      padding: "20px",
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      marginTop: "10px",
      display: "flex"
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
    checkboxBody: {
      marginTop: "-8px",
      marginRight: "10px"
    }
  })
);
const MergeList: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      /* */
    }
  });
  const openMergeModal = () => {
    props.handleCloseModal();
    handleModalOpen();
  };

  return (
    <div>
      <MergeChanges
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
        {...props}
        handleSaveChanges={openMergeModal}
      >
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12} lg={12}>
              <div className={classes.contactBody}>
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item xs={6} lg={6}>
                    <span className={classes.contactName}>Abdul Rehman</span>
                    <span className={classes.nameChip}>Billing Contact</span>
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <span style={{ float: "right" }} className={classes.nameChip}>
                      Residential
                    </span>
                  </Grid>
                  <br />

                  <Grid item xs={6}>
                    Title, Company Name <br />
                    Address Line 1 here <br />
                    Address Line 2 here <br />
                    Country, State, City 54000
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <br />
          <Typography variant="h6">Merge With</Typography>
          <br />
          <Grid container>
            <Grid item xs={12} lg={12}>
              <div className={classes.contactBody}>
                <div className={classes.checkboxBody}>
                  <Checkbox
                    checked={true}
                    handleChange={() => {
                      /* */
                    }}
                  />
                </div>
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item xs={6} lg={6}>
                    <span className={classes.contactName}>Abdul Rehman</span>
                    <span className={classes.nameChip}>Billing Contact</span>
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <span style={{ float: "right" }} className={classes.nameChip}>
                      Residential
                    </span>
                  </Grid>
                  <br />

                  <Grid item xs={6}>
                    Title, Company Name <br />
                    Address Line 1 here <br />
                    Address Line 2 here <br />
                    Country, State, City 54000
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </ModalPopup>
    </div>
  );
};

export default MergeList;
