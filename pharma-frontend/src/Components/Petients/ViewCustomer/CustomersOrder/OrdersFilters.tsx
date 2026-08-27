import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../../../Button";
import TextInput from "../../../Form/TextInput";
import { useSearchParams } from "react-router-dom";
import { productParamsGeneralKeys } from "Utils/queryParamKeys";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      justifyContent: "space-between",
      display: "flex"
    },
    heading: {
      fontSize: "21px"
    },
    searchCustomerBody: {
      widht: "100%",
      background: theme.palette.gray[100],
      borderRadius: "6px",
      marginTop: "10px",
      padding: "25px"
    },
    searchHeading: {
      fontSize: "14px"
    },
    formBody: {
      marginTop: "20px"
    },

    headerButton: {
      display: "flex",
      justifyContent: "flex-end"
    },
    buttonDiv: {
      textAlign: "right"
    },
    selectLabel: {
      color: theme.palette.text.secondary,
      fontSize: "11px"
    },
    selectConatiner: {
      width: "89%",
      marginLeft: "auto"
    }
  })
);

const queryParamsKeys = [...productParamsGeneralKeys];

const ContactFilters: React.FC = props => {
  const classes = useStyles();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = ({ key, value }: { key: string; value: string }) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name: key, value } = event.currentTarget;
    handleChange({ key, value });
  };

  return (
    <div>
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item lg={3} xs={6}>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid item lg={4} xs={6}>
            <div className={classes.headerButton}>
              {/* <Button disabled={!showFilters} text="Search" type="secondary" /> */}
              &nbsp;
              <Button
                disabled={!showFilters}
                text="Reset"
                type="secondary"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  queryParamsKeys.forEach(key => params.delete(key));
                  setSearchParams(params);
                }}
              />
              &nbsp;
              <Button
                onClick={() => setShowFilters(!showFilters)}
                text={showFilters ? "Hide" : "Show"}
                type="secondary"
              />
            </div>
          </Grid>
        </Grid>

        {showFilters && (
          <Grid
            container
            direction="row"
            spacing={1}
            className={classes.formBody}
            justifyContent="space-between"
          >
            <Grid item lg={6} md={6} xs={6}>
              <Grid container alignItems="center">
                <Grid item lg={6} md={10} sm={10} xs={6}>
                  <TextInput
                    name="product_name"
                    value={searchParams.get("product_name") || ""}
                    onChange={handleTextChange}
                    margin="dense"
                    label="Product Name"
                    variant="outlined"
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={6} md={6} xs={6}>
              <Grid container alignItems="center">
                <Grid item lg={6} md={10} sm={10} xs={6}>
                  <TextInput
                    name="order_number"
                    value={searchParams.get("order_number") || ""}
                    onChange={handleTextChange}
                    margin="dense"
                    label="Order Number"
                    variant="outlined"
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default ContactFilters;
