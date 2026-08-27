import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import OrganizationInfoSection from "./OrganizationInfoSection";
import { NavBar } from "Components/Navbar";
import BrandsTable from "Components/Admin/Brands/BrandsTable";
import UsersTable from "Components/Admin/Users/UsersTable";
import BrandModal from "./BrandModal";
import UserModal from "./UserModal";
import { useModal } from "Hooks/useModal";
import { QueryPagination } from "Interfaces/QueryFilters";
import { Organization } from "Interfaces/Org";
import { useBrandsByOrganization } from "Hooks/useBrands";
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
interface Props {
  data: Organization | undefined;
}
type PartialQueryPagination = Partial<QueryPagination> & { [key: string]: string };

const ViewOrganization: React.FC<Props> = ({ data }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  // { handleSave, handleModalOpen, handleModalClose, modalOpen }
  const BrandModalKit = useModal({
    onSave: () => null
  });
  const UserModalKit = useModal({
    onSave: () => null
  });
  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setTabValue(newValue);
  };
  const [queryFilters, setQueryFilters] = React.useState<Partial<QueryPagination>>({});
  const debouncedFilters = useDebounce(queryFilters, 500);
  const { data: brands, isLoading } = useBrandsByOrganization(data?.id, debouncedFilters);
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: users, isLoading: isUsersLoading } = useUsers(debouncedParams);

  const handlePagination = (pagination: PartialQueryPagination) => {
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
      <BrandModal
        title="Add Brands"
        saveText="Add Brand"
        handleCloseModal={BrandModalKit.handleModalClose}
        handleSaveChanges={BrandModalKit.handleSave}
        openModal={BrandModalKit.modalOpen}
      />
      <UserModal
        title="Add User"
        saveText="Add User"
        handleCloseModal={UserModalKit.handleModalClose}
        handleSaveChanges={UserModalKit.handleSave}
        openModal={UserModalKit.modalOpen}
      />
      <NavBar pageTitle={`Organization No: ${data?.ein}`}>
        <div className={classes.headerButtons}>
          <Button
            text="Create Organization"
            variant="contained"
            icon={<MuiIcon icon="add" />}
            onClick={() => {
              navigate("/admin/organizations/create");
            }}
          />
        </div>
      </NavBar>
      <div style={{ padding: 30 }}>
        <Grid container>
          <div
            className={classes.customerBackDiv}
            onClick={() => navigate("/admin/organizations")}
          >
            <p>
              <MuiIcon icon="backArrow" fontSize="small" />
            </p>{" "}
            &nbsp;
            <p>Organizations</p>
          </div>
        </Grid>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          <Tab label="Organization Info" />
          <Tab label="Users" />
          <Tab label="Brands" />
        </Tabs>
        {tabValue === 0 && <OrganizationInfoSection data={data} />}
        {tabValue === 1 && (
          <div>
            <div style={{ textAlign: "right" }}>
              <Button
                icon={<MuiIcon icon="add" />}
                onClick={UserModalKit.handleModalOpen}
                text="Add Users"
                type="secondary"
              />
            </div>
            <br />
            <UsersTable
              users={users}
              isLoading={isUsersLoading}
              handlePagination={handlePagination}
            />
          </div>
        )}
        {tabValue === 2 && (
          <div>
            <div style={{ textAlign: "right" }}>
              <Button
                icon={<MuiIcon icon="add" />}
                onClick={BrandModalKit.handleModalOpen}
                text="Add Brands"
                type="secondary"
              />
            </div>
            <br />
            <BrandsTable brands={brands} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};
export default ViewOrganization;
