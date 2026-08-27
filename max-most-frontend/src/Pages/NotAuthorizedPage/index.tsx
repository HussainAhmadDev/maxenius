import { Home } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotAuthorizedPage = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/dashboard");
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
          startIcon={<Home />}
          sx={{ position: "absolute" }}
          onClick={handleBack}
        >
          Dashboard
        </Button>
        <Box
          component={"img"}
          src="/assets/401-error-unauthorized.gif"
          width={"100%"}
          maxWidth={"700px"}
          sx={{ userSelect: "none", pointerEvents: "none" }}
        />
      </Box>
    </Stack>
  );
};

export default NotAuthorizedPage;
