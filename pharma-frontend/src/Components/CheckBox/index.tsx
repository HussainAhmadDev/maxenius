import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { SwitchBaseProps } from "@material-ui/core/internal/SwitchBase";

interface Props {
  readonly checked: boolean;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly style?: React.CSSProperties;
  readonly inputProps?: SwitchBaseProps["inputProps"];
  readonly defaultValue?: boolean;
  readonly ariaLabel?: string;

  readonly handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const CustomCheckbox: React.FC<Props> = (props: Props) => {
  return (
    <Checkbox
      // defaultValue={props.defaultValue ? props.defaultValue : false}
      checked={props.checked}
      name={props?.name}
      disabled={props?.disabled}
      onChange={props.handleChange}
      inputProps={{ "aria-label": props.ariaLabel, ...props.inputProps }}
      style={props.style}
    />
  );
};

export default CustomCheckbox;
