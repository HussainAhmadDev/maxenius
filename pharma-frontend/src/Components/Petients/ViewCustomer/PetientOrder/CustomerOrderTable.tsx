import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { OrderTableData } from "../../../../Interfaces/TableInterfaces";
import DataTable from "../../../DataTable/Table";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import PrintModal from "../../../Orders/PrintModal";
import { useModal } from "../../../../Hooks/useModal";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly maxWidth?: number;
  readonly cell?: (row: OrderTableData) => JSX.Element;
  readonly selector?: (row: OrderTableData) => string | React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "2%"
    },
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    selectButton: {
      marginTop: "10px"
    },
    successChip: {
      background: theme.palette.gray[1400],
      border: `0.5px solid ${theme.palette.gray[1500]}`,
      padding: "4px",
      borderRadius: "2px",
      color: theme.palette.gray[1500]
    },
    warnChip: {
      background: "#FFF8E3",
      border: "0.5px solid #D9A81A",
      padding: "4px",
      color: "#D9A81A",
      borderRadius: "2px"
    },
    dangerChip: {
      background: "#FFF2F4",
      border: `0.5px solid ${theme.palette.primary.main}`,
      padding: "4px",
      color: theme.palette.primary.main,
      borderRadius: "2px"
    }
  })
);
const OrderTable: React.FC = () => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      /* */
    }
  });

  const columns: ColumnsProps[] = [
    {
      name: "Order No.",
      selector: row => `${row?.orderNumber}`,
      cell: row => <p className={classes.redField}>{row?.orderNumber}</p>,
      sortable: true,
      maxWidth: 100
    },
    {
      name: "Order Date",
      selector: row => `${row?.date}`,
      sortable: true
    },

    {
      name: "Total price",
      selector: row => `${"$" + row?.price}`,
      sortable: true,
      maxWidth: 100
    },
    {
      name: "Bill To",
      selector: row => `${row?.billing.name}`,
      cell: row => <p className={classes.redField}>{row?.billing.name}</p>,
      sortable: true
    },
    {
      name: "Ship To",
      selector: row => `${row?.shipping.name}`,
      cell: row => <p className={classes.redField}>{row?.shipping.name}</p>,
      sortable: true
    },

    {
      name: "Payment Status",
      selector: row => `${row?.paymentStatus}`,
      cell: row => <Typography variant="body2">{row?.paymentStatus}</Typography>,
      sortable: true
    },
    {
      name: "Shipment Status",
      selector: row => `${row?.shipmentStatus}`,
      cell: row => <Typography variant="body2">{row?.shipmentStatus}</Typography>,
      sortable: true
    },
    {
      name: "Shipping Date",
      selector: row => `${row?.shipmentStatus}`,
      cell: row => <Typography variant="body2">{row?.date}</Typography>,
      sortable: true
    },
    {
      name: "",
      maxWidth: 100,
      selector: row => (
        <Button
          variant="outlined"
          type="secondary"
          size="small"
          onlyIcon={true}
          icon={<MuiIcon icon="dots" fontSize="small" />}
        />
      )
    }
  ];

  const data: OrderTableData[] = [
    {
      orderNumber: "41231",
      customerNumber: "411231",
      date: "May 14, 2222",
      billing: { name: "John Doe" },
      shipping: { name: "Ahmad Doe" },
      paymentStatus: "Not Paid",
      shipmentStatus: "Shipped",
      price: "10"
    },
    {
      orderNumber: "41232",
      customerNumber: "411232",
      date: "May 14,2221",
      billing: { name: "John Ahmad" },
      shipping: { name: "Ahmad John" },
      paymentStatus: "Paid",
      shipmentStatus: "Shipped",
      price: "15"
    },
    {
      orderNumber: "41233",
      customerNumber: "411233",
      date: "May 14,2224",
      billing: { name: "John jacky" },
      shipping: { name: "Ahmad mint" },
      paymentStatus: "Not Paid",
      shipmentStatus: "Partially Shipped",
      price: "14"
    }
  ];

  let selectedTableRows: OrderTableData[] = [];

  const handleRowChange = (data: { selectedRows: OrderTableData[] }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedTableRows = data?.selectedRows;
  };

  return (
    <div className={classes.root}>
      <PrintModal
        saveText="Confirm Print"
        title="Print"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
      />
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={12} lg={4}>
          <span>{data?.length} results </span>
        </Grid>
        <Grid item xs={12} lg={6}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              icon={<MuiIcon color="action" fontSize="small" icon="send" />}
              text="Send Invoices"
              type="secondary"
            />
            &nbsp;
            <Button
              icon={<MuiIcon color="action" fontSize="small" icon="download" />}
              text="Download Invoices"
              onClick={handleModalOpen}
              type="secondary"
            />
            &nbsp;
            <Button
              icon={<MuiIcon color="action" fontSize="small" icon="delete" />}
              text="Trash"
              type="secondary"
            />
          </div>
        </Grid>
      </Grid>
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={[...data, ...data, ...data, ...data]}
        showPagination
        onRowSelection={handleRowChange}
      />
    </div>
  );
};

export default OrderTable;
