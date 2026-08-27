import * as React from "react";
// import { useLocation, useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../../Button";
import TextInput from "../../Form/TextInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "Components/Form/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      justifyContent: "space-between",
      display: "flex"
    },
    heading: {
      fontSize: "21px"
    },
    DateTextField: {
      paddingLeft: "3px"
    },
    searchCustomerBody: {
      widht: "100%",
      background: theme.palette.gray[100],
      borderRadius: "6px",
      marginTop: "20px",
      padding: "25px"
    },
    searchHeading: {
      fontSize: "14px"
    },
    formBody: {
      marginTop: "20px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    smallText: {
      fontSize: "12px"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    w100: {
      width: "100%"
    },
    labelDiv: {
      minWidth: "130px"
    },
    selectDiv: {
      width: "100%"
    },
    flexContainer: {
      display: "flex",
      alignItems: "center"
    },
    checkboxContainerSmall: {
      display: "flex",
      flexDirection: "column"
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px",
      padding: "0px 13px",
      marginBottom: 4
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      padding: "0px 13px",
      color: theme.palette.gray[400],
      marginBottom: 4
    },
    pointer: {
      cursor: "pointer"
    },
    radioButton: {
      padding: "7px"
    }
  })
);
interface Props {
  readonly header?: boolean;
}

interface Option {
  value: string;
  label: string;
}

const searchBy: Array<Option> = [
  { label: "SKU / Title / Barcode", value: "sku-title-barcode" },
  { label: "Amazon ASIN", value: "amazon-aSIN" },
  { label: "Barcode", value: "barcode" },
  { label: "Batch Number", value: "Batch Number" }
];
const categoryOptions: Array<Option> = [
  { label: "All Categories", value: "all-categories" },
  { label: "Default", value: "default" }
];

const MyInventoryFilters: React.FC<Props> = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  return (
    <div>
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid xs={6} item>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid xs={6} container item justifyContent="flex-end">
            <div className={classes.flexContainer}>
              <Button
                disabled={!showFilters}
                text="Reset"
                type="secondary"
                style={{ margin: "2px" }}
                onClick={() => {}}
              />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                text={showFilters ? "Hide" : "Show"}
                style={{ margin: "2px" }}
                type="secondary"
              />
            </div>
          </Grid>
        </Grid>

        {showFilters && (
          <Grid container spacing={1} className={classes.formBody} alignItems="center">
            <Grid lg={4} xs={12} item>
              <div className={matches ? classes.flexAlign : ""}>
                <div className={classes.labelDiv}>
                  <p className={classes.label}>Search By:</p>
                </div>
                <div className={classes.selectDiv}>
                  <Select ariaLabel="search by" options={searchBy} name="searchby" />{" "}
                </div>
              </div>
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                inputProps={{ "aria-label": "search by" }}
                name="search"
                margin="dense"
                variant="outlined"
                type="text"
                label="Search"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <div className={matches ? classes.flexAlign : ""}>
                <div className={classes.labelDiv}>
                  <p className={classes.label}>Category:</p>
                </div>
                <div className={classes.selectDiv}>
                  <Select
                    ariaLabel="category"
                    options={categoryOptions}
                    name="category"
                  />{" "}
                </div>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default MyInventoryFilters;
