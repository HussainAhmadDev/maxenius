import { Card, Divider } from "@mui/material";
import DataTables from "../../../../Components/DataTable";
import { WarningMessageList } from "../../../../Interfaces/warningMessageType";
import { WarningColumns } from "../../../../Constants/warningConst";
import { Dispatch, SetStateAction } from "react";

interface UserTableProps {
  warningMessages: WarningMessageList[] | undefined;
  isLoading: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "view" | "edit" | "restore" | null;
      row: WarningMessageList | null;
    }>
  >;
}

function WarningMessage({ warningMessages, isLoading, setAction }: UserTableProps) {
  const handleEdit = (row: WarningMessageList) => {
    setAction({ type: "edit", row });
  };
  return (
    <Card>
      <Divider />
      <DataTables
        columns={WarningColumns({ handleEdit })}
        data={warningMessages ? warningMessages : []}
        loading={isLoading}
      />
    </Card>
  );
}
export default WarningMessage;
