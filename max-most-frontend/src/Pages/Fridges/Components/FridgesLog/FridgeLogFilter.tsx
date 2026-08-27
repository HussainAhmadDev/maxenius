import {
  Button,
  Collapse,
  ButtonGroup,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Box
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Input from "../../../../Components/Input";
import { fridgeParamsGeneralKeys } from "../../../../Utils/queryParamKeys";
import { InputValueAndLabel } from "@interfaces/global";
import { StyledTabBody } from "../../../../Components/Tabs";
import SeeDocumentation from "../../../../Components/SeeDocumentation";
import DateRangePicker from "../../../../Components/DateRangePicker";
import dayjs from "dayjs";

interface ProductFiltersProps {
  isTrash?: boolean;
}

const FridgeLogFilter: React.FC<ProductFiltersProps> = ({ isTrash }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);

  const [values, setValues] = useState<{
    range: string;
    to_from: string[];
    batch_number: string;
    fridge_number: string;
  }>({
    range: searchParams.get("range") || "all_time",
    to_from: [searchParams.get("from_date") || "", searchParams.get("to_date") || ""],
    batch_number: searchParams.get("batch_number") || "",
    fridge_number: searchParams.get("fridge_number") || ""
  });

  useEffect(() => {
    setValues({
      range: searchParams.get("range") || "all_time",
      to_from: [searchParams.get("from_date") || "", searchParams.get("to_date") || ""],
      batch_number: searchParams.get("batch_number") || "",
      fridge_number: searchParams.get("fridge_number") || ""
    });
  }, [searchParams]);

  const handleChange = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      if (value) {
        searchParams.set(label, value.toString());
      } else {
        searchParams.delete(label);
      }
      setSearchParams(searchParams);
      setValues(prevValues => ({
        ...prevValues,
        [label]: value ? value.toString() : ""
      }));
    }
  };

  const handleDateRangeChange = (dates: (dayjs.Dayjs | null)[]) => {
    const formattedDates = dates.map(date =>
      date ? dayjs(date).format("YYYY-M-D") : ""
    );

    searchParams.set("from_date", formattedDates[0]);
    searchParams.set("to_date", formattedDates[1]);
    setSearchParams(searchParams);
    setValues(prevValues => ({
      ...prevValues,
      to_from: formattedDates
    }));
  };

  const handleReset = () => {
    fridgeParamsGeneralKeys.forEach(el => {
      searchParams.delete(el);
    });
    setSearchParams(searchParams);
    setKey(prevKey => prevKey + 1);
    setValues({
      range: "all_time",
      to_from: ["", ""],
      batch_number: "",
      fridge_number: ""
    });
  };

  const handleToggleFilters = () => {
    setShow(!show);
  };

  return (
    <>
      <StyledTabBody istrash={isTrash ? 1 : 0}>
        <CardHeader
          title="Search"
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
                <Input
                  handleChange={handleChange}
                  label=" Fridge Number :"
                  name="fridge_number"
                  id="cy__ProductNumber"
                  value={values.fridge_number}
                />
              </Grid>

              <Grid item md={4} sm={6} xs={12}>
                <DateRangePicker
                  label="From - To :"
                  value={[
                    values.to_from[0] ? dayjs(values.to_from[0], "YYYY-M-D") : null,
                    values.to_from[1] ? dayjs(values.to_from[1], "YYYY-M-D") : null
                  ]}
                  onAccept={handleDateRangeChange}
                  id="cy__BatchFromto"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Box sx={{ pl: 2, pb: 1 }}>
            <SeeDocumentation
              title="See Filters Related Documentation"
              fileName="Temperature Log"
            />
          </Box>
        </Collapse>
      </StyledTabBody>
      <br />
    </>
  );
};

export default FridgeLogFilter;
