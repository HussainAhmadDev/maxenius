import * as React from "react";
import { CustomIconProps } from "./types";
import Logo from ".././../Assets/images/refine-group-logo.jpeg";

export const AdvocacyIcon: React.FC<CustomIconProps> = ({ width = 179, height = 45 }) => {
  return (
    <img
      style={{
        objectFit: "contain"
      }}
      src={Logo}
      alt=""
      width={width}
      height={height}
    />
  );
};
