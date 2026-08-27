/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { FormikProps } from "formik";
import { ProductData } from "../../../Interfaces/Products";
import { Typography, Radio } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import MuiIcon from "../../icons/MuiIcons";
// import Select from "../../Form/Select";
import TextInput from "../../Form/TextInput";
// import AccordionVariations from "./accordionVariation";
// import { useProducts } from "Hooks/useProducts";
// import { useSearchParams } from "react-router-dom";
// import { useDebounce } from "Hooks/useDebounce";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexDiv: {
      display: "flex",
      alignItems: "center",
      marginTop: theme.spacing(3)
    },
    selectLabel: {
      marginTop: theme.spacing(3),
      display: "flex",
      alignItems: "center",
      marginBottom: "8px"
    },
    label: {
      fontSize: "14px",
      color: theme.palette.gray[600]
    },
    border: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      color: theme.palette.gray[400]
    }
  })
);

interface IProps {
  data: Partial<ProductData>;
  formik: FormikProps<Partial<ProductData>>;
}

// interface IOptions {
//   label: string;
//   value: string;
// }

const ProductType: React.FC<IProps> = props => {
  const classes = useStyles();
  // const [searchParams] = useSearchParams();
  // const debouncedParams = useDebounce(searchParams, 800);
  // const [productOptions, setProductOptions] = React.useState<IOptions[]>([]);
  // const { data: products } = useProducts(debouncedParams);
  const [selectedValue, setSelectedValue] = React.useState("Physical Products");

  // React.useEffect(() => {
  //   if (products?.results) {
  //     const makeProductOptions = products?.results.map(item => {
  //       return {
  //         label: item.name,
  //         value: item.id
  //       };
  //     });
  //     return setProductOptions(makeProductOptions);
  //   }
  // }, [products]);

  React.useEffect(() => {
    setSelectedValue(
      props.formik.values.is_saas
        ? "Digital Subscription"
        : props.formik.values.is_downloadable
        ? "Digital Download"
        : "Physical Products"
    );
    //eslint-disable-next-line
  }, [props.formik.values.is_downloadable, props.formik.values.is_saas]);

  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    if (event.target.value === "Digital Download") {
      props.formik.setFieldValue("is_downloadable", true, true);
      props.formik.setFieldValue("is_saas", false, true);
    }
    if (event.target.value === "Physical Products") {
      props.formik.setFieldValue("is_downloadable", false, true);
      props.formik.setFieldValue("is_saas", false, true);
    }
    if (event.target.value === "Digital Subscription") {
      props.formik.setFieldValue("is_downloadable", false, true);
      props.formik.setFieldValue("is_saas", true, true);
    }
  };

  // const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   if (value) {
  //     props.formik.setFieldValue("status", value, true);
  //   }
  // };

  return (
    <div>
      {/* Type  */}
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.flexDiv}>
            <Typography variant="subtitle1">Type</Typography>
            &nbsp;&nbsp;
            <MuiIcon icon="info" fontSize="small" color="disabled" />
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <div
            className={
              selectedValue === "Digital Download"
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <Radio
              checked={selectedValue === "Digital Download"}
              onChange={handleChangeType}
              value="Digital Download"
              name="type"
              inputProps={{ "aria-label": "Digital Download" }}
            />
            Digital Download
          </div>
        </Grid>
        <Grid lg={4} md={4} sm={12} xs={12} item>
          <div
            className={
              selectedValue === "Digital Subscription"
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <Radio
              checked={selectedValue === "Digital Subscription"}
              onChange={handleChangeType}
              value="Digital Subscription"
              name="type"
              inputProps={{ "aria-label": "Digital Subscription" }}
            />
            Digital Subscription
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <div
            className={
              selectedValue === "Physical Products"
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <Radio
              checked={selectedValue === "Physical Products"}
              onChange={handleChangeType}
              value="Physical Products"
              name="type"
              inputProps={{ "aria-label": "Physical Products" }}
            />
            Physical Products
          </div>
        </Grid>
      </Grid>

      {selectedValue === "Digital Subscription" && (
        <>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <br />
            <Typography variant="subtitle1" className={classes.label}>
              Sticky Product Id
            </Typography>
            <TextInput
              value={props.data.sticky_product_id || ""}
              name="sticky_product_id"
              onChange={props.formik.handleChange}
              type="number"
              placeholder="StockProducIDExampleHere"
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <br />
            <Typography variant="subtitle1" className={classes.label}>
              Sticky Offer ID
            </Typography>
            <TextInput
              value={props.data.sticky_offer_id || ""}
              name="sticky_offer_id"
              onChange={props.formik.handleChange}
              type="number"
              placeholder="StickyOfferIdExampleHere"
            />
          </Grid>
        </>
      )}
      {selectedValue === "Physical Products" && (
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <br />
          <Grid container spacing={2}>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Typography variant="subtitle1" className={classes.label}>
                Weight (Pounds)
              </Typography>
              <TextInput
                name="weight"
                onChange={props.formik.handleChange}
                type="number"
                placeholder="Weight"
                disabled={true}
                value={0}
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Typography variant="subtitle1" className={classes.label}>
                Width (Inches)
              </Typography>
              <TextInput
                value={props.data.dimension_width || 0}
                name="dimension_width"
                onChange={props.formik.handleChange}
                type="number"
                placeholder="Width"
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Typography variant="subtitle1" className={classes.label}>
                Height (Inches)
              </Typography>
              <TextInput
                value={props.data.dimension_height || 0}
                name="dimension_height"
                onChange={props.formik.handleChange}
                type="number"
                placeholder="Height"
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Typography variant="subtitle1" className={classes.label}>
                Length (Inches)
              </Typography>
              <TextInput
                value={props.data.dimension_length || 0}
                name="dimension_length"
                onChange={props.formik.handleChange}
                type="number"
                placeholder="Length"
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Type  */}
      {/* Variation */}
      {/* <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.selectLabel}>
            <Typography variant="subtitle1">Variation of</Typography>
            &nbsp;&nbsp;
            <MuiIcon icon="info" fontSize="small" color="disabled" />
          </div>
          <Select
            name="productName"
            options={productOptions}
            placeholder="Type Product Name"
            disabled={false}
          />
        </Grid>
      </Grid>

      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment
        //@ts-ignore
        props?.data?.attributes?.map((item: any) => {
          return <AccordionVariations props={props} data={item} />;
        })
      } */}
      {/* Variation */}

      {/* Status */}
      {/* <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.flexDiv}>
            <Typography variant="subtitle1">Status</Typography>
            &nbsp;&nbsp;
            <MuiIcon icon="info" fontSize="small" color="disabled" />
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <div
            className={
              props.formik.values.status === "on_back_order"
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <Radio
              checked={props.formik.values.status === "on_back_order"}
              onChange={handleChangeStatus}
              value="on_back_order"
              name="status"
              inputProps={{ "aria-label": "Backordered" }}
            />
            Backordered
          </div>
        </Grid>
        <Grid lg={4} md={4} sm={12} xs={12} item>
          <div
            className={
              props.formik.values.status === "in_stock"
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <Radio
              checked={props.formik.values.status === "in_stock"}
              onChange={handleChangeStatus}
              value="in_stock"
              name="status"
              inputProps={{ "aria-label": "in stock" }}
            />
            In Stock
          </div>
        </Grid>
        <Grid lg={4} md={4} sm={12} xs={12} item>
          <div
            className={
              props.formik.values.status === "out_of_stock"
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <Radio
              checked={props.formik.values.status === "out_of_stock"}
              onChange={handleChangeStatus}
              value="out_of_stock"
              name="status"
              inputProps={{ "aria-label": "out of stock" }}
            />
            Out Of Stock
          </div>
        </Grid>
      </Grid> */}
      {/* Status */}
      {/* Tags */}
      {/* <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.selectLabel}>
            <Typography variant="subtitle1">Tags</Typography>
          </div>
          <Select
            name="productTag"
            options={productOptions}
            placeholder="Type Product Name"
            multiple={true}
            disabled={true}
          />
        </Grid>
      </Grid> */}
      {/* Tags */}
      {/* Categories */}
      {/* <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.selectLabel}>
            <Typography variant="subtitle1">Categories</Typography>
          </div>
          <Select
            name="productTag"
            options={[]}
            placeholder="Type Product Name"
            multiple={true}
            disabled={true}
          />
        </Grid>
      </Grid> */}
      {/* Categories */}
      <br />
      <hr />
    </div>
  );
};
export default ProductType;
