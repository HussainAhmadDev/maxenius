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
import { userParmasKey } from "../../../../Utils/queryParamKeys";
import { useState } from "react";
import { StyledTabBody } from "../../../../Components/Tabs";

const UserFilters: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
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
    userParmasKey.forEach(el => {
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
          icon="/assets/icons/Mask group (1).svg"
          title="Users"
          endComponent={
            <Link to="/admin/create-user">
              <Button size="medium" variant="contained">
                Create User
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
                  label="First Name :"
                  name="first_name"
                  id="cy__fname"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Last Name :"
                  name="last_name"
                  id="cy__lname"
                />
              </Grid>{" "}
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Middle Name :"
                  name="middle_name"
                />
              </Grid>{" "}
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Email :"
                  name="email"
                  id="cy__Email"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Mobile Number :"
                  name="mobileNumber"
                  id="cy__MobileNumber"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </StyledTabBody>
    </>
  );
};

export default UserFilters;
