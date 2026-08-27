import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Switch from "Components/Switch";
import { BrandsData } from "Interfaces/Brands";
import { BrandsResponse } from "Interfaces/Brands";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useModal } from "Hooks/useModal";
import EnableDisableModal from "./EnableDisableModal";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import IconButton from "@material-ui/core/IconButton";
import get from "lodash/get";
import Prompt from "Components/Prompt";
import { useRestoreBrand, useTrashBrand } from "Hooks/useBrands";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: BrandsData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: BrandsData) => JSX.Element;
  readonly width?: string;
}
interface Props {
  brands: BrandsResponse | undefined;
  isLoading: boolean;
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
const BrandsTable: React.FC<Props> = ({ brands, isLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [modalState, setModalState] = React.useState("");
  const [showWarning, setShowWarning] = React.useState(false);
  const [selectedBrand, setSelectedBrand] = React.useState<{
    id: string;
    name: string;
    is_trash: boolean;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      //
    }
  });
  const { mutateAsync: trashBrand } = useTrashBrand();

  const { mutateAsync: restoreBrand } = useRestoreBrand();

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    // If the value of a query param is empty string, delete it from URL
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
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
      selector: row => `${/* row?.ein || */ "-- --"}`,
      sortable: true
    },
    {
      name: "Organization",
      selector: row => `${row?.organization_id || "-- --"}`,
      width: "150px",
      cell: row => <p className={classes.redField}>{row?.organization_id || "-- --"}</p>,
      sortable: true
    },
    {
      name: "Email",
      selector: row => `${row?.email}`,
      cell: row => <p className={classes.greyField}>{row?.email || "-- --"}</p>,
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
      selector: row => `${/*row?.dateCreated || */ "-- --"}`,
      cell: row => (
        <p>{/*new Date(get(row, "created")).toLocaleDateString() || */ "-- --"}</p>
      ),
      sortable: true
    },
    {
      name: "Active",
      selector: row => `${/* row?.active ||*/ false}`,
      cell: row => (
        <Switch
          value={/*row?.active || */ false}
          handleChange={() => handleChangeSwitch(/* row?.active || */ false)}
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
            aria-label={`Delete brand ${get(row, "number", "")}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => {
              setSelectedBrand({ id: row.id, name: row.name, is_trash: row.is_trash });
              setShowWarning(true);
            }}
          >
            {row.is_trash ? <RestoreIcon /> : <DeleteIcon color="error" />}
          </IconButton>
        );
      }
    }
  ];
  const [selectedRows, setSelectedRows] = React.useState<BrandsData[]>([]);
  const pagination = {
    page: (brands?.page || 1).toString(),
    rowsPerPage: (brands?.count || 10).toString(),
    pages: (brands?.pages || 1).toString(),
    total: (brands?.total || 0).toString()
  };

  const handleChangeSwitch = (state: boolean) => {
    setModalState(state ? "Enable" : "Disable");
    handleModalOpen();
  };
  const handleRowSelection = (data: { selectedRows: BrandsData[] }) => {
    setSelectedRows(data.selectedRows);
  };
  const handleRowClicked = (id: string) => {
    navigate(`/admin/brand/${id}`);
  };
  return (
    <div>
      <Prompt
        openModal={showWarning}
        title="Delete Order"
        promptMsg={`This will ${
          selectedBrand?.is_trash ? "restore" : "trash"
        } the brand ${selectedBrand?.name}.`}
        onProceed={async () => {
          selectedBrand?.is_trash
            ? await restoreBrand({ brandId: get(selectedBrand, "id") })
            : await trashBrand({ brandId: get(selectedBrand, "id") });
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
          <span>{brands?.results?.length} results </span>
          <span className={classes.redField}>({selectedRows.length || 0} selected)</span>
        </Grid>
        <div className={classes.flex}>
          <Button text="Bulk Delete" icon={<MuiIcon icon="delete" />} type="secondary" />
        </div>
      </Grid>
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={brands?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={page => handleChange("page", `${page}`)}
        onRowChange={count => handleChange("count", `${count}`)}
        onRowSelection={handleRowSelection}
        onRowClicked={({ id }) => {
          handleRowClicked(id);
        }}
      />
    </div>
  );
};
export default BrandsTable;
