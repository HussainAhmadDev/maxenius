import * as React from "react";
import MuiIcon from "Components/icons/MuiIcons";
import IconButton from "@material-ui/core/IconButton";
import { Attachment } from "Interfaces/Products";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ImageNotFound from "Assets/images/not_found.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    },
    carouselWrapper: {
      width: "190px",
      overflow: "hidden"
    },
    carousel: {
      display: "flex",
      alignItems: "center"
    },
    imageContainer: {
      border: "1px solid black",
      padding: "2px",
      margin: "2px",
      alignItems: "center",
      display: "flex",
      cursor: "pointer"
    },
    image: {
      // 4/3 ratio
      height: "60px",
      width: "80px"
    },
    cover_image: {
      // 16/9 ratio
      height: "45px",
      width: "80px"
    },
    overlay: {
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    },
    hoverIcons: {
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "flex",
      zIndex: 10,
      opacity: 0,
      backgroundColor: "white",
      "&:hover": {
        opacity: 0.7
      }
    },
    imageStyles: {
      height: "100%",
      width: "100%",
      display: "block",
      zIndex: 0,
      objectFit: "cover"
    },
    hoverIconContainer: {
      position: "relative",
      // 50% from the top and from the center of the icon so it is exactly at the center, icon's height and width is 42px so the center is 21px.
      top: "calc(50% - 21px)"
      // left: "calc(50% - 21px)"
    }
  })
);

interface Props {
  images: Array<Attachment>;
  handleEditImageData: (slide: Attachment) => void;
  handleDeleteImageData: (id: string) => void;
}

const Slider: React.FC<Props> = props => {
  const classes = useStyles();
  const { images } = props;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carousel = React.useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (carousel.current !== null && currentIndex < images.length - 1) {
      setCurrentIndex(prevState => prevState + 1);
      carousel.current.scrollLeft += 86;
    }
  };

  const previousSlide = () => {
    if (carousel.current !== null && currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1);
      carousel.current.scrollLeft += -86;
    }
  };

  return (
    <>
      {images.length > 0 ? (
        <div className={classes.root}>
          <div>
            <IconButton
              aria-label="previous image"
              aria-controls="long-menu"
              aria-haspopup="true"
              disabled={currentIndex < 1}
              onClick={previousSlide}
            >
              <MuiIcon icon="arrowLeft" />
            </IconButton>
          </div>
          <div ref={carousel} className={classes.carouselWrapper}>
            <div className={classes.carousel}>
              {images.map(slide => (
                <div key={slide.id} className={classes.imageContainer}>
                  <div
                    className={`${slide.is_cover ? classes.cover_image : classes.image} ${
                      classes.overlay
                    }`}
                  >
                    <img
                      className={classes.imageStyles}
                      src={slide.url}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = ImageNotFound;
                      }}
                      alt=""
                    />
                    <span className={classes.hoverIcons}>
                      <span className={classes.hoverIconContainer}>
                        <IconButton
                          style={{ height: "42px", width: "42px", color: "green" }}
                          aria-label="edit image"
                          aria-haspopup="true"
                          onClick={() => props.handleEditImageData(slide)}
                        >
                          <MuiIcon icon="edit" />
                        </IconButton>
                      </span>
                      <span className={classes.hoverIconContainer}>
                        <IconButton
                          style={{ height: "42px", width: "42px", color: "red" }}
                          aria-label="delete image"
                          aria-haspopup="true"
                          onClick={() => props.handleDeleteImageData(slide.id)}
                        >
                          <MuiIcon icon="delete" />
                        </IconButton>
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <IconButton
              aria-label="next image"
              aria-controls="long-menu"
              aria-haspopup="true"
              disabled={currentIndex >= images.length - 2}
              onClick={nextSlide}
            >
              <MuiIcon icon="arrowRight" />
            </IconButton>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Slider;
