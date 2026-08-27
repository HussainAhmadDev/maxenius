import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "Components/Button";
import DataTable from "Components/DataTable/Table";
import MuiIcon from "../icons/MuiIcons";
import IconButton from "@material-ui/core/IconButton";
import { CompanyData, CompanyResponse } from "Interfaces/Company";
import Chip from "@mui/material/Chip";
import get from "lodash/get";
import DeleteIcon from "@mui/icons-material/Delete";
import Prompt from "Components/Prompt";
import { useRestoreCustomer, useTrashCompany } from "Hooks/useCompanies";
import RestoreIcon from "@mui/icons-material/Restore";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  cell?: (row: CompanyData) => JSX.Element;
  readonly selector?: (row: CompanyData) => string | React.ReactNode | undefined;
}

interface Props {
  companies?: CompanyResponse;
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

export const CustomersPage: React.FC<Props> = ({ isLoading, companies }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = React.useState<CompanyData[]>([]);
  const [customerToDelete, setCustomerToDelete] = React.useState<{
    id: string;
    number: string;
    is_trash: boolean;
  }>();
  const [showWarning, setShowWarning] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (companies?.page || 1).toString(),
    rowsPerPage: (companies?.count || 100).toString(),
    pages: (companies?.pages || 1).toString(),
    total: (companies?.total || 0).toString()
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

  const handleRowClick = (id: string) => {
    navigate(`/customer-details/${id}`);
  };

  const { mutateAsync: trashCustomer } = useTrashCompany();

  const { mutateAsync: restoreCustomer } = useRestoreCustomer();

  const columns: ColumnsProps[] = [
    {
      name: "Customer No.",
      selector: row => get(row, "number", "--"),
      cell: row => (
        <p className={classes.redField} onClick={() => handleRowClick(row?.id)}>
          {get(row, "number", "--")}
        </p>
      ),
      sortable: true
    },
    {
      name: "Company Name",
      selector: row => (
        <p onClick={() => handleRowClick(row?.id)}>{get(row, "name", "")}</p>
      ),
      sortable: true
    },
    {
      name: "Bill To",
      selector: row => get(row, "billing_contact.user.email", ""),
      cell: row => (
        <p className={classes.redField} onClick={() => handleRowClick(row?.id)}>{`${get(
          row,
          "billing_contact.user.first_name",
          ""
        )} ${get(row, "billing_contact.user.last_name", "")}`}</p>
      ),
      sortable: true
    },
    {
      name: "Ship To",
      selector: row => `${row?.shipping_contact?.shipping_address?.email}`,
      cell: row => (
        <p className={classes.redField} onClick={() => handleRowClick(row?.id)}>
          {`${get(row, "shipping_contact.user.first_name", "")} ${get(
            row,
            "shipping_contact.user.last_name",
            ""
          )}`}
        </p>
      ),
      sortable: true
    },
    {
      name: "Type",
      sortable: true,
      selector: row => (
        <Chip
          onClick={() => handleRowClick(row?.id)}
          label={get(row, "is_individual", false) ? "Individual" : "Company"}
          size="medium"
        />
      )
    },
    {
      name: "",
      selector: row => {
        return (
          <>
            <IconButton
              aria-label={`edit customer ${get(row, "number", "")}`}
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => {
                navigate(`/customers/${get(row, "id", "")}`);
              }}
            >
              {!row.is_trash && <EditIcon />}
            </IconButton>
            <IconButton
              aria-label={`${row?.is_trash ? "Restore" : "Delete"} customer ${get(
                row,
                "number",
                ""
              )}`}
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => {
                setCustomerToDelete({
                  id: row.id,
                  number: row.number,
                  is_trash: row.is_trash
                });
                setShowWarning(true);
              }}
            >
              {row.is_trash ? <RestoreIcon /> : <DeleteIcon color="error" />}
            </IconButton>
          </>
        );
      }
    }
  ];

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (companies?.pages && companies.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${companies.pages}`);
      setSearchParams(params);
    }
  }, [companies?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  const resultCount = companies?.results?.length || 0;
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
        selectableRows={true}
        columns={columns}
        data={companies?.results}
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
