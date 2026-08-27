import * as React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ModalInterface } from "Interfaces/ModalInterface";
import ModalPopUp from "Components/ModalPopup/";
import CreatableSelect from "react-select/creatable";
import { useFormik } from "formik";
import { BulkShipment } from "Interfaces/Order";
import DatePicker from "../Form/Date";
import { useBulkShipment } from "Hooks/useOrders";
import { isoToMarshmallow } from "Utils/Regex";
import * as yup from "yup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.text.primary,
      marginBottom: "0px",
      fontWeight: "bold"
    },
    selectlabel: {
      color: theme.palette.text.primary,
      marginBottom: "8px",
      fontWeight: "bold"
    },
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0
    },
    chip: {
      margin: theme.spacing(0.5)
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    fileIcon: {
      transform: "rotate(20deg)"
    }
  })
);

interface Option {
  label: string;
  value: string;
}

const validationSchema = yup.object({
  sku_list: yup.array().of(yup.string()).required("At least one sku is required")
  // start_date: yup.string().required("start date is required"),
  // end_date: yup.string().required("end date is required"),
  // ship_date: yup.string().required("ship date is required")
});

const AddBulkShipment: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  const { mutate: addBulkShipment, isLoading: isLoadingBulkShipment } = useBulkShipment();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {} as BulkShipment,
    onSubmit: values => {
      addBulkShipment({
        sku_list: values.sku_list,
        start_date: !values.start_date ? isoToMarshmallow(new Date()) : values.start_date,
        end_date: !values.end_date ? isoToMarshmallow(new Date()) : values.end_date,
        ship_date: !values.ship_date ? isoToMarshmallow(new Date()) : values.ship_date
      });
    }
  });

  const handleChangeCreateable = (newValue: Array<Option>, label: string) => {
    if (newValue?.length === 0) formik.setFieldValue(label, []);

    const fieldArr = newValue?.map(item => item.value);
    formik.setFieldValue(label, fieldArr);
  };

  const handleDateChange = (date: Date | null, name: string) => {
    formik.setFieldValue(name, isoToMarshmallow(date || new Date()));
  };

  return (
    <div>
      <ModalPopUp
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        disableSaveBtn={!(formik.values.sku_list?.length > 0) || isLoadingBulkShipment}
        submit="addBulkShipment"
        {...props}
      >
        <form id="addBulkShipment" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* list of sku */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <p className={classes.selectlabel}>SKUs</p>

              <CreatableSelect
                isMulti
                value={formik.values.sku_list?.map((item: string) => {
                  return { label: item, value: item };
                })}
                // @ts-expect-error fix
                onChange={value => handleChangeCreateable(value, "sku_list")}
              />
            </Grid>

            {/* Date fields */}
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <p className={classes.label}>Start Date</p>
              <DatePicker
                inputAriaLabel="end date"
                onChange={(date: Date | null) => handleDateChange(date, "start_date")}
                value={
                  formik.values.start_date
                    ? new Date(formik.values.start_date)
                    : new Date()
                }
              />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <p className={classes.label}>End Date</p>
              <DatePicker
                inputAriaLabel="end date"
                onChange={(date: Date | null) => handleDateChange(date, "end_date")}
                value={
                  formik.values.end_date ? new Date(formik.values.end_date) : new Date()
                }
              />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <p className={classes.label}>Ship Date</p>
              <DatePicker
                inputAriaLabel="ship date"
                onChange={(date: Date | null) => handleDateChange(date, "ship_date")}
                value={
                  formik.values.ship_date ? new Date(formik.values.ship_date) : new Date()
                }
              />
            </Grid>
          </Grid>
        </form>
      </ModalPopUp>
    </div>
  );
};

export default AddBulkShipment;
