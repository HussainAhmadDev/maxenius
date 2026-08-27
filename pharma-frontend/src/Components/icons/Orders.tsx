import * as React from "react";
import { useTheme } from "@material-ui/core/styles";
import { CustomIconProps } from "./types";

export const OrdersIcon: React.FC<CustomIconProps> = ({
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
      <path
        d="M16.988 15.018l-.007-.096H3.015l-.006.096c-.062.767.213 1.531.758 2.092a2.93 2.93 0 002.11.887h8.249c.796 0 1.565-.326 2.11-.887a2.715 2.715 0 00.752-2.092z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.primary.dark}
      />
      <path
        d="M16.898 13.93h-13.8l.7-8.477c.048-.615.59-1.1 1.231-1.1h1.555v2.222c0 .275.231.498.518.498a.507.507 0 00.517-.498V4.354h4.758v2.22c0 .276.231.499.518.499a.507.507 0 00.517-.498V4.354h1.559c.64 0 1.182.481 1.23 1.099l.697 8.476z"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        d="M13.412 4.287v.067h-1.034v-.067c0-1.262-1.066-2.29-2.38-2.29-1.31 0-2.379 1.025-2.379 2.29v.067H6.584v-.067C6.584 2.474 8.116 1 9.998 1c1.883 0 3.41 1.474 3.414 3.287z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.primary.dark}
      />
    </svg>
  );
};
