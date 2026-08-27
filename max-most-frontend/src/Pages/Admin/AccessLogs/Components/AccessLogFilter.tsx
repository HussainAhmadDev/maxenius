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
import { accessLogParamsGeneralKeys } from "../../../../Utils/queryParamKeys";
import { InputValueAndLabel } from "@interfaces/global";
import { StyledTabBody } from "../../../../Components/Tabs";
import SeeDocumentation from "../../../../Components/SeeDocumentation";
import DateRangePicker from "../../../../Components/DateRangePicker";
import dayjs from "dayjs";

interface AccessLogFilterProps {
  isTrash?: boolean | undefined;
}

const AccessLogFilter: React.FC<AccessLogFilterProps> = ({ isTrash }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);

  const [values, setValues] = useState<{
    range: string;
    to_from: string[];
    batch_number: string;
    first_name: string;
    last_name: string;
  }>({
    range: searchParams.get("range") || "all_time",
    to_from: [searchParams.get("from_date") || "", searchParams.get("to_date") || ""],
    batch_number: searchParams.get("batch_number") || "",
    first_name: searchParams.get("first_name") || "",
    last_name: searchParams.get("last_name") || ""
  });

  useEffect(() => {
    setValues({
      range: searchParams.get("range") || "all_time",
      to_from: [searchParams.get("from_date") || "", searchParams.get("to_date") || ""],
      batch_number: searchParams.get("batch_number") || "",
      first_name: searchParams.get("first_name") || "",
      last_name: searchParams.get("last_name") || ""
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
    accessLogParamsGeneralKeys.forEach(el => {
      searchParams.delete(el);
    });
    setSearchParams(searchParams);
    setKey(prevKey => prevKey + 1);
    setValues({
      range: "all_time",
      to_from: ["", ""],
      batch_number: "",
      first_name: "",
      last_name: ""
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
              {!isTrash && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="First Name:"
                      name="first_name"
                      id="cy__ProductNumber"
                      value={values.first_name}
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Last Name:"
                      name="last_name"
                      id="cy__ProductNumber"
                      value={values.last_name}
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
                </>
              )}
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

export default AccessLogFilter;
