import { InputValueAndLabel } from "../../../../Interfaces/global";
import Button from "@mui/material/Button";
import { Link, useSearchParams } from "react-router-dom";
import {
  ButtonGroup,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid
} from "@mui/material";
import Input from "../../../../Components/Input";
import PageTitle from "../../../../Components/PageTitle";
import { websitesParamsGeneralKeys } from "../../../../Utils/queryParamKeys";
import { useState } from "react";
import { StyledTabBody } from "../../../../Components/Tabs";

const WebsiteFilters: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);
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
    websitesParamsGeneralKeys.forEach(el => {
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
          icon="/assets/icons/websites-icon.svg"
          title="Websites"
          endComponent={
            <Link to="/admin/create-website">
              <Button size="medium" variant="contained">
                Create Website
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
                <Input handleChange={handleChange} label="Title  :" name="title" />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Website URL :"
                  name="site_url"
                />
              </Grid>{" "}
            </Grid>
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default WebsiteFilters;
