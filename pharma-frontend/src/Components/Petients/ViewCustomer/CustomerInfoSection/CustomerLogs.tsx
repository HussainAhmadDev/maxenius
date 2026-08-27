import * as React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { CustomerLogs } from "../../../../Interfaces/TableInterfaces";
import DataTable from "../../../DataTable/Table";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly width?: string;
  cell?: (row: CustomerLogs) => JSX.Element;

  readonly selector?: (row: CustomerLogs) => string | React.ReactNode | undefined;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "3%"
    },
    logNo: {
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },

    tableSection: {
      marginTop: "2%",
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px"
    }
  })
);
const CustomerLogsTable: React.FC = () => {
  const classes = useStyles();
  const columns: ColumnsProps[] = [
    {
      name: "Log No",
      selector: row => `${row.logNo}`,
      cell: row => <span className={classes.logNo}>{row.logNo}</span>,
      sortable: true
    },
    {
      name: "User",
      selector: row => `${row.user}`,
      sortable: true
    },
    {
      name: "Date & Time",
      selector: row => `${row.date}`,
      cell: row => <p>{row.date}</p>,
      sortable: true
    },
    {
      name: "Field Name",
      selector: row => `${row.fieldName}`,
      sortable: true
    },
    {
      name: "Field Value",
      selector: row => `${row.fieldValue}`,
      sortable: true
    },
    {
      name: "",
      width: "60px",

      cell: row => (
        <Button
          onlyIcon={true}
          type="secondary"
          size="small"
          icon={<MuiIcon icon="undo" />}
        />
      )
    }
  ];

  const rows: CustomerLogs[] = [
    {
      logNo: "11235",
      user: "User Name",
      date: "May 31,2021 4:00PM",
      fieldName: "Name",
      fieldValue: "old Pvt Ltd"
    },
    {
      logNo: "11235",
      user: "User Name",
      date: "May 31,2021 4:00PM",
      fieldName: "Name",
      fieldValue: "old Pvt Ltd"
    },
    {
      logNo: "11235",
      user: "User Name",
      date: "May 31,2021 4:00PM",
      fieldName: "Name",
      fieldValue: "old Pvt Ltd"
    },
    {
      logNo: "11235",
      user: "User Name",
      date: "May 31,2021 4:00PM",
      fieldName: "Name",
      fieldValue: "old Pvt Ltd"
    }
  ];
  return (
    <div className={classes.root}>
      <Typography variant="h6">Customer Logs</Typography>
      <div className={classes.tableSection}>
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
};

export default CustomerLogsTable;
