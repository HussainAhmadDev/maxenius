import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Select from "Components/Form/Select";
import { usePurchaseOrder } from "Components/PurchaseOrders/CreatePurchaseOrder/PurchaseOrderEditTable";
import { ProductData } from "Interfaces/Products";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchCustomerBody: {
      widht: "100%",
      background: theme.palette.gray[100],
      borderRadius: "6px",
      marginTop: "20px",
      padding: "25px"
    },
    searchHeading: {
      fontSize: "14px"
    },
    formBody: {
      marginTop: theme.spacing(1),
      gap: theme.spacing(4)
    },

    flexAlign: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },

    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    selectDiv: {
      width: "100%"
    }
  })
);
interface ProductDetail {
  label: string;
  value: string;
}

interface IProps {
  selectedProduct: ProductDetail;
  setSelectedProduct: (data: ProductDetail) => void;
}
const ProductTransactionFilter: React.FC<IProps> = ({
  selectedProduct,
  setSelectedProduct
}) => {
  const classes = useStyles();

  const { products, isLoading: isProductLoading } = usePurchaseOrder();

  const typedProducts: ProductData[] = products;

  return (
    <div>
      <div>
        <div className={classes.searchCustomerBody}>
          <Grid container direction="row" justifyContent="space-between">
            <Grid xs={6} item>
              <h5 className={classes.searchHeading}>Search</h5>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            spacing={1}
            className={classes.formBody}
            aria-label="filters container"
            component="form"
          >
            <Grid lg={6} xs={12} item>
              <div className={classes.flexAlign}>
                <div className={classes.labelDiv}>
                  <p className={classes.label}>Select Product:</p>
                </div>
                <div className={classes.selectDiv}>
                  {/* search product */}

                  <Select
                    loading={isProductLoading}
                    disabled={isProductLoading}
                    ariaLabel="product transaction search product"
                    options={products?.map(
                      (r: {
                        id_hash: string;
                        id: string;
                        name: string;
                        sku: string;
                      }) => ({
                        value: r.id_hash,
                        label: `${r.name}  (${r.sku})`
                      })
                    )}
                    value={selectedProduct}
                    onChange={e => {
                      const productFound:
                        | Pick<ProductData, "id_hash" | "name">
                        | undefined = typedProducts.find(
                        ({ id_hash }: { id_hash: string }) => {
                          return id_hash === e.value;
                        }
                      );

                      if (productFound) {
                        setSelectedProduct({
                          label: productFound?.name,
                          value: productFound?.id_hash
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ProductTransactionFilter;
