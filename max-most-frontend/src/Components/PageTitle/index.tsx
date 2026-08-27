import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
interface PageTitleProps {
  icon: string;
  title: string;
  noDivider?: boolean;
  endComponent?: React.ReactNode;
}
const PageTitle: React.FC<PageTitleProps> = props => {
  const { icon, title, noDivider = false, endComponent = <></> } = props;
  return (
    <Stack width={"100%"} gap={1} mb={2}>
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
          <Box
            src={icon?.toString()}
            component={"img"}
            alt={icon}
            width={30}
            height={30}
            padding={"2px"}
            sx={{
              filter: `brightness(0) saturate(100%) invert(42%) sepia(67%) saturate(616%) hue-rotate(200deg) brightness(96%) contrast(88%)`
            }}
          />
          <Typography variant="h3" fontSize={26} fontWeight={600} color={"common.black"}>
            {title}
          </Typography>
        </Stack>
        {endComponent}
      </Stack>
      {!noDivider && <Divider />}
    </Stack>
  );
};

export default PageTitle;
