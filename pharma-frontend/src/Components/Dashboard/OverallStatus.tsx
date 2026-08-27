import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@mui/material";
import StatusCard from "./StatusCard";
import { BagIcon } from "Components/icons/Bag";
import { BackOrderIcon } from "Components/icons/BackOrderIcon";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useWebsitesPrescription } from "Hooks/usePatients";
import DataTable from "../../Components/DataTable/Table";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import Cancel from "@material-ui/icons/Cancel";
import { useDownloadCSV } from "Hooks/useDownloadCSV";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import { useDebounce } from "Hooks/useDebounce";
import { useBrand } from "Context/BrandContext";
import { useSearchParams } from "react-router-dom";
import { CustomersIcon } from "Components/icons";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  padding: "20px 32px 32px 20px"
};

const useStyles = makeStyles(theme => ({
  root: {
    top: "5px",
    position: "relative"
  },
  headingContainer: {
    marginBottom: "10px"
  },
  resultContainer: {
    marginBottom: "10px"
  },
  redField: {
    color: theme.palette.primary.main
  },
  iconDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  websiteTableContainer: { maxHeight: "400px", overflowY: "auto" }
}));

interface ILoader {
  readonly size?: number;
}
interface Results {
  consumer_key?: string | null;
  consumer_secret?: string | null;
  id: string;
  site_url: string;
  title: string;
  value?: string;
  label?: string;
}

interface Column<T> {
  name: string;
  selector: (row: T) => JSX.Element;
  cell?: (row: T) => JSX.Element;
  sortable: boolean;
}

//eslint-disable-next-line
const OverallStatus: React.FC<ILoader> = props => {
  const classes = useStyles();

  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedRows, setSelectedRows] = React.useState<Results[]>([]);
  const [websites, setWebsites] = React.useState<{
    count: number;
    page: number;
    pages: number;
    results: Results[];
    total: number;
  }>({
    count: 0,
    page: 0,
    pages: 0,
    results: [],
    total: 0
  });

  const { data, isLoading, refetch } = useWebsitesPrescription();

  React.useEffect(() => {
    if (data) {
      const filteredResults = data?.results?.filter(result => !result.is_trash);
      filteredResults &&
        setWebsites(prevWebsites => ({
          ...prevWebsites,
          results: filteredResults,
          count: data.count,
          pages: data.pages,
          page: data.page
        }));
    }
  }, [data]);

  const [searchParams] = useSearchParams();

  const { activeBrand, brandDetail } = useBrand();
  const debouncedParams = useDebounce(searchParams, 800);

  React.useEffect(() => {
    refetch();
  }, [activeBrand, debouncedParams, refetch]);

  const { mutate: downloadCSV, isLoading: loadingCSV } = useDownloadCSV();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };
  const handleRowSelect = (data: { selectedRows: Results[] }) =>
    setSelectedRows(data.selectedRows);

  const csvDownloadHanlder = () => {
    const siteUrlsArray = selectedRows.map(item => item.site_url);
    const websites = {
      websites: siteUrlsArray
    };
    downloadCSV(websites);
  };

  const columns: Column<{ title: string; site_url: string }>[] = [
    {
      name: "Website Name",
      selector: row => <p> {row.title}</p>,
      sortable: false
    },
    {
      name: "website URL",
      selector: row => <p>{`${row?.site_url}`}</p>,
      cell: row => <p>{row.site_url}</p>,
      sortable: false
    }
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h6">Overall Status</Typography>
      <Grid container mt={2} spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatusCard
            title="Orders"
            icon={<BagIcon />}
            buttonText="View Orders"
            routePath="orders"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatusCard
            title="Products"
            icon={<BackOrderIcon />}
            buttonText="View Products"
            routePath="products"
          />
        </Grid>
        {brandDetail?.brandSettings?.patients && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatusCard
              title="Patients"
              icon={<CustomersIcon width={30} height={30} color="gray" />}
              buttonText="View Patients"
              routePath="patients"
            />
          </Grid>
        )}

        {brandDetail?.brandSettings?.["private-prescription"] && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatusCard
              title="Private Prescription Register"
              icon={
                <NoteAddIcon
                  style={{ width: "30px", height: "30px", color: "#64748b" }}
                />
              }
              buttonText="Select Websites"
              handleOpen={handleOpen}
            />
          </Grid>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className={classes.iconDiv}>
              <Typography variant="h6" className={classes.redField}>
                Select Websites
              </Typography>
              <span onClick={handleClose}>
                <Cancel
                  color="primary"
                  style={{ color: "#F7CA2A", fontSize: "50px", cursor: "pointer" }}
                />
              </span>
            </div>
            {/* <div className={classes.headingContainer}>
            
            </div> */}
            <div className={classes.resultContainer}>
              <span>{data?.results?.length} results </span>
            </div>
            <div className={classes.websiteTableContainer}>
              <DataTable
                selectableRows={true}
                columns={columns}
                data={websites?.results}
                showPagination={false}
                loading={isLoading}
                onRowSelection={handleRowSelect}
              />
            </div>

            <Box sx={{ m: 1, position: "relative" }}>
              <Button
                text="Download CSV"
                variant="contained"
                disabled={loadingCSV || selectedRows?.length === 0 ? true : false}
                onClick={csvDownloadHanlder}
                icon={<MuiIcon icon="download" />}
              />

              {loadingCSV && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px"
                  }}
                />
              )}
            </Box>
          </Box>
        </Modal>
      </Grid>
    </div>
  );
};
export default OverallStatus;
