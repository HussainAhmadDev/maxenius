/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Checkbox } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ContactTableData } from "../../../Interfaces/TableInterfaces";
import DataTable from "../../DataTable/Table";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: ContactTableData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly width?: string;
  readonly cell?: (row: any) => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    greyField: {
      color: theme.palette.text.secondary
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
    }
  })
);

const Return: React.FC = () => {
  const classes = useStyles();

  const columns: ColumnsProps[] = [
    {
      name: "Name",
      selector: row => `${row?.name}`,
      cell: row => (
        <>
          <span className={classes.contactName}>{row.name}</span>
          {row.billing && <span className={classes.nameChip}>Billing</span>}
          {row.shipping && <span className={classes.nameChip}>Shipping</span>}
        </>
      ),
      sortable: true,
      width: "300px"
    },
    {
      name: "Email",
      selector: row => `${row?.email}`,
      cell: row => <p className={classes.greyField}>{row?.email}</p>,
      sortable: true
    },
    {
      name: "Phone",
      selector: row => `${row?.phone}`,
      cell: row => <p className={classes.greyField}>{row?.phone}</p>,
      sortable: true
    },
    {
      name: "",
      selector: row => `${row?.billing}`,
      cell: row => (
        <>
          <Checkbox />
          <p className={classes.greyField}>Add as Billing</p>,
        </>
      )
    },
    {
      name: "",
      selector: row => `${row?.shipping}`,
      cell: row => (
        <>
          <Checkbox />
          <p className={classes.greyField}>Add as Shipping</p>,
        </>
      )
    }
  ];

  const rows: ContactTableData[] = [
    {
      name: "Michael Schott",
      email: "apple@email.com",
      phone: "+9211312312",
      shipping: false,
      billing: true
    },
    {
      name: "James Vince",
      email: "android@email.com",
      phone: "+921112312",
      shipping: true,
      billing: true
    },
    {
      name: "Joe Root",
      email: "joe@email.com",
      phone: "+9212312312",
      shipping: true,
      billing: false
    }
  ];

  const handleRowChange = (data: any) => {
    //We will need this function once API is ready
  };

  return (
    <>
      <p className={classes.greyField}>{rows?.length} results </p>
      <DataTable
        onRowSelection={handleRowChange}
        selectableRows={true}
        columns={columns}
        data={rows}
      />
    </>
  );
};

export default Return;
