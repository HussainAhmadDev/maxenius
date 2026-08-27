import {
  Button,
  Collapse,
  ButtonGroup,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from "@mui/material";
import PageTitle from "../../../../Components/PageTitle";
import { vendorsParamsGeneralKeys } from "../../../../Utils/queryParamKeys";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Input from "../../../../Components/Input";
import Checkbox from "../../../../Components/Checkbox";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import { StyledTabBody } from "../../../../Components/Tabs";

interface VendorFiltersProps {
  isTrash?: boolean;
}

const VendorFilters: React.FC<VendorFiltersProps> = ({ isTrash }) => {
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
    vendorsParamsGeneralKeys.forEach(el => {
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
          icon="/assets/icons/Mask group.svg"
          title="Vendors"
          endComponent={
            <Link to="/admin/add-vendor">
              <Button size="medium" variant="contained" id="cy__AddVendorBtn">
                Add Vendor
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
                <Input
                  handleChange={handleChange}
                  label="Name :"
                  name="name"
                  id="cy__NameField"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="City/Town :"
                  name="cityOrTown"
                  id="cy__CityTown"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Post code :"
                  name="postCode"
                  id="cy__PostCode"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Country :"
                  name="country"
                  id="cy__CountryField"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Email :"
                  name="email"
                  id="cy__EmailField"
                />
              </Grid>
              <Grid item xs={12}>
                <Checkbox
                  label="Show Active Vendors only"
                  name="search_by_active_vendor"
                  handleChange={({ label, value }) => {
                    handleChange({
                      label: label,
                      value: value ? 1 : 0
                    });
                  }}
                  checked={!!Number(searchParams.get("search_by_active_vendor"))}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default VendorFilters;
