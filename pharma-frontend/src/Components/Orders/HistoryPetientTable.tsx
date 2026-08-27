import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { HistoryResponse, HistoryData } from "Interfaces/Order";
import DataTable from "../DataTable/Table";
import { get } from "lodash";

interface Props {
  isLoading: boolean;
  history: HistoryResponse | undefined;
}

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly maxWidth?: number;
  readonly cell?: (row: HistoryData) => JSX.Element;
  readonly selector?: (row: HistoryData) => string | React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      color: theme.palette.primary.main
    },
    selectButton: {
      marginTop: "10px"
    },
    successChip: {
      background: theme.palette.gray[1400],
      border: `0.5px solid ${theme.palette.gray[1500]}`,
      padding: "2px",
      color: theme.palette.gray[1500],
      borderRadius: "6px",
      minWidth: "95px",
      fontSize: 12
    },
    warnChip: {
      borderRadius: "6px",
      minWidth: "95px",
      background: "#FFF8E3",
      border: "0.5px solid #D9A81A",
      padding: "2px",
      color: "#D9A81A",
      fontSize: 12
    },
    dangerChip: {
      minWidth: "95px",
      background: "#FFF2F4",
      border: `0.5px solid ${theme.palette.primary.main}`,
      padding: "2px",
      color: theme.palette.primary.main,
      borderRadius: "6px",
      fontSize: 12
    }
  })
);

const OrderTable: React.FC<Props> = ({ history, isLoading }) => {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (history?.page || 1).toString(),
    rowsPerPage: (history?.count || 100).toString(),
    pages: (history?.pages || 1).toString(),
    total: (history?.total || 0).toString()
  };

  const columns: ColumnsProps[] = [
    {
      name: "Product Name",
      selector: row => row?.name,
      cell: row => (
        <>
          {get(row, "name", "")}
          <p className={classes.redField}>Direction: {get(row, "direction", "")}</p>
        </>
      ),
      sortable: true,
      maxWidth: 100
    },
    {
      name: "Quantity",
      selector: row => row?.quantity,
      cell: row => <p>{get(row, "quantity")}</p>,
      sortable: true
    },

    {
      name: "Price",
      selector: row => row?.price,
      cell: row => <p>{get(row, "price")}</p>,
      sortable: true
    },

    {
      name: "Prescription ID",
      selector: row => row?.website_prescription_id,
      cell: row => <p>{get(row, "website_prescription_id")}</p>,
      sortable: true
    },
    {
      name: "Order Number",
      selector: row => row.website_order_id,
      cell: row => <p>{get(row, "website_order_id", "")}</p>,
      sortable: true
    },

    {
      name: "Order Date",
      selector: row => row.website_order_date,
      cell: row => (
        <p className={classes.redField}>{get(row, "website_order_date", "")}</p>
      ),
      sortable: true
    }
  ];

  const handleRowClick = () => {
    //eslint-disable-next-line
    console.log("yep");
  };

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (history?.pages && history.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${history.pages}`);
      setSearchParams(params);
    }
  }, [history?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  return (
    <div>
      <DataTable
        selectableRows={false}
        columns={columns}
        data={history?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onRowClicked={handleRowClick}
      />
    </div>
  );
};

export default OrderTable;
