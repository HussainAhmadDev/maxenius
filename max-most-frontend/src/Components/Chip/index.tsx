import { Chip as ChipComponnet, ChipOwnProps, styled, useTheme } from "@mui/material";

interface ChipProps extends ChipOwnProps {}

const Chip: React.FC<ChipProps> = props => {
  const { color = "default", ...rest } = props;
  return <StyledChipComponnet color={color} {...rest} />;
};

const StyledChipComponnet = styled(ChipComponnet)((props: ChipProps) => {
  const { color = "primary", variant } = props;
  let styles = {};
  let clr;
  const { palette } = useTheme();
  switch (color) {
    case "info":
      clr = palette.grey.A100;
      break;
    case "default":
      clr = palette.primary.main;
      break;
    default:
      switch (typeof palette[color]) {
        case "object":
          clr = palette[color].main;
          break;
        case "string":
          clr = palette[color];
          break;
        default:
          break;
      }

      break;
  }
  if (variant === "filled") {
    styles = {
      ...styles,
      position: "relative",
      overflow: "hidden",
      borderRadius: "5px",
      outline: `1px solid ${clr}`,
      color: "#fff",
      background: "transparent",
      "&:before": {
        content: '""',
        position: "absolute",
        inset: 0,
        opacity: 0.6,
        background: clr,
        zIndex: 1
      },
      span: {
        zIndex: 2
      }
    };
  }

  return styles;
});
export default Chip;
