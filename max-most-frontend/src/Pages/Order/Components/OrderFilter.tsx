import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import {
  ButtonGroup,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { orderParamsGeneralKeys } from "../../../Utils/queryParamKeys";
import { InputValueAndLabel } from "../../../Interfaces/global";
import PageTitle from "../../../Components/PageTitle";
import Input from "../../../Components/Input";
import { useWebsites } from "../../../Hooks/usePatients";
import SelectField from "../../../Components/SelectField";
import { orderStatusOptions, shipmentStatusOptions } from "../../../Constants/Orders";
import { StyledTabBody } from "../../../Components/Tabs";

const OrderFilters: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  const { data: websitesResponse, isLoading: websitesFetchLoading } = useWebsites();
  const websites = useMemo(() => {
    const data = [
      {
        label: "All",
        value: "all"
      }
    ];
    if (websitesResponse?.results?.length) {
      const { results = [] } = websitesResponse;
      results?.forEach(el => {
        data.push({
          value: el.id,
          label: el?.title
        });
      });
    }
    return data;
  }, [websitesResponse]);
  const handleChange = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      if (value) {
        searchParams.set(label, value?.toString());
      } else {
        searchParams.delete(label);
      }
      setSearchParams(searchParams);
    }
  };
  const handleReset = () => {
    orderParamsGeneralKeys.forEach(el => {
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
      {!isTrash && <PageTitle icon="/assets/icons/orderIcon.svg" title="Orders" />}
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
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Website Order id :"
                  name="website_order_id"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  id="cy__OrderNoInput"
                  handleChange={handleChange}
                  label="Order number :"
                  name="order_number"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Customer name :"
                  name="company_name"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  handleSelect={(opt, name) => {
                    handleChange({
                      label: name,
                      value: opt?.value === "all" ? "" : opt.value
                    });
                  }}
                  loading={websitesFetchLoading}
                  label="Website :"
                  name="website_id"
                  options={websites}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  handleSelect={(opt, name) => {
                    handleChange({
                      label: name,
                      value: opt?.value === "all" ? "" : opt.value
                    });
                  }}
                  label="Status :"
                  name="status"
                  options={orderStatusOptions}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  handleSelect={(opt, name) => {
                    handleChange({
                      label: name,
                      value: opt?.value === "all" ? "" : opt.value
                    });
                  }}
                  label="Shipment Status :"
                  name="shipment_status"
                  options={shipmentStatusOptions}
                  id="cy__Ordershipment_status"
                />
              </Grid>

              <Grid item md={4} sm={6} xs={12}>
                <Input
                  value={searchParams.get("count")?.toString()}
                  handleChange={({ value }) => {
                    handleChange({
                      label: "count",
                      value: value
                    });
                  }}
                  label="Count :"
                  min={1}
                  name="count"
                  type="number"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default OrderFilters;
