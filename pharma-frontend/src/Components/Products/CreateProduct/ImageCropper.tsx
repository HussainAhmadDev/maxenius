import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import MuiIcon from "Components/icons/MuiIcons";
import getCroppedImg from "Utils/cropImage";
import Button from "Components/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      top: "29px",
      left: "0px",
      right: "0px",
      bottom: "10px",
      position: "absolute"
    },
    cropContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: "80px",
      "& > div": {
        borderRadius: "5px"
      }
    },
    controls: {
      position: "absolute",
      bottom: 0,
      left: "30%",
      width: "60%",
      transform: "translateX(-50%)",
      height: "80px",
      display: "flex",
      color: theme.palette.gray[400],
      alignItems: "center"
    },
    slider: {
      color: theme.palette.gray[400],
      padding: "22px 0px"
    }
  })
);

interface PropsState {
  readonly name: string;
  readonly description: string;
  readonly image: File | null;
  readonly is_cover: boolean;
}
interface Props {
  readonly imageData: PropsState;
  setImageData?: (data: PropsState) => void;
}

const ImageCropper: React.FC<Props> = ({ setImageData, imageData }) => {
  const classes = useStyles();
  const [imgBlob, setImgBlob] = React.useState("");
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>({} as Area);

  const onCropComplete = React.useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const cropImage = React.useCallback(async () => {
    try {
      if (imageData.image) {
        const resultantCroppedImage = await getCroppedImg(imgBlob, croppedAreaPixels);
        resultantCroppedImage &&
          setImageData &&
          setImageData({
            ...imageData,
            image: new File([resultantCroppedImage], imageData.name)
          });
        setZoom(1);
      }
    } catch (e) {
      // do nothing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels]);

  React.useEffect(() => {
    if (imageData.image) {
      const blob = URL?.createObjectURL(imageData.image);
      setImgBlob(blob);
    }
  }, [imageData.image]);

  return (
    <div className={classes.app}>
      <div className={classes.cropContainer}>
        <Cropper
          image={imgBlob}
          crop={crop}
          zoom={zoom}
          aspect={imageData.is_cover ? 16 / 9 : 4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={classes.controls}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2} lg={2}>
            <MuiIcon fontSize="small" icon="image" />
          </Grid>
          <Grid item xs={8} lg={8}>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(Number(zoom))}
              classes={{ root: classes.slider }}
            />
          </Grid>
          <Grid item xs={1} lg={1}>
            <MuiIcon fontSize="large" icon="image" />
          </Grid>
        </Grid>
        <Grid container justifyContent={"center"}>
          <Grid item>
            <Button text="Crop Image" onClick={cropImage} type="secondary" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ImageCropper;
