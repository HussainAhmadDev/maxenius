import { TableColumn } from "react-data-table-component";
import { Typography } from "@mui/material";
import { AccessLog } from "@interfaces/AccessLogs";

type Columns<T> = TableColumn<T>[];

const AccessLogColumns = (): Columns<AccessLog> => {
  return [
    {
      name: "AM/PM",
      selector: row => `${row?.["AM/PM"]}`,
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{`${row?.["AM/PM"]}`}</Typography>,
      maxWidth: "200px"
    },
    {
      name: "Time",
      selector: row => row?.time || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.time}</Typography>
    },
    {
      name: "Date",
      selector: row => row?.date || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.date}</Typography>
    },
    {
      name: "User Name",
      selector: row => `${row?.first_name || ""} ${row?.last_name || ""}`.trim() || "N/A",
      sortable: true,
      cell: row => (
        <Typography id="cy__StockQuantity">{`${row?.first_name} ${row?.last_name}`}</Typography>
      )
    },

    {
      name: "Action",
      selector: row => row?.action,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.action}</Typography>
    },
    {
      name: "Note",
      selector: row => row?.note || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.note}</Typography>
    }
  ];
};

export { AccessLogColumns };
