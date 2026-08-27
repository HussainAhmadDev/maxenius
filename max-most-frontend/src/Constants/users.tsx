import { TableColumn } from "react-data-table-component";
import { Box, Button, IconButton, Radio } from "@mui/material";
import { DeleteForever, ModeEdit } from "@mui/icons-material";
import { User } from "../Interfaces/usersType";
import { ukDateFormat } from "../Utils/datesFormat";

type Columns = TableColumn<User>[];

type Props = {
  handleDelete(row: User): void;
  handleView(row: User): void;
  handleResetPassword(row: User): void;
  handleRestore?(row: User): void;
  isTrash?: boolean;
};
const UsersColumns = (props: Props): Columns => {
  const { handleDelete, handleView, handleResetPassword, handleRestore, isTrash } = props;
  return [
    {
      name: "Full Name",
      sortable: true,
      cell: row => {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={() => handleView(row)}
            sx={{
              justifyContent: "start !important",
              textAlign: "left !important"
            }}
            size="small"
            id="cy__FullName"
          >
            {row.first_name} {row.last_name}
          </Button>
        );
      },
      minWidth: "140px"
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      minWidth: "190px"
    },

    {
      name: "Password",
      selector: row => row.password,
      sortable: true,
      cell: row => {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={() => handleResetPassword(row)}
            endIcon={<ModeEdit />}
            size="small"
          >
            ---
          </Button>
        );
      },
      button: true
    },
    {
      name: "Mobile Number",
      selector: row => row.mobile_phone,
      sortable: true,
      minWidth: "130px"
    },
    {
      name: "Last Login",
      selector: row => row.last_login,
      sortable: true,
      minWidth: "120px",
      format: row =>
        row?.last_login?.toString()?.toLowerCase() === "none" || !row?.last_login
          ? "---"
          : ukDateFormat(row?.last_login, false)
    },
    {
      name: "Active",
      cell({ is_active }) {
        return <Radio checked={!!is_active} size="medium" />;
      },
      button: true
    },
    {
      name: "Action",
      cell: row => {
        return isTrash && handleRestore ? (
          <IconButton onClick={() => handleRestore(row)}>
            <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleDelete(row)}>
            <DeleteForever sx={{ color: "error.main" }} />
          </IconButton>
        );
      },
      button: true
    }
  ];
};

export { UsersColumns };
