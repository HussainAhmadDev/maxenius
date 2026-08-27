import { useSearchParams } from "react-router-dom";
import { getBrandId } from "../../../Hooks/api";
import { useAccessLog, useReportAccessLog } from "../../../Hooks/useAccessLogs";
import { useDebounce } from "../../../Hooks/useDebounce";
import PageTitle from "../../../Components/PageTitle";
import AccessLogTable from "./Components/AccessLogTable";
import AccessLogFilter from "./Components/AccessLogFilter";
import { Box } from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import { TrendingUp } from "@mui/icons-material";

const AccessLog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const brand = getBrandId();
  const { data, isLoading } = useAccessLog(brand?.brand_id, debouncedParams);
  const isTrash: boolean = false;

  const { refetch, isLoading: isReportLoading } = useReportAccessLog(searchParams);

  const handleActionCsvReport = async () => {
    try {
      await refetch({}); // Triggers the report download
    } catch (error) {
      console.error("Error downloading the report:", error);
    }
  };

  return (
    <div>
      <PageTitle
        icon="/assets/icons/productIcon.svg"
        title="Access Logs"
        endComponent={
          <Box sx={{ display: "flex", gap: 1 }}>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleActionCsvReport}
              loading={isReportLoading}
              id="cy__GetStockStatus"
            >
              Get CSV Report
            </LoadingButton>
          </Box>
        }
      />

      <AccessLogFilter isTrash={isTrash} />
      <AccessLogTable data={data} isLoading={isLoading} />
    </div>
  );
};

export default AccessLog;
