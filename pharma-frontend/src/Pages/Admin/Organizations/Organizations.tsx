import * as React from "react";
import Layout from "../../../Components/layout";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../../Components/Navbar";
import OrganizationFilters from "../../../Components/Admin/Organizations/OrganizationFilters";
import OrganizationsTable from "Components/Admin/Organizations/OrganizationTable";
import Grid from "@mui/material/Grid";
import Button from "../../../Components/Button";
import MuiIcon from "../../../Components/icons/MuiIcons";
import EnableDisableModal from "../../../Components/Admin/Organizations/EnableOrgModal";
import { useModal } from "../../../Hooks/useModal";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { OrganizationTableData } from "../../../Interfaces/TableInterfaces";
// import Switch from "../../../Components/Switch";
import { useOrganizations } from "../../../Hooks/useOrgs";
import { OrganizationQueryFilters, QueryPagination } from "Interfaces/QueryFilters";
import { useDebounce } from "Hooks/useDebounce";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    selectButton: {
      marginTop: "10px"
    },
    greyField: {
      color: theme.palette.text.secondary
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },

    passwordItem: {
      display: "flex",
      alignItems: "center",
      marginTop: "-6px"
    },
    iconAvatar: {
      marginLeft: "7px",
      width: "22px",
      height: "22px",
      marginTop: "5px"
    },
    editButton: {
      marginTop: "10px",
      color: theme.palette.text.secondary
    }
  })
);

export const AdminOrganization: React.FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [modalState, setModalState] = React.useState("");
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      //
    }
  });
  const [queryFilters, setQueryFilters] = React.useState<OrganizationQueryFilters>({
    count: "10"
  });

  const debouncedFilters = useDebounce(queryFilters, 800);
  const { data: organizations, isLoading } = useOrganizations(debouncedFilters);

  // const handleRowChange = (data: { selectedRows: OrganizationTableData[] }) => {
  //   //WE'll use this function later
  // };
  // const handleChangeSwitch = (state: boolean) => {
  //   setModalState(state ? "Enable" : "Disable");
  //   handleModalOpen();
  // };

  const handlePaginationChange = (pagination: Partial<QueryPagination>) => {
    setQueryFilters({ ...queryFilters, ...pagination });
  };

  const handleOrganizationFilters = (search: Partial<OrganizationQueryFilters>) => {
    setQueryFilters({ ...search, page: "1", count: "10" });
  };

  return (
    <Layout title="Organization">
      <NavBar pageTitle="Organizations">
        <Button
          onClick={() => navigate("/admin/organizations/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Create Organization"
        />
      </NavBar>
      <div style={{ padding: 30 }}>
        <OrganizationFilters handleOrganizationFilters={handleOrganizationFilters} />
        <div style={{ marginTop: "30px" }}>
          <EnableDisableModal
            title={modalState}
            noHeader={true}
            saveText={"Confirm " + modalState}
            handleCloseModal={handleModalClose}
            handleSaveChanges={handleSave}
            openModal={modalOpen}
          />

          <br />
          <OrganizationsTable
            isLoading={isLoading}
            organizations={organizations}
            handlePagination={handlePaginationChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrganization;
