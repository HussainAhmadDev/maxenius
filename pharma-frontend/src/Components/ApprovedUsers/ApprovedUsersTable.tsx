import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
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
    link: {
      color: theme.palette.primary.main,
      backgroundColor: "transparent",
      border: "none",
      textDecoration: "underline",
      cursor: "pointer"
    },
    dBlock: {
      display: "block"
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
    },
    successChip: {
      background: theme.palette.gray[1400],
      border: `0.5px solid ${theme.palette.gray[1500]}`,
      padding: "2px",
      color: theme.palette.gray[1500],
      borderRadius: "6px",
      minWidth: "70px",
      fontSize: 12
    },
    warnChip: {
      borderRadius: "6px",
      minWidth: "70px",
      background: "#FFF8E3",
      border: "0.5px solid #D9A81A",
      padding: "2px",
      color: "#D9A81A",
      fontSize: 12
    }
  })
);
const ApprovedUsersTable: React.FC<Props> = ({ isLoading }) => {
  const classes = useStyles();
  // const navigate = useNavigate();

  const columns: ColumnsProps[] = [
    {
      name: "Id",
      selector: row => `${"id"}`,
      cell: row => <p className={classes.redField}>2587</p>,
      sortable: true
    },
    {
      name: "Name",
      selector: row => `${"name"}`,
      cell: row => <p>Fname Lname</p>,
      sortable: true
    },
    {
      name: "Profession",
      selector: row => `${"profession"}`,
      cell: row => <p>Dentist</p>,
      sortable: true
    },
    {
      name: "Registration",
      selector: row => `${"registration"}`,
      cell: row => <p>12345</p>,
      sortable: true
    },
    {
      name: "Type",
      selector: row => `${"type"}`,
      cell: row => <p>Prescriber</p>,
      sortable: true
    },
    {
      name: "Email",
      selector: row => `${"email"}`,
      cell: row => <p>fname.lname@abc.com</p>,
      sortable: true
    },
    {
      name: "R. Date / Heard From ",
      selector: row => `${"heardfrom"}`,
      cell: row => (
        <p>
          23-03-20 16:04:28 <span className={classes.dBlock}>Blog</span>
        </p>
      ),
      sortable: true
    },
    {
      name: "Files",
      selector: row => `${"files"}`,
      cell: row => (
        <p>
          <button className={`${classes.dBlock} ${classes.link}`}>
            Passpoart/License
          </button>
          <button className={`${classes.dBlock} ${classes.link}`}>Utility Bills</button>
          <button className={`${classes.dBlock} ${classes.link}`}>
            Medical Insurance
          </button>
        </p>
      ),
      sortable: true
    },
    {
      name: "Status",
      selector: row => `${"status"}`,
      cell: row => <div className={classes.warnChip}>Pending</div>,
      sortable: true
    },
    {
      name: "",
      selector: row => `${""}`,
      cell: row => (
        <p>
          <Button text="Approve" type="secondary" style={{ marginBottom: "4px" }} />
          <Button text="On Hold" type="primary" />
        </p>
      ),
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
        {/* <div className={classes.flex}>
          <Button text="New PO" icon={<MuiIcon color="action" fontSize="small" icon="add" />} type="secondary" />
        </div> */}
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
export default ApprovedUsersTable;
