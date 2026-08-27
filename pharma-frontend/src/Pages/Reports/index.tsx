import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";
import AllReports from "Components/Reports/AllReports";
import TextInput from "Components/Form/TextInput";
import { Typography } from "@mui/material";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";
import ModalPopup from "Components/ModalPopup";
import { useNavigate } from "react-router-dom";
import { useCreateReportTemplate } from "Hooks/useReports";
import GenerateReport from "./ReportTabPages/GenerateReport";
import ProductAndExpiryReport from "./ReportTabPages/ProductAndExpiryReport";
import BatchReport from "./ReportTabPages/BatchReport";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: 22
    },
    innerContainer: {
      padding: 10,
      marginTop: "36px"
    },
    header: {
      justifyContent: "space-between",
      display: "flex"
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

export const ReportsPage = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [popupOpen, togglePopup] = React.useState(false);
  const [reportName, setReportName] = React.useState("");
  const { mutate: createReportTemplate, data: report } = useCreateReportTemplate();

  const navigate = useNavigate();

  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (report && report.id) {
      togglePopup(false);
      setTimeout(() => {
        navigate(`/reports/${report.id}`);
      }, 200);
    }
  }, [report, navigate]);

  return (
    <Layout title="Reports">
      <NavBar pageTitle="Reports"></NavBar>

      <ModalPopup
        openModal={popupOpen}
        maxWidth="sm"
        saveBtnText="Proceed"
        handleSaveChanges={() => {
          createReportTemplate({ name: reportName });
        }}
        disableSaveBtn={!reportName}
        handleCloseModal={() => {
          togglePopup(false);
        }}
        modalTitle="Create New Report"
      >
        <TextInput
          label="Report Name"
          name="name"
          type="text"
          value={reportName}
          onChange={e => setReportName(e.target.value)}
          error={!reportName}
        />
      </ModalPopup>
      <div className={classes.container}>
        <Tabs
          indicatorColor="primary"
          value={value}
          onChange={handleChangeTab}
          aria-label="report tabs"
        >
          <Tab
            style={{ fontWeight: "bold" }}
            className={value === 0 ? classes.selectedTab : classes.tab}
            label="All"
            aria-label="all reports"
          />
          <Tab
            style={{ fontWeight: "bold" }}
            className={value === 1 ? classes.selectedTab : classes.tab}
            label="Overview"
          />
          <Tab
            style={{ fontWeight: "bold" }}
            className={value === 2 ? classes.selectedTab : classes.tab}
            label="Products"
          />

          <Tab
            style={{ fontWeight: "bold" }}
            className={value === 3 ? classes.selectedTab : classes.tab}
            label="Customers"
          />
          <Tab
            style={{ fontWeight: "bold" }}
            className={value === 3 ? classes.selectedTab : classes.tab}
            label=" BATCH# DETAIL"
          />
        </Tabs>
        <div className={classes.innerContainer}>
          {value === 0 && (
            <div className={classes.header}>
              <div>
                <Typography variant="body1">Reports</Typography>
              </div>
              <div>
                <Button
                  variant="outlined"
                  text="Create Custom Report"
                  onClick={() => togglePopup(true)}
                  icon={<MuiIcon icon="equalizer" />}
                />
              </div>
            </div>
          )}
          <br />
          <div>{value === 0 && <AllReports />}</div>
          <div>
            {value === 1 && (
              <GenerateReport
                staticPath="/order/report/profit/"
                dateFilter={true}
                title=" Generate Overview"
                isRevenue={true}
              />
            )}
          </div>
          <div>{value === 2 && <ProductAndExpiryReport />}</div>
          <div>
            {value === 3 && (
              <GenerateReport
                staticPath="/customer/report/spent/"
                dateFilter={true}
                title="Customer Spent"
              />
            )}
          </div>
          <div>{value === 4 && <BatchReport />}</div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
