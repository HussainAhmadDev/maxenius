import PatientTable from "./Components/patientTable";
import { useState } from "react";
import { Patient } from "../../Interfaces/patientTypes";
import { useSearchParams } from "react-router-dom";
import PatientFilters from "./Components/patientFilters";
import { usePatients } from "../../Hooks/usePatients";
import { Website } from "../../Interfaces/Company";
import { useDebounce } from "../../Hooks/useDebounce";
import { Stack } from "@mui/material";
import PatientDrawer from "./Components/PatientsDrawer";

function Patients() {
  const [searchParams] = useSearchParams();

  const [action, setAction] = useState<{
    type: "view" | null;
    row: Patient | null;
  }>({
    row: null,
    type: null
  });
  const handleClear = () => {
    setAction({ row: null, type: null });
  };

  const [selectedSite, setSelectedSite] = useState<Website | undefined>(undefined);

  const debounced = useDebounce(searchParams, 800);
  const { data: patientList, isLoading } = usePatients(
    selectedSite?.site_url,
    selectedSite?.authorization_key,
    debounced
  );
  return (
    <>
      <Stack gap={2}>
        <PatientFilters setSelectedSite={setSelectedSite} selectedSite={selectedSite} />
        <PatientTable
          patients={patientList}
          isLoading={isLoading}
          setAction={setAction}
        />
      </Stack>
      <PatientDrawer
        onClose={handleClear}
        open={action.type === "view"}
        row={action.row!}
        selectedSite={selectedSite}
      />
    </>
  );
}
export default Patients;
