import {
  Button,
  Collapse,
  ButtonGroup,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from "@mui/material";
import PageTitle from "../../../Components/PageTitle";
import { productActiveLogParamsGeneralKeys } from "../../../Utils/queryParamKeys";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Input from "../../../Components/Input";
import { InputValueAndLabel } from "../../../Interfaces/global";
import { StyledTabBody } from "../../../Components/Tabs";
import DateRangePicker from "../../../Components/DateRangePicker";
import dayjs from "dayjs";

interface ProductFiltersProps {
  isTrash?: boolean;
}

const ProductsActivityLogFilter: React.FC<ProductFiltersProps> = ({ isTrash }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);

  const handleChange = (event: InputValueAndLabel | null) => {
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
    productActiveLogParamsGeneralKeys.forEach(el => {
      searchParams.delete(el);
    });
    setSearchParams(searchParams);
    setKey(key + 1);
  };

  const handleToggleFilters = () => {
    setShow(!show);
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    const [fromDate, toDate] = dates;
    if (fromDate) {
      searchParams.set("from_date", dayjs(fromDate).format("DD-MM-YYYY"));
    } else {
      searchParams.delete("from_date");
    }
    if (toDate) {
      searchParams.set("to_date", dayjs(toDate).format("DD-MM-YYYY"));
    } else {
      searchParams.delete("to_date");
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      {!isTrash && (
        <PageTitle icon="/assets/icons/productIcon.svg" title="Products Activity Log" />
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
              {!isTrash && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Website Domain :"
                      name="website_domain"
                      id="cy__ProductWebsiteDomain"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Request By :"
                      name="request_by"
                      id="cy__RequestBy"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Inventory Item ID :"
                      name="inventory_item_id"
                      id="cy__InventoryItemId"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Platform Product ID :"
                      name="platform_product_id"
                      id="cy__PlatformProductId"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Product Name :"
                      name="product_name"
                      id="cy__ProductName"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="SKU :"
                      name="sku"
                      id="cy__ProductSKU"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Price :"
                      name="price"
                      id="cy__ProductPrice"
                      type="number"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Status :"
                      name="status"
                      id="cy__ProductStatus"
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Action :"
                      name="action"
                      id="cy__ProductAction"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <DateRangePicker
                      label="From - To :"
                      value={[
                        searchParams.get("from_date")
                          ? dayjs(searchParams.get("from_date"), "DD-MM-YYYY")
                          : null,
                        searchParams.get("to_date")
                          ? dayjs(searchParams.get("to_date"), "DD-MM-YYYY")
                          : null
                      ]}
                      onChange={handleDateRangeChange}
                      id="cy__BatchFromTo"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default ProductsActivityLogFilter;
