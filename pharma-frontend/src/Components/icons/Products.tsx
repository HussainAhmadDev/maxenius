import * as React from "react";
import { useTheme } from "@material-ui/core/styles";
import { CustomIconProps } from "./types";

export const ProductsIcon: React.FC<CustomIconProps> = ({
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
      <path d="M6.578 8.111V13L3.91 11.444H3.8V6.556h.11L6.579 8.11z" fill="#000" />
      <path
        d="M12.467 1.556L9.8 3.11 3.911 6.556H3.8L1.133 5 3.8 3.444 9.8 0l2.667 1.556z"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        opacity={0.42}
        d="M6.578 8.111V13L3.91 11.444V6.556L6.578 8.11z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.gray[1300]}
      />
      <path
        d="M3.91 6.556L6.579 8.11V13L3.91 11.444H3.8V6.556h.11z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.primary.dark}
      />
      <path
        d="M9.8 10v10l-3.222-1.889-2.667-1.555L1.133 15V5L3.8 6.556v4.888h.111L6.578 13V8.111L9.8 10z"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        d="M18.466 5L9.8 10 6.578 8.111 9.8 6.222l5.444-3.11L18.467 5z"
        fill={color === "gray" ? theme.palette.gray[400] : theme.palette.primary.main}
      />
      <path
        d="M18.467 5v10L9.8 20V10l8.667-5zM15.245 3.111L9.8 6.222l-3.222 1.89L3.91 6.555 9.8 3.11l2.667-1.555 2.777 1.555z"
        fill={color === "gray" ? theme.palette.gray[1200] : theme.palette.gray[1300]}
      />
    </svg>
  );
};
