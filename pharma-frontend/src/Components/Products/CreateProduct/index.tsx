import * as React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "Hooks/useProducts";
import { ProductData } from "Interfaces/Products";
import { NavBar } from "Components/Navbar";
import MuiIcon from "Components/icons/MuiIcons";
import ProductInfo from "./ProductInfo";
import Button from "Components/Button";
import ProductType from "./ProductType";
import ProductMeta from "./ProductMeta";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      padding: "30px"
    },
    flexDiv: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    backArrow: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    }
  })
);
const initialFormState: Partial<ProductData> = {
  name: "",
  sku: "",
  description: "",
  is_tax_exempt: false,
  is_downloadable: false,
  is_saas: false,
  retail_price: 0,
  shipping_rate: 0
};
// in_stock | out_of_stock | on_back_order
const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, "Please Enter a Valid Name")
    .required("Product Name is required"),
  sku: yup.string().required("Product Number is required"),
  retail_price: yup
    .number()
    .min(0, "Amount should be equal to or more than 0")
    .required("Retail Price is required"),
  seo_slug: yup
    .string()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "slug must be - sperated and should have alphabets and numbers"
    )
    .nullable()
});

const CreateProduct: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { mutate: createProduct, isLoading } = useCreateProduct();

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: validationSchema,
    onSubmit: values => {
      console.log("i am calling");
      createProduct(values);
    }
  });
  const [selectedWarning, setSelectedWarning] = React.useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <NavBar pageTitle="Create Product">
          <div className={classes.headerButtons}>
            <Button text="Cancel" type="secondary" />
            &nbsp;
            <Button
              text="Save Product"
              variant="contained"
              loading={isLoading}
              submit="submit"
            />
          </div>
        </NavBar>
        <div className={classes.container}>
          <Typography variant="body2">
            <span onClick={() => navigate("/products/")} className={classes.backArrow}>
              <MuiIcon icon="backArrow" fontSize="small" />
              {" Products"}
            </span>
          </Typography>
          <br />
          <br />
          <ProductInfo
            data={formik.values}
            formik={formik}
            setProductImage={function (): void {
              throw new Error("Function not implemented.");
            }}
            setSelectedWarning={setSelectedWarning}
            selectedWarning={selectedWarning}
          >
            <ProductType data={formik.values} formik={formik} />
            <ProductMeta data={formik.values} formik={formik} />
          </ProductInfo>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
