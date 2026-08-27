import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
    >
      <Box position={"relative"}>
        <Button
          color="secondary"
          startIcon={<ArrowBack />}
          sx={{ position: "absolute" }}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box
          component={"img"}
          src="/assets/404-page-not-found.gif"
          width={"100%"}
          maxWidth={"700px"}
          sx={{ userSelect: "none", pointerEvents: "none" }}
        />
      </Box>
    </Stack>
  );
};

export default PageNotFound;
