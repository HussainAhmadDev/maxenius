import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import AddImageModal from "Components/AddImage/AddImageModal";
import { useModal } from "Hooks/useModal";
import { Attachment, ProductData } from "Interfaces/Products";
import { FormikProps } from "formik";
import ImageSlider from "Components/ImageSlider";
import { convertUrlToFile } from "Utils/convertUrlToFile";
import { useEditProductImage, useTrashProductImage } from "Hooks/useProducts";

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
      height: "142px",
      border: `1px solid ${theme.palette.gray[700]}`,
      background: theme.palette.gray[100],
      color: theme.palette.text.secondary,
      fontSize: "12px",
      fontWeight: "bold",
      paddingTop: "60px",
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
      fontWeight: "bold",
      marginLeft: "10px",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    productDetails: {
      fontSize: "12px",
      marginTop: "0px",
      color: theme.palette.text.secondary
    },
    productBody: {
      display: "flex",
      alignItems: "center"
    }
  })
);

interface FileState {
  readonly name: string;
  readonly description: string;
  readonly image: File | null;
}
interface Props {
  handleSetImage: (data: FileState) => void;
  formik: FormikProps<Partial<ProductData>>;
}
interface PropsState {
  readonly name: string;
  readonly description: string;
  readonly image: File | null;
  readonly is_cover: boolean;
}

const AddImage: React.FC<Props> = ({ handleSetImage, formik }) => {
  const classes = useStyles();
  const { mutate: editProductImage } = useEditProductImage(formik.values.id || "");
  const { mutate: deleteProductImage } = useTrashProductImage(formik.values.id || "");

  const [imageData, setImageData] = React.useState<PropsState>({
    name: "",
    description: "",
    image: null,
    is_cover: false
  });
  const [editAttachment, setEditAttachment] = React.useState<Attachment>(
    {} as Attachment
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    async function fetchFile() {
      if (editAttachment) return await convertUrlToFile(editAttachment.url, "");
    }
    fetchFile().then(file => {
      setImageData({
        name: "",
        description: "",
        image: file || null,
        is_cover: editAttachment.is_cover
      });
    });
    setIsLoading(false);
  }, [editAttachment, isLoading]);

  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      /* */
    }
  });
  const coverImage =
    formik?.values &&
    formik?.values?.images &&
    formik?.values?.images.find(item => item.is_cover === true);
  return (
    <div>
      <AddImageModal
        handleCloseModal={handleModalClose}
        handleSaveChanges={() => {
          if (!isEditing) {
            handleSetImage && handleSetImage(imageData);
          } else {
            editProductImage({
              id: editAttachment.id,
              file: imageData.image,
              is_cover: imageData.is_cover
            });
            setIsEditing(false);
          }
          setImageData({
            name: "",
            description: "",
            image: null,
            is_cover: false
          });
          handleModalClose();
          handleSave();
        }}
        openModal={modalOpen}
        title="Product Image"
        handleSetImage={handleSetImage}
        imageData={imageData}
        setImageData={setImageData}
      />
      <h3 className={classes.heading}>Product Images</h3>
      <div className={classes.root}>
        {coverImage ? (
          <img style={{ width: "100%" }} src={coverImage.url} alt="" />
        ) : (
          <div className={classes.noImageDiv}>No Cover/feature product Image</div>
        )}
        <div>
          <ImageSlider
            images={formik?.values?.images || []}
            handleEditImageData={slide => {
              setIsLoading(true);
              setIsEditing(true);
              setEditAttachment(slide);
              handleModalOpen();
            }}
            handleDeleteImageData={id => {
              deleteProductImage({ id });
            }}
          />
        </div>
        <hr />
        <Button
          text="Add Image"
          type="secondary"
          icon={<MuiIcon icon="add" />}
          style={{ marginTop: "10px" }}
          onClick={() => {
            setIsEditing(false);
            setImageData({
              name: "",
              description: "",
              image: null,
              is_cover: false
            });
            handleModalOpen();
          }}
        />
      </div>
    </div>
  );
};

export default AddImage;
