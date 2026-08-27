import React from "react";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import { SxProps, Theme } from "@mui/system";

interface ButtonAddCardProps {
  onClickAddCard: () => void;
}

const buttonStyles: SxProps<Theme> = {
  px: 2,
  py: 1,
  width: "100%",
  color: "#44546f",
  "&:hover": {
    backgroundColor: "#d1d4db"
  },
  fontWeight: "medium",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1
};

const AddIcon: React.FC = props => (
  <SvgIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </SvgIcon>
);

export const ButtonAddCard: React.FC<ButtonAddCardProps> = ({ onClickAddCard }) => {
  return (
    <Button
      sx={buttonStyles}
      title="Add tab"
      onClick={onClickAddCard}
      startIcon={<AddIcon />}
    >
      Add tab
    </Button>
  );
};
