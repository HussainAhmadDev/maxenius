import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { ProductsIcon } from "../icons/Products";
import ModalPopUp from "../ModalPopup";
import { ModalInterface } from "../../Interfaces/ModalInterface";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center"
    },
    label: {
      color: theme.palette.gray[1200],
      fontweight: "bold"
    },
    iconDiv: {
      margin: "auto",
      width: "fit-content"
    },
    description: {
      margin: theme.spacing(2)
    }
  })
);

const ConfrimationModal: React.FC<
  ModalInterface & {
    confirmationMessage?: string;
    description?: string;
  }
> = ({
  confirmationMessage = "Are you sure?",
  description = "You'll not be able to search for the products while adding them into an order if the product is deactivated",
  ...rest
}) => {
  const classes = useStyles();

  return (
    <ModalPopUp
      maxWidth="sm"
      modalTitle={rest.title}
      saveBtnText={rest.saveText}
      checkBox={rest.checkBox}
      {...rest}
    >
      <div className={classes.root}>
        <div className={classes.iconDiv}>
          <ProductsIcon />
        </div>
        <div>
          <Typography variant="h6" className={classes.label}>
            {confirmationMessage}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {description}
          </Typography>
        </div>
      </div>
    </ModalPopUp>
  );
};

export default ConfrimationModal;
