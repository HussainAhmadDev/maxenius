import * as React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import CapitolLogo from "../../Assets/images/capenqRed.png";
import Avatar from "@material-ui/core/Avatar";
import MuiIcon from "../icons/MuiIcons";
import { useBrands, useBrandByUserId } from "Hooks/useBrands";
import { useBrand } from "Context/BrandContext";
import { BrandsData } from "Interfaces/Brands";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    storeOption: {
      display: "flex",
      height: "70px",
      alignItems: "center",
      width: "240px",
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      padding: "10px",
      "&:hover": {
        backgroundColor: theme.palette.gray[100],
        cursor: "pointer"
      }
    },
    optionSeletected: {
      display: "flex",
      height: "70px",
      alignItems: "center",
      width: "240px",
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      padding: "10px",
      backgroundColor: theme.palette.gray[200],
      cursor: "pointer"
    },
    storeOptionSelected: {
      display: "flex",
      height: "70px",
      alignItems: "center",
      width: "230px",
      padding: "10px",
      backgroundColor: theme.palette.gray[200],
      cursor: "pointer",
      borderRadius: "6px"
    },
    storeLogo: {
      padding: "2%",
      background: "white",
      borderRadius: "100px"
    },
    storeName: {
      paddingLeft: "2%",
      width: "100%"
    },
    storeSubHeading: {
      fontSize: "12px",
      color: "black",
      marginTop: "3px"
    },
    storeHeading: {
      color: "black",
      marginBottom: "0px"
    },
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      background: "white"
    },
    brandDropDown: {
      width: "100%",
      maxHeight: "70px",
      background: theme.palette.gray[200]
    },
    branddropContainer: { maxHeight: "300px", overflowY: "scroll" },
    cursorNotAllowed: {
      cursor: "not-allowed"
    }
  })
);

export default function SimplePopover() {
  const { data: userBrands } = useBrandByUserId();
  const classes = useStyles();
  const { data: brands } = useBrands();
  const { activeBrand, setActiveBrand, setBrandDetail } = useBrand();
  const selectedBrand = brands?.results?.find(brand => brand.id === activeBrand);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const onChangeBrand = (brand: BrandsData) => {
    setBrandDetail(brand);
    setActiveBrand(brand.id);
    navigate("/");
    handleClose();
    window.location.reload();
  };

  const isEnabled = true;

  return (
    <div>
      <div
        className={`${classes.storeOptionSelected} ${
          isEnabled ? "" : classes.cursorNotAllowed
        }`}
        onClick={e => {
          handleClick(e);
        }}
        aria-label="brand selector"
      >
        <div className={classes.storeLogo}>
          <Avatar
            src={CapitolLogo}
            className={classes.small}
            imgProps={{
              "aria-label": "brand avatar",
              alt: "brand avatar"
            }}
          />
        </div>
        &nbsp;&nbsp;
        <div className={classes.storeName}>
          <Typography variant="subtitle1" aria-label="brand name">
            {selectedBrand?.name}
          </Typography>
          <Typography variant="body2" aria-label="brand description">
            {selectedBrand?.description}
          </Typography>
        </div>
        <div>
          <MuiIcon icon="arrowDown" color="action" aria-label="arrow down" />
        </div>
      </div>

      <Popover
        style={{
          marginTop: "10px",
          marginLeft: "-10px"
        }}
        id="simple-popover"
        open={open && isEnabled}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        aria-label="brand popover"
      >
        <div className={classes.branddropContainer}>
          {userBrands
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((brand, index) => (
              <div
                key={index}
                className={
                  brand.id !== activeBrand
                    ? classes.storeOption
                    : classes.optionSeletected
                }
                onClick={() => onChangeBrand(brand)}
              >
                <div className={classes.storeLogo}>
                  <Avatar src={CapitolLogo} className={classes.small} />
                </div>
                &nbsp;&nbsp;
                <div className={classes.storeName}>
                  <Typography variant="subtitle1">{brand.name}</Typography>
                  <Typography variant="body2">{brand.description}</Typography>
                </div>
              </div>
            ))}
        </div>
      </Popover>
    </div>
  );
}
