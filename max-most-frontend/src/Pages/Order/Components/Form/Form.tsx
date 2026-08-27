import React from "react";
import { Button, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FormProps {
  onClickButton: () => void;
  onClickButtonClose: () => void;
  onChangeValue: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlurHandler: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  textareaValue: string;
  refValue: React.RefObject<HTMLTextAreaElement>;
}

const Form: React.FC<FormProps> = ({
  onClickButton,
  onClickButtonClose,
  onChangeValue,
  onBlurHandler,
  textareaValue,
  refValue
}) => {
  return (
    <form className="mx-1 my-2">
      <TextField
        multiline
        rows={3}
        placeholder="Enter a name for this tab..."
        variant="outlined"
        fullWidth
        margin="normal"
        InputProps={{
          classes: {
            root: "p-3",
            input: "text-[14px]",
            notchedOutline: "shadow-[0_1px_0px_rgba(9,30,66,0.3)]"
          }
        }}
        onChange={onChangeValue}
        onBlur={onBlurHandler}
        value={textareaValue}
        inputRef={refValue}
      />
      <div className="flex flex-row items-center gap-1">
        <Button variant="contained" onClick={onClickButton}>
          Add tab
        </Button>
        <IconButton onClick={onClickButtonClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </form>
  );
};

export default Form;
