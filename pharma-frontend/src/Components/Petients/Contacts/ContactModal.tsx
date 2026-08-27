import * as React from "react";
import { ModalInterface } from "../../../Interfaces/ModalInterface";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ModalPopup from "../../ModalPopup";
import SearchFilter from "./ContactFilters";
import ContactTable from "./ContactTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "20px",
      paddingTop: "0px"
    }
  })
);

const PaymentModal: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  return (
    <ModalPopup
      maxWidth="lg"
      modalTitle="Add Contacts"
      saveBtnText="Add Contacts"
      {...props}
    >
      <div className={classes.root}>
        <SearchFilter />
        <ContactTable />
      </div>
    </ModalPopup>
  );
};

export default PaymentModal;
