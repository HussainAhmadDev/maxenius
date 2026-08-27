import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import DataTable from "Components/DataTable/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PurchaseOrderData, PurchaseOrderResponse } from "Interfaces/PurchaseOrder";
// import { IconButton } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
// import RestoreIcon from "@mui/icons-material/Restore";
import Prompt from "Components/Prompt";
import { useRestorePurchaseOrder, useTrashPurchaseOrder } from "Hooks/usePurchaseOrders";
import { ukDateFormat } from "Utils/datesFormat";
import IconButton from "@material-ui/core/IconButton";
interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: PType) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: PType) => JSX.Element;
  readonly width?: string;
}
interface Props {
  isLoading: boolean;
  purchaseOrders?: PurchaseOrderResponse;
}
type PType = {
  product_name: string;
  id: string;
  status: string;
  vendor_id: string;
  ordered: string;
  total_amount: string;
  is_trash: boolean | string;
  number: string;
  purchase_order_id: string;
  currency: string;
  invoicing_currency: string;
  exchange_total_amount: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    selectButton: {
      marginTop: "10px"
    },
    greyField: {
      color: theme.palette.text.secondary
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    passwordItem: {
      display: "flex",
      alignItems: "center",
      marginTop: "-6px"
    },
    iconAvatar: {
      marginLeft: "7px",
      width: "22px",
      height: "22px",
      marginTop: "5px"
    },
    editButton: {
      marginTop: "10px",
      color: theme.palette.text.secondary
    }
  })
);
const PurchaseOrderTable: React.FC<Props> = ({ purchaseOrders, isLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // const [purchaseOrder, setPurchaseOrder] = React.useState(
  //   [] as { status: string; vendor_id: string }[]
  // );

  const [showWarning, setShowWarning] = React.useState(false);

  const [pOToDelete, setPOToDelete] = React.useState<{
    id: string;
    is_trash: boolean | string;
  }>();

  const { mutateAsync: trashPurchaseOrder } = useTrashPurchaseOrder();

  const columns: ColumnsProps[] = [
    {
      name: "PO#",
      /* eslint-disable-next-line */
      selector: (row: PurchaseOrderData | any) => `${row.id}`,
      /* eslint-disable-next-line */
      cell: (row: PurchaseOrderData | any) => (
        <p
          onClick={() => navigate(`/purchase-orders/create/${row.id}`)}
          className={classes.redField}
        >
          {`${row?.id} / ${row?.purchase_order_id}`}
        </p>
      ),
      sortable: true
    },

    {
      name: "Status",
      /* eslint-disable-next-line */
      selector: (row: any) => `${"status"}`,
      /* eslint-disable-next-line */
      cell: (row: any) => (
        <p
          style={{
            textTransform: "capitalize"
          }}
        >
          {row?.status.includes("partially_received") ? "Partially Received" : row.status}
        </p>
      ),
      sortable: true
    },
    // {
    //   name: "Supplier Ref",
    //   selector: row => `${"supplier ref"}`,
    //   cell: row => <p>{row.vendor_id}</p>,
    //   sortable: true
    // },
    {
      name: "Product Name",
      selector: () => `${"supplier ref"}`,
      cell: row => <p>{row.product_name}</p>,
      sortable: true
    },

    {
      name: "Date",
      selector: () => `${"date"}`,
      /* eslint-disable-next-line */
      cell: (row: any) => <p>{ukDateFormat(row.ordered, false)}</p>,
      sortable: true
    },
    // {
    //   name: "Supplier",
    //   selector: row => `${"supplier"}`,
    //   cell: row => <p>Sample Data</p>,
    //   sortable: true
    // },
    // {
    //   name: "Location",
    //   selector: row => `${"location"}`,
    //   cell: row => <p>Sample Data</p>,
    //   sortable: true
    // },
    // {
    //   name: "Lines",
    //   selector: row => `${"lines"}`,
    //   cell: row => <p>Sample Data</p>,
    //   sortable: true
    // },
    {
      name: "Total",
      selector: () => `${"total"}`,
      cell: row => <p>{row.total_amount}</p>,
      sortable: true
    },

    {
      name: "Exchange Total",

      cell: row => <p>{row?.exchange_total_amount ?? ""}</p>,
      sortable: true
    },
    {
      name: "Action",
      selector: row => {
        return (
          <IconButton
            // aria-label={`Delete product ${get(row, "id", "")}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => {
              setPOToDelete({ id: row?.id, is_trash: row?.is_trash });
              setShowWarning(true);
            }}
          >
            {row.is_trash === "True" ? "" : <DeleteIcon color="error" />}
            {/* {<DeleteIcon color="error" />} */}
          </IconButton>
        );
      }
    }
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const { mutateAsync: restoreOrder } = useRestorePurchaseOrder();

  const pagination = {
    page: (purchaseOrders?.page || 1).toString(),
    rowsPerPage: (purchaseOrders?.count || 100).toString(),
    pages: (purchaseOrders?.pages || 1).toString(),
    total: (purchaseOrders?.total || 0).toString()
  };
  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    // If the value of a query param is empty string, delete it from URL
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };
  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const isTrash = searchParams.get("is_trash");
  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} lg={4}>
          <span>{purchaseOrders?.total} results </span>
          {/* <span className={classes.redField}>({0} selected)</span> */}
        </Grid>
        {/* <div className={classes.flex}>
          <Button text="New PO" icon={<MuiIcon color="action" fontSize="small" icon="add" />} type="secondary" />
        </div> */}
        <Prompt
          openModal={showWarning}
          title={isTrash === "1" ? "Restore Purchase Order" : "Delete Purchase Order"}
          promptMsg={`This will ${
            isTrash === "1" ? "restore" : "trash"
          } the Purchase Orde number ${pOToDelete?.id}.`}
          onProceed={async () => {
            isTrash === "1"
              ? await restoreOrder({ orderId: pOToDelete?.id as string })
              : await trashPurchaseOrder({ productId: pOToDelete?.id });
            setShowWarning(false);
          }}
          onCancel={() => setShowWarning(false)}
        />
      </Grid>
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={purchaseOrders?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        // onRowSelection={() => {}}
        onRowClicked={({ id }) => {
          navigate(`/purchase-orders/create/${id}`);
        }}
      />
    </div>
  );
};
export default PurchaseOrderTable;
