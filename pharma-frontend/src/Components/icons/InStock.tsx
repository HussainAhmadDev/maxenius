import * as React from "react";
import { useTheme } from "@material-ui/core/styles";
import { CustomIconProps } from "./types";

export const InStockIcon: React.FC<CustomIconProps> = ({ width = 179, height = 45 }) => {
  const theme = useTheme();

  return (
    <svg
      width="89"
      height="86"
      viewBox="0 0 89 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="43" cy="43" r="43" fill={theme.palette.gray[100]} />
      <path
        d="M35.1262 35.6555V46.9L28.9929 43.3222H28.7373V32.0778H28.9929L35.1262 35.6555Z"
        fill="black"
      />
      <path
        d="M48.6721 20.5778L42.5388 24.1556L28.9944 32.0778H28.7388L22.6055 28.5L28.7388 24.9222L42.5388 17L48.6721 20.5778Z"
        fill={theme.palette.primary.main}
      />
      <path
        opacity="0.42"
        d="M35.1265 35.6555V46.9L28.9932 43.3222V32.0778L35.1265 35.6555Z"
        fill="#6D6D6D"
      />
      <path
        d="M28.9929 32.0778L35.1262 35.6555V46.9L28.9929 43.3222H28.7373V32.0778H28.9929Z"
        fill={theme.palette.gray[1300]}
      />
      <path
        d="M42.5388 40V63L35.1277 58.6556L28.9944 55.0778L22.6055 51.5V28.5L28.7388 32.0778V43.3222H28.9944L35.1277 46.9V35.6556L42.5388 40Z"
        fill={theme.palette.primary.main}
      />
      <path
        d="M62.4743 28.5L42.541 40L35.1299 35.6555L42.541 31.3111L55.0632 24.1555L62.4743 28.5Z"
        fill={theme.palette.primary.main}
      />
      <path
        d="M62.4704 28.5V51.5L42.5371 63V40L62.4704 28.5Z"
        fill={theme.palette.gray[1300]}
      />
      <path
        d="M55.0598 24.1555L42.5376 31.3111L35.1265 35.6555L28.9932 32.0778L42.5376 24.1555L48.6709 20.5778L55.0598 24.1555Z"
        fill={theme.palette.gray[1300]}
      />
      <circle
        cx="65"
        cy="57"
        r="13.5"
        fill={theme.palette.primary.main}
        stroke={theme.palette.gray[100]}
        strokeWidth="3"
      />
      <rect x="64" y="54.5" width="2" height="9" rx="1" fill="white" />
      <rect x="64" y="51" width="2" height="2" rx="1" fill="white" />
    </svg>
  );
};
