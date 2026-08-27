import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../Button";
import AddOrderNotesPopUp from "./AddOrderNotes";
import MuiIcon from "../../icons/MuiIcons";
import { useModal } from "../../../Hooks/useModal";
import { EmptyData } from "../../icons/EmptyData";
import { OrderNote } from "Interfaces/Order";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tb: {
      border: "1px solid red"
    },
    container: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      marginTop: "20px"
    },
    headingSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "auto",
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      textAlign: "center",
      maxHeight: "60px"
    },
    OrderNotesHeading: {
      marginLeft: "15px"
    },
    orderNotesDiv: {
      padding: "20px",
      height: "310px",

      overflowY: "scroll"
    },
    addNotesDiv: {
      padding: "20px"
    },
    noteDiv: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `1px solid ${theme.palette.gray[700]}`
    },
    note: {
      color: theme.palette.gray[600],
      textAlign: "left"
    },
    noteDate: {
      paddingTop: "5px",
      color: theme.palette.gray[1200],
      fontSize: "12px"
    },
    noteContainer: {
      textAlign: "left",
      paddingTop: "10px"
    },
    emptyDiv: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "50px"
    }
  })
);

interface Props {
  readonly type: string;
  readonly notes: OrderNote[];
  readonly onDelete: (id: string) => void;
  disabled?: boolean;
  readonly onAdd: (note: Omit<OrderNote, "created" | "id">) => void;
}
const OrderNotes = (props: Props) => {
  const classes = useStyles();
  const { disabled = false } = props;
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });
  const [note, setNote] = React.useState<string>("");

  const onSave = () => {
    if (note !== "") {
      props.onAdd({ text: note, type: props.type.toLowerCase() });
      handleSave();
      setNote("");
    }
  };
  const ShowEmpty = () => {
    return (
      <div className={classes.emptyDiv}>
        <EmptyData />
        <p>No {props.type} Notes</p>
      </div>
    );
  };
  return (
    <div className={classes.container}>
      <AddOrderNotesPopUp
        saveText={`Save ${props.type} Note `}
        title={`Add ${props.type} Prescription Notes`}
        handleSaveChanges={onSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
        note={note}
        setNote={setNote}
      />
      <div className={classes.headingSection}>
        <div>
          <h4 className={classes.OrderNotesHeading}>
            Prescription {props.type} Notes{" "}
            {props.notes?.length > 0 ? `(${props.notes?.length})` : null}{" "}
          </h4>
        </div>
        <div className={classes.addNotesDiv}>
          <Button
            text="Add Note"
            type="secondary"
            onClick={() => handleModalOpen()}
            icon={<MuiIcon icon="edit" />}
            disabled={disabled}
          ></Button>
        </div>
      </div>
      <div className={classes.orderNotesDiv}>
        {props.notes?.length > 0 ? (
          props.notes?.map((note, index) => (
            <div className={classes.noteDiv} key={index}>
              <div className={classes.noteContainer}>
                <span className={classes.note}>{note?.text}</span>
                <p className={classes.noteDate}>
                  {new Date(note?.created || "").toLocaleString("en-us")}
                </p>
              </div>
              <div>
                <Button
                  style={{ width: 40 }}
                  onlyIcon={true}
                  icon={<MuiIcon fontSize="small" icon="delete" />}
                  type="secondary"
                  size="small"
                  variant="outlined"
                  onClick={() => props.onDelete(note.id)}
                  disabled={disabled}
                />
              </div>
            </div>
          ))
        ) : (
          <ShowEmpty />
        )}
      </div>
    </div>
  );
};

export default OrderNotes;
