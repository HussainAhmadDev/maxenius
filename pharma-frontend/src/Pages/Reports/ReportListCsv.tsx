import * as React from "react";
import Layout from "Components/layout";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "Components/Navbar";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";
import { Grid, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import TextInput from "Components/Form/TextInput";
import DataTable from "Components/DataTable/Table";
import Select from "Components/Form/Select";
import { useParams } from "react-router-dom";
import { API_URL, getAccessToken } from "Hooks/api";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: 22
    },
    backArrow: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    applyText: {
      textAlign: "center"
    },
    row: {
      marginTop: "1rem",
      background: theme.palette.gray["100"],
      minHeight: "56px",
      borderRadius: "6px",
      paddingLeft: "1rem",
      border: "1px solid #E6EBEE",
      boxSizing: "border-box",
      padding: "0.5rem"
    },
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    selectButton: {
      marginTop: "10px"
    },
    tableHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      display: "flex",
      height: "35px",
      marginRight: "1rem"
    },
    tableStyle: {
      padding: "1rem 0rem 1rem 0rem",
      background: "#FFFFFF",
      border: "1px solid #E6EBEE",
      boxSizing: "border-box",
      borderRadius: "6px"
    },
    spacing: {
      paddingRight: "0.7rem"
    },
    paddingLeft: {
      paddingLeft: "0.5rem"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    selectDiv: {
      width: "100%"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    datasetBody: {
      width: "100%",
      background: theme.palette.gray[100],
      borderRadius: "6px",
      marginTop: "20px",
      padding: "25px 20px 0 20px",
      border: `1px solid ${theme.palette.gray[700]}`
    }
  })
);
interface DataProps {
  id: number;
  title: string;
  date: Date;
  columnOne: string;
  columnTwo: string;
  numericColumnOne: number;
  columnThree: string;
  numericColumnTwo: number;
}
interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  cell?: (row: DataProps) => JSX.Element;
  readonly selector?: (row: DataProps) => string | React.ReactNode | undefined;
}

const csvReportList = [
  {
    id: 1,
    title: "Cell Value",
    date: new Date(),
    columnOne: "Cell Value",
    columnTwo: "Cell Value",
    numericColumnOne: 123556,
    columnThree: "Cell Value",
    numericColumnTwo: 128556
  },
  {
    id: 2,
    title: "Cell Value",
    date: new Date(),
    columnOne: "Cell Value",
    columnTwo: "Cell Value",
    numericColumnOne: 123556,
    columnThree: "Cell Value",
    numericColumnTwo: 128556
  },
  {
    id: 3,
    title: "Cell Value",
    date: new Date(),
    columnOne: "Cell Value",
    columnTwo: "Cell Value",
    numericColumnOne: 123556,
    columnThree: "Cell Value",
    numericColumnTwo: 128556
  },
  {
    id: 4,
    title: "Cell Value",
    date: new Date(),
    columnOne: "Cell Value",
    columnTwo: "Cell Value",
    numericColumnOne: 123556,
    columnThree: "Cell Value",
    numericColumnTwo: 128556
  }
];

const ReportListCsv = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = React.useState("");
  const [isFileDownloading, setIsFileDownloading] = React.useState(false);
  const { id: report_template_id } = useParams<"id">();
  const pagination = {
    page: (1).toString(),
    rowsPerPage: (10).toString(),
    pages: (3).toString(),
    total: (0).toString()
  };
  const columns: ColumnsProps[] = [
    {
      name: "Main Column",
      selector: row => `${row.title}`,
      cell: row => <p className={classes.redField}>{row?.title || "-- --"}</p>,
      sortable: true
    },
    {
      name: "Date",
      selector: row => new Date(row.date).toLocaleDateString(),
      sortable: true
    },
    {
      name: "Column",
      selector: row => `${row?.columnOne}`,
      sortable: true
    },
    {
      name: "Column",
      selector: row => `${row?.columnTwo}`,
      sortable: true
    },
    {
      name: "Numeric Column",
      selector: row => `${row?.numericColumnOne}`,
      sortable: true
    },
    {
      name: "Column",
      selector: row => `${row?.columnThree}`,
      sortable: true
    },
    {
      name: "Numeric Column",
      selector: row => `${row?.numericColumnTwo}`,
      sortable: true
    }
  ];

  async function handleDownloadCSV() {
    setIsFileDownloading(true);
    const resp = await fetch(`${API_URL}/report/download/${report_template_id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    if (resp.ok) {
      const pdf = await resp.blob();
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = "item.name";
      link.click();
      link.remove();
      setIsFileDownloading(false);
    } else {
      setIsFileDownloading(false);
      toast.error("Failed to download file");
    }
  }

  return (
    <>
      <Layout title="Report csv">
        <NavBar pageTitle="Test Report Csv"></NavBar>
        <div className={classes.container}>
          <div style={{ alignItems: "center" }}>
            <Typography variant="body2">
              <div onClick={() => navigate("/reports/")} className={classes.backArrow}>
                <p>
                  <MuiIcon icon="backArrow" fontSize="small" />
                </p>{" "}
                &nbsp;
                <p>Reports</p>
              </div>
            </Typography>
          </div>

          <Grid container justifyContent="space-between">
            <Grid item xs={12} lg={2}>
              <Typography> Filters</Typography>
            </Grid>
            <Grid item xs={12} lg={2}>
              <Typography>
                {" "}
                <Button
                  text="Create Filter"
                  type="secondary"
                  icon={<MuiIcon icon="add" />}
                  onClick={() => {
                    navigate(`/reports/${report_template_id}/filter/create/`);
                  }}
                />
              </Typography>
            </Grid>
          </Grid>

          <Grid container alignItems="center" className={classes.row}>
            <Grid item xs={12} sm={12} lg={6}>
              <div className={classes.flexAlign}>
                <div className={classes.labelDiv}>
                  <p className={classes.label}>Select Filter:</p>
                </div>
                <div className={classes.selectDiv}>
                  <Select options={[]} />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <Button
                text="Edit Filter"
                type="secondary"
                icon={<MuiIcon icon="edit" fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={2} className={classes.applyText}>
              <Button text="Apply" variant="outlined" type="secondary" />
            </Grid>
          </Grid>
          <br />
          <Grid container justifyContent="space-between">
            <Grid item xs={6} sm={12} lg={2}>
              <Typography variant="body1"> Report CSV Preview</Typography>
            </Grid>
            <Grid item xs={6} sm={12} lg={2}>
              <Button
                text="Download CSV"
                type="primaryOutlined"
                icon={<MuiIcon icon="download" fontSize="small" />}
                onClick={handleDownloadCSV}
                loading={isFileDownloading}
              />
            </Grid>
          </Grid>
          <div>
            <div className={classes.datasetBody}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm={12} lg={6}>
                  <Typography variant="subtitle1">Results Preview</Typography>
                </Grid>
                <Grid item xs={12} sm={12} lg={3}>
                  <Typography className={classes.tableHeader}>
                    <span className={classes.spacing}>Search:</span>
                    <TextInput
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      ) => setSearchFilter(e.target.value)}
                      value={searchFilter}
                      name="searchFilter"
                      type="text"
                      placeholder=""
                    />
                  </Typography>
                </Grid>
              </Grid>
              <br />
            </div>
          </div>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={12} lg={12}>
              <DataTable
                // selectableRows={true}
                columns={columns}
                data={csvReportList}
                showPagination
                // loading={isLoading}
                pagination={pagination}
                // onPageChange={handlePageChange}
                // onRowChange={handleRowChange}
                // onRowSelection={handleRowSelect}
              />
            </Grid>
          </Grid>
        </div>
      </Layout>
    </>
  );
};

export default ReportListCsv;
