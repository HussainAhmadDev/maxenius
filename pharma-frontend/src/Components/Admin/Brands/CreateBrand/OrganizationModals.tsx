import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../../Interfaces/ModalInterface";
import { OrganizationTableData } from "../../../../Interfaces/TableInterfaces";
import ModalPopUp from "../../../ModalPopup";
import DataTable from "../../../DataTable/Table";
import MuiIcon from "../../../icons/MuiIcons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      marginTop: "6px"
    },
    imgDiv: {
      display: "flex",
      textAlign: "center",
      color: "red",
      padding: "2px"
    },
    redField: {
      whiteSpace: "normal",
      color: theme.palette.primary.main
    },
    container: {
      borderTop: `1px solid ${theme.palette.gray[700]}`,
      padding: "10px 0px 10px 0px"
    },
    subConatiner: {
      border: `1px solid ${theme.palette.gray[700]}`,
      background: theme.palette.gray[100],
      padding: "10px 0px 10px 0px",
      display: "flex",
      borderRadius: "6px"
    },
    paidAmountDiv: {
      padding: "5px",
      width: "50%"
    },
    paidAmount: {
      color: theme.palette.gray[600],
      fontWeight: "bold",
      marginLeft: "10px"
    },
    refundAmountDiv: {
      padding: "5px",
      width: "50%"
    },
    refundAmount: {
      fontWeight: "bold",
      color: theme.palette.primary.main,
      marginLeft: "10px"
    }
  })
);
interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly width?: string;
  readonly selector: (row: OrganizationTableData) => string | React.ReactNode | undefined;
  readonly cell?: (row: OrganizationTableData) => JSX.Element;
}

const AddReturnModal: React.FC<ModalInterface> = (props: ModalInterface) => {
  const classes = useStyles();

  const columns: ColumnsProps[] = [
    {
      name: "",
      width: "100px",
      selector: row => (
        <div className={classes.imgDiv}>
          <img alt="" width="50" src={row.logo} />
        </div>
      )
    },
    {
      name: " Name",
      width: "350px",
      selector: row => (
        <div>
          <p className={classes.redField}>{row.name}</p>
        </div>
      )
    },
    {
      name: "EIN",
      selector: row => `${row.ein}`
    },

    {
      name: "Brands",
      selector: row => `${row.brands}`,
      cell: row => (
        <div style={{ display: "flex" }}>
          <span className={classes.redField}>{row.brands}</span>
          <div style={{ marginTop: "-2px", marginLeft: "10px" }}>
            <MuiIcon fontSize="small" icon="edit" />
          </div>
        </div>
      )
    },
    {
      name: "Users",
      selector: row => `${row.user}`,
      cell: row => (
        <div style={{ display: "flex" }}>
          <span className={classes.redField}>{row.user}</span>
          <div style={{ marginTop: "-2px", marginLeft: "10px" }}>
            <MuiIcon fontSize="small" icon="edit" />
          </div>
        </div>
      )
    }
  ];

  const rows: OrganizationTableData[] = [
    {
      name: "Organization Number Here Some Long Name",
      email: "",
      isActive: true,
      ein: "12-3456789",
      brands: "1",
      user: "1",
      logo: "https://media-exp1.licdn.com/dms/image/C560BAQHMnA03XDdf3w/company-logo_200_200/0/1519855918965?e=2159024400&v=beta&t=CrP5Le1mWICRcaxIGNBuajHcHGFPuyNA5C8DI339lSk"
    },
    {
      name: "Organization Number Here Some Short Name",
      ein: "12-3456789",
      brands: "3",
      user: "5",
      isActive: true,
      email: "",
      logo: "https://media-exp1.licdn.com/dms/image/C560BAQHMnA03XDdf3w/company-logo_200_200/0/1519855918965?e=2159024400&v=beta&t=CrP5Le1mWICRcaxIGNBuajHcHGFPuyNA5C8DI339lSk"
    }
  ];

  return (
    <div>
      <ModalPopUp
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        {...props}
      >
        <DataTable selectableRows={true} columns={columns} data={rows} />
      </ModalPopUp>
    </div>
  );
};

export default AddReturnModal;
