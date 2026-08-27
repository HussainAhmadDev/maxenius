import * as React from "react";
import { useParams } from "react-router-dom";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";
import Report from "Components/Reports/CreateReport";
import { useReportTemplates } from "Hooks/useReports";
import { ReportTemplate } from "Interfaces/Reports";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: 22
    },
    selectedTab: {
      backgroundColor: `${theme.palette.gray[100]} !important`,
      borderTopRightRadius: "6px !important",
      borderTopLeftRadius: "6px !important",
      color: `${theme.palette.text.primary} !important`
    },
    tab: {
      color: theme.palette.text.secondary
    }
  })
);

export const ReportPage: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams<"id">();
  const { data } = useReportTemplates();
  const report = (data && data.results.find(r => r.id === id)) || ({} as ReportTemplate);

  return (
    <Layout title="Create Report">
      <NavBar pageTitle={report?.name || ""}></NavBar>
      <div className={classes.container}>
        <Report report={report} />
      </div>
    </Layout>
  );
};

export default ReportPage;
