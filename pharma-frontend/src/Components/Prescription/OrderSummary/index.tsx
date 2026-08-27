import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../../Button";
import OrderNotes from "../OrderNotes";
import MuiIcon from "../../icons/MuiIcons";
import OrderCalculations from "../OrderCalculations";
import ProductModal from "./ProductModal";
import { useModal } from "../../../Hooks/useModal";
import { ProductData } from "../../../Interfaces/Products";
import { OrderData } from "Interfaces/Order";
import { CompanyData } from "Interfaces/Company";
import { productParamsGeneralKeys } from "Utils/queryParamKeys";
import { useSearchParams } from "react-router-dom";
import { useAddOrderProducts } from "Hooks/useOrders";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tb: {
      border: "1px solid red"
    },
    addProductDiv: {
      display: "flex",
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      paddingBottom: "10px"
    },
    childBtn: {
      marginRight: "10px"
    }
  })
);

interface Props {
  order: OrderData;
  orderProductsIds?: string[];
  customer: CompanyData;
}

const queryParamsKeys = [...productParamsGeneralKeys, "page", "count"];

const OrderSummary: React.FC<Props> = ({ order, orderProductsIds, customer }) => {
  const classes = useStyles();
  const [selectedProducts, setSelectedProducts] = React.useState<ProductData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutateAsync, isLoading } = useAddOrderProducts(order?.id || "");
  // const subscription = useModal({
  //   onSave: () => null
  // });
  const product = useModal({
    onSave: () => {
      handleAddProducts(selectedProducts);
      setSelectedProducts([]);
    }
  });
  const handleChangeProductRows = (data: ProductData[]) => {
    setSelectedProducts(data);
  };

  const handleAddProducts = (productsArray: ProductData[]) => {
    mutateAsync({ product_ids: productsArray.map(product => product.id) });
  };

  const selectedProductIds = selectedProducts.map(product => product.id);

  const deleteQueryParams = () => {
    const params = new URLSearchParams(searchParams);
    queryParamsKeys.forEach(key => params.delete(key));
    setSearchParams(params);
  };

  return (
    <div>
      <ProductModal
        saveBtnLoading={isLoading}
        handleCloseModal={() => {
          product.handleModalClose();
          deleteQueryParams();
        }}
        handleSaveChanges={() => {
          product.handleSave();
          deleteQueryParams();
        }}
        openModal={product.modalOpen}
        saveText="Add Product"
        handleChangeProductRows={handleChangeProductRows}
        orderProductsIds={orderProductsIds}
        selectedProductIds={selectedProductIds}
        selectedProducts={selectedProducts}
        disableSaveBtn={!selectedProductIds.length}
      />
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} sm={7} xs={12}>
          <div className={classes.addProductDiv}>
            <div className={classes.childBtn}>
              <Button
                style={{ marginTop: "20px", width: "170px" }}
                icon={<MuiIcon icon="add" />}
                text="Add Product"
                type="secondary"
                disabled={order.is_trash}
                onClick={product.handleModalOpen}
                variant="outlined"
              />
            </div>
            {/* <div className={classes.childBtn}>
              <Button
                style={{ marginTop: "20px", width: "170px" }}
                icon={<MuiIcon icon="add" />}
                text="Add Subscription"
                onClick={subscription.handleModalOpen}
                type="secondary"
                variant="outlined"
              />
            </div> */}
          </div>
          <div>
            <OrderNotes order={order || ({} as OrderData)} />
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={5} xs={12}>
          <OrderCalculations currentOrder={order} customer={customer} />
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderSummary;
