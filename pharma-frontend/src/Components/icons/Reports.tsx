import * as React from "react";
import { useTheme } from "@material-ui/core/styles";
import { CustomIconProps } from "./types";

export const ReportsIcon: React.FC<CustomIconProps> = ({
  width = 20,
  height = 20,
  color = "gray"
}) => {
  const theme = useTheme();
  return (
    <svg
      width={height}
      height={width}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.4 0H4.3C3 0 2 1 2 2.3v15.4C2 19 3 20 4.3 20h12.1c1.3 0 2.3-1 2.3-2.3V2.3C18.7 1 17.6 0 16.4 0z"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        d="M6 17.1c0 .3-.3.6-.6.6-.2 0-.3-.1-.4-.2-.1-.1-.2-.3-.2-.4v-.7c0-.3.3-.6.6-.6.2 0 .3.1.4.2.1.1.2.3.2.4v.7zM6.4 6.2v-.6c.1-.4.2-.9.4-1.3.6-1.1 1.7-1.9 2.9-2.1V6L7.1 8.6c-.4-.7-.7-1.5-.7-2.4zM8.5 17.1c0 .3-.3.6-.6.6-.2 0-.3-.1-.4-.2-.1-.1-.2-.3-.2-.4v-1.9c0-.3.3-.6.6-.6.2 0 .3.1.4.2.1.1.2.3.2.4v1.9zM11 17.1c0 .3-.3.6-.6.6-.2 0-.3-.1-.4-.2-.1-.1-.2-.3-.2-.4V13c0-.3.3-.6.6-.6.2 0 .3.1.4.2.1 0 .2.2.2.4v4.1zM13.5 17.1c0 .3-.3.6-.6.6-.2 0-.3-.1-.4-.2-.1-.1-.2-.3-.2-.4v-3.2c0-.3.3-.6.6-.6.2 0 .3.1.4.2.1.1.2.3.2.4v3.2z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.gray[1300]}
      />
      <path
        d="M10.3 10.2c-.9 0-1.7-.3-2.3-.8l2.8-2.8c.1-.1.2-.3.2-.4V2.3c1.9.3 3.4 1.9 3.4 3.9-.1 2.2-1.9 4-4.1 4zM16 17.1c0 .3-.3.6-.6.6-.2 0-.3-.1-.4-.2-.1-.1-.2-.3-.2-.4V12c0-.3.3-.6.6-.6.2 0 .3.1.4.2.1.1.2.3.2.4v5.1z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.gray[1300]}
      />
    </svg>
  );
};
