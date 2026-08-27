import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { CompanyData } from "../../Interfaces/Company";
// Components
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DataTable from "../DataTable/Table";
import Button from "../Button";
import PopupNotes from "./PopupNotes";
import Chip from "@mui/material/Chip";
// Hooks
import { useModal } from "../../Hooks/useModal";
import CustomerFilters from "./PetientFilters";
import { useCompanies } from "../../Hooks/useCompanies";
import { useCreateOrder } from "../../Hooks/useOrders";
import { useDebounce } from "Hooks/useDebounce";
import get from "lodash/get";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly width?: string;
  readonly selector: (row: CompanyData) => string | React.ReactNode | undefined;
  cell?: (row: CompanyData) => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      color: theme.palette.primary.main
    },
    selectButton: {
      marginTop: "10px"
    }
  })
);

interface Props {
  readonly handleSelectCustomer?: (customer: CompanyData) => void;
}

const FilterTable: React.FC<Props> = ({ handleSelectCustomer }) => {
  const classes = useStyles();
  const [currentRow, setCurrentRow] = React.useState<string>("");
  const [currentCustomer, setCurrentCustomer] = React.useState<CompanyData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 900);
  const { data: companies, isLoading } = useCompanies(debouncedParams);
  const { mutate: createOrder } = useCreateOrder();

  const pagination = {
    page: (companies?.page || 1).toString(),
    rowsPerPage: (companies?.count || 10).toString(),
    pages: (companies?.pages || 1).toString(),
    total: (companies?.total || 0).toString()
  };

  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      if (currentCustomer) {
        createOrder({
          company_id: currentCustomer?.id,
          brand_id: currentCustomer?.brand_id || "",
          contact_id: currentCustomer?.billing_contact?.id || "",
          website_id: ""
        });
      }
    }
  });

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const columns: ColumnsProps[] = [
    {
      name: "Customer No.",
      selector: row => get(row, "number", "--"),
      cell: row => <p className={classes.redField}>{get(row, "number", "--")}</p>,
      sortable: true
    },
    {
      name: "Company Name",
      selector: row => get(row, "name", "") || "--",
      sortable: true
    },
    {
      name: "Bill To",
      selector: row => (
        <div>
          <div className={classes.redField}>
            {`${get(row, "billing_contact.user.first_name", "")} ${get(
              row,
              "billing_contact.user.last_name",
              ""
            )}`}
          </div>
        </div>
      ),
      width: "250px"
    },
    {
      name: "Ship To",
      selector: row => (
        <div>
          <div className={classes.redField}>
            {`${get(row, "shipping_contact.user.first_name", "")} ${get(
              row,
              "shipping_contact.user.last_name",
              ""
            )}`}
          </div>
        </div>
      ),
      width: "250px"
    },
    {
      name: "Type",
      sortable: true,
      selector: row => (
        <Chip
          label={get(row, "is_individual", false) ? "Individual" : "Company"}
          size="medium"
        />
      )
    },
    {
      name: "",
      selector: row => (
        <div className={classes.selectButton}>
          <Button
            text="Select"
            variant={currentRow === row?.id ? "contained" : "outlined"}
            icon={
              currentRow === row?.id ? <CheckCircleOutlineIcon /> : <CheckCircleIcon />
            }
            onClick={() => {
              setCurrentCustomer(row);
              setCurrentRow(row.id);
              handleSelectCustomer ? handleSelectCustomer(row) : handleModalOpen();
            }}
            disabled={!(row.shipping_contact && row.billing_contact)}
          />
        </div>
      )
    }
  ];

  // Sync the page number in pagination and in the URL
  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");
  React.useEffect(() => {
    if (companies?.pages && companies.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${companies.pages}`);
      setSearchParams(params);
    }
  }, [companies?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  return (
    <div>
      <PopupNotes
        companyId={currentRow}
        handleSaveChanges={handleSave}
        handleCloseModal={() => {
          setCurrentCustomer(undefined);
          setCurrentRow("");
          handleModalClose();
        }}
        openModal={modalOpen}
        saveText="Confirm and create order"
        title="Add Popup Notes"
      />
      <CustomerFilters header={true} />
      <br />
      <DataTable
        loading={isLoading}
        columns={columns}
        data={companies?.results}
        onPageChange={page => handleChange("page", `${page}`)}
        onRowChange={count => handleChange("count", `${count}`)}
        pagination={pagination}
        showPagination
      />
    </div>
  );
};

export default FilterTable;
