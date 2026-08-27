/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import { Stack, Box, Divider } from "@mui/material";
import Input from "../../../Components/Input";
import DataTable from "../../../Components/DataTable";
import { HistoryResponse } from "../../../Interfaces/Orders";
import { Website } from "../../../Interfaces/Company";
import { useLazyPatientHistory } from "../../../Hooks/usePatients";
import { OrderProductPatientHistoryColumns } from "../../../Constants/Orders";
import { queryStringify } from "../../../Utils/queryString";
import { toast } from "react-toastify";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface PatientHistoryProps {
  mode: "view" | "full";
  loading: boolean;
  selectedSite?: Website;
  patientId?: string;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({
  mode = "full",
  loading,
  selectedSite,
  patientId
}) => {
  const [patientHistory, setPatientHistory] = useState<HistoryResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<Record<string, string | number>>({});
  const fetchPatientHistory = useLazyPatientHistory();
  const handleChange = (key: string, value: string | number) => {
    setQuery({ ...query, [key]: value });
  };
  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const pagination = {
    page: (patientHistory?.page || 1).toString(),
    rowsPerPage: (patientHistory?.count || 100).toString(),
    pages: (patientHistory?.pages || 1).toString(),
    total: (patientHistory?.total || 0).toString()
  };
  const fetchData = useCallback(async () => {
    if (selectedSite?.site_url && selectedSite?.authorization_key && patientId) {
      setIsLoading(true);
      try {
        const searchParams = new URLSearchParams(
          queryStringify(query as Record<string, string>)
        );
        const data = await fetchPatientHistory(
          selectedSite.site_url,
          selectedSite.authorization_key || "",
          patientId,
          searchParams
        );
        setPatientHistory(data);
      } catch (error) {
        toast.error(`Error fetching patient history: ${JSON.stringify(error)}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedSite, patientId, query]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Box py={2}>
      <Typography fontSize={14} fontWeight={"medium"} variant="h3">
        Search
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack direction={"row"} gap={2} alignItems={"center"} justifyContent={"start"}>
        <Input
          label="Product name :"
          name="product_name"
          handleChange={({ label, value }) => handleChange(label, value)}
        />
        <Input
          label="Order Number :"
          name="order_number"
          handleChange={({ label, value }) => handleChange(label, value)}
        />
      </Stack>
      <Box mt={3}>
        <DataTable
          columns={OrderProductPatientHistoryColumns}
          data={patientHistory?.results || []}
          loading={isLoading || loading}
          dense={mode === "view"}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowChange={handleRowChange}
        />
      </Box>
      <SeeDocumentation
        title="See Patient History Documentation"
        fileName={"usePatientHistory"}
      />
    </Box>
  );
};

export default PatientHistory;
