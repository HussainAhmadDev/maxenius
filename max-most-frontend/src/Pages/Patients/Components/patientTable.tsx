import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

import DataTables from "../../../Components/DataTable";
import { PatientColumns } from "../../../Constants/PatientsConst";

import { Patient, PatientResponse } from "../../../Interfaces/patientTypes";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface UserTableProps {
  patients: PatientResponse | undefined;
  isLoading: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "view" | null;
      row: Patient | null;
    }>
  >;
}

function UserTable({ patients, isLoading, setAction }: UserTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (patients?.page || 1).toString(),
    rowsPerPage: (patients?.count || 100).toString(),
    pages: (patients?.pages || 1).toString(),
    total: (patients?.total || 0).toString()
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

  const handleView = (row: Patient) => {
    setAction({ type: "view", row });
  };

  return (
    <Card>
      <CardContent>
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
            <Typography variant="body2" fontWeight={"bold"}>
              {patients?.total} Results{" "}
            </Typography>
          </Stack>
          <SeeDocumentation
            title="Patient Listing API Documentation"
            fileName={"usePatients"}
          />
        </Stack>
      </CardContent>
      <Divider />
      <DataTables
        columns={PatientColumns({ handleView })}
        data={patients?.results?.length ? patients?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        onRowClicked={handleView}
      />
    </Card>
  );
}
export default UserTable;
