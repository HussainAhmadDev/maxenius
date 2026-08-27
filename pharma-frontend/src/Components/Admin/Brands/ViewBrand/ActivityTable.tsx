import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ActivityLogsTableData } from "../../../../Interfaces/TableInterfaces";
import DataTable from "../../../DataTable/Table";
import MuiIcon from "../../../icons/MuiIcons";
import Button from "../../../Button";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly selector: (row: ActivityLogsTableData) => string | React.ReactNode | undefined;
  readonly cell?: (row: ActivityLogsTableData) => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    }
  })
);

const Payment: React.FC = () => {
  const classes = useStyles();

  const columns: ColumnsProps[] = [
    {
      name: "Log No.",
      selector: row => row.logNumber,
      cell: row => <p className={classes.redField}>{row?.logNumber}</p>
    },
    {
      name: "Date & Time",
      selector: row => `${row.dateTime}`
    },
    {
      name: "Organization",
      selector: row => row.organization,
      cell: row => <p className={classes.redField}>{row?.organization}</p>
    },
    {
      name: "Brand",
      selector: row => row.brand,
      cell: row => <p className={classes.redField}>{row?.brand}</p>
    },
    {
      name: "Content Type",
      selector: row => row.contentType,
      cell: row => <p className={classes.redField}>{row?.contentType}</p>
    },
    {
      name: "Field Name",
      selector: row => `${row.fieldName}`
    },
    {
      name: "Field Value",
      selector: row => `${row.fieldValue}`
    },
    {
      name: "",
      selector: row => row,
      cell: row => (
        <Button
          onlyIcon={true}
          type="secondary"
          size="small"
          icon={<MuiIcon fontSize="small" icon="undo" />}
        />
      )
    }
  ];

  const rows: ActivityLogsTableData[] = [
    {
      logNumber: "2312",
      dateTime: "May 23,2021 4:00PM",
      organization: "Organization 1",
      brand: "Brand Name 1",
      contentType: "Order# 12344",
      fieldName: "Name",
      fieldValue: "Old Name Pvt Ltd"
    },
    {
      logNumber: "2313",
      dateTime: "May 21,2021 5:00PM",
      organization: "Organization 2",
      brand: "Brand Name 2",
      contentType: "Order# 12345",
      fieldName: "Name 5",
      fieldValue: "Old Name 1 Pvt Ltd"
    },
    {
      logNumber: "2316",
      dateTime: "May 26,2021 6:00PM",
      organization: "Organization 6",
      brand: "Brand Name 6",
      contentType: "Order# 126344",
      fieldName: "Name 6",
      fieldValue: "Old Name 6 Pvt Ltd"
    }
  ];

  return (
    <>
      <br />
      <DataTable columns={columns} data={rows} />
      <br />
    </>
  );
};

export default Payment;
