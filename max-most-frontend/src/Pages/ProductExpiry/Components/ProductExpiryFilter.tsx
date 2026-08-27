import { Card, CardContent, CardHeader, Divider, Grid } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import SelectField from "../../../Components/SelectField";
import PageTitle from "../../../Components/PageTitle";
import dayjs from "dayjs";
import DateRangePicker from "../../../Components/DateRangePicker";
import { SelectOption } from "../../../Interfaces/ui";
import { rangesOptions } from "../../../Constants/reportsConst";
import { DateRange } from "@mui/x-date-pickers-pro";
import Button from "@mui/material/Button";
import { useProductExpiry } from "../../../Hooks/useProductExpiry";
import { getBrandId } from "../../../Hooks/api";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import { ProductExpiryResponse } from "../../../Interfaces/productExpiryType";
import SeeDocumentation from "../../../Components/SeeDocumentation";

// Define the interface for the state values
interface IValues {
  date: {
    range: string;
    to_from: string[];
  };
}

const InitialState: IValues = {
  date: {
    range: "all_time",
    to_from: []
  }
};

interface IProps {
  setExpiryData: React.Dispatch<SetStateAction<ProductExpiryResponse | undefined>>;
  setIsloading: React.Dispatch<SetStateAction<boolean>>;
}

const ProductTransactionFilter: React.FC<IProps> = ({ setExpiryData, setIsloading }) => {
  const [values, setValues] = useState<IValues>(InitialState);

  // Handle changes in date range
  const handleRangeChange = (value: DateRange<dayjs.Dayjs>) => {
    setValues(prevValues => ({
      ...prevValues,
      date: {
        ...prevValues.date,
        to_from: value.map(el => (el ? dayjs(el).format("M/D/YYYY") : ""))
      }
    }));
  };

  // Handle changes in select fields
  const handleSelectChange = (opts: SelectOption[] | SelectOption, name: string) => {
    setValues(prevValues => ({
      ...prevValues,
      date: {
        ...prevValues.date,
        [name]: Array.isArray(opts) ? opts.map(el => el.value) : opts.value
      }
    }));
  };
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);
  useEffect(() => {
    if (debouncedParams) {
      submitHandler();
    }
  }, [debouncedParams]);

  const {
    mutate,
    data: expiryData,
    isLoading: expiryLoading
  } = useProductExpiry(debouncedParams);

  const submitHandler = () => {
    const brand = getBrandId();
    const activeBrand = brand?.brand_id;

    mutate({
      brand_id: activeBrand,
      date_range:
        values?.date?.range !== "custom"
          ? !["today_and_before", "all_time"].includes(values?.date?.range)
            ? dayjs(values?.date?.range).format("YYYY-MM-DD")
            : values?.date?.range
          : values?.date?.range === "custom"
            ? { startDate: values?.date?.to_from[0], endDate: values?.date?.to_from[1] }
            : "all_time"
    });
  };

  useEffect(() => {
    setIsloading(expiryLoading);
    if (expiryData) {
      setExpiryData(expiryData);
    }
  }, [expiryData, expiryLoading]);

  return (
    <>
      <PageTitle icon="/assets/icons/productTransaction.svg" title="Product Expiry" />

      <Card>
        <CardHeader
          title="Search"
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: "bold"
          }}
        />
        <Divider />

        <CardContent>
          <SeeDocumentation fileName={"useProductExpiry"} title={"See Documenation"} />
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <SelectField
                    id="cy__DateRange"
                    label="Date Range :"
                    options={rangesOptions?.map(({ value, label }) => {
                      return {
                        label: label === "Today" ? "Today and Before" : label,
                        value: label === "Today" ? "today_and_before" : value
                      };
                    })}
                    name="range"
                    handleSelect={opts => handleSelectChange(opts, "range")}
                    value={values.date.range}
                  />
                </Grid>
                {values.date.range === "custom" && (
                  <Grid item md={12} sm={12} xs={12}>
                    <DateRangePicker
                      id="cy__CustomeDatePicker"
                      label="From - To:"
                      value={[
                        values.date.to_from[0] ? dayjs(values.date.to_from[0]) : null,
                        values.date.to_from[1] ? dayjs(values.date.to_from[1]) : null
                      ]}
                      onAccept={handleRangeChange}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          <div style={{ marginTop: "4%" }}>
            <Button
              variant="contained"
              id="basic-button"
              aria-haspopup="true"
              onClick={submitHandler}
              data-cy="cy__ExpiryBtn"
            >
              Get Expiry Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductTransactionFilter;
