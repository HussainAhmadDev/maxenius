import * as React from "react";
import { CustomIconProps } from "./types";

export const BackOrderIcon: React.FC<CustomIconProps> = ({
  width = 30,
  height = 30,
  color = "gray"
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.57856 8.11122V13.0001L3.91189 11.4446H3.80078V6.55566H3.91189L6.57856 8.11122Z"
        fill="black"
      />
      <path
        d="M12.4671 1.55556L9.80046 3.11111L3.91157 6.55556H3.80046L1.13379 5L3.80046 3.44444L9.80046 0L12.4671 1.55556Z"
        fill="#97A6BA"
      />
      <path
        opacity="0.42"
        d="M6.5778 8.11122V13.0001L3.91113 11.4446V6.55566L6.5778 8.11122Z"
        fill="#6D6D6D"
      />
      <path
        d="M3.91189 6.55566L6.57856 8.11122V13.0001L3.91189 11.4446H3.80078V6.55566H3.91189Z"
        fill="#64748B"
      />
      <path
        d="M9.80046 10V20L6.57823 18.1111L3.91157 16.5556L1.13379 15V5L3.80046 6.55556V11.4444H3.91157L6.57823 13V8.11111L9.80046 10Z"
        fill="#97A6BA"
      />
      <path
        d="M18.467 5.00022L9.80035 10.0002L6.57812 8.11133L9.80035 6.22244L15.2448 3.11133L18.467 5.00022Z"
        fill="#97A6BA"
      />
      <path d="M18.4674 5V15L9.80078 20V10L18.4674 5Z" fill="#64748B" />
      <path
        d="M15.2445 3.11122L9.80002 6.22233L6.5778 8.11122L3.91113 6.55566L9.80002 3.11122L12.4667 1.55566L15.2445 3.11122Z"
        fill="#64748B"
      />
    </svg>
  );
};
