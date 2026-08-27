import { useMemo } from "react";
import { useUser } from "../Contexts/userContext";
import { TableColumn } from "react-data-table-component";

/**
 * Custom hook to manage columns in a table, including conditional display of action columns based on user roles.
 *
 * @template T
 * @param {string[]} alloweActionColumnTo - List of roles allowed to see the action column.
 * @param {Array<TableColumn<T>>} columns - Initial columns of the table.
 * @returns {Array<TableColumn<T>>} Updated columns with conditional omission of the action column.
 */
const useColumns = <T>(
  alloweActionColumnTo: string[],
  columns: Array<TableColumn<T>>
): Array<TableColumn<T>> => {
  const { user } = useUser();

  return useMemo(() => {
    const updatedColumns = [...columns];
    const actionColumn = updatedColumns.find(
      col =>
        String(col.name)
          .trim()
          .localeCompare("action", undefined, { sensitivity: "base" }) === 0
    );
    if (actionColumn) {
      actionColumn.omit =
        !user?.is_superuser &&
        !alloweActionColumnTo.some(
          allowed => (allowed === "manager" && user?.is_manager) || allowed === "static"
        );
    }
    return updatedColumns;
  }, [columns, user, alloweActionColumnTo]);
};

export default useColumns;
