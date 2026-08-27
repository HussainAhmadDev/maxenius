import { Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import React, { useState } from "react";
import UserFilters from "./Components/UserFilters";
import UserTable from "./Components/UserTable";
import UserDrawer from "./Components/UserDrawer";
import DeleteConfirmation from "./Components/DeleteConfirmation";
import { useUsers } from "../../../Hooks/useUsers";
import { User } from "../../../Interfaces/usersType";
import ResetLinkDialog from "./Components/ResetLinkDialog";
import RestoreConfirmation from "./Components/restoreConfirmation";

const Users: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: users, isLoading, refetch } = useUsers(debouncedParams, isTrash);
  const [action, setAction] = useState<{
    type: "del" | "view" | "edit" | "password-reset" | "restore" | null;
    row: User | null;
  }>({ row: null, type: null });

  const handleClear = () => {
    setAction({ row: null, type: null });
  };
  return (
    <Stack gap={2}>
      <UserFilters isTrash={isTrash} />
      <UserTable
        isLoading={isLoading}
        users={users}
        setAction={setAction}
        isTrash={isTrash}
      />
      <DeleteConfirmation
        onClose={() => {
          refetch();
          handleClear();
        }}
        open={action.type === "del"}
        row={action.row!}
      />
      <RestoreConfirmation
        onClose={() => {
          refetch();
          handleClear();
        }}
        open={action.type === "restore"}
        row={action.row!}
      />
      <UserDrawer
        onClose={handleClear}
        open={action.type === "view"}
        row={action.row!}
        onDelete={() => setAction({ ...action, type: "del" })}
        onResetPassword={() => setAction({ ...action, type: "password-reset" })}
        isTrash={isTrash}
      />
      <ResetLinkDialog
        onClose={handleClear}
        open={action.type === "password-reset"}
        row={action.row!}
      />
    </Stack>
  );
};
export default Users;
