import * as React from "react";
import { useTheme } from "@material-ui/core/styles";
import { CustomIconProps } from "./types";

export const StockSuccess: React.FC<CustomIconProps> = ({ width = 179, height = 45 }) => {
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
      <path
        d="M62.7505 60.1275L60.148 57.525C59.8555 57.2325 59.383 57.2325 59.0905 57.525C58.798 57.8175 58.798 58.29 59.0905 58.5825L62.2255 61.7175C62.518 62.01 62.9905 62.01 63.283 61.7175L71.218 53.7825C71.5105 53.49 71.5105 53.0175 71.218 52.725C70.9255 52.4325 70.453 52.4325 70.1605 52.725L62.7505 60.1275Z"
        fill="white"
      />
    </svg>
  );
};
