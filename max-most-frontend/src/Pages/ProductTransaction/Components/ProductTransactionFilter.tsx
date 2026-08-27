import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  ButtonGroup,
  Button
} from "@mui/material";
import { SetStateAction, useMemo, useState } from "react";
import SelectField from "../../../Components/SelectField";
import PageTitle from "../../../Components/PageTitle";
import { useProducts } from "../../../Hooks/useProducts";
import { PurchaseOrderProductForm } from "../../../Interfaces/PurchaseOrder";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface IProps {
  product: PurchaseOrderProductForm;
  setProduct: React.Dispatch<SetStateAction<PurchaseOrderProductForm>>;
}

const ProductTransactionFilter: React.FC<IProps> = ({ product, setProduct }) => {
  const { data: productsData, isLoading: producstLoading } = useProducts(
    new URLSearchParams("?count=2000")
  );
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);

  const productsOptions = useMemo(() => {
    if (productsData?.results?.length) {
      return productsData.results?.map(el => {
        return {
          label: `${el.name}${el.barcode ? ` (${el.barcode})` : ""}`,
          value: el?.id_hash
        };
      });
    } else {
      return [];
    }
  }, [productsData]);

  const handleReset = () => {
    setProduct({
      ...product,
      product: {
        cost_price: 0,
        label: "",
        value: ""
      },
      price: 0,
      product_id: ""
    });
    setKey(key + 1);
  };

  const handleToggleFilters = () => {
    setShow(!show);
  };

  return (
    <>
      <PageTitle
        icon="/assets/icons/productTransaction.svg"
        title="Product Transactions"
      />
      <SeeDocumentation fileName={"useProductTransaction"} title={"See Documentation"} />

      <Card>
        <CardHeader
          title={"Search"}
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: "bold"
          }}
          action={
            <ButtonGroup color="info" variant="contained" size="small">
              <Button onClick={handleToggleFilters}>{show ? "Hide" : "Show"}</Button>
              <Button onClick={handleReset} disabled={!show}>
                Reset
              </Button>
            </ButtonGroup>
          }
        />
        <Collapse in={show} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent key={key}>
            <Grid container spacing={2}>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  options={productsOptions}
                  label="Select Product :"
                  loading={producstLoading}
                  value={product.product_id}
                  name="product"
                  id="cy__SelectProduct"
                  handleSelect={opt => {
                    const prod = productsData?.results?.find(
                      el => String(el.id_hash) === String(opt.value)
                    );
                    setProduct({
                      ...product,
                      product: {
                        cost_price: prod?.cost_price || 0,
                        ...opt
                      },
                      price: prod?.cost_price || 0,
                      product_id: opt.value
                    });
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

export default ProductTransactionFilter;
