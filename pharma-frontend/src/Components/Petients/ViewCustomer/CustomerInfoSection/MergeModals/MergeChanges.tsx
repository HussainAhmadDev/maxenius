import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../../../Interfaces/ModalInterface";
import ModalPopup from "../../../../ModalPopup";
import Radio from "@material-ui/core/Radio";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },

    checkedType: {
      borderRadius: "3px",
      border: `2px solid ${theme.palette.primary.main}`,
      background: "white",
      maxWidth: "49% !important",
      minHeight: "56px"
    },
    unCheckedType: {
      borderRadius: "3px",
      border: `2px solid ${theme.palette.gray[300]}`,
      color: theme.palette.gray[400],
      background: "white",
      maxWidth: "49% !important",
      minHeight: "56px"
    },
    radioBody: {
      background: theme.palette.gray[100],
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "12px",
      marginTop: "10px"
    }
  })
);
const MergeList: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState("NewName");

  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  return (
    <div>
      <ModalPopup
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        {...props}
      >
        <div className={classes.root}>
          <Typography variant="h6">Name</Typography>
          <div className={classes.radioBody}>
            <Grid container spacing={1} justifyContent="space-between">
              <Grid
                item
                lg={6}
                md={6}
                className={
                  selectedValue === "NewName"
                    ? classes.checkedType
                    : classes.unCheckedType
                }
              >
                <Radio
                  checked={selectedValue === "NewName"}
                  onChange={handleChangeType}
                  value="NewName"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                Abdul Rehman
              </Grid>
              <Grid
                item
                md={6}
                lg={6}
                className={
                  selectedValue === "OldName"
                    ? classes.checkedType
                    : classes.unCheckedType
                }
              >
                <Radio
                  checked={selectedValue === "OldName"}
                  onChange={handleChangeType}
                  value="OldName"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                Arnold Brecker
              </Grid>
            </Grid>
          </div>
          <br />
          <Typography variant="h6">Billing Phone</Typography>
          <div className={classes.radioBody}>
            <Grid container spacing={1} justifyContent="space-between">
              <Grid
                item
                lg={6}
                md={6}
                className={
                  selectedValue === "NewName"
                    ? classes.checkedType
                    : classes.unCheckedType
                }
              >
                <Radio
                  checked={selectedValue === "NewName"}
                  onChange={handleChangeType}
                  value="NewName"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                (415) 555 2671
              </Grid>
              <Grid
                item
                md={6}
                lg={6}
                className={
                  selectedValue === "OldName"
                    ? classes.checkedType
                    : classes.unCheckedType
                }
              >
                <Radio
                  checked={selectedValue === "OldName"}
                  onChange={handleChangeType}
                  value="OldName"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                (415) 555 26123
              </Grid>
            </Grid>
          </div>
          <br />
          <Typography variant="h6">Billing Address</Typography>
          <div className={classes.radioBody}>
            <Grid container spacing={1} justifyContent="space-between">
              <Grid
                item
                lg={6}
                md={6}
                className={
                  selectedValue === "NewName"
                    ? classes.checkedType
                    : classes.unCheckedType
                }
              >
                <Radio
                  checked={selectedValue === "NewName"}
                  onChange={handleChangeType}
                  value="NewName"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                Title, Company Name <br />
                Address Line 1 here
                <br />
                Address Line 2 here
                <br />
                Country, State, City 54000
              </Grid>
              <Grid
                item
                md={6}
                lg={6}
                className={
                  selectedValue === "OldName"
                    ? classes.checkedType
                    : classes.unCheckedType
                }
              >
                <Radio
                  checked={selectedValue === "OldName"}
                  onChange={handleChangeType}
                  value="OldName"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                Title, Company Name <br />
                Address Line 1 here
                <br />
                Address Line 2 here
                <br />
                Country, State, City 54000
              </Grid>
            </Grid>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
};

export default MergeList;
