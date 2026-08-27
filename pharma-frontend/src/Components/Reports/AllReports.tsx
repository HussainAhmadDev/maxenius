import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";
import {
  useReportTemplates,
  useDeleteReport,
  useFilters,
  useDownloadReport
} from "Hooks/useReports";
import { ReportTemplate } from "Interfaces/Reports";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: 10,
      marginTop: "40px"
    },
    header: {
      justifyContent: "space-between",
      display: "flex"
    },
    tableCell: {
      width: "150px",
      textAlign: "center"
    },
    buttonsCell: {
      display: "flex",
      justifyContent: "flex-end"
    },
    tableCellLabel: {
      width: "150px",
      textAlign: "left",
      padding: 18
    },
    row: {
      borderBottom: `0.5px solid ${theme.palette.gray[300]}`,
      "&:hover": {
        background: " #FFFFFF",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.06)"
      }
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    }
  })
);

export const ReportsPage = () => {
  const classes = useStyles();
  const { data: reports } = useReportTemplates();

  return (
    <div>
      <table className={classes.table}>
        <tbody>
          {reports &&
            reports.results.map(report => <ReportRow key={report.id} report={report} />)}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;

const ReportRow: React.FC<{ report: ReportTemplate }> = ({ report }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { mutate: deleteReport } = useDeleteReport();
  const { data: filters } = useFilters(report.id);
  const { mutate, isLoading } = useDownloadReport(report.id, report.name);

  return (
    <tr className={classes.row} key={report.id} style={{ cursor: "pointer" }}>
      <td className={classes.tableCellLabel} onClick={() => navigate(`${report.id}`)}>
        {report.name}
      </td>
      <td className={classes.tableCell}>
        <div className={classes.buttonsCell}>
          <Button
            text="Export PDF"
            type="secondary"
            onClick={() => navigate(`/reports/pdf/${report.id}`)}
            icon={<MuiIcon icon="download" />}
            disabled
          />
          &nbsp;
          <Button
            type="secondary"
            text="Export CSV"
            onClick={mutate}
            icon={<MuiIcon icon="download" />}
            loading={isLoading}
            disabled={(filters?.total || 0) <= 0}
          />
          &nbsp;
          <Button
            text="Delete Report"
            type="secondary"
            onClick={() => deleteReport({ id: report.id })}
            icon={<MuiIcon icon="download" />}
          />
        </div>
      </td>
    </tr>
  );
};
