import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import DataTable from "Components/DataTable/Table";
import get from "lodash/get";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StockTransferHistory, StockTransferResponse } from "Hooks/useStockTransfer";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: StockTransferHistory) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: StockTransferHistory) => JSX.Element;
  readonly width?: string;
}

interface Props {
  stockTransfer: StockTransferResponse | undefined;
  isLoading: boolean;
}

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
    }
  })
);

const StockTransferTable: React.FC<Props> = ({ stockTransfer, isLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (stockTransfer?.page || 1).toString(),
    rowsPerPage: (stockTransfer?.count || 100).toString(),
    pages: (stockTransfer?.pages || 1).toString(),
    total: (stockTransfer?.total || 0).toString()
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

  const handleRowClicked = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const columns: ColumnsProps[] = [
    {
      name: "From Brand",
      selector: row => `${row?.from_brand_id}`,
      cell: row => <p className={classes.redField}>{row?.from_brand_id}</p>,
      sortable: true
    },
    {
      name: "From Product",
      selector: row => `${row?.from_product_id}`,
      cell: row => <p className={classes.redField}>{row?.from_product_id}</p>,
      sortable: true
    },
    {
      name: "To Brand",
      selector: row => `${get(row, "name", "")}`,
      cell: row => <p>{row?.to_brand_id}</p>,
      sortable: true
    },
    {
      name: "To Product",
      selector: row => `${get(row, "name", "")}`,
      cell: row => <p>{row?.to_product_id}</p>,
      sortable: true
    },

    {
      name: "Stock Quantity",
      selector: row => row?.quantity,
      cell: row => <p className={classes.greyField}>{get(row, "quantity", "")}</p>,
      sortable: true
    }
  ];

  return (
    <div style={{ padding: "8px" }}>
      <Grid item xs={12} lg={4}>
        <span>{stockTransfer?.total} results </span>
      </Grid>
      <br />
      <DataTable
        columns={columns}
        data={stockTransfer?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowClicked={({ id_hash }) => {
          id_hash && handleRowClicked(id_hash);
        }}
      />
    </div>
  );
};

export default StockTransferTable;
