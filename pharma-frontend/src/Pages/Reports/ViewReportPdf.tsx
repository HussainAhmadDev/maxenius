import * as React from "react";
import Layout from "Components/layout";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "Components/Navbar";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";
import { Grid, Typography } from "@material-ui/core";
import Select from "Components/Form/Select";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, getAccessToken } from "Hooks/api";
import { toast } from "react-toastify";
import { useFilters } from "Hooks/useReports";
import { Filter } from "Interfaces/Reports";

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
      height: "56px",
      borderRadius: "6px",
      paddingLeft: "1rem",
      border: "1px solid #E6EBEE",
      boxSizing: "border-box"
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
    }
  })
);

interface Option {
  label: string;
  value: string;
}

const ViewReportPdf = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: report_template_id } = useParams<"id">();
  const [isFileDownloading, setIsFileDownloading] = React.useState(false);
  const { data: filtersData } = useFilters(report_template_id || "");

  const selectFilter: Array<Option> | undefined = filtersData?.results.map(
    (filter: Filter) => {
      return {
        label: filter.field_name.split("_").join(" ").toUpperCase(),
        value: filter.id
      };
    }
  );

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
      <Layout title="Report pdf">
        <NavBar pageTitle="Test Report"></NavBar>
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
              <Typography variant="body1"> Filters</Typography>
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
                  <Select options={selectFilter || []} />
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
            <Grid item xs={12} sm={12} lg={2}>
              <Typography variant="body1"> Report PDF Preview</Typography>
            </Grid>
            <Grid item xs={12} sm={12} lg={2}>
              <Button
                text="Download PDF"
                type="primaryOutlined"
                icon={<MuiIcon icon="download" fontSize="small" />}
                onClick={handleDownloadCSV}
                loading={isFileDownloading}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container>
            <Grid item xs={12} sm={12} lg={12}></Grid>
          </Grid>
        </div>
      </Layout>
    </>
  );
};

export default ViewReportPdf;
