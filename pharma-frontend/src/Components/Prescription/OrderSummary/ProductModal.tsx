import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ModalPopup from "Components/ModalPopup";
import ProductModalFilters from "Components/Products/ProductModalFilters";
import ProductTableModal from "Components/Products/ProductTableModal";
import { useProducts } from "Hooks/useProducts";
import { ModalInterface } from "Interfaces/ModalInterface";
import { ProductData } from "Interfaces/Products";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { data: products, isLoading } = useProducts(debouncedParams);

  const filteredProducts =
    products?.results
      .filter(product => Boolean(product.id))
      .filter(product => !orderProductsIds.includes(product.id as string)) || [];

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
          isLoading={isLoading}
          products={{ ...products, results: filteredProducts }}
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
