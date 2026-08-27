import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tb: {
      border: "1px solid red"
    },
    row: {
      borderBottom: `0.5px solid ${theme.palette.gray[300]}`,
      "&:hover": {
        background: " #FFFFFF",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.06)"
      }
    },
    tableCell: {
      width: "150px",
      textAlign: "center",
      padding: "17px"
    },
    productName: {
      minWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main
    },
    iconCell: {
      display: "flex"
    },
    productNameSku: {
      maxWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center"
    },
    tableCellSku: {
      padding: "17px",
      width: "200px",
      textAlign: "left"
    },
    dBlock: {
      display: "block"
    },
    inputSelect: {
      minWidth: "150px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      border: `1px solid ${theme.palette.green.success}`,
      color: theme.palette.green.success,
      background: theme.palette.green.successBg,
      minWidth: "120px",
      maxHeight: "50px",
      borderRadius: "6px",
      padding: "10px"
    },
    shipText: {
      margin: "0px",
      color: "#121212"
    },
    shipIcon: {
      marginRight: "10px"
    }
  })
);

const ProdcutEditableRow: React.FC = () => {
  const classes = useStyles();

  return (
    <tbody>
      <tr>
        <td className={classes.tableCellSku}>
          <div className={classes.productNameSku}>
            <Avatar style={{ marginRight: 16 }} variant="square" alt={""} src={" "} />
            <p className={classes.shipText}>
              <span className={classes.dBlock}>Product Name</span>
              <span className={classes.dBlock}>SKU: REF2048798</span>
              <span className={classes.dBlock}>
                <strong>Directions:</strong>
              </span>
            </p>
          </div>
        </td>
        <td className={classes.tableCell}>$60.00</td>
        <td className={classes.tableCell}>X 1</td>
        <td className={classes.tableCell}>$60.00</td>
      </tr>
    </tbody>
  );
};

export default ProdcutEditableRow;
