import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../Button";
import AddOrderNotesPopUp from "./AddOrderNotes";
import MuiIcon from "../../icons/MuiIcons";
import { useModal } from "../../../Hooks/useModal";
import { EmptyData } from "../../icons/EmptyData";
import { OrderNote } from "Interfaces/Order";
import { useUser } from "Hooks/localStorageUser";

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
      padding: "0px 20px 0px 20px",
      height: "310px",

      overflowY: "scroll"
    },
    addNotesDiv: {
      padding: "0px 20px 0px 20px"
    },
    noteDivGrannyApple: {
      padding: "10px",
      borderRadius: "4px",
      background: "#A7CEDC"
    },
    noteColorEee: {
      padding: "10px",
      borderRadius: "4px",
      background: "#eee"
    },
    noteDivTamato: {
      padding: "10px",
      borderRadius: "4px",
      background: "#FF7070"
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
    },
    dateAndCreatedBy: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
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
  const user = useUser();

  const onSave = () => {
    if (note !== "" && user?.first_name) {
      props.onAdd({
        text: note,
        source: "user",
        note_username: `${
          (user?.first_name || "") +
          " " +
          (user?.middle_name || "") +
          " " +
          (user?.last_name || "")
        }`,
        type: props.type.toLowerCase()
      });
      // props.onAdd({ text: note, source: 'user', note_username: `${user?.first_name + " " + user?.middle_name + " " + user?.last_name}`, type: props.type.toLowerCase() });
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

  const changeColor = window.location.href.toLowerCase().includes("purchase-orders")
    ? true
    : false;

  return (
    <div className={classes.container}>
      <AddOrderNotesPopUp
        saveText={`Save ${props.type} Note `}
        title={`Add ${props.type} Order Notes`}
        handleSaveChanges={onSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
        note={note}
        setNote={setNote}
      />
      <div className={classes.headingSection}>
        <div>
          <h4 className={classes.OrderNotesHeading}>
            Order {props.type} Notes{" "}
            {props.notes?.length > 0 ? `(${props.notes?.length})` : null}{" "}
          </h4>
        </div>
        <div className={classes.addNotesDiv}>
          <Button
            id={`cy_${props.type}_notes`}
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
                <div
                  className={[
                    !changeColor && note?.source?.toLowerCase() === "u"
                      ? classes.noteDivTamato
                      : !changeColor &&
                        note?.source?.toLowerCase() === "s" &&
                        note?.text.toLowerCase().includes("shipping payment")
                      ? classes.noteDivGrannyApple
                      : classes.noteColorEee
                  ].join(" ")}
                >
                  <span
                    className={classes.note}
                    dangerouslySetInnerHTML={{ __html: note?.text }}
                  ></span>
                </div>
                <div className={classes.dateAndCreatedBy}>
                  <div className={classes.noteDate}>
                    {new Date(note?.created || "").toLocaleString("en-us")}
                  </div>
                  {note?.note_username && note?.source?.toLowerCase() === "u" && (
                    <div className={classes.noteDate}>
                      {`By ${note?.note_username.replace(/null/g, "")}`}
                    </div>
                  )}
                </div>
              </div>
              {/* <div>
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
              </div> */}
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
