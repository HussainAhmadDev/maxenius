import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import { ImageUploadIcon } from "Components/icons/ImageUploadIcon";
import Button from "Components/Button";
import imageCompression from "browser-image-compression";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    uploadDiv: {
      background: theme.palette.gray[100],
      border: `0.5px dashed ${theme.palette.gray[300]}`,
      boxSizing: "border-box",
      borderRadius: "5px",
      height: "315px",
      width: "100%",
      textAlign: "center",
      paddingTop: "58px",
      marginTop: "10px",
      marginBottom: "10px"
    },
    heading: {
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "18px",
      color: theme.palette.gray[500]
    },
    detail: {
      fontSize: "12px",
      lineHeight: "18px",
      color: theme.palette.gray[400]
    },
    redText: {
      color: theme.palette.primary.main
    }
  })
);
interface Props {
  readonly handleSetImage: (file: File) => void;
}

const ImageUploader: React.FC<Props> = ({ handleSetImage }) => {
  const classes = useStyles();
  const { getRootProps, acceptedFiles, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true
  });

  async function handleImageCompression(imageFile: File) {
    const options = {
      maxSizeMB: 300 / 1024, // max size for now is 300kb
      useWebWorker: true
    };
    return await imageCompression(imageFile, options);
  }

  React.useEffect(() => {
    if (acceptedFiles?.length > 0) {
      let acceptedFile = acceptedFiles[0];
      // if image file size is greater than 300Kb then compress the image
      if (acceptedFile.size > 300 * 1024) {
        handleImageCompression(acceptedFile).then(response => {
          if (response) {
            acceptedFile = response;
          }
        });
      }
      handleSetImage(acceptedFile);
    }
  });
  return (
    <div className={classes.root}>
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className={classes.uploadDiv}>
            <ImageUploadIcon />
            <h2 className={classes.heading}>No Cover/feature product Image</h2>
            <p className={classes.detail}>
              Drag and drop images here or <br />
              <span className={classes.redText}>Browse</span> to add images
            </p>
            <Button onClick={open} type="primaryOutlined" text="Browse" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageUploader;
