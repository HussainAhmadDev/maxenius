import * as React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}
interface Props extends SwitchProps {
  classes: Styles;
  value?: boolean;
  checked?: boolean;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  disabled?: boolean;
  defaultChecked?: boolean;
}

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1)
    },
    switchBase: {
      padding: 1,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: theme.palette.primary,
          opacity: 1,
          border: "none"
        }
      },
      "&$focusVisible $thumb": {
        color: theme.palette.primary,
        border: `6px solid ${theme.palette.common.white}`
      },
      "&.MuiSwitch-colorSecondary.Mui-disabled + .MuiSwitch-track": {
        backgroundColor: `#f50057`
      }
    },
    thumb: {
      width: 24,
      height: 24
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.gray[1100]}`,
      backgroundColor: theme.palette.gray[1100],
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"])
    },
    checked: {},
    focusVisible: {},
    disabled: {}
  })
)(({ classes, checked, handleChange, disabled, defaultChecked, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      onChange={handleChange}
      checked={checked}
      disabled={disabled}
      defaultChecked={defaultChecked}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
        disabled: classes.checked
      }}
      {...props}
    />
  );
});

export default IOSSwitch;
