import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "../../../Navbar";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import AddWarehouseInfo from "./AddWarehouseInfo";
import { Form, Formik } from "formik";
import { WarehouseFormValues } from "Interfaces/Warehouse";
import {
  useCreateWarehouse,
  useUpdateWarehouse,
  useWarehouseById
} from "Hooks/useWarehouses";
import { useQueryClient } from "react-query";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex",
      color: theme.palette.gray[400],
      cursor: "pointer"
    },
    markActiveDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    iconLabel: {
      display: "flex",
      alignItems: "center"
    },
    TypeSection: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(6),
      [theme.breakpoints.down("md")]: {
        marginLeft: 0
      }
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px"
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      color: theme.palette.gray[400]
    },

    infoIcon: {
      margin: "8px",
      color: theme.palette.gray[400]
    }
  })
);
interface IProps {
  title?: string;
}

const CreateWarehouse: React.FC<IProps> = ({ title }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { id: warehouseId } = useParams<"id">();
  const { mutate: createNewWarehouse } = useCreateWarehouse();
  const { mutate: UpdateNewWarehouse } = useUpdateWarehouse({
    id: warehouseId as string
  });
  let initialValues: WarehouseFormValues = {
    name: "",
    description: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    region: "",
    post_code: "",
    country: ""
  };

  const { data, isLoading } = useWarehouseById(warehouseId as string);

  if (data) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initialValues = {
      name: data?.name,
      description: data?.description,
      address_line_1: data?.address_line_1,
      address_line_2: data?.address_line_2,
      city: data?.city,
      region: data?.region,
      post_code: data?.post_code,
      country: data?.country
    };
  }

  const createWareSchema = yup.object().shape({
    name: yup.string().required("Warehouse Name Is Required"),
    description: yup.string().required("Description Is Required"),
    address_line_1: yup.string().required("Address Line 1 Is Required"),
    address_line_2: yup.string(),
    city: yup.string().required("City or Town Is Required"),
    region: yup.string().required("Region Is Required"),
    post_code: yup.string().required("Post Code Is Required"),
    country: yup.string().required("Country Is Required")
  });
  const queryClient = useQueryClient();
  return (
    <div>
      {!isLoading && (
        <Formik
          initialValues={initialValues}
          validationSchema={createWareSchema}
          onSubmit={(values, actions) => {
            if (warehouseId) {
              UpdateNewWarehouse(
                {
                  address_line_2: values.address_line_2,
                  city: values.city,
                  name: values.name,
                  country: values.country,
                  region: values.region,
                  description: values.description,
                  post_code: values.post_code,
                  address_line_1: values.address_line_1
                },
                {
                  onSuccess: data => {
                    queryClient.invalidateQueries("warehouses");
                    navigate(`/admin/warehouses`);
                  }
                }
              );
            } else {
              createNewWarehouse(
                { ...values },
                {
                  onSuccess: data => {
                    navigate(`/admin/warehouse/view/${data.id}`);
                  }
                }
              );
            }
          }}
        >
          {({ errors, touched, values, handleChange, setFieldValue }) => (
            <Form>
              <NavBar pageTitle={title}>
                <div className={classes.headerButtons}>
                  <Button text="Cancel" type="secondary" />
                  &nbsp;
                  <Button text="Save Warehouse" variant="contained" submit="submit" />
                </div>
              </NavBar>
              <div style={{ padding: 30 }}>
                <Grid container justifyContent="space-between">
                  {/* Back Icon */}
                  <Grid container>
                    <div
                      className={classes.customerBackDiv}
                      onClick={() => navigate("/admin/warehouses")}
                    >
                      <p>
                        <MuiIcon icon="backArrow" fontSize="small" />
                      </p>{" "}
                      &nbsp;
                      <p>Warehouses</p>
                    </div>
                  </Grid>
                </Grid>
                {/* Back Icon */}
                <Grid container spacing={2}>
                  {/* Info Section */}
                  <Grid item lg={8} md={8} sm={12} xs={12}>
                    <AddWarehouseInfo
                      errors={errors}
                      values={values}
                      touched={touched}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                    />
                  </Grid>
                  {/* Info Section */}
                </Grid>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default CreateWarehouse;
