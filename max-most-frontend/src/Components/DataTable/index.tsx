/* eslint-disable */
import Table, { TableColumn } from "react-data-table-component";
import Box from "@mui/material/Box";
import { Checkbox } from "@mui/material";
import NumberPagination from "./Components/pagenationTable";
import NoData from "./Components/noData";
import Progress from "./Components/progress";
import useColumns from "../../Hooks/useColumns";
import customStyles from "./Components/styles";

interface Pagination {
  page: string;
  rowsPerPage: string;
  pages: string;
  total: string;
}
type AllowedActionColumns = ("manager" | "staff" | "static")[];

interface DataTableProps<T, B> {
  columns: TableColumn<B>[];
  data: T[];
  loading: boolean;
  pagination?: Pagination;
  onPageChange?: (p: number) => void;
  onRowChange?: (c: number) => void;
  onRowSelection?: (selectedRows: T[]) => void;
  selectable?: boolean;
  onRowClicked?: (row: T) => void;
  dense?: boolean;
  alloweActionColumnTo?: AllowedActionColumns;
}

const selectProps = { indeterminate: (isIndeterminate: any) => isIndeterminate };
const DataTable = <T, B>({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowChange,
  onRowSelection = () => {},
  selectable,
  onRowClicked,
  dense,
  alloweActionColumnTo = []
}: DataTableProps<T, B>): JSX.Element => {
  const allowedColumns = useColumns(alloweActionColumnTo, columns);

  return (
    <Box>
      <Table
        columns={allowedColumns as unknown as TableColumn<T>[]}
        data={data}
        customStyles={customStyles}
        responsive
        onSelectedRowsChange={({ selectedRows }) => onRowSelection(selectedRows)}
        progressPending={loading}
        selectableRows={selectable}
        onRowClicked={onRowClicked}
        highlightOnHover
        noDataComponent={<NoData dense={dense} />}
        progressComponent={<Progress />}
        selectableRowsComponent={Checkbox as unknown as React.ReactNode}
        selectableRowsComponentProps={selectProps}
      />
      {pagination && (
        <NumberPagination
          rowsPerPage={Number.parseInt(pagination.rowsPerPage || "10")}
          setRowsPerPage={onRowChange}
          onPageChange={onPageChange || (() => {})}
          loading={loading}
          paginationValues={{
            page: Number(pagination.page),
            rowsPerPage: Number(pagination.rowsPerPage),
            pages: Number(pagination.pages),
            total: Number(pagination.total)
          }}
        />
      )}
    </Box>
  );
};

export default DataTable;
