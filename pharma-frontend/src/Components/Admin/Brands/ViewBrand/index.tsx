import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import UserInfoSection from "./BrandInfoSection";
import { NavBar } from "../../../Navbar";
import UsersTable from "../../Users/UsersTable";
import UserFilters from "../../Users/UserFilters";
import {
  QueryPagination,
  UserPageFilters,
  UserQueryFilters
} from "Interfaces/QueryFilters";
import { useDebounce } from "Hooks/useDebounce";
import { useUsers } from "Hooks/useUsers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex",
      color: theme.palette.gray[400],
      cursor: "pointer"
    }
  })
);
type PartialQueryPagination = Partial<QueryPagination> & { [key: string]: string };

const AddCustomer: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const { id: brandId } = useParams<"id">();
  const [queryFilters, setQueryFilters] = React.useState<UserQueryFilters>({
    count: "10"
  });
  useDebounce(queryFilters, 800);
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: users, isLoading, refetch } = useUsers(debouncedParams);

  const handleUserFilters = (search: Partial<UserPageFilters>) => {
    setQueryFilters({ ...search, page: "1", count: "10" });
  };

  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePaginationChange = (pagination: PartialQueryPagination) => {
    setQueryFilters({ ...queryFilters, ...pagination });

    const paginationKey = Object.keys(pagination)[0];

    if (!paginationKey) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (pagination[paginationKey]) {
      newParams.set(paginationKey, pagination[paginationKey].toString());
    } else {
      newParams.delete(paginationKey);
    }
  };

  return (
    <div>
      <NavBar pageTitle={`Brand: ${brandId}`}>
        <div className={classes.headerButtons}>
          <Button text="Cancel" type="secondary" />
          &nbsp;
          <Button text="Save Customer" variant="contained" />
        </div>
      </NavBar>

      <div style={{ padding: 30 }}>
        <Grid container>
          <div
            className={classes.customerBackDiv}
            onClick={() => navigate("/admin/brands/")}
          >
            <p>
              <MuiIcon icon="backArrow" fontSize="small" />
            </p>{" "}
            &nbsp;
            <p>Brands</p>
          </div>
        </Grid>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          <Tab label="Brand Info" />
          <Tab label="Users" />
        </Tabs>
        {tabValue === 0 ? (
          <UserInfoSection />
        ) : (
          <div>
            <div style={{ textAlign: "right" }}>
              <Button icon={<MuiIcon icon="add" />} type="secondary" text="Add User" />
            </div>
            <UserFilters onSearch={refetch} handleUserFilters={handleUserFilters} />
            <br />
            <UsersTable
              isLoading={isLoading}
              users={users}
              handlePagination={handlePaginationChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomer;
