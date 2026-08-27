import * as React from "react";
import { Typography, IconButton } from "@mui/material";
import { Divider, Drawer, Stack, styled } from "@mui/material";
import Tabs from "../../../Components/Tabs";
import PatientInformation from "./PatientInformation";
import PatientHistory from "./PatientHistory";
import { Close } from "@mui/icons-material";
import { PatientData } from "../../../Interfaces/Orders";
import { Website } from "../../../Interfaces/Company";
import { usePatient } from "../../../Hooks/usePatients";

interface PatientsDrawerProps {
  open: boolean;
  onClose(): void;
  row?: PatientData;
  selectedSite?: Website;
}

const PatientDrawer: React.FC<PatientsDrawerProps> = props => {
  const { onClose, open, row, selectedSite } = props;
  const { data, isLoading: isPatientLoading } = usePatient(
    selectedSite?.site_url,
    selectedSite?.authorization_key,
    open ? row?.id : undefined
  );

  const info: PatientData | null | undefined = React.useMemo(() => {
    if (data?.results?.length) {
      return data.results?.[0];
    } else {
      return null;
    }
  }, [data]);

  return (
    <StyledDrawer anchor="right" open={open} onClose={() => onClose()}>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
        <Typography fontSize={20} fontWeight={"bold"} variant="h3">
          Patient ID:
        </Typography>
        <Typography fontSize={20} fontWeight={"bold"} variant="h3">
          {row?.id || "----"}
        </Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Tabs
        list={[
          {
            title: "Patient information",
            comp: <PatientInformation row={info} loading={isPatientLoading} />
          },
          {
            title: "History",
            comp: (
              <PatientHistory
                loading={isPatientLoading}
                mode="view"
                selectedSite={selectedSite}
                patientId={row?.id}
              />
            )
          }
        ]}
        noshadow
      />
    </StyledDrawer>
  );
};

const StyledDrawer = styled(Drawer)(({
  theme: {
    shape: { borderRadius }
  }
}) => {
  const spaceFromTop = 67;
  return {
    ".MuiDrawer-paper": {
      marginTop: spaceFromTop,
      height: `calc(100% - ${spaceFromTop}px)`,
      width: "100%",
      maxWidth: "500px",
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      boxShadow: "0px 4px 29.3px 0px #0000001A",
      padding: "18px"
    }
  };
});

export default PatientDrawer;
