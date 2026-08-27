import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { ProductsResponse, ProductData } from "../../Interfaces/Products";
import DataTable from "../DataTable/Table";
import { useSearchParams } from "react-router-dom";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: ProductData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: ProductData) => JSX.Element;
  readonly width?: string;
}

interface Props {
  totalSelected: number;
  products?: ProductsResponse;
  isLoading: boolean;
  alreadyAddedProducts: string[];
  selectedProducts: ProductData[];
  handleChangeProductRows: (data: ProductData[]) => void;
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
const ProductTable: React.FC<Props> = ({
  products,
  isLoading,
  totalSelected,
  selectedProducts,
  handleChangeProductRows,
  alreadyAddedProducts
}) => {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (products?.page || 1).toString(),
    rowsPerPage: (products?.count || 10).toString(),
    pages: (products?.pages || 1).toString(),
    total: (products?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    // If the value of a query param is empty string, delete it from URL
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const productsToShow =
    products?.results
      ?.filter(product => Boolean(product.id))
      ?.filter(product => !alreadyAddedProducts.includes(product.id as string)) || [];

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const handleRowSelect = ({
    selectedRows
  }: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductData[];
  }) => {
    handleChangeProductRows(selectedRows);
  };

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (products?.pages && products.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${products.pages}`);
      setSearchParams(params);
    }
  }, [products?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  const columns: ColumnsProps[] = [
    {
      name: "Product Number",
      selector: row => `${row?.sku}`,
      cell: row => <p className={classes.greyField}>{row?.sku}</p>,
      sortable: true
    },
    {
      name: "Product Name",
      selector: row => `${row?.name}`,
      sortable: true
    },

    {
      name: "Type",
      selector: row => `${row?.description}`,
      cell: row => <p className={classes.greyField}>{"-- --"}</p>,
      sortable: true
    }
  ];

  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} lg={4}>
          {selectedProducts?.length > 0 && (
            <span className={classes.redField}>({totalSelected} selected)</span>
          )}
        </Grid>
        <Grid item xs={12} style={{ marginTop: 10 }}>
          {selectedProducts.map(row => (
            <Chip
              key={row.id}
              label={row.name}
              color="error"
              style={{ marginRight: 8, marginBottom: 8, color: "white !important" }}
            />
          ))}
        </Grid>
      </Grid>
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={productsToShow}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowSelection={handleRowSelect}
      />
    </div>
  );
};

export default ProductTable;
