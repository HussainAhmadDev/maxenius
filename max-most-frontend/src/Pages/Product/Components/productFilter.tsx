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
import { productParamsGeneralKeys } from "../../../Utils/queryParamKeys";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import Input from "../../../Components/Input";
import SelectField from "../../../Components/SelectField";
import { InputValueAndLabel } from "../../../Interfaces/global";
import { useWebsites } from "../../../Hooks/usePatients";
import { StyledTabBody } from "../../../Components/Tabs";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface ProductFiltersProps {
  isTrash?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ isTrash }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
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
      results.forEach(el => {
        data.push({
          value: el.id,
          label: el.title
        });
      });
    }
    return data;
  }, [websitesResponse]);

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
    productParamsGeneralKeys.forEach(el => {
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
          icon="/assets/icons/productIcon.svg"
          title="Products"
          endComponent={
            <Link to={"/create-product"}>
              <Button size="medium" variant="contained" id="cy__CreatePurchaseOrderBtn">
                Create Product
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
                  id="cy__ProductWebsiteSelect"
                  options={websites}
                />
              </Grid>
              {!isTrash && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Product number :"
                      name="sku"
                      id="cy__ProductNumber"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Product name :"
                      name="name"
                      id="cy__ProductName"
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Input
                      handleChange={handleChange}
                      label="Barcode :"
                      name="barcode"
                      id="cy__ProductBarcode"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
          <SeeDocumentation
            title="See Filters Related Documentation"
            fileName={"useProducts"}
          />
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default ProductFilters;
