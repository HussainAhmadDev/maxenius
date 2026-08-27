import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const NoData: React.FC<{ dense?: boolean }> = ({ dense }) => {
  return (
    <Stack justifyContent={"center"} alignItems={"center"} textAlign={"center"} pb={5}>
      <Box
        src="/assets/no-data-icon.png"
        component={"img"}
        display={"block"}
        marginLeft={"-40px"}
        width={dense ? 100 : undefined}
      />
      <Typography color={"primary.main"} fontWeight={"bold"}>
        Sorry no results found
      </Typography>
      <Typography color={"common.black"}>
        What you searched unfortunately does not exist
      </Typography>
    </Stack>
  );
};

export default NoData;
