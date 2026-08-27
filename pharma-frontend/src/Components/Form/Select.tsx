/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import AsyncSelect from "react-select/async";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { CSSObject } from "@emotion/react";

export type Option = { readonly label: string; readonly value: string };
export type GroupedOption = { readonly label: string; readonly options: Option[] };

function isGroupedOption(groupedOption: any): groupedOption is GroupedOption {
  return groupedOption.label !== undefined && groupedOption.options !== undefined;
}

interface Props {
  readonly options: Option[] | GroupedOption[];
  readonly multiple?: boolean;
  readonly value?: Option | Option[];
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly name?: string;
  readonly style?: React.CSSProperties;
  readonly defaultValue?: Option;
  readonly error?: boolean;
  readonly label?: string;
  readonly id?: string;
  readonly helperText?: string | false | undefined | unknown;
  readonly ariaLabel?: string;
  onChange?(value: any): void;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redText: {
      color: "red",
      marginTop: "5px"
    },
    errorField: {
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "6px"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    textGrid: {
      display: "block",
      alignItems: "center"
    },
    labelDiv: {
      minWidth: "130px"
    }
  })
);
const customStyles = {
  menu: (provided: CSSObject) => ({
    ...provided,
    borderRadius: "6px"
  }),
  option: (provided: CSSObject) => ({
    ...provided,
    borderRadius: "6px",
    width: "97%",
    margin: "auto"
  })
};
const Select: React.FC<Props> = props => {
  const defaultTheme = useTheme();
  const classes = useStyles();

  const filterArr = (inputValue: string) => {
    let filteredArr: Option[] = [];
    if (isGroupedOption(props.options[0])) {
      const groupedOptions = props.options as GroupedOption[];
      groupedOptions.forEach(group => {
        filteredArr.push(
          ...group.options.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      });
    } else {
      const options = props.options as Option[];
      filteredArr = options.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return filteredArr;
  };

  const promiseOptions = (inputValue: string, callback: any) => {
    callback(filterArr(inputValue));
  };

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      wrap="wrap"
    >
      <Grid item lg={12} xs={12} className={classes.textGrid}>
        {props?.label && (
          <div className={classes.labelDiv}>
            <span className={classes.label}>{props?.label}:</span>
          </div>
        )}
        <div style={{ width: "100%" }}>
          <AsyncSelect
            aria-label={props.ariaLabel}
            defaultOptions={props.options}
            id={props?.id}
            value={props.value}
            isMulti={props.multiple}
            isLoading={props.loading}
            loadOptions={promiseOptions}
            placeholder={props.placeholder}
            name={props.name}
            defaultValue={props.defaultValue}
            isDisabled={props.disabled || props.loading}
            className={props.error ? classes.errorField : ""}
            onChange={value => props?.onChange?.(value)}
            styles={customStyles}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: defaultTheme.palette.gray[300],
                primary: defaultTheme.palette.primary.main
              }
            })}
          />
        </div>
        {props.error ? (
          <Typography variant="body2" className={classes.redText}>
            &nbsp;&nbsp;{props.helperText}
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default Select;
