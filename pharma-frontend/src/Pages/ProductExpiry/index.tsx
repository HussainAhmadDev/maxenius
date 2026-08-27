import React, { useEffect } from "react";
import Layout from "Components/layout";
import { NavBar } from "../../Components/Navbar";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ProductTable from "./ExpiryProductTable";
import { useDebounce } from "../../Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import Button from "Components/Button";
import { useProductExpiry } from "Hooks/useExpiryProduct";
import { useBrand } from "Context/BrandContext";
import ReportDateFilter from "Pages/Reports/ReportTabPages/ReportDateFilter";
import { ukDateFormat } from "Utils/datesFormat";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      padding: "40px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#F9FAFB",
      marginBottom: "20px"
    }
  })
);

const ProductExpiry = () => {
  const activeBrand = useBrand();
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const [selectedDateRange, setSelectedDateRange] = React.useState<Date | string>();
  const [customDateRange, setCustomDateRange] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  const classes = useStyles();

  // Post data to fetch expiry product data
  const {
    mutate,
    data: expiryData,
    isLoading: expiryLoading
  } = useProductExpiry(debouncedParams);

  useEffect(() => {
    submitHandler();
    //eslint-disable-next-line
  }, [debouncedParams]);

  const submitHandler = () => {
    const today = new Date();
    const changeFormat = ukDateFormat(today, false);
    const matchFormat =
      selectedDateRange &&
      selectedDateRange !== "all_time" &&
      ukDateFormat(selectedDateRange?.toString(), false);

    if (changeFormat === matchFormat) {
      mutate({
        brand_id: activeBrand.activeBrand,
        date_range: "today_and_before"
      });
    } else {
      mutate({
        brand_id: activeBrand.activeBrand,
        date_range: selectedDateRange
          ? selectedDateRange
          : customDateRange.startDate
          ? customDateRange
          : "all_time"
      });
    }
  };

  return (
    <Layout title="Product Expiry">
      <NavBar pageTitle="Product Expiry" />
      <div style={{ margin: "4%" }}>
        <div className={classes.container}>
          <div style={{ width: "80%" }}>
            <ReportDateFilter
              expiryProduct={true}
              setCustomDateRange={data => setCustomDateRange(data)}
              setSelectedDateRange={(data: Date | string) => setSelectedDateRange(data)}
            />
          </div>

          <div style={{ marginTop: "4%" }}>
            <Button
              variant="contained"
              text="Get Product Expiry"
              onClick={submitHandler}
              loading={expiryLoading}
              disabled={expiryLoading}
            />
          </div>
        </div>

        <ProductTable isLoading={expiryLoading} ExpiryData={expiryData} />
      </div>
    </Layout>
  );
};

export default ProductExpiry;
