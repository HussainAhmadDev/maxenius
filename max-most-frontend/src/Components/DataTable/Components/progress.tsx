import { CircularProgress, Stack } from "@mui/material";

const Progress = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={180}
    >
      <CircularProgress size="3rem" />
    </Stack>
  );
};

export default Progress;
