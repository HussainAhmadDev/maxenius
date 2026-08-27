import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "Components/Button";
import DataTable from "Components/DataTable/Table";
import MuiIcon from "../icons/MuiIcons";
import { CompanyData, PatientResponse } from "Interfaces/Company";
import get from "lodash/get";
import Prompt from "Components/Prompt";
import { useRestoreCustomer, useTrashCompany } from "Hooks/useCompanies";
import { useNavigate } from "react-router-dom";
import { PatientData } from "Interfaces/Order";
import { ukDateFormat } from "Utils/datesFormat";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  cell?: (row: PatientData) => JSX.Element;
  readonly selector?: (row: PatientData) => string | React.ReactNode | undefined;
}

interface Props {
  patients?: PatientResponse | undefined;
  isLoading: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      color: theme.palette.primary.main
    },
    selectButton: {
      marginTop: "10px"
    },
    tableHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      display: "flex",
      height: "35px"
    }
  })
);

export const CustomersPage: React.FC<Props> = ({ isLoading, patients }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = React.useState<CompanyData[]>([]);
  const [customerToDelete] = React.useState<{
    id: string;
    number: string;
    is_trash: boolean;
  }>();
  const [showWarning, setShowWarning] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (patients?.page || 1).toString(),
    rowsPerPage: (patients?.count || 100).toString(),
    pages: (patients?.pages || 1).toString(),
    total: (patients?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    // If the value of a query param is empty string, delete it from URL
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleRowSelect = (data: { selectedRows: CompanyData[] }) => {
    setSelectedRows(data.selectedRows);
  };

  const website_id = searchParams.get("website_id");

  const handleRowClick = (id: string) => {
    navigate(`/Patient-details/${id}/${website_id}`);
  };

  const { mutateAsync: trashCustomer } = useTrashCompany();

  const { mutateAsync: restoreCustomer } = useRestoreCustomer();

  const columns: ColumnsProps[] = [
    {
      name: "Name",
      selector: row => (
        <p onClick={() => handleRowClick(row?.id)}>{get(row, "name", "")}</p>
      ),
      sortable: true
    },
    {
      name: "Date Of Birth",
      selector: row => `${row?.date_of_birth}`,
      cell: row => (
        <p className={classes.redField} onClick={() => handleRowClick(row?.id)}>
          {ukDateFormat(row.date_of_birth, false)}
        </p>
      ),
      sortable: true
    },
    {
      name: "Managed By",
      // selector: row => `${row?.address}`,
      cell: row => (
        <p className={classes.redField} onClick={() => handleRowClick(row?.id)}>
          {row?.prescriber}
        </p>
      ),
      sortable: true
    },
    {
      name: "Manage By Contact #",
      selector: row => `${row?.prescriber_phone}`,
      cell: row => (
        <p className={classes.redField} onClick={() => handleRowClick(row?.id)}>
          {row?.prescriber_phone}
        </p>
      ),
      sortable: true
    },
    {
      name: "Address",
      selector: row => get(row, "address", ""),
      cell: row => (
        <p onClick={() => handleRowClick(row?.id)} className={classes.redField}>
          {row.address}
        </p>
      ),
      sortable: true
    }
  ];

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (patients?.pages && patients.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${patients.pages}`);
      setSearchParams(params);
    }
  }, [patients?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  const resultCount = patients?.total || 0;
  return (
    <div>
      <Prompt
        openModal={showWarning}
        title={`${customerToDelete?.is_trash ? "Restore" : "Trash"} Customer`}
        promptMsg={`This will ${
          customerToDelete?.is_trash ? "restore" : "trash"
        } the customer number ${customerToDelete?.number}.`}
        onProceed={async () => {
          customerToDelete?.is_trash
            ? await restoreCustomer({ customerId: get(customerToDelete, "id") })
            : await trashCustomer({ customerId: get(customerToDelete, "id") });
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
      />
      {!isLoading && (
        <div className={classes.tableHeader}>
          <div>
            <span>{resultCount} results </span>
            {selectedRows?.length > 0 && (
              <span className={classes.redField}>({selectedRows?.length} selected)</span>
            )}
          </div>
          <div>
            {selectedRows?.length > 0 && (
              <Button
                icon={<MuiIcon color="action" fontSize="small" icon="delete" />}
                text="Bulk Delete"
                type="secondary"
              />
            )}
          </div>
        </div>
      )}
      <br />

      <DataTable
        selectableRows={false}
        columns={columns}
        data={patients?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={page => handleChange("page", `${page}`)}
        onRowChange={count => handleChange("count", `${count}`)}
        onRowSelection={handleRowSelect}
        onRowClicked={({ id }) => handleRowClick(id)}
      />
    </div>
  );
};

export default CustomersPage;
