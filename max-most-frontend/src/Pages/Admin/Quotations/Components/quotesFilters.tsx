import {
  Button,
  Collapse,
  ButtonGroup,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Stack
} from "@mui/material";
import PageTitle from "../../../../Components/PageTitle";
import { quotesParamsGeneralKeys } from "../../../../Utils/queryParamKeys";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import Checkbox from "../../../../Components/Checkbox";
import SelectField from "../../../../Components/SelectField";
import { SelectOption } from "../../../../Interfaces/ui";
import { useVendors } from "../../../../Hooks/useVendors";
import { StyledTabBody } from "../../../../Components/Tabs";
import { quotesStatusOptions } from "../../../../Constants/quotesConst";

interface QuotesFiltersProps {
  isTrash?: boolean;
}

const QuotesFilters: React.FC<QuotesFiltersProps> = ({ isTrash }) => {
  const { data: suppliers, isLoading: supplierLoading } = useVendors();
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);

  const vendorsData = useMemo(() => {
    const data: SelectOption[] = [
      {
        label: "All",
        value: ""
      }
    ];
    if (suppliers?.results?.length) {
      suppliers?.results?.forEach(s => {
        data.push({
          value: s.id,
          label: s.name
        });
      });
    }
    return data;
  }, [suppliers]);

  const handleOrderFilter = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      if (value) {
        searchParams.set(label, value.toString());
      } else {
        searchParams.delete(label);
      }
      setSearchParams(searchParams);
    }
  };

  const handleReset = () => {
    quotesParamsGeneralKeys.forEach(el => {
      searchParams.delete(el);
    });
    setSearchParams(searchParams);
    setKey(key + 1);
  };

  const handleToggleFilters = () => {
    setShow(!show);
  };

  return (
    <>
      {!isTrash && (
        <PageTitle
          icon="/assets/icons/quotes-icon.svg"
          title="Quotes"
          endComponent={
            <Link to={"/admin/create-quote"}>
              <Button variant="contained" size="medium" id="cy__CreateQuoteBtn">
                Create Quote
              </Button>
            </Link>
          }
        />
      )}
      <StyledTabBody istrash={isTrash ? 1 : 0}>
        <CardHeader
          title={"Search"}
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
              <Grid item xs={12}>
                <Typography>Status :</Typography>
                <Stack
                  direction={"row"}
                  gap={1}
                  flexWrap={"wrap"}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  {quotesStatusOptions.map((item, key) => (
                    <Checkbox
                      label={item.label}
                      key={key}
                      handleChange={() =>
                        handleOrderFilter({ label: "status", value: item.value })
                      }
                      checked={searchParams.get("status") === item.value}
                      name={"status"}
                    />
                  ))}
                </Stack>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  handleSelect={(opt, name) =>
                    handleOrderFilter({ label: name, value: opt.value })
                  }
                  name="vendorID"
                  label="Vendor :"
                  options={vendorsData}
                  loading={supplierLoading}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default QuotesFilters;
