import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Switch from "Components/Switch";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useModal } from "Hooks/useModal";
import EnableDisableModal from "Components/Admin/Organizations/EnableOrgModal";
import { QueryPagination } from "Interfaces/QueryFilters";
import { ListOrganizationResult, Organization } from "Interfaces/Org";
import get from "lodash/get";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import IconButton from "@material-ui/core/IconButton";
import Prompt from "Components/Prompt";
import { useRestoreOrganization, useTrashOrganization } from "Hooks/useOrgs";
import { useNavigate } from "react-router-dom";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: Organization) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: Organization) => JSX.Element;
  readonly width?: string;
}

interface Props {
  organizations?: ListOrganizationResult;
  isLoading: boolean;
  handlePagination(values: Partial<QueryPagination>): void;
}

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
const OrganizationTable: React.FC<Props> = ({
  isLoading,
  organizations,
  handlePagination
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [modalState, setModalState] = React.useState("");
  const [showWarning, setShowWarning] = React.useState(false);
  const [organizationToDelete, setOrganizationToDelete] = React.useState<{
    id: string;
    name: string;
    is_trash: boolean;
  }>();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });
  const [selectedRows, setSelectedRows] = React.useState<Organization[]>();
  const { mutateAsync: trashOrgnaization } = useTrashOrganization();
  const { mutateAsync: restoreOrganization } = useRestoreOrganization();
  const pagination = {
    page: (organizations?.page || 1).toString(),
    rowsPerPage: (organizations?.count || 10).toString(),
    pages: (organizations?.pages || 1).toString(),
    total: (organizations?.total || 0).toString()
  };
  const handlePageChange = (p: number) => {
    handlePagination({ page: `${p}` });
  };

  const handleRowChange = (c: number) => {
    handlePagination({ count: `${c}` });
  };

  const columns: ColumnsProps[] = [
    {
      name: "",
      cell: row => <img height="50" width="50" src={row.logo} alt="" />,
      sortable: true,
      width: "80px"
    },
    {
      name: "Name",
      selector: row => `${row?.name}`,
      cell: row => <p className={classes.redField}>{row?.name}</p>,
      sortable: true
    },
    {
      name: "EIN",
      selector: row => `${row?.ein}`,
      sortable: true
    },
    {
      name: "Email",
      selector: row => `${row?.email}`,
      cell: row => <p className={classes.greyField}>{row?.email}</p>,
      sortable: true
    },
    {
      name: "Office Phone",
      selector: row => `${row?.office_phone}`,
      cell: row => <p className={classes.greyField}>{row?.office_phone || "-- --"}</p>,
      sortable: true
    },
    {
      name: "Date Created",
      selector: row => `${row?.created}`,
      cell: row => <p>{new Date(get(row, "created")).toLocaleDateString()}</p>,
      sortable: true
    },
    {
      name: "Brands",
      selector: row => `${row?.brands}`,
      cell: row => <p className={classes.redField}>{row?.brands || "-- --"}</p>,
      sortable: true,
      width: "80px"
    },
    {
      name: "Users",
      selector: row => `${row?.user}`,
      cell: row => <p className={classes.redField}>{row?.user || "-- --"}</p>,
      sortable: true,
      width: "80px"
    },
    {
      name: "Active",
      selector: row => `${row?.is_active}`,
      cell: row => (
        <Switch
          value={row?.is_active}
          handleChange={() => handleChangeSwitch(row?.is_active)}
          disabled
        />
      ),
      sortable: true,
      width: "80px"
    },
    {
      name: "",
      selector: row => {
        return (
          <IconButton
            aria-label={`Delete organization ${get(row, "name", "")}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => {
              setOrganizationToDelete({
                id: row.id,
                name: row.name,
                is_trash: row.is_trash
              });
              setShowWarning(true);
            }}
          >
            {row.is_trash ? <RestoreIcon /> : <DeleteIcon color="error" />}
          </IconButton>
        );
      }
    }
  ];

  const handleChangeSwitch = (state: boolean) => {
    setModalState(state ? "Enable" : "Disable");
    handleModalOpen();
  };

  const handleRowSelection = (data: { selectedRows: Organization[] }) => {
    setSelectedRows(data.selectedRows);
  };

  const handleRowClicked = (id: string) => {
    navigate(`/admin/organizations/${id}`);
  };

  return (
    <div>
      <Prompt
        openModal={showWarning}
        title="Delete Organization"
        promptMsg={`This will trash the organization ${organizationToDelete?.name}.`}
        onProceed={async () => {
          organizationToDelete?.is_trash
            ? await restoreOrganization({
                organizationId: get(organizationToDelete, "id")
              })
            : await trashOrgnaization({
                organizationId: get(organizationToDelete, "id")
              });
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
      />
      <EnableDisableModal
        title={modalState}
        noHeader={true}
        saveText={"Confirm " + modalState}
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        openModal={modalOpen}
      />
      <Grid container justifyContent="space-between">
        <Grid item xs={12} lg={4}>
          <span>{organizations?.results?.length} results </span>
          <span className={classes.redField}>({selectedRows?.length || 0} selected)</span>
        </Grid>
        <div className={classes.flex}>
          <Button
            text="Bulk Delete"
            icon={<MuiIcon icon="delete" />}
            type="secondary"
            disabled
          />
        </div>
      </Grid>
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={organizations?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowSelection={handleRowSelection}
        onRowClicked={({ id }) => {
          handleRowClicked(id);
        }}
      />
    </div>
  );
};

export default OrganizationTable;
