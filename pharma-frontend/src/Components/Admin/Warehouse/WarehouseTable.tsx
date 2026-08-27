import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Switch from "Components/Switch";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
// import { useModal } from "Hooks/useModal";
// import EnableDisableModal from "./EnableDisableModal";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import IconButton from "@material-ui/core/IconButton";
import get from "lodash/get";
import Prompt from "Components/Prompt";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WarehouseData, WarehouseResponse } from "Interfaces/Warehouse";
import { useRestoreWarehouse, useTrashWarehouse } from "Hooks/useWarehouses";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: WarehouseData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: WarehouseData) => JSX.Element;
  readonly width?: string;
}
interface Props {
  warehouses: WarehouseResponse | undefined;
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
const WarehousesTable: React.FC<Props> = ({ warehouses, isLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  // const [modalState, setModalState] = React.useState("");
  const [showWarning, setShowWarning] = React.useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<{
    id: string;
    name: string;
    is_trash: boolean;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutateAsync: trashWarehouse } = useTrashWarehouse();

  const { mutateAsync: restoreWarehouse } = useRestoreWarehouse();

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    // If the value of a query param is empty string, delete it from URL
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const isTrashFound = searchParams.get("is_trash");

  const columns: ColumnsProps[] = [
    {
      name: "Name",
      selector: row => `${row?.name}`,
      cell: row => <p className={classes.redField}>{row?.name}</p>,
      sortable: true
    },
    {
      name: "Address Line 1",
      selector: row => `${row?.address_line_1}`,
      width: "150px",
      cell: row => <p className={classes.greyField}>{row?.address_line_1 || "-- --"}</p>,
      sortable: true
    },
    {
      name: "City/Town",
      selector: row => `${row?.address_line_2}`,
      cell: row => <p className={classes.greyField}>{row?.address_line_2 || "-- --"}</p>,
      sortable: true
    },
    {
      name: "Region",
      selector: row => `${row?.region}`,
      cell: row => <p className={classes.greyField}>{row?.region || "-- --"}</p>,
      sortable: true
    },
    {
      name: "Post code",
      selector: row => `${row?.post_code}`,
      cell: row => <p className={classes.greyField}>{row?.post_code || "-- --"}</p>,
      sortable: true
    },
    {
      name: "Country",
      selector: row => `${row?.country}`,
      cell: row => <p className={classes.greyField}>{row?.country || "-- --"}</p>,
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
      selector: () => `${/* row?.active ||*/ false}`,
      cell: () => (
        <Switch
          value={/*row?.active || */ false}
          // handleChange={() => handleChangeSwitch(/* row?.active || */ false)}
          disabled
        />
      ),
      sortable: true,
      width: "80px"
    },
    {
      name: "Action",
      selector: row => {
        return (
          <IconButton
            aria-label={`Delete warehouse ${get(row, "number", "")}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => {
              setSelectedWarehouse({
                id: row.id,
                name: row.name,
                is_trash: isTrashFound ? true : false
              });
              setShowWarning(true);
            }}
          >
            {isTrashFound ? <RestoreIcon /> : <DeleteIcon color="error" />}
          </IconButton>
        );
      }
    }
  ];
  const [selectedRows, setSelectedRows] = React.useState<WarehouseData[]>([]);
  const pagination = {
    page: (warehouses?.page || 1).toString(),
    rowsPerPage: (warehouses?.count || 10).toString(),
    pages: (warehouses?.pages || 1).toString(),
    total: (warehouses?.total || 0).toString()
  };

  // const handleChangeSwitch = (state: boolean) => {
  //   setModalState(state ? "Enable" : "Disable");
  //   handleModalOpen();
  // };
  const handleRowSelection = (data: { selectedRows: WarehouseData[] }) => {
    setSelectedRows(data.selectedRows);
  };
  const handleRowClicked = (id: string) => {
    navigate(`/admin/warehouse/view/${id}`);
  };
  const isTrash = searchParams.get("is_trash");
  return (
    <div>
      <Prompt
        openModal={showWarning}
        title={isTrash === "1" ? "Restore Warehouse" : "Delete Warehouse"}
        promptMsg={`This will ${isTrash === "1" ? "restore" : "trash"} the warehouse ${
          selectedWarehouse?.name
        }.`}
        onProceed={async () => {
          selectedWarehouse?.is_trash
            ? await restoreWarehouse({ warehouseId: get(selectedWarehouse, "id") })
            : await trashWarehouse({ warehouseId: get(selectedWarehouse, "id") });
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
      />
      {/* <EnableDisableModal
        title={modalState}
        noHeader={true}
        saveText={"Confirm " + modalState}
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        openModal={modalOpen}
      /> */}
      <Grid container justifyContent="space-between">
        <Grid item xs={12} lg={4} mb={2}>
          <span>{warehouses?.total} results </span>
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
        data={warehouses?.results}
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
export default WarehousesTable;
