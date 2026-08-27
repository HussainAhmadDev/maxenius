import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import AddImageModal from "../../../AddImage/AddImageModal";
import { useModal } from "../../../../Hooks/useModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "20px"
    },
    noImageDiv: {
      width: "100%",
      height: "334px",
      border: `1px solid ${theme.palette.gray[700]}`,
      background: theme.palette.gray[100],
      color: theme.palette.text.secondary,
      fontSize: "12px",
      paddingTop: "147px",
      textAlign: "center",
      marginBottom: "20px",
      borderRadius: "5px"
    },
    heading: {
      marginTop: "0px",
      marginBottom: "5px"
    },
    buttonsDiv: {
      display: "flex",
      justifyContent: "flex-end"
    },
    productTitle: {
      fontSize: "12px",
      marginBottom: "0px",
      fontWeight: "bold"
    },
    productDetails: {
      fontSize: "12px",
      marginTop: "0px",
      color: theme.palette.text.secondary
    }
  })
);

interface PropsState {
  readonly name: string;
  readonly description: string;
  readonly image: File | null;
  readonly is_cover: boolean;
}

const AddImage: React.FC = () => {
  const classes = useStyles();
  const [imageData, setImageData] = React.useState<PropsState>({
    name: "",
    description: "",
    image: null,
    is_cover: false
  });
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      //
    }
  });

  return (
    <div>
      <AddImageModal
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        openModal={modalOpen}
        title="Add/Edit User Picture"
        imageData={imageData}
        setImageData={setImageData}
      />
      <h3 className={classes.heading}>Logo</h3>
      <div className={classes.root}>
        <div className={classes.noImageDiv}>
          <b>No Organization Image</b>
          <p> Click the Add Image button below to add a image.</p>{" "}
        </div>
        <hr />
        <Button
          text="Add Image"
          type="secondary"
          icon={<MuiIcon icon="add" />}
          style={{ width: "100%", marginTop: "10px" }}
          onClick={handleModalOpen}
        />
      </div>
    </div>
  );
};

export default AddImage;
