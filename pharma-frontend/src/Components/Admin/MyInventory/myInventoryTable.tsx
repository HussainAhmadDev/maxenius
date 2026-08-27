import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import DataTable from "Components/DataTable/Table";
// import Button from "Components/Button";
// import MuiIcon from "Components/icons/MuiIcons";
// import { useModal } from "Hooks/useModal";
// import { useNavigate } from "react-router-dom";

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: string) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: string) => JSX.Element;
  readonly width?: string;
}
interface Props {
  isLoading: boolean;
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
const MyInventoryTable: React.FC<Props> = ({ isLoading }) => {
  const classes = useStyles();
  // const navigate = useNavigate();

  const columns: ColumnsProps[] = [
    {
      name: "SKU",
      selector: row => `${"SKU"}`,
      cell: row => <p className={classes.redField}>RC28265316-01</p>,
      sortable: true
    },
    {
      name: "Title",
      selector: row => `${"title"}`,
      cell: row => <p>Sample Title</p>,
      sortable: true
    },
    {
      name: "Barcode Number",
      selector: row => `${"barcode number"}`,
      cell: row => <p>Sample Date</p>,
      sortable: true
    },
    {
      name: "Retail Price",
      selector: row => `${"retail price"}`,
      cell: row => <p>Sample Price</p>,
      sortable: true
    },
    {
      name: "Purchase",
      selector: row => `${"purchase"}`,
      cell: row => <p>Sample Data</p>,
      sortable: true
    },
    {
      name: "Stock Level",
      selector: row => `${"stock level"}`,
      cell: row => <p>Sample Data</p>,
      sortable: true
    },
    {
      name: "In Open Orders",
      selector: row => `${"in open orders"}`,
      cell: row => <p>0</p>,
      sortable: true
    },
    {
      name: "Available",
      selector: row => `${"avaiable"}`,
      cell: row => <p>0</p>,
      sortable: true
    },
    {
      name: "Minimum Level",
      selector: row => `${"minimum level"}`,
      cell: row => <p>0</p>,
      sortable: true
    },
    {
      name: "Tracked",
      selector: row => `${"tracked"}`,
      cell: row => <p>Sample Data</p>,
      sortable: true
    }
  ];
  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} lg={4}>
          <span>0 results </span>
          <span className={classes.redField}>({0} selected)</span>
        </Grid>
      </Grid>
      <br />
      <DataTable
        selectableRows={true}
        columns={columns}
        data={[""]}
        showPagination
        loading={isLoading}
        pagination={undefined}
        onPageChange={() => {}}
        onRowChange={() => {}}
        onRowSelection={() => {}}
        onRowClicked={({ id }) => {}}
      />
    </div>
  );
};
export default MyInventoryTable;
