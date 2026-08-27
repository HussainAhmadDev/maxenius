import React from "react";
import { Button, IconButton } from "@mui/material";
import { Textarea } from "../Textarea/Textarea";
import CloseIcon from "@mui/icons-material/Close";

interface FormColumnProps {
  onClickButtonClose: () => void;
  onClickButton: () => void;
  onChangeValue: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaValue: string;
  refValue: React.RefObject<HTMLTextAreaElement>;
}

const FormColumn: React.FC<FormColumnProps> = ({
  onClickButtonClose,
  onClickButton,
  onChangeValue,
  textareaValue,
  refValue
}) => {
  return (
    <section
      style={{
        marginBottom: "10px",
        padding: "3px",
        width: "100%",
        backgroundColor: "#f1f2f4",
        color: "#4a4a4a",
        borderRadius: "1rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        flexShrink: 0
      }}
    >
      <form>
        <Textarea
          padding="px-3 py-2"
          placeholder="Zadej jméno sloupce..."
          onChangeValue={onChangeValue}
          textareaValue={textareaValue}
          refValue={refValue}
        />
        <div className="flex flex-row items-center gap-1">
          <Button variant="contained" onClick={onClickButton}>
            Přidat sloupec
          </Button>
          <IconButton onClick={onClickButtonClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </form>
    </section>
  );
};

export default FormColumn;
