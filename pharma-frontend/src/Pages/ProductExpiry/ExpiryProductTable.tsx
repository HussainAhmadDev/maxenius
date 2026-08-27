import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import DataTable from "../../Components/DataTable/Table";

import { ExpiryData, ExpiryDataResponse } from "Interfaces/ExpiryProduct";
import { ukDateFormat } from "Utils/datesFormat";
interface Props {
  isLoading: boolean;
  ExpiryData: ExpiryDataResponse | undefined; // Ensure this matches the property name
}

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly maxWidth?: number;
  readonly cell?: (row: ExpiryData) => JSX.Element;
  readonly selector?: (row: ExpiryData) => string | React.ReactNode;
}

const useStyles = makeStyles(() =>
  createStyles({
    blackField: {
      color: "#2a2a2a"
    }
  })
);

const ExpiryProduct: React.FC<Props> = ({ ExpiryData, isLoading }) => {
  const classes = useStyles();

  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (ExpiryData?.page || 1).toString(),
    rowsPerPage: (ExpiryData?.count || 100).toString(),
    pages: (ExpiryData?.pages || 1).toString(),
    total: (ExpiryData?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };

  const columns: ColumnsProps[] = [
    {
      name: "Product Name",
      cell: row => <p className={classes.blackField}>{row.product_name}</p>,
      sortable: true,
      maxWidth: 300
    },
    {
      name: "SKU",
      cell: row => <p className={classes.blackField}>{row.product_sku}</p>,
      sortable: true,
      maxWidth: 150
    },
    {
      name: "Purchase#",
      cell: row => <p className={classes.blackField}>{row.number}</p>,
      sortable: true,
      maxWidth: 150
    },

    {
      name: "Batch Number",
      cell: row => <p className={classes.blackField}>{row.batch_number}</p>,
      sortable: true,
      maxWidth: 150
    },
    {
      name: "Expiry Date",
      cell: row => (
        <p className={classes.blackField}>
          {ukDateFormat(row?.expiry_date.toString(), false)}
        </p>
      ),
      sortable: true,
      maxWidth: 200
    },
    {
      name: "Available Quantity",
      cell: row => <p className={classes.blackField}>{row.available_quantity}</p>,
      sortable: true,
      maxWidth: 150
    }
  ];

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (ExpiryData?.pages && ExpiryData.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${ExpiryData.pages}`);
      setSearchParams(params);
    }
  }, [ExpiryData?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  return (
    <div>
      <Grid item xs={12} lg={4}>
        <span>{ExpiryData?.total} results </span>
      </Grid>
      <br />
      <DataTable
        columns={columns}
        data={ExpiryData?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
      />
    </div>
  );
};

export default ExpiryProduct;
