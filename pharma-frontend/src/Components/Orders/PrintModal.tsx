import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Checkbox } from "@material-ui/core";
import { ModalInterface } from "../../Interfaces/ModalInterface";
import ModalPopup from "../ModalPopup";
import { PrintIcon } from "../icons/Print";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "20px 10px 0px 10px",
      marginBottom: "20px"
    },
    header: {
      textAlign: "center"
    },
    checkField: {
      display: "flex",
      borderRadius: "6px",
      width: "100%",
      border: `1px solid ${theme.palette.primary.main}`,
      height: "56px",
      marginTop: "8px"
    },
    field: {
      display: "flex",
      borderRadius: "6px",
      width: "100%",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      height: "56px",
      marginTop: "8px"
    },
    label: {
      marginBottom: "0px",
      lineHeight: "18px",
      marginTop: "7px"
    },
    description: {
      color: theme.palette.text.secondary,
      margin: "0px"
    }
  })
);

interface printState {
  readonly packingSlips: boolean;
  readonly shippingLabel: boolean;
}

const PrintModal: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  const [printOptions, setPrintOptions] = React.useState<printState>({
    packingSlips: true,
    shippingLabel: false
  });
  const handleChange = (e: { target: { checked: boolean; name: string } }) => {
    setPrintOptions({ ...printOptions, [e.target.name]: e.target.checked });
  };
  return (
    <ModalPopup
      maxWidth="sm"
      modalTitle={props.title}
      saveBtnText={props.saveText}
      noHeader={true}
      {...props}
    >
      <div className={classes.root}>
        <div className={classes.header}>
          <PrintIcon />
          <h2>Bulk Print</h2>
        </div>
        <div className={printOptions?.packingSlips ? classes.checkField : classes.field}>
          <Checkbox
            checked={printOptions?.packingSlips}
            name="packingSlips"
            onChange={handleChange}
          />
          <div>
            <h4 className={classes.label}>Print Packing Slips</h4>
            <p className={classes.description}>Differences explanied in some way here</p>
          </div>
        </div>
        <div className={printOptions?.shippingLabel ? classes.checkField : classes.field}>
          <Checkbox
            checked={printOptions?.shippingLabel}
            name="shippingLabel"
            onChange={handleChange}
          />
          <div>
            <h4 className={classes.label}>Print Shipping Labels</h4>
            <p className={classes.description}>Differences explanied in some way here</p>
          </div>
        </div>
      </div>
    </ModalPopup>
  );
};

export default PrintModal;
