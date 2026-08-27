import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../Interfaces/ModalInterface";
import ModalPopup from "../ModalPopup";
import Button from "../Button";
import MuiIcons from "../icons/MuiIcons";
import { Note } from "Interfaces/Company";
import {
  useCompanyNotes,
  useCreateCompanyNote,
  useEditCompanyNote,
  useDeleteCompanyNote
} from "Hooks/useCompanies";
import { CircularProgress } from "@material-ui/core";
import { useUser } from "Hooks/localStorageUser";
import { useWebsites } from "Hooks/usePatients";
import { getAllWebsitesWithoutAll } from "Utils/states";
import Select from "Components/Form/Select";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  iconCell: {
    display: "flex"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));

interface NoteData extends Partial<Note> {
  readonly isEditMode: boolean;
}

interface Props extends ModalInterface {
  companyId: string;
  noFooter?: boolean;
  setWebsiteOrderFun?: (id: string) => void;
  websiteOrderID?: string;
}

const PopUpNotes: React.FC<Props> = ({
  title,
  saveText = "Confirm and Create Order",
  companyId,
  setWebsiteOrderFun,
  websiteOrderID,
  ...rest
}) => {
  const classes = useStyles();
  const { data: companyNotes, isLoading } = useCompanyNotes(companyId);
  const { mutate: createNewNote } = useCreateCompanyNote(companyId);
  const { mutate: editNote } = useEditCompanyNote(companyId);
  const { mutate: deleteNote } = useDeleteCompanyNote(companyId);

  const [notes, setNotes] = React.useState<NoteData[]>(
    companyNotes?.results.map(note => ({ ...note, isEditMode: false })) || []
  );

  const onChange =
    (index: number) =>
    ({
      target: { value }
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNotes(
        notes.map((note, idx) => (index === idx ? { ...note, text: value } : note))
      );
    };

  const toggleEditMode = (index: number) => {
    setNotes(
      notes
        .map((note, idx) =>
          index === idx ? { ...note, isEditMode: !note.isEditMode } : note
        )
        .filter(note => Boolean(note.id))
    );
  };

  const addNewNote = () => {
    setNotes(notes => [...notes, { text: "", isEditMode: true, type: "private" }]);
  };

  const user = useUser();

  const createNote = ({ text = "" }) => {
    createNewNote({
      note_username: `${user?.first_name} ${user?.middle_name} ${user?.last_name} `,
      source: "user",
      text,
      type: "private"
    });
  };

  React.useEffect(() => {
    setNotes(companyNotes?.results.map(note => ({ ...note, isEditMode: false })) || []);
  }, [companyNotes?.results]);

  const { data, isLoading: loadWebsites } = useWebsites();

  return isLoading || loadWebsites ? (
    <div style={{ width: "100%", textAlign: "center", paddingTop: "30px" }}>
      <CircularProgress />
    </div>
  ) : (
    <ModalPopup maxWidth="md" modalTitle={title} saveBtnText={saveText} {...rest}>
      <Select
        placeholder="Select Website"
        name="websites"
        value={getAllWebsitesWithoutAll(data?.results ? data?.results : []).find(
          itm => itm.id === websiteOrderID
        )}
        options={getAllWebsitesWithoutAll(data?.results ? data?.results : [])}
        onChange={value =>
          value?.id && setWebsiteOrderFun && setWebsiteOrderFun(value?.id)
        }
      />
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Note</TableCell>
            <TableCell align="left">Date Added</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes?.map((note, index) => (
            <TableRow key={note.id}>
              <CustomTableCell {...{ note, name: "name", onChange, index }} />
              <TableCell align="left" className={classes.tableCell}>
                {note.created ? new Date(note.created).toLocaleDateString() : "--"}
              </TableCell>
              <TableCell className={classes.selectTableCell}>
                {note.isEditMode ? (
                  <>
                    <div className={classes.iconCell}>
                      <Button
                        icon={<MuiIcons icon="check" />}
                        onlyIcon={true}
                        type="secondary"
                        onClick={() => {
                          toggleEditMode(index);
                          if (!note.id) {
                            createNote({ text: note.text });
                          } else {
                            editNote({ text: note.text || "", noteId: note.id });
                          }
                        }}
                        variant="outlined"
                        size="small"
                      />
                      {"   "}
                      <Button
                        icon={<MuiIcons icon="cancel" />}
                        onlyIcon={true}
                        type="secondary"
                        onClick={() => toggleEditMode(index)}
                        variant="outlined"
                        size="small"
                      />
                    </div>
                  </>
                ) : (
                  <div className={classes.iconCell}>
                    <Button
                      icon={<MuiIcons icon="edit" />}
                      onlyIcon={true}
                      type="secondary"
                      onClick={() => toggleEditMode(index)}
                      variant="outlined"
                      size="small"
                    />
                    &nbsp;&nbsp;
                    <Button
                      size="small"
                      icon={<MuiIcons icon="delete" />}
                      onClick={() => {
                        if (note?.id) deleteNote(note.id);
                      }}
                      onlyIcon={true}
                      type="secondary"
                      variant="outlined"
                    />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        style={{ marginTop: "20px", width: "190px" }}
        icon={<MuiIcons icon="add" />}
        text="Add Popup Notes"
        type="secondary"
        variant="outlined"
        onClick={() => addNewNote()}
      />
    </ModalPopup>
  );
};

export default PopUpNotes;

interface CustomTableCellProps {
  readonly note: NoteData;
  readonly name: string;
  readonly index: number;
  readonly onChange: (
    index: number
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomTableCell = (props: CustomTableCellProps) => {
  const classes = useStyles();
  const { note, name, index, onChange } = props;
  const { isEditMode } = note;

  return (
    <TableCell align="left" className={classes.tableCell} style={{ width: "65%" }}>
      {isEditMode ? (
        <TextField
          variant="outlined"
          style={{ width: "100%", minHeight: "90px" }}
          value={note?.text}
          name={name}
          maxRows={4}
          minRows={4}
          multiline
          onChange={onChange(index)}
          className={classes.input}
        />
      ) : (
        note?.text
      )}
    </TableCell>
  );
};
