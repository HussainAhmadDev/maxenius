import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../../Interfaces/ModalInterface";
import ModalPopup from "../../../ModalPopup";
import BrandFilters from ".././../Brands/BrandFilters";
import BrandsTable from ".././../Brands/BrandsTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);
const BrandModal: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  return (
    <div>
      <ModalPopup
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        {...props}
      >
        <div className={classes.root}>
          <BrandFilters />
          <br />
          <BrandsTable brands={undefined} isLoading={false} />
        </div>
      </ModalPopup>
    </div>
  );
};
export default BrandModal;
