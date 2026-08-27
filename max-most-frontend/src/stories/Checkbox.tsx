import React, { useRef } from "react";
import {
  CheckCircleOutline,
  RadioButtonChecked,
  RadioButtonUnchecked
} from "@mui/icons-material";
import {
  Checkbox as Check,
  FormControlLabel,
  FormControlLabelProps,
  ListItemButton,
  ListItemButtonBaseProps,
  Radio,
  Skeleton,
  Stack,
  styled,
  useTheme
} from "@mui/material";

interface Props extends Omit<FormControlLabelProps, "control" | "label"> {
  label?: string;
  mode?: "primary" | "light";
  handleChange?(val: { label: string; value: boolean }): void;
  loading?: boolean;
  child?: "checkbox" | "radio";
  fullWidth?: boolean;
  readonly?: boolean;
}

const Checkbox: React.FC<Props> = ({
  mode = "primary",
  label = "",
  handleChange,
  name,
  loading = false,
  child = "checkbox",
  disabled,
  fullWidth = false,
  readonly = false,
  ...props
}) => {
  const formControlLabelRef = useRef<HTMLElement>(null);
  const handleContainerClick = () => formControlLabelRef?.current?.click();

  return loading ? (
    <Stack
      direction={"row"}
      gap={1}
      alignItems={"center"}
      width={"100%"}
      maxWidth={27 + label?.length * 7.5}
    >
      <Skeleton variant="circular" sx={{ minWidth: 22 }} height={22} animation="wave" />
      {label && (
        <Skeleton
          width="100%"
          height={30}
          sx={{ minWidth: label?.length * 7.5 }}
          animation="wave"
        />
      )}
    </Stack>
  ) : (
    <StyledCheckBoxContainer
      dense
      mode={mode}
      disableRipple={disabled}
      fullWidth={fullWidth ? 1 : 0}
      onClick={() => {
        if (!disabled) {
          handleContainerClick();
        }
      }}
    >
      <FormControlLabel
        ref={formControlLabelRef}
        control={
          child === "checkbox" ? (
            <Check
              disableRipple
              icon={<RadioButtonUnchecked />}
              checkedIcon={<CheckCircleOutline />}
              onChange={({ target: { checked } }) => {
                !readonly &&
                  handleChange &&
                  name &&
                  handleChange({ label: name, value: checked });
              }}
            />
          ) : (
            <Radio
              disableRipple
              icon={<RadioButtonUnchecked />}
              checkedIcon={<RadioButtonChecked />}
              onChange={({ target: { checked } }) => {
                !readonly &&
                  handleChange &&
                  name &&
                  handleChange({ label: name, value: checked });
              }}
            />
          )
        }
        label={label}
        disabled={disabled}
        onClick={e => e.stopPropagation()}
        {...props}
      />
    </StyledCheckBoxContainer>
  );
};

interface StyledCheckBoxContainerProps extends ListItemButtonBaseProps {
  mode: "primary" | "light";
  fullWidth?: number;
}

const StyledCheckBoxContainer = styled(ListItemButton)<StyledCheckBoxContainerProps>(({
  mode,
  fullWidth,
  disableRipple
}) => {
  const {
    palette: {
      primary: { main },
      common: { white, black }
    }
  } = useTheme();
  return {
    maxWidth: fullWidth ? "100%" : "fit-content",
    width: fullWidth ? "100%" : "unset",
    display: "inline-block",
    borderRadius: 5,
    padding: 0,
    color: mode === "primary" ? black : white,
    cursor: disableRipple ? "not-allowed" : "pointer",
    ".MuiFormControlLabel-root": {
      cursor: `${disableRipple ? "not-allowed" : "pointer"} !important`,
      pointerEvents: `${disableRipple ? "none" : "all"} !important`,
      margin: 0,
      padding: "8px",
      "span:first-of-type": {
        padding: "0 8px 0 0 !important",
        svg: {
          color: mode === "primary" ? black : white,
          opacity: disableRipple ? 0.4 : 1
        },
        "&:has(input[type='checkbox']:checked) ~ span ": {
          color: mode === "primary" ? main : white
        }
      },
      "span:nth-of-type(2)": {
        opacity: disableRipple ? 0.4 : 1
      },
      "input:checked ~ svg": {
        color: mode === "primary" ? main : white
      }
    }
  };
});

export default Checkbox;
