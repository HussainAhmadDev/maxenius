import * as React from "react";
import { FormikProps } from "formik";
// import { useAddProductImage } from "Hooks/useProducts";
import { ProductData } from "../../../Interfaces/Products";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import MuiIcon from "../../icons/MuiIcons";
import TextInput from "../../Form/TextInput";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useSingleProductWebsite } from "Hooks/useProducts";
import { useWarningMessages } from "Hooks/useWarningMessage";
import { useSearchParams } from "react-router-dom";
import Select from "Components/Form/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexDiv: {
      display: "flex",
      alignItems: "center"
    },
    flex: {
      display: "flex"
    },
    selectLabel: {
      display: "flex",
      alignItems: "center",
      marginBottom: "8px"
    },
    label: {
      fontSize: "14px",
      color: theme.palette.gray[600]
    }
  })
);

interface IProps {
  data: Partial<ProductData>;
  formik: FormikProps<Partial<ProductData>>;
  setProductImage: React.Dispatch<React.SetStateAction<string>>;
  selectedWarning: { label: string; value: string };
  setSelectedWarning: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }>
  >;
}

const ProductInfo: React.FC<IProps> = props => {
  const classes = useStyles();

  const { data: singleProductList, isLoading: listLoading } = useSingleProductWebsite(
    props?.data?.sku
  );
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const translateY = Math.min(scrollY / 2, 50);

  const [searchParams] = useSearchParams();
  const { data, isLoading } = useWarningMessages(searchParams);

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Product Number</Typography>

              <TextInput
                disabled
                value={props.data.sku || ""}
                name="sku"
                onChange={props.formik.handleChange}
                type="text"
                error={props.formik.touched.sku && Boolean(props.formik.errors.sku)}
                helperText={props.formik.touched.sku && props.formik.errors.sku}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Bar code</Typography>

              <TextInput
                disabled
                value={props.data.barcode || ""}
                name="barcode"
                onChange={props.formik.handleChange}
                type="text"
                error={
                  props.formik.touched.barcode && Boolean(props.formik.errors.barcode)
                }
                helperText={props.formik.touched.barcode && props.formik.errors.barcode}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className={classes.selectLabel}>
                <Typography variant="subtitle1"> Product Name</Typography>
                &nbsp;&nbsp;
                <MuiIcon icon="info" fontSize="small" color="disabled" />
              </div>
              <TextInput
                value={props.data.name || ""}
                name="name"
                onChange={props.formik.handleChange}
                type="text"
                error={props.formik.touched.name && Boolean(props.formik.errors.name)}
                helperText={props.formik.touched.name && props.formik.errors.name}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Description</Typography>

              <TextInput
                disabled
                value={props.data.description || ""}
                name="description"
                onChange={props.formik.handleChange}
                type="number"
                isMultiline={true}
                minRows={6}
                maxRows={6}
                placeholder="Some Descriptive Text here"
                error={
                  props.formik.touched.description &&
                  Boolean(props.formik.errors.description)
                }
                helperText={
                  props.formik.touched.description && props.formik.errors.description
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Warning Message</Typography>

              <Select
                options={
                  data
                    ? data?.map(
                        (r: { id: string; message: string; warningNumber: string }) => ({
                          label: `${
                            r.warningNumber !== "None" ? r.warningNumber : ""
                          } - ${truncateString(r.message, 100)} `,
                          value: r.id
                        })
                      )
                    : []
                }
                disabled={isLoading}
                loading={isLoading}
                value={props.selectedWarning}
                name="warning_message"
                onChange={val => {
                  const itemFound = data?.find(item => item.id === val.value && item);

                  itemFound &&
                    props.setSelectedWarning({
                      label: itemFound.warningNumber + " - " + itemFound.message,
                      value: itemFound.id
                    });
                }}
              />

              {/* <TextInput
                value={props.data.warning_message || ""}
                name="warning_message"
                onChange={props.formik.handleChange}
                type="number"
                isMultiline={true}
                minRows={6}
                maxRows={6}
                placeholder="Warning Text here"
                error={
                  props.formik.touched.warning_message &&
                  Boolean(props.formik.errors.warning_message)
                }
                // inputProps={{
                //   maxLength: 70
                // }}
                helperText={
                  props.formik.touched.warning_message &&
                  props.formik.errors.warning_message
                }
              /> */}
            </Grid>
          </Grid>

          {props.children}
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12} mt={3.5}>
          {!listLoading ? (
            <List
              sx={{
                width: "100%",
                minWidth: 150,
                maxWidth: 300,
                bgcolor: "background.paper",
                position: "fixed",
                overflow: "auto",
                background: "#f1f1f1",
                borderRadius: "4px",
                paddingBottom: 0,
                maxHeight: 300,
                "& ul": { padding: 0 },
                transition: "transform 0.3s ease-out",
                transform: "translateY(50px)",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)"
              }}
              style={{ transform: `translateY(${translateY}px)` }}
              subheader={<li />}
            >
              <ListSubheader
                sx={{
                  color: "rgba(0, 0, 0, 0.87)",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                Connected Websites
              </ListSubheader>
              {singleProductList?.Websites?.map((item: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`${item}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            listLoading && <Grid>Loading...</Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ProductInfo;
