import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../../Interfaces/ModalInterface";
import ModalPopup from "../../../ModalPopup";
import UserFilters from "../../Users/UserFilters";
import UsersTable from "../../Users/UsersTable";
import { QueryPagination, UserPageFilters } from "Interfaces/QueryFilters";

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
          <UserFilters
            handleUserFilters={function (filters: Partial<UserPageFilters>): void {
              throw new Error("Function not implemented");
            }}
          />
          <br />
          <UsersTable
            users={undefined}
            isLoading={false}
            handlePagination={function (filters: Partial<QueryPagination>): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </ModalPopup>
    </div>
  );
};

export default BrandModal;
