import * as React from "react";
import { useTheme } from "@material-ui/core/styles";
import { CustomIconProps } from "./types";

export const BrandsIcon: React.FC<CustomIconProps> = ({
  width = 20,
  height = 20,
  color = "gray"
}) => {
  const theme = useTheme();
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="13"
        width="7"
        height="7"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        d="M0 13L13 0L20 7L7 20L0 13Z"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        d="M5 12.2L10.2 7L13 9.8L7.8 15L5 12.2Z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.primary.dark}
      />
      <path
        d="M0 8L12 1L1.5 11.5L0 8Z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.primary.dark}
      />
      <circle
        cx="15"
        cy="5"
        r="2"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.primary.dark}
      />
    </svg>
  );
};
