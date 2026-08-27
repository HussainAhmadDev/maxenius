import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Divider
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import {
  useGetNotes,
  useAddNote,
  useUpateNote,
  useNoteDelete
} from "./../../../Hooks/useOrders";
import { useParams } from "react-router-dom";
import { useUser } from "../../../Contexts/userContext";

type AddPopupNotesModalProps = {
  open: boolean;
  onClose: () => void;
};

type Option = {
  value: string;
  label: string;
};
const options: Option[] = [
  { value: "LPG", label: "LPG" },
  { value: "Refine Staging", label: "Refine Staging" }
];
interface Note {
  id: string;
  id_hash: string;
  is_trash: boolean;
  note_username: string;
  source: string;
  text: string;
  type: string;
  created: string;
  updated: string | null;
}
type NotesDataType = {
  [id: string]: Note;
};

const AddPopupNotesModal: React.FC<AddPopupNotesModalProps> = ({ open, onClose }) => {
  const { id } = useParams();
  const { user } = useUser();
  const { data: NotesData } = useGetNotes(id || "");
  const { mutateAsync: createNote } = useAddNote();
  const { mutateAsync: noteDelete } = useNoteDelete();
  const { mutateAsync: updateNote } = useUpateNote();
  const [notes, setNotes] = useState<NotesDataType>({});
  const [newNotes, setNewNotes] = useState<{ id: string; text: string }[]>([]);
  const [inputValues, setInputValues] = useState<{ [id: string]: string }>({});
  const [editNoteId, setEditNoteId] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<{ [id: string]: string | null }>({});
  const newNoteAdd = () => {
    setNewNotes(prev => [...prev, { id: Date.now().toString(), text: "" }]);
  };
  const onNewNoteDelete = (id: string) => {
    setNewNotes(prev => prev.filter(note => note.id !== id));
  };
  const onNewNoteSave = async (noteId: string) => {
    const noteToSave = newNotes.find(note => note.id === noteId);

    if (noteToSave && user) {
      if (!validateInput(noteToSave.text, noteId)) {
        return;
      } else {
        const payload = {
          type: "private",
          text: noteToSave.text,
          source: "user",
          note_username: `${user?.first_name} ${user?.last_name}`
        };
        const response = await createNote({ id, payload });
        if (response.id) {
          onNewNoteDelete(noteId);
          setNotes(prev => ({
            [response.id]: {
              id: response.id,
              id_hash: response.id_hash,
              is_trash: false,
              note_username: `${user?.first_name} ${user?.last_name}`,
              source: "user",
              text: noteToSave.text,
              type: "private",
              created: new Date().toISOString(),
              updated: null
            },
            ...prev
          }));
          setInputValues(prev => ({
            [response.id]: response.text,
            ...prev
          }));
        }
      }
    }
  };
  const onNoteDelete = async (noteId: string) => {
    const response = await noteDelete({ id, noteId });
    if (response === null) {
      const updatedNotes = { ...notes };
      delete updatedNotes[noteId];
      setNotes(updatedNotes);
      setInputValues(prev => {
        const updatedInputValues = { ...prev };
        delete updatedInputValues[noteId];
        return updatedInputValues;
      });
    }
  };
  const onNoteEdit = async (noteId: string) => {
    const noteToEdit = inputValues[noteId];
    if (!validateInput(noteToEdit, noteId)) {
      return;
    }
    if (user) {
      const payload = {
        text: noteToEdit
      };
      const response = await updateNote({ id, noteId, payload });
      if (response.id) {
        setNotes(prev => ({
          ...prev,
          [noteId]: {
            ...prev[noteId],
            text: response.text
          }
        }));
        setEditNoteId("");
      }
    }
  };
  const validateInput = (text: string, noteId: string): boolean => {
    if (!text.trim()) {
      setErrorMessages(prev => ({
        ...prev,
        [noteId]: "Note cannot be empty."
      }));
      return false;
    }
    setErrorMessages(prev => ({
      ...prev,
      [noteId]: null
    }));
    return true;
  };
  useEffect(() => {
    if (NotesData) {
      const updatedNotes: NotesDataType = NotesData.results.reduce(
        (acc: NotesDataType, note: Note) => {
          acc[note.id] = note;
          return acc;
        },
        {}
      );
      setNotes(updatedNotes);
      const initialInputValues = NotesData.results.reduce<{ [id: string]: string }>(
        (acc, note) => {
          acc[note.id] = note.text;
          return acc;
        },
        {}
      );
      setInputValues(initialInputValues);
    }
  }, [NotesData]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-popup-notes-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <Box
        sx={{
          width: {
            xs: "98%",
            sm: "90%",
            md: "80%",
            lg: "75%"
          },
          maxHeight: "80vh",
          bgcolor: "background.paper",
          borderRadius: "2px",
          outline: "none",
          overflowY: "auto",
          overflowX: "auto"
        }}
      >
        {/* Modal Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ paddingX: 3, pt: 2 }}
        >
          <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Add Popup Notes
          </Typography>

          <IconButton
            onClick={onClose}
            sx={{
              color: "black",
              border: "1px solid #d9d9d9",
              borderRadius: "6%",
              boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            <CancelIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>

        <Divider sx={{ width: "100%", mb: 3, mt: 1 }} />

        {/* Dropdown Menu */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center"
          }}
        >
          <Box sx={{ width: "95%" }}>
            <Select
              options={options}
              onChange={selected => {
                console.log("Selected Option:", selected);
              }}
              placeholder="Select Website"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? "red" : "#d9d9d9",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: state.isFocused ? "red" : "#d9d9d9"
                  },
                  borderWidth: "1px",
                  borderRadius: "5px"
                }),
                menu: base => ({
                  ...base,
                  marginTop: 0
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "red"
                    : state.isFocused
                      ? "#d3d9e0"
                      : "white", // BgColor: [Selected-red] [Light Gray-hover] [white-default]
                  color: state.isSelected ? "white" : "black", // TextColor: [Selected: White] [Black-Default]
                  width: "95%",
                  margin: "auto",
                  borderRadius: "5px"
                }),
                singleValue: base => ({
                  ...base,
                  color: "black",
                  backgroundColor: "white"
                })
              }}
            />
          </Box>
        </Box>

        {/* Notes Section */}
        <Box sx={{ width: "90%", overflowX: "auto", margin: "auto" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "60%",
                      fontSize: "15px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold"
                    }}
                  >
                    Note
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      whiteSpace: "nowrap",
                      fontSize: "15px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold"
                    }}
                  >
                    Date Added
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      fontSize: "15px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold"
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(notes).map(note => (
                  <TableRow
                    key={note.id}
                    sx={{
                      "&:not(:last-child)": {
                        borderBottom: "1px solid #ddd"
                      },
                      fontSize: "10px"
                    }}
                  >
                    <TableCell>
                      {editNoteId === note.id ? (
                        <Box>
                          <TextField
                            value={inputValues[note.id]}
                            onChange={e => {
                              setInputValues(prev => ({
                                ...prev,
                                [note.id]: e.target.value
                              }));
                            }}
                            onBlur={e => validateInput(e.target.value, note.id)}
                            variant="outlined"
                            placeholder="Enter name"
                            fullWidth
                            InputProps={{
                              sx: {
                                height: "90px"
                              }
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#d9d9d9"
                                },
                                "&:hover fieldset": {
                                  borderColor: "#d9d9d9"
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "red",
                                  boxShadow: "none"
                                },
                                "& input": {
                                  paddingLeft: "8px",
                                  boxSizing: "border-box"
                                }
                              }
                            }}
                          />
                          {errorMessages[note.id] && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                              {errorMessages[note.id]}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <span> {note.text}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {note.updated
                        ? new Date(note.updated).toLocaleDateString()
                        : new Date(note.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      {editNoteId === note.id ? (
                        <IconButton
                          onClick={() => onNoteEdit(note.id)}
                          sx={{
                            color: "black",
                            border: "1px solid #d9d9d9",
                            borderRadius: "9px",
                            boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#f5f5f5"
                            }
                          }}
                        >
                          <DoneIcon sx={{ fontSize: "24px" }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => setEditNoteId(note.id)}
                          sx={{
                            color: "black",
                            border: "1px solid #d9d9d9",
                            borderRadius: "9px",
                            boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#f5f5f5"
                            }
                          }}
                        >
                          <EditIcon sx={{ fontSize: "24px" }} />
                        </IconButton>
                      )}

                      <IconButton
                        onClick={() => onNoteDelete(note.id)}
                        sx={{
                          color: "black",
                          border: "1px solid #d9d9d9",
                          borderRadius: "9px",
                          boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#f5f5f5"
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: "24px" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {newNotes.map(newNote => (
                  <TableRow
                    key={newNote.id}
                    sx={{
                      "&:not(:last-child)": {
                        borderBottom: "1px solid #ddd"
                      },
                      fontSize: "10px"
                    }}
                  >
                    <TableCell>
                      <Box>
                        <TextField
                          value={newNote.text}
                          onChange={e => {
                            const updatedText = e.target.value;
                            setNewNotes(prev =>
                              prev.map(note =>
                                note.id === newNote.id
                                  ? { ...note, text: updatedText }
                                  : note
                              )
                            );
                          }}
                          onBlur={e => validateInput(e.target.value, newNote.id)}
                          variant="outlined"
                          placeholder="Enter name"
                          fullWidth
                          InputProps={{
                            sx: {
                              height: "90px"
                            }
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#d9d9d9"
                              },
                              "&:hover fieldset": {
                                borderColor: "#d9d9d9"
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "red",
                                boxShadow: "none"
                              },
                              "& input": {
                                paddingLeft: "8px",
                                boxSizing: "border-box"
                              }
                            }
                          }}
                        />
                        {errorMessages[newNote.id] && (
                          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errorMessages[newNote.id]}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>--</TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <IconButton
                        onClick={() => onNewNoteSave(newNote.id)}
                        sx={{
                          color: "black",
                          border: "1px solid #d9d9d9",
                          borderRadius: "9px",
                          boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#f5f5f5"
                          }
                        }}
                      >
                        <DoneIcon sx={{ fontSize: "24px" }} />
                      </IconButton>

                      <IconButton
                        onClick={() => onNewNoteDelete(newNote.id)}
                        sx={{
                          color: "black",
                          border: "1px solid #d9d9d9",
                          borderRadius: "9px",
                          boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#f5f5f5"
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: "24px" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ width: "100%", mb: 2, mt: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "",
            alignItems: "center",
            mb: 2
          }}
        >
          <Button
            variant="outlined"
            onClick={newNoteAdd}
            sx={{
              marginLeft: "5%",

              color: "black",
              borderColor: "#d9d9d9",
              backgroundColor: "white",
              "&:hover": {
                borderColor: "red",
                backgroundColor: "rgba(250,0,0,0.06)"
              }
            }}
          >
            <AddIcon sx={{ paddingRight: "6px" }} /> Add Popup Notes
          </Button>
        </Box>
        <Divider sx={{ width: "100%", mb: 2, mt: 1 }} />

        <Box display="flex" justifyContent="end" alignItems="center">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: "black",
              borderColor: "#d9d9d9",
              "&:hover": {
                borderColor: "#bfbfbf",
                backgroundColor: "#fafafa"
              },
              mb: 2,
              marginRight: 2
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPopupNotesModal;
