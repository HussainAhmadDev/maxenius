import * as React from "react";
import { UseMutateFunction } from "react-query";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";
import AddDatasetModal from "./AddDatasetModal";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@material-ui/core/IconButton";

import { useModal } from "Hooks/useModal";
import { useFilters, useDeleteFilter } from "Hooks/useReports";
import { Filter, ReportTemplate } from "Interfaces/Reports";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backArrow: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    mainHeading: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    },
    dataSet: {
      width: "100%",
      height: "100%",
      background: theme.palette.gray[100],
      border: `1px solid ${theme.palette.gray[700]} `,
      boxSizing: "border-box",
      borderRadius: "6px",
      paddingLeft: "16px",
      paddingTop: "25px",
      paddingBottom: "8px"
    },
    reportTitle: {
      fontFamily: theme.typography.fontFamily,
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "18px"
    },
    reportList: {
      fontFamily: theme.typography.fontFamily,
      fontStyle: "normal",
      fontWeight: "normal",
      color: theme.palette.text.primary
    },
    filter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "90%"
    }
  })
);
const styleObj = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "18px"
};

const subHeadingStyle = {
  fontWeight: 500,
  fontSize: 14
};

interface DatasetProps {
  filter: Filter;
  deleteFilter: UseMutateFunction<
    void,
    Error,
    {
      filterId: string;
    },
    unknown
  >;
}

function OrderDataset({ filter, deleteFilter }: DatasetProps) {
  const classes = useStyles();
  return (
    <Grid item lg={4} md={6} xs={12}>
      <div className={classes.filter}>
        {filter.field_name === "date_from" ? (
          <Typography style={{ ...styleObj, display: "inline" }}>
            Orders From : {new Date(String(filter.field_value)).toLocaleDateString()}
          </Typography>
        ) : null}
        {filter.field_name === "date_to" ? (
          <Typography style={{ ...styleObj }}>
            Orders To: {new Date(String(filter.field_value)).toLocaleDateString()}
          </Typography>
        ) : null}
        {filter.field_name === "shipped_date_from" ? (
          <Typography style={{ ...styleObj, display: "inline" }}>
            Shipped Date From :{" "}
            {new Date(String(filter.field_value)).toLocaleDateString()}
          </Typography>
        ) : null}
        {filter.field_name === "shipped_date_to" ? (
          <Typography style={{ ...styleObj }}>
            Shipped Date To: {new Date(String(filter.field_value)).toLocaleDateString()}
          </Typography>
        ) : null}
        {filter.field_name === "payment_status" ? (
          <Typography style={{ ...styleObj }}>
            Payment Status:{" "}
            {String(filter.field_value).split("_").join(" ").toUpperCase()}
          </Typography>
        ) : null}
        {filter.field_name === "shipment_status" ? (
          <Typography style={{ ...styleObj }}>
            Shipment Status:{" "}
            {String(filter.field_value).split("_").join(" ").toUpperCase()}
          </Typography>
        ) : null}
        {filter.field_name === "total_amount_from" ? (
          <Typography style={{ ...styleObj }}>
            Total From: ${Number(filter.field_value).toFixed(2)}
          </Typography>
        ) : null}
        {filter.field_name === "total_amount_to" ? (
          <Typography style={{ ...styleObj }}>
            Total To: ${Number(filter.field_value).toFixed(2)}
          </Typography>
        ) : null}
        {filter.field_name === "sku" ? (
          <Typography style={{ ...styleObj }}>
            SKUs:{" "}
            {Array.isArray(filter.field_value)
              ? filter.field_value.join(" ").toUpperCase()
              : ""}
          </Typography>
        ) : null}
        <IconButton
          style={{ padding: "5px" }}
          aria-label={"Delete Filter"}
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={() => {
            deleteFilter({ filterId: filter.id });
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </Grid>
  );
}

function CustomerDataset({ filter, deleteFilter }: DatasetProps) {
  const classes = useStyles();
  return (
    <Grid item lg={4} md={6} xs={12}>
      <div className={classes.filter}>
        {filter.field_name === "ordered_from" ? (
          <Typography style={{ ...styleObj }}>
            Orders From : {new Date(String(filter.field_value)).toLocaleDateString()}
          </Typography>
        ) : null}

        {filter.field_name === "ordered_to" ? (
          <Typography style={{ ...styleObj }}>
            Orders To: {new Date(String(filter.field_value)).toLocaleDateString()}
          </Typography>
        ) : null}
        {filter.field_name === "is_tax_exempt" ? (
          <Typography style={{ ...styleObj }}>
            Tax Exempt: {filter.field_value ? "Yes" : "NO"}
          </Typography>
        ) : null}
        <IconButton
          style={{ padding: "5px" }}
          aria-label={"Delete Filter"}
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={() => {
            deleteFilter({ filterId: filter.id });
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </Grid>
  );
}

function ProductDataset({ filter, deleteFilter }: DatasetProps) {
  const classes = useStyles();
  return (
    <Grid item lg={4} md={6} xs={12}>
      <div className={classes.filter}>
        {filter.field_name === "price_from" ? (
          <Typography style={{ ...styleObj }}>
            Total From: ${Number(filter.field_value).toFixed(2)}
          </Typography>
        ) : null}
        {filter.field_name === "price_to" ? (
          <Typography style={{ ...styleObj }}>
            Total To: ${Number(filter.field_value).toFixed(2)}
          </Typography>
        ) : null}
        {filter.field_name === "sku" ? (
          <Typography style={{ ...styleObj }}>
            SKUs:{" "}
            {Array.isArray(filter.field_value)
              ? filter.field_value.join(" ").toUpperCase()
              : ""}
          </Typography>
        ) : null}
        <IconButton
          style={{ padding: "5px" }}
          aria-label={"Delete Filter"}
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={() => {
            deleteFilter({ filterId: filter.id });
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </Grid>
  );
}
export const ReportsPage = ({ report }: { report: ReportTemplate }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });
  const { data } = useFilters(report.id);
  const { mutate: deleteFilter } = useDeleteFilter();

  const {
    productExcludeFilters,
    productIncludeFilters,
    orderExludeFilters,
    orderIncludeFilters,
    customerExludeFilters,
    customersIncludeFilters
  } = React.useMemo(() => {
    const filters = data?.results || [];
    const excludeFilters = filters.filter(f => f.exclude);
    const includeFilters = filters.filter(f => !f.exclude);

    const productExcludeFilters = excludeFilters.filter(f => f.type === "product");
    const orderExludeFilters = excludeFilters.filter(f => f.type === "order");
    const customerExludeFilters = excludeFilters.filter(f => f.type === "customer");

    const customersIncludeFilters = includeFilters.filter(f => f.type === "customer");
    const orderIncludeFilters = includeFilters.filter(f => f.type === "order");
    const productIncludeFilters = includeFilters.filter(f => f.type === "product");

    return {
      productExcludeFilters,
      productIncludeFilters,
      orderExludeFilters,
      orderIncludeFilters,
      customerExludeFilters,
      customersIncludeFilters
    };
  }, [data?.results]);

  return (
    <>
      <AddDatasetModal
        saveText="Add Filter"
        title="Add Filter"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
        reportId={report?.id}
      />
      <>
        <Typography variant="body2" style={{ cursor: "pointer" }}>
          <span onClick={() => navigate("/reports/")} className={classes.backArrow}>
            <MuiIcon icon="backArrow" fontSize="small" />
            {"  Reports"}
          </span>
        </Typography>
        <br />
        <Grid container style={{ display: "flex", alignItems: "center" }}>
          <div className={classes.mainHeading}>
            <Typography variant="h5">Data Sets</Typography>
            <Button
              text="Customize"
              type="secondary"
              onClick={handleModalOpen}
              variant="outlined"
              icon={<MuiIcon icon="edit" />}
              disabled
            />
          </div>
          <hr />
          <Grid mt={3} xs={12} lg={12} item>
            {(orderExludeFilters.length > 0 || orderIncludeFilters.length > 0) && (
              <div className={classes.dataSet}>
                {orderExludeFilters.length > 0 ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{ ...styleObj, ...subHeadingStyle }}
                      mb={2}
                    >
                      Orders (excluded)
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={12} mb={3}>
                      {orderExludeFilters.map(filter => (
                        <OrderDataset
                          filter={filter}
                          key={filter.id}
                          deleteFilter={deleteFilter}
                        />
                      ))}
                    </Grid>
                  </>
                ) : null}
                {orderIncludeFilters.length > 0 ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{ ...styleObj, ...subHeadingStyle }}
                      mb={2}
                    >
                      Orders (included)
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={12} mb={2}>
                      {orderIncludeFilters.map(filter => (
                        <OrderDataset
                          filter={filter}
                          key={filter.id}
                          deleteFilter={deleteFilter}
                        />
                      ))}
                    </Grid>
                  </>
                ) : null}
              </div>
            )}
            <br />
            {(productExcludeFilters.length > 0 || productIncludeFilters.length > 0) && (
              <div className={classes.dataSet}>
                {productExcludeFilters.length ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{ ...styleObj, ...subHeadingStyle }}
                      mb={2}
                    >
                      Products (excluded)
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={12} mb={3}>
                      {productExcludeFilters.map(filter => (
                        <ProductDataset
                          filter={filter}
                          key={filter.id}
                          deleteFilter={deleteFilter}
                        />
                      ))}
                    </Grid>
                  </>
                ) : null}
                {productIncludeFilters.length ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{ ...styleObj, ...subHeadingStyle }}
                      mb={2}
                    >
                      Products (included)
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={12} mb={2}>
                      {productIncludeFilters.map(filter => (
                        <ProductDataset
                          filter={filter}
                          key={filter.id}
                          deleteFilter={deleteFilter}
                        />
                      ))}
                    </Grid>
                  </>
                ) : null}
              </div>
            )}

            <br />
            {(customerExludeFilters.length > 0 || customersIncludeFilters.length > 0) && (
              <div className={classes.dataSet}>
                {customerExludeFilters.length ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{ ...styleObj, ...subHeadingStyle }}
                      mb={2}
                    >
                      Customers (excluded)
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={12} mb={3}>
                      {customerExludeFilters.map(filter => (
                        <CustomerDataset
                          filter={filter}
                          key={filter.id}
                          deleteFilter={deleteFilter}
                        />
                      ))}
                    </Grid>
                  </>
                ) : null}
                {customersIncludeFilters.length ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{ ...styleObj, ...subHeadingStyle }}
                      mb={2}
                    >
                      Customers (included)
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={12} mb={2}>
                      {customersIncludeFilters.map(filter => (
                        <CustomerDataset
                          filter={filter}
                          key={filter.id}
                          deleteFilter={deleteFilter}
                        />
                      ))}
                    </Grid>
                  </>
                ) : null}
              </div>
            )}
          </Grid>
          <Grid item mt={3} xs={12} lg={12}>
            <Button
              text="Add Filter"
              onClick={handleModalOpen}
              variant="outlined"
              icon={<MuiIcon icon="add" />}
            />
          </Grid>
          <Grid mt={3} xs={12} lg={12} item>
            <hr />
          </Grid>
          <Grid item mt={3} xs={12} lg={12}>
            <Button
              style={{ float: "right" }}
              text="Save Custom Report"
              variant="contained"
              submit="submit"
              disabled
            />
          </Grid>
        </Grid>
      </>
    </>
  );
};

export default ReportsPage;
