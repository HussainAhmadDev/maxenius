import React from "react";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";

interface ButtonProps {
  text: string;
  onClickButton: () => void;
}

const buttonStyles: SxProps = {
  px: 3,
  py: 1.5,
  bgcolor: "#0c66e4",
  "&:hover": {
    bgcolor: "#0055cc"
  },
  color: "white",
  fontWeight: "bold",
  borderRadius: "3px"
};

export const CustomButton: React.FC<ButtonProps> = ({ text, onClickButton }) => {
  return (
    <Button sx={buttonStyles} onClick={onClickButton}>
      {text}
    </Button>
  );
};
export { Button };
