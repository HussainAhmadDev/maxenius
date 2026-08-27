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
import { useState } from "react";

import Input from "../../../../Components/Input";
import { fridgeParamsGeneralKeys } from "../../../../Utils/queryParamKeys";
import { InputValueAndLabel } from "@interfaces/global";
import { StyledTabBody } from "../../../../Components/Tabs";
import SeeDocumentation from "../../../../Components/SeeDocumentation";

interface ProductFiltersProps {
  isTrash?: boolean;
}

const FridgeFilter: React.FC<ProductFiltersProps> = ({ isTrash }) => {
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
    fridgeParamsGeneralKeys.forEach(el => {
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
                  label="Fridge Number :"
                  name="fridge_number"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input handleChange={handleChange} label="Location :" name="location" />
              </Grid>
            </Grid>
          </CardContent>
          <Box sx={{ pl: 2, pb: 1 }}>
            <SeeDocumentation
              title="See Filters Related Documentation"
              fileName="useProducts"
            />
          </Box>
        </Collapse>
      </StyledTabBody>
      <br />
    </>
  );
};

export default FridgeFilter;
