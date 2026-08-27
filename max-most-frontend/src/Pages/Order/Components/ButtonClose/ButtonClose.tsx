import React from "react";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import { SxProps, Theme } from "@mui/system";

interface ButtonCloseProps {
  onClickButtonClose: () => void;
  text: string;
  showText: boolean;
}

const buttonStyles: SxProps<Theme> = {
  p: 1.5,
  color: "#44546f",
  borderRadius: "3px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "#d1d4db"
  },
  "&.showText": {
    backgroundColor: "#e5e6ea",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#d1d4db"
    }
  },
  "&.hideText": {
    "&:hover": {
      backgroundColor: "#091e4224"
    }
  }
};

const CloseIcon: React.FC = props => (
  <SvgIcon {...props} viewBox="0 0 20 20">
    <path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z" />
  </SvgIcon>
);

export const ButtonClose: React.FC<ButtonCloseProps> = ({
  onClickButtonClose,
  text,
  showText
}) => {
  return (
    <Button
      sx={{
        ...buttonStyles,
        ...(showText
          ? { "&.MuiButton-root": buttonStyles["&.showText"] }
          : { "&.MuiButton-root": buttonStyles["&.hideText"] })
      }}
      title={showText ? text : "Zavřít"}
      onClick={onClickButtonClose}
    >
      {showText ? (
        text
      ) : (
        //@ts-ignore
        <CloseIcon sx={{ width: "24px", height: "24px", fill: "currentColor" }} />
      )}
    </Button>
  );
};
