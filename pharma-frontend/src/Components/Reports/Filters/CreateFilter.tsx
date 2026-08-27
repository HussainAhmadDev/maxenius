import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@mui/material";
// import TextInput from "Components/Form/TextInput";
import OrderSelector from "./OrderSelector";
import ProductSelector from "./ProductSelector";
import CustomerSelector from "./CustomerSelector";
import Button from "Components/Button";
import { Filter } from "Interfaces/Reports";
import * as yup from "yup";
import { useFormik } from "formik";
import { useCreateFilter } from "Hooks/useReports";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexDiv: {
      display: "flex",
      width: "fit-content"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    saveButton: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    }
  })
);

const initialState = {} as Partial<Filter>;

const validationSchema = yup.object({
  name: yup.string().required("Filter name is required.")
});

const CreateFilter = () => {
  const classes = useStyles();
  const { mutate: createFilter, isLoading } = useCreateFilter();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: values => {
      createFilter(values);
    }
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container alignItems="center" xs={12} sm={12} lg={6}>
          <div className={classes.flexAlign}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Filter Name:</p>
            </div>
            {/* <TextInput
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            /> */}
          </div>
        </Grid>
        <hr />
        <OrderSelector />
        <ProductSelector />
        <CustomerSelector />
        <br />
        <hr />
        <div className={classes.saveButton}>
          <Button
            variant="contained"
            text="Save Filter"
            submit="submit"
            loading={isLoading}
          ></Button>
        </div>
      </form>
    </>
  );
};

export default CreateFilter;
