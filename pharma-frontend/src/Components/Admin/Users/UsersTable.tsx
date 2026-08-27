import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Switch from "Components/Switch";
import { UserTableData } from "Interfaces/TableInterfaces";
import { UserData, UserResponse } from "Interfaces/User";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import ResetPassModal from "./ResetPassModal";
import { useModal } from "Hooks/useModal";
import { QueryPagination } from "Interfaces/QueryFilters";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteIcon from "@mui/icons-material/Delete";
import { get } from "lodash";
import Prompt from "Components/Prompt";
import { useForgetPassword, useRestoreUser, useTrashUser } from "Hooks/useUsers";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: UserData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: UserTableData) => JSX.Element;
  readonly width?: string;
}

interface Props {
  users?: UserResponse;
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
const UserTable: React.FC<Props> = ({ isLoading, users, handlePagination }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [userToDelete, setUserToDelete] = React.useState<{
    id: string;
    is_trash: boolean;
  }>();
  const [selectedRows, setSelectedRows] = React.useState<UserData[]>([]);
  const [showWarning, setShowWarning] = React.useState(false);
  const [selectedEditPassword, setSelectedEditPassword] = React.useState<UserData>();

  const { mutateAsync: restoreUser } = useRestoreUser();

  const { mutate } = useTrashUser();
  const deleteHandler = async (id: string) => {
    id && (await mutate({ id: id }));
  };

  const columns: ColumnsProps[] = [
    {
      name: "Full Name",
      selector: row => `${row?.first_name}`,
      cell: ({ id, first_name, middle_name, last_name }) => (
        <p onClick={() => handleRowClick(id)} className={classes.redField}>
          {first_name && !first_name?.toLowerCase().trim().includes("none")
            ? first_name
            : " "}
          {middle_name && !middle_name?.toLowerCase().trim().includes("none")
            ? middle_name
            : " "}
          {last_name && !last_name?.toLowerCase().trim().includes("none")
            ? last_name
            : " "}
        </p>
      ),
      sortable: true
    },
    {
      name: "Email",
      selector: row => `${row?.email}`,
      sortable: true
    },
    {
      name: "Password",
      selector: row => `${row.password}`,
      width: "150px",

      cell: row => (
        <div className={classes.passwordItem}>
          <p className={classes.redField}>{"--"}</p>&nbsp;&nbsp;
          <span
            onClick={() => {
              setSelectedEditPassword(row);
              handleModalOpen();
            }}
          >
            <MuiIcon fontSize="small" icon="edit" className={classes.editButton} />
          </span>
        </div>
      ),
      sortable: true
    },
    {
      name: "Mobile Number",
      selector: row => `${row.mobile_phone}`,
      cell: row => (
        <p onClick={() => handleRowClick(row?.id)} className={classes.greyField}>
          {!row?.mobile_phone || row?.mobile_phone.includes("None")
            ? "--"
            : row?.mobile_phone}
        </p>
      ),
      sortable: true
    },
    {
      name: "Last Login",
      selector: row => `${row.last_login}`,
      cell: row => (
        <p onClick={() => handleRowClick(row?.id)} className={classes.greyField}>
          {row?.last_login && !row?.last_login.includes("None")
            ? convertDate(new Date(row.last_login))
            : "--"}
        </p>
      ),
      sortable: true
    },
    {
      name: "Active",
      selector: row => `${row.is_active}`,
      cell: row => <Switch checked={!!row.is_active} disabled />,
      sortable: true
    },
    {
      name: "Action",
      selector: row => {
        return (
          <>
            <IconButton
              aria-label={`edit customer ${get(row, "number", "")}`}
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => {
                navigate(`/admin/user/${get(row, "id", "")}`);
              }}
            >
              {!row.is_trash && <EditIcon />}
            </IconButton>
            <IconButton
              aria-label={`${
                userToDelete?.is_trash ? "Restore" : "Delete"
              } customer ${get(row, "number", "")}`}
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => {
                if (row.is_trash === "False") {
                  setUserToDelete({
                    id: row.id,
                    is_trash: true
                  });
                } else {
                  setUserToDelete({
                    id: row.id,
                    is_trash: false
                  });
                }
                setShowWarning(true);
              }}
            >
              {row.is_trash === "False" ? <DeleteIcon color="error" /> : <RestoreIcon />}
            </IconButton>
          </>
        );
      }
    }
  ];

  const pagination = {
    page: (users?.page || 1).toString(),
    rowsPerPage: (users?.count || 10).toString(),
    pages: (users?.pages || 1).toString(),
    total: (users?.total || 0).toString()
  };

  const handlePageChange = (p: number) => {
    handlePagination({ page: `${p}` });
  };

  const handleRowChange = (c: number) => {
    handlePagination({ count: `${c}` });
  };

  const handleRowSelect = (data: { selectedRows: UserData[] }) => {
    setSelectedRows(data.selectedRows);
  };

  const convertDate = (date: Date): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });

  const handleRowClick = (id: string) => {
    navigate(`/admin/user/edit/${id}`);
  };
  const [searchParams] = useSearchParams();

  const istrash = searchParams.get("is_trash");

  const { mutate: sendResetLink } = useForgetPassword();

  const sendEmailHandler = (user: UserData | undefined) => {
    sendResetLink({
      email: user?.email,
      origin: window?.location?.origin + "/reset-password"
    });
    // throw new Error("Function not implemented.");
  };

  return (
    <div>
      <Prompt
        openModal={showWarning}
        title={`${istrash === "1" ? "Restore" : "Trash"} Customer`}
        promptMsg={`This will ${istrash === "1" ? "restore" : "trash"} the user.`}
        onProceed={() => {
          istrash !== "1"
            ? userToDelete?.id && deleteHandler(userToDelete?.id)
            : userToDelete?.id && restoreUser({ userID: userToDelete?.id });
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
      />
      <ResetPassModal
        title=""
        noHeader={true}
        saveText="Send Reset Link"
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        handleReset={sendEmailHandler}
        openModal={modalOpen}
        selectedEditPassword={selectedEditPassword}
      />
      {Boolean(users?.results?.length) && (
        <Grid container justifyContent="space-between">
          <Grid item xs={12} lg={4} mb={2}>
            <span>{users?.total || 0} results </span>
            <span className={classes.redField}>({selectedRows?.length} selected)</span>
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
      )}
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={users?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowSelection={handleRowSelect}
        onRowClicked={({ id }) => handleRowClick(id)}
      />
    </div>
  );
};

export default UserTable;
