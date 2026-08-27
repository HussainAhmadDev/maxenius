import * as React from "react";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import ModalPopup from "Components/ModalPopup";
import ImageCropper from "Components/Products/CreateProduct/ImageCropper";
import TextField from "Components/Form/TextInput";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import Switch from "Components/Switch";
import UploadComponent from "Components/Products/CreateProduct/UploadComponent";

interface Props {
  readonly title: string;
  readonly handleSaveChanges: () => void;
  readonly handleCloseModal: () => void;
  readonly openModal: boolean;
  handleSetImage?: (data: PropsState) => void;
  imageData: PropsState;
  setImageData: React.Dispatch<React.SetStateAction<PropsState>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldLabel: {
      marginBottom: "0px",
      marginTop: "0px"
    },
    imageTitle: {
      fontSize: "12px",
      fontWeight: "bold"
    },
    changeImage: {
      width: "100%",
      textAlign: "right",
      marginTop: "-68px",
      marginBottom: "17px"
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      alignItems: "center"
    },
    switchBody: {},
    buttonsBody: { display: "flex" }
  })
);

interface PropsState {
  readonly name: string;
  readonly description: string;
  readonly image: File | null;
  readonly is_cover: boolean;
}

const AddImageModal: React.FC<Props> = ({
  title,
  handleSaveChanges,
  handleCloseModal,
  openModal,
  handleSetImage,
  imageData,
  setImageData
}) => {
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setImageData({ ...imageData, [e.target.name]: e.target.value });
  };
  const handleChangeImage = (file: File) => {
    setImageData({ ...imageData, image: file });
  };

  const handleClose = () => {
    setImageData({
      name: "",
      description: "",
      image: null,
      is_cover: false
    });
    handleCloseModal();
  };
  const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
    setImageData({
      ...imageData,
      is_cover: value
    });
  };
  return (
    <ModalPopup
      maxWidth="sm"
      modalTitle={title}
      noFooter={true}
      handleSaveChanges={handleSaveChanges}
      handleCloseModal={handleClose}
      openModal={openModal}
    >
      <Grid container spacing={1}>
        <Grid lg={6} item>
          <p className={classes.fieldLabel}>Image Name</p>
          <TextField
            placeholder="Image name here"
            name="name"
            type="text"
            value={imageData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid lg={6} item>
          <p className={classes.fieldLabel}>Alt / Description</p>
          <TextField
            placeholder="Alt / description here"
            name="description"
            type="text"
            value={imageData.description}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      {imageData?.image ? (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <div style={{ height: "400px", position: "relative" }}>
              {" "}
              <p className={classes.imageTitle}>Image</p>
              <ImageCropper setImageData={setImageData} imageData={imageData} />
            </div>
            <div className={classes.changeImage}>
              <Button
                text="Change Image"
                onClick={() => setImageData({ ...imageData, image: null })}
                type="secondary"
                icon={<MuiIcon icon="loop" />}
              />
            </div>
          </Grid>
        </Grid>
      ) : (
        <UploadComponent handleSetImage={handleChangeImage} />
      )}

      <hr />
      <div className={classes.footer}>
        <div className={classes.switchBody}>
          {title === "Product Image" && (
            <>
              <span>Cover Image: </span>
              <Switch checked={imageData?.is_cover} handleChange={handleChangeCover} />
            </>
          )}
        </div>

        <div className={classes.buttonsBody}>
          <Button onClick={handleClose} type="secondary" text="Cancel" />
          &nbsp;
          <Button variant="contained" onClick={handleSaveChanges} text="Save Image" />
        </div>
      </div>
    </ModalPopup>
  );
};

export default AddImageModal;
