import { Box, Stack } from "@mui/material";

const UnderConstruction = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ height: "calc(100vh - 150px)" }}
    >
      <Box
        component={"img"}
        src="/assets/under-construction.gif"
        width={"100%"}
        maxWidth={"500px"}
        sx={{ userSelect: "none", pointerEvents: "none" }}
      />
    </Stack>
  );
};

export default UnderConstruction;
