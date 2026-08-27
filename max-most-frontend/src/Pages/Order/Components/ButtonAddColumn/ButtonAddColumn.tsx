import React from "react";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import { SxProps, Theme } from "@mui/system";

interface ButtonAddColumnProps {
  onClickAddColumn: () => void;
}

const buttonStyles: SxProps<Theme> = {
  mb: { xs: 10, sm: 0 },
  mx: { sm: 10 },
  p: 3,
  width: { xs: "100%", sm: "20rem" },
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  "&:hover": {
    backgroundColor: "rgba(166, 197, 226, 0.15)"
  },
  color: "white",
  fontWeight: "bold",
  borderRadius: "12px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: 1,
  flexShrink: 0
};

const AddIcon: React.FC = props => (
  <SvgIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </SvgIcon>
);

export const ButtonAddColumn: React.FC<ButtonAddColumnProps> = ({ onClickAddColumn }) => {
  return (
    <Button
      sx={buttonStyles}
      title="Přidat sloupec"
      onClick={onClickAddColumn}
      startIcon={<AddIcon />}
    >
      Add another column
    </Button>
  );
};
