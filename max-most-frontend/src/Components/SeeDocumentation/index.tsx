import { Stack, Typography } from "@mui/material";

const isJSDocumentation = import.meta.env.VITE_JS_DOCUMENTATION;

const SeeDocumentation = ({
  fileName,
  title,
  color
}: {
  fileName: string;
  title: string;
  color?: string;
}) => {
  const isLocalhost = window.location.hostname === "localhost";
  return isJSDocumentation === "true" && isLocalhost ? (
    <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
      <Typography
        variant="body2"
        fontWeight={"bold"}
        color={color ? color : "primary"}
        sx={{ cursor: "pointer", marginY: "4px" }}
        onClick={() => window.open(`/jsDocs/global.html#${fileName}`, "_blank")}
      >
        {title}
      </Typography>
    </Stack>
  ) : (
    <></>
  );
};
export default SeeDocumentation;
