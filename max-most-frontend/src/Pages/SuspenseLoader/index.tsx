import { CircularProgress, Stack } from "@mui/material";

const SuspenseLoader = () => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
    >
      <CircularProgress size={45} />
    </Stack>
  );
};

export default SuspenseLoader;
