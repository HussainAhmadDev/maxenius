import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { InStockIcon } from "../icons/InStock";
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

const ProductStockModal: React.FC<ModalInterface> = (props: ModalInterface) => {
  const classes = useStyles();

  return (
    <div>
      <ModalPopUp
        maxWidth="sm"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        {...props}
      >
        <div className={classes.root}>
          <div className={classes.iconDiv}>
            <InStockIcon />
          </div>
          <div>
            <Typography variant="h6" className={classes.label}>
              Are you sure ?
            </Typography>
            <Typography variant="body2" className={classes.description}>
              Some of the Products marked as coming into In-stocks are being part of
              orders that needs to be shipped.
            </Typography>
          </div>
        </div>
      </ModalPopUp>
    </div>
  );
};

export default ProductStockModal;
