import React, { ChangeEventHandler } from "react";
import { TextareaAutosize, TextareaAutosizeProps } from "@mui/material";

interface TextareaProps extends Omit<TextareaAutosizeProps, "ref"> {
  onChangeValue: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlurHandler?: React.FocusEventHandler<HTMLTextAreaElement>;
  textareaValue: string;
  refValue?: React.Ref<HTMLTextAreaElement>;
  height?: string;
  margin?: string;
  padding?: string;
  sx?: React.CSSProperties;
  rows?: ChangeEventHandler<HTMLTextAreaElement>; // Define rows as a number
}

export const Textarea: React.FC<TextareaProps> = ({
  rows,
  placeholder,
  height,
  margin,
  padding,
  sx,
  onChangeValue,
  onBlurHandler,
  textareaValue,
  refValue
}) => {
  return (
    <TextareaAutosize
      className={`${height} ${margin} ${padding} rounded-lg outline-none`}
      // @ts-ignore
      rows={rows}
      placeholder={placeholder}
      onChange={onChangeValue}
      onBlur={onBlurHandler}
      value={textareaValue}
      ref={refValue}
      style={sx}
    />
  );
};
