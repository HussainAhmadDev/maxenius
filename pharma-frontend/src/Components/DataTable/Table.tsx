import { Checkbox } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import DataTable from "react-data-table-component";

import { QueryPagination } from "Interfaces/QueryFilters";

import {
  CustomerFilterTableData,
  CustomerTableData,
  PaymentHistoryTableData
} from "../../Interfaces/TableInterfaces";
import { EmptyData } from "../icons/EmptyData";
import Pagination from "./Pagination";
import { PurchaseOrderData } from "Interfaces/PurchaseOrder";
import { useUser } from "Hooks/localStorageUser";

interface Column {
  readonly name: string;
  readonly sortable?: boolean;
  readonly selector?: (
    row:
      | CustomerFilterTableData
      | PaymentHistoryTableData
      | CustomerTableData
      | PurchaseOrderData
      | any,
    index?: number
  ) => any;
  cell?: (row: PurchaseOrderData | any) => JSX.Element;
}

interface Props {
  readonly columns: Column[];
  onRowClicked?(value: {
    id: string;
    id_hash?: string;
    action_id?: string;
    action_name?: string;
  }): void;
  readonly data?:
    | CustomerFilterTableData[]
    | PaymentHistoryTableData[]
    | CustomerTableData[]
    | Array<any>;
  readonly selectableRows?: boolean;
  readonly showPagination?: boolean;
  readonly onRowSelection?: (data: any) => void;
  readonly onSort?: (rowA: any, rowB: any) => void;
  readonly loading?: boolean;
  readonly onPageChange?: (page: number) => void;
  readonly onRowChange?: (count: number) => void;
  readonly pageCount?: number;
  tableStyles?: React.CSSProperties;
  selectableRowSelected?(row: any): boolean;
  clearSelectedRows?: boolean;
  pagination?: Partial<QueryPagination>;
  readonly filterTenOn?: boolean;
  readonly hideNoData?: boolean;
}

const customStyles = {
  rows: {
    style: {
      backgroundColor: "#f6f7f7",

      padding: "7px"
    },
    stripedStyle: {
      backgroundColor: "#fbfbfb"
    }
  },
  header: {
    style: {
      borderRadius: "6px 6px 0px 0px"
    }
  },
  headCells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
      background: "#F1F5F9", //This custom library styles and we are not getting theme here
      color: "#475569", //This custom library styles and we are not getting theme here
      justifyContent: "center",
      textAlign: "center",
      fontSize: "12px",
      "> div": {
        margin: "auto"
      },
      "&:nth-child(1)": {
        borderRadius: "6px 0px 0px 0px",
        paddingLeft: "10px"
      },
      "&:nth-last-child(1)": {
        borderRadius: "0px 6px 0px 0px"
      }
    }
  },
  cells: {
    style: {
      textAlign: "center",
      justifyContent: "center"
    }
  }
};

const Table: React.FC<Props> = props => {
  const {
    columns,
    data,
    selectableRows,
    showPagination,
    onRowSelection,
    onSort,
    loading,
    pagination,
    onPageChange,
    onRowChange,
    onRowClicked,
    clearSelectedRows = false,
    selectableRowSelected,
    tableStyles,
    filterTenOn,
    hideNoData
  } = props;

  const user = useUser();

  // React.useEffect(()=>{

  // },[])
  const modifiedColumns = user?.is_superuser
    ? columns
    : columns.filter(column => column.name !== "Action");

  const styles =
    tableStyles !== undefined
      ? { ...customStyles, table: { style: tableStyles } }
      : customStyles;

  return !loading ? (
    <>
      <DataTable
        highlightOnHover
        selectableRows={selectableRows}
        onSelectedRowsChange={onRowSelection}
        pointerOnHover
        columns={modifiedColumns}
        noDataComponent={
          !hideNoData ? <EmptyData /> : <p>Please add items for stock adjustment.</p>
        }
        // @ts-expect-error -Will fix the Type information later.
        data={data}
        responsive
        onSort={onSort}
        selectableRowsComponent={Checkbox}
        customStyles={styles}
        onRowClicked={row => onRowClicked?.(row)}
        clearSelectedRows={clearSelectedRows}
        selectableRowSelected={selectableRowSelected}
        striped
      />
      {showPagination && data && data?.length > 0 && (
        <Pagination
          rowsPerPage={Number.parseInt(pagination?.rowsPerPage || "10")}
          currentPage={Number.parseInt(pagination?.page || "1")}
          count={Number.parseInt(pagination?.pages || "0")}
          onPageChange={onPageChange}
          paginationValues={pagination}
          pagination={pagination}
          setRowsPerPage={onRowChange}
          filterTenOn={filterTenOn}
        />
      )}
    </>
  ) : (
    <div style={{ width: "100%", textAlign: "center", paddingTop: "30px" }}>
      <CircularProgress />
    </div>
  );
};

export default Table;
