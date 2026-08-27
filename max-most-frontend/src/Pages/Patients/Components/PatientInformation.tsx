import React from "react";
import Typography from "@mui/material/Typography";
import { Skeleton, Grid, Divider } from "@mui/material";
import { PatientData } from "../../../Interfaces/Orders";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface PatientInformationProps {
  row?: PatientData | null;
  loading: boolean;
}

const PatientInformation: React.FC<PatientInformationProps> = ({ loading, row }) => {
  return (
    <Grid container p={1} pt={4} spacing={2}>
      <Grid item xs={6}>
        {loading ? (
          <Skeleton variant="text" width={120} />
        ) : (
          <Typography fontSize={"14px"} variant="body2" fontWeight={"bold"}>
            Basic information :
          </Typography>
        )}
        <Divider sx={{ mt: 1 }} />
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
        ) : (
          <Typography mt={3} variant="body2">
            Name
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={150} />
        ) : (
          <Typography mt={1} variant="body2" fontWeight={"bold"}>
            {row?.name}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={120} />
        ) : (
          <Typography variant="body2" mt={3}>
            Date of Birth:
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={100} />
        ) : (
          <Typography variant="body2" fontWeight={"bold"} mt={1}>
            {row?.date_of_birth}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
        ) : (
          <Typography variant="body2" mt={3}>
            Address
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={100} />
        ) : (
          <Typography variant="body2" fontWeight={"bold"} mt={1}>
            {row?.address}
          </Typography>
        )}
      </Grid>
      <Grid item xs={6}>
        {loading ? (
          <Skeleton variant="text" width={120} />
        ) : (
          <Typography variant="body2" fontWeight={"bold"} fontSize={"14px"}>
            Prescriber Detail :
          </Typography>
        )}
        <Divider sx={{ mt: 1 }} />
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
        ) : (
          <Typography mt={3} variant="body2">
            Name
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={150} />
        ) : (
          <Typography variant="body2" fontWeight={"bold"} mt={1}>
            {row?.prescriber}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={60} />
        ) : (
          <Typography variant="body2" mt={3}>
            Email Address
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={220} />
        ) : (
          <Typography variant="body2" fontWeight={"bold"} mt={1}>
            {row?.prescriber_email}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
        ) : (
          <Typography variant="body2" mt={3}>
            Phone
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" sx={{ fontSize: 20 }} width={120} />
        ) : (
          <Typography variant="body2" fontWeight={"bold"} mt={1}>
            {row?.prescriber_phone}
          </Typography>
        )}
        <SeeDocumentation
          title="Patient Detailed Documentation"
          fileName={"usePatient"}
        />
      </Grid>
    </Grid>
  );
};

export default PatientInformation;
