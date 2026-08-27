import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "../../Form/TextInput";
import ModalPopup from "../../ModalPopup";
import { ModalInterface } from "../../../Interfaces/ModalInterface";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noteLabel: {
      color: theme.palette.gray[500]
    },
    textField: {
      width: "100%"
    }
  })
);
interface AddNotesProps extends ModalInterface {
  readonly note: string;
  readonly setNote: React.Dispatch<React.SetStateAction<string>>;
}
const AddOrderNotes: React.FC<AddNotesProps> = props => {
  const classes = useStyles();
  return (
    <div>
      <ModalPopup
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        disableSaveBtn={props.note === ""}
        {...props}
      >
        <div>
          <span className={classes.noteLabel}>Note</span>
          <TextInput
            type="text"
            name="note"
            variant="outlined"
            value={props.note}
            maxRows={7}
            minRows={7}
            isMultiline={true}
            onChange={e => props.setNote(e.target.value)}
          />
        </div>
      </ModalPopup>
    </div>
  );
};

export default AddOrderNotes;
