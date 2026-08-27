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
import PageTitle from "../../../Components/PageTitle";
import { purchaseOrderParamsGeneralKeys } from "../../../Utils/queryParamKeys";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Input from "../../../Components/Input";
import { InputValueAndLabel } from "../../../Interfaces/global";
import { purchaseOrdersStatusOptions } from "../../../Constants/PurchaseOrders";
import Checkbox from "../../../Components/Checkbox";
import SelectField from "../../../Components/SelectField";
import { useWarehouses } from "../../../Hooks/useWarehouses";
import { SelectOption } from "../../../Interfaces/ui";
import { useVendors } from "../../../Hooks/useVendors";
import { StyledTabBody } from "../../../Components/Tabs";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface PurchaseOrderFiltersProps {
  isTrash?: boolean;
}

const PurchaseOrderFilters: React.FC<PurchaseOrderFiltersProps> = ({ isTrash }) => {
  const { data: locations, isLoading: locationLoading } = useWarehouses();
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

  const locationData = useMemo(() => {
    const data: SelectOption[] = [
      {
        label: "All",
        value: ""
      }
    ];
    if (locations?.results?.length) {
      locations?.results?.map(loc => {
        data.push({
          value: loc.id,
          label: loc.name
        });
      });
    }
    return data;
  }, [locations]);

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
    purchaseOrderParamsGeneralKeys.forEach(el => {
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
          icon="/assets/icons/purchaseOrder.svg"
          title="Purchase Orders"
          endComponent={
            <Link to={"/create-purchaseOrder"}>
              <Button size="medium" variant="contained" id="cy__CreatePurchaseOrderBtn">
                Create Purchase Order
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
                  {purchaseOrdersStatusOptions.map((item, key) => (
                    <Checkbox
                      label={item.label}
                      key={key}
                      handleChange={() =>
                        handleOrderFilter({ label: "status", value: item.value })
                      }
                      id={`cy__Status${item.value}`}
                      checked={searchParams.get("status") === item.value}
                      name={"status"}
                    />
                  ))}
                </Stack>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleOrderFilter}
                  label="Purchase # :"
                  name="number"
                  type="number"
                  id="cy__PurchaseNoid"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  handleSelect={(opt, name) =>
                    handleOrderFilter({ label: name, value: opt.value })
                  }
                  name="warehouseID"
                  label="Location :"
                  options={locationData}
                  loading={locationLoading}
                  id="cy__PurchaseOrderLocation"
                />
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
                  id="cy__PurchaseOrderVendor"
                />
              </Grid>
            </Grid>
            <SeeDocumentation
              title="Purchase Order Listing API Documentation"
              fileName={"usePurchaseOrders"}
            />
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default PurchaseOrderFilters;
