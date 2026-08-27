import React from "react";
import { Box } from "@mui/material";
import { useLabel } from "../../context/LabelContext";

interface LabelProps {
  color: string;
  title: string;
  showDetail: boolean;
}

const Label: React.FC<LabelProps> = ({ color, title, showDetail }) => {
  const { isClickLabel, onClickLabel } = useLabel();

  return (
    <Box
      component="div"
      sx={{
        backgroundColor: `#${color}`,
        minWidth: isClickLabel || showDetail ? "10px" : "10px",
        height: isClickLabel || showDetail ? "auto" : "2px",
        marginRight: "2px",
        padding: isClickLabel || showDetail ? "0.5rem" : "0",
        borderRadius: isClickLabel || showDetail ? "4px" : "50%",
        fontSize: "10px",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: isClickLabel || showDetail ? `#${color}` : "transparent"
        }
      }}
      onClick={onClickLabel}
    >
      {isClickLabel || showDetail ? title : ""}
    </Box>
  );
};

export default Label;
