import * as React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Cancel from "@material-ui/icons/Cancel";
import { ProductsResponse, ProductData } from "Interfaces/Products";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import IconButton from "@material-ui/core/IconButton";
import ProductInStockModal from "./ProductStockModal";
import { useModal } from "Hooks/useModal";
import ConfrimationModal from "./ConfirmationModal";
import get from "lodash/get";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import Prompt from "Components/Prompt";
import {
  useAddDiscountCSV,
  useGenerateBarcodeBySKU,
  useRestoreProduct,
  useTrashProduct
} from "Hooks/useProducts";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Select from "react-select";
import { usePurchaseOrder } from "Components/PurchaseOrders/CreatePurchaseOrder/PurchaseOrderEditTable";
import { toast } from "react-toastify";
import MuiIcon from "../icons/MuiIcons";
import { useBrand } from "Context/BrandContext";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  padding: "20px 32px 32px 20px"
};
interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: ProductData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: ProductData) => JSX.Element;
  readonly width?: string;
}

interface Props {
  products: ProductsResponse | undefined;
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
    },
    iconDiv: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    productTableContainer: {
      maxHeight: "600px",
      overflowY: "auto",
      minHeight: "500px",
      display: "flex",
      justifyContent: "space-between"
    },

    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    generateBarcodeContainer: {
      // width: "100%",
      // height: "40px",
      // display: "flex",
      // alignItems: "center",
      // justifyContent: "flex-end",
      // marginTop: "20px"
      display: "flex",
      alignItems: "flex-end",
      flexDirection: "row",
      justifyContent: "flex-end"
    },
    btnContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    }
  })
);

const ProductTable: React.FC<Props> = ({ products, isLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { currencySymbol } = useBrand();

  const [searchParams, setSearchParams] = useSearchParams();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });

  const confirmationModal = useModal();
  const [selectedProduct] = React.useState<ProductData | undefined>();
  const [selectedRows, setSelectedRows] = React.useState<ProductData[]>([]);
  const [productToDelete, setProductToDelete] = React.useState<{
    id: string;
    sku: string;
    is_trash: boolean;
  }>();
  const [showWarning, setShowWarning] = React.useState(false);
  const { mutateAsync: trashProduct } = useTrashProduct();
  const { mutateAsync: restoreProduct } = useRestoreProduct();
  const inputFile = React.useRef<HTMLInputElement>(null);
  const { mutate: addDiscountCSV } = useAddDiscountCSV();

  const pagination = {
    page: (products?.page || 1).toString(),
    rowsPerPage: (products?.count || 100).toString(),
    pages: (products?.pages || 1).toString(),
    total: (products?.total || 0).toString()
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

  const handleRowSelection = ({
    selectedRows
  }: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductData[];
  }) => {
    setSelectedRows(selectedRows);
  };

  const columns: ColumnsProps[] = [
    {
      name: "Product#/SKU",
      selector: row => `${row?.id_hash}`,
      cell: row => (
        <p
          onClick={() => handleRowClicked(row?.id_hash as string)}
          className={classes.redField}
        >
          {row?.sku}
        </p>
      ),
      sortable: true
    },
    // {
    //   name: "Barcode",
    //   selector: row => `${row?.id_hash}`,
    //   cell: row => (
    //     <p
    //       onClick={() => handleRowClicked(row?.id_hash as string)}
    //       className={classes.redField}
    //     >
    //       {row?.barcode}
    //     </p>
    //   ),
    //   sortable: true
    // },
    {
      name: "Product Name",
      selector: row => `${get(row, "name", "")}`,
      cell: row => (
        <p onClick={() => handleRowClicked(row?.id_hash as string)}>{row?.name}</p>
      ),
      sortable: true
    },

    {
      name: "Stock Quantity",
      selector: row => row?.status,
      cell: row => (
        <p
          onClick={() => handleRowClicked(row?.id_hash as string)}
          className={classes.greyField}
        >
          {get(row, "stock_quantity", "")}
        </p>
      ),
      sortable: true
    },
    {
      name: "Cost Price",
      selector: row => row?.retail_price,
      cell: row => (
        <p
          onClick={() => handleRowClicked(row?.id_hash as string)}
          className={classes.greyField}
        >
          {`${currencySymbol}${(row?.cost_price || 0).toFixed(2)}`}
        </p>
      ),
      sortable: true
    },
    // {
    //   name: "Price",
    //   selector: row => row?.retail_price,
    //   cell: row => (
    //     <p
    //       onClick={() => handleRowClicked(row?.id_hash as string)}
    //       className={classes.greyField}
    //     >
    //       {`${currencySymbol}${(row?.retail_price || 0).toFixed(2)}`}
    //     </p>
    //   ),
    //   sortable: true
    // },
    {
      name: "Action",
      selector: row => {
        return (
          <IconButton
            aria-label={`Delete product ${get(row, "sku", "")}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => {
              setProductToDelete({
                id: row.id_hash as string,
                sku: row.sku,
                is_trash: row.is_trash
              });
              setShowWarning(true);
            }}
          >
            {row.is_trash ? <RestoreIcon /> : <DeleteIcon color="error" />}
          </IconButton>
        );
      }
    }
  ];
  const isTrash = searchParams.get("is_trash");

  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };
  const { products: allProducts, isLoading: allProductLoading } = usePurchaseOrder();
  const [product, setProduct] = React.useState<{
    product: { value: string; label: string; sku: string }[];
  }>({
    product: [] // Initialize as an empty array
  });

  const { mutate, isLoading: generateBarcodeLoading } = useGenerateBarcodeBySKU();
  const generateHandler = () => {
    // mutate({ data: ["123456789", "987654321", "RC5643422"] })

    if (product?.product.length > 0) {
      mutate({ data: product.product.map(item => item.sku) });
    } else {
      toast.info("Please Select Atleast 1 Product!");
    }
  };
  const defaultTheme = useTheme();

  return (
    <div>
      <Prompt
        openModal={showWarning}
        title={isTrash === "1" ? "Restore Product" : "Delete Product"}
        promptMsg={`This will ${
          isTrash === "1" ? "restore" : "trash"
        } the product number ${productToDelete?.sku}.`}
        onProceed={async () => {
          productToDelete?.is_trash
            ? await restoreProduct({ productId: get(productToDelete, "id") })
            : await trashProduct({ productId: get(productToDelete, "id") });
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
      />

      <Box className={classes.btnContainer}>
        <Button
          icon={<MuiIcon icon="print" />}
          text="Generate Barcodes"
          type="secondary"
          onClick={handleOpen}
          disabled={false}
        />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={classes.iconDiv}>
            <Typography variant="h6" className={classes.redField}>
              Select Products
            </Typography>
            <span onClick={handleClose}>
              <Cancel
                color="primary"
                style={{ color: "#F7CA2A", fontSize: "50px", cursor: "pointer" }}
              />
            </span>
          </div>

          <div className={classes.productTableContainer}>
            <Stack minWidth={250}>
              <p className={classes.label}>{"Search Product:"}</p>
              <Select
                aria-label="status"
                isMulti={true}
                name="colors"
                options={allProducts?.map(
                  (r: { id_hash: string; id: string; name: string; sku: string }) => ({
                    value: r.id_hash,
                    label: `${r.name} (${r.sku})`,
                    sku: r.sku
                  })
                )}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectedOptions => {
                  const selectedProducts = selectedOptions.map(option => ({
                    value: option.value,
                    label: option.label,
                    sku: option.sku
                  }));

                  setProduct(prevState => ({ ...prevState, product: selectedProducts }));
                }}
                isLoading={allProductLoading}
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: defaultTheme.palette.gray[300],
                    primary: defaultTheme.palette.primary.main
                  }
                })}
              />
            </Stack>
          </div>
          <Box className={classes.generateBarcodeContainer}>
            <Button
              text="Generate Barcodes"
              type="primary"
              onClick={generateHandler}
              loading={allProductLoading}
              disabled={generateBarcodeLoading}
            />
          </Box>
        </Box>
      </Modal>

      <ProductInStockModal
        saveText="Confirm"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
      />
      <ConfrimationModal
        saveText="Confirm"
        handleCloseModal={confirmationModal.handleModalClose}
        handleSaveChanges={confirmationModal.handleSave}
        openModal={confirmationModal.modalOpen}
        confirmationMessage={`Are you sure you want to ${
          selectedProduct?.status ? "activate" : "deactivate"
        }`}
      />

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item sm={12} lg={6}>
          {Boolean(selectedRows.length) && (
            <div className={classes.flex}>
              <span className={classes.redField}>({selectedRows.length} selected)</span>
            </div>
          )}
        </Grid>
        <Grid item sm={12} lg={6} justifyContent="right">
          <div className={classes.flex} style={{ justifyContent: "right" }}>
            {Boolean(selectedRows.length) && (
              <>
                <Button
                  text="Bulk Mark In-Stock"
                  type="secondary"
                  onClick={handleModalOpen}
                  disabled={true}
                />
                &nbsp;&nbsp;
                <Button text="Bulk Discontinued" type="secondary" />
              </>
            )}
            <input
              type="file"
              accept=".csv"
              ref={inputFile}
              style={{ display: "none" }}
              onChange={e => {
                const files = e.target.files;
                if (files) {
                  addDiscountCSV(files[0]);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={4}>
        <span>{products?.total} results </span>
      </Grid>
      <br />
      <DataTable
        columns={columns}
        data={products?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowSelection={handleRowSelection}
        onRowClicked={({ id_hash }) => {
          id_hash && handleRowClicked(id_hash);
        }}
      />
    </div>
  );
};

export default ProductTable;
