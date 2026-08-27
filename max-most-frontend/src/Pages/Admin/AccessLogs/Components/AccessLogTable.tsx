import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SeeDocumentation from "../../../../Components/SeeDocumentation";

import DataTable from "../../../../Components/DataTable";
import { AccessLogResponse } from "@interfaces/AccessLogs";
import { AccessLogColumns } from "../../../../Constants/AccessLogConst";

interface AccessLogTableProps {
  data: AccessLogResponse | undefined;
  isLoading: boolean;
}
const AccessLogTable: React.FC<AccessLogTableProps> = ({
  data,
  isLoading
}: AccessLogTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination = {
    page: (data?.page || 1).toString(),
    rowsPerPage: (data?.count || 100).toString(),
    pages: (data?.pages || 1).toString(),
    total: (data?.total || 0).toString()
  };
  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.total} Results{" "}
            </Typography>
            <SeeDocumentation
              title="See Documentation"
              fileName="useOutOfStockProducts"
            />
          </Stack>
        </CardContent>
        <Divider />
        <DataTable
          columns={AccessLogColumns()}
          data={data?.results?.length ? data?.results : []}
          loading={isLoading}
          pagination={pagination}
          onRowChange={handleRowChange}
          onPageChange={handlePageChange}
        />
      </Card>
    </>
  );
};

export default AccessLogTable;
