import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ModalPopup from "Components/ModalPopup";
import ProductModalFilters from "Components/Products/ProductModalFilters";
import ProductTableModal from "Components/Products/ProductTableModal";
import { ModalInterface } from "Interfaces/ModalInterface";
import { ProductData, ProductsResponse } from "Interfaces/Products";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "20px 10px 0px 10px",
      marginBottom: "20px"
    }
  })
);

interface Props extends ModalInterface {
  handleChangeProductRows: (data: ProductData[]) => void;
  selectedProducts: ProductData[];
  orderProductsIds?: string[];
  selectedProductIds?: string[];
  disableSaveBtn?: boolean;
}

const ProductModal: React.FC<Props> = ({
  orderProductsIds = [],
  selectedProductIds = [],
  selectedProducts,
  ...props
}) => {
  const classes = useStyles();

  const products: ProductsResponse = {
    results: [],
    page: 0,
    pages: 0
  };

  return (
    <ModalPopup
      maxWidth="md"
      modalTitle={props.title}
      saveBtnText={props.saveText}
      noHeader={true}
      {...props}
    >
      <div className={classes.root}>
        <ProductModalFilters hasHeader />
        <br />
        <ProductTableModal
          isLoading={true}
          products={{ ...products, results: products?.results }}
          handleChangeProductRows={props.handleChangeProductRows}
          alreadyAddedProducts={orderProductsIds}
          totalSelected={selectedProductIds.length}
          selectedProducts={selectedProducts}
        />
      </div>
    </ModalPopup>
  );
};

export default ProductModal;
