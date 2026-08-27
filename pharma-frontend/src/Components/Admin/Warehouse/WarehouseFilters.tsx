import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "Components/Button";
import CheckBox from "Components/CheckBox";
import TextInput from "Components/Form/TextInput";
import { warehouseParamsGeneralKeys as queryParamsKeys } from "Utils/queryParamKeys";

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
      marginTop: "20px",
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
    flex: {
      display: "flex",
      alignItems: "center"
    },
    createBtn: {
      textAlign: "right"
    }
  })
);
interface Props {
  readonly header?: boolean;
}

const WarehouseFilters: React.FC<Props> = () => {
  const classes = useStyles();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // This function stores the input values inside query parameters
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
              <Button
                disabled={!showFilters}
                text="Reset"
                type="secondary"
                style={{ margin: "2px" }}
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
            columnSpacing={3}
            className={classes.formBody}
            justifyContent="flex-start"
          >
            <Grid lg={4} xs={12} item>
              <TextInput
                name="name"
                value={searchParams.get("name") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="cityOrTown"
                value={searchParams.get("cityOrTown") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="CIty/Town"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="region"
                value={searchParams.get("region") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Region"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="postCode"
                value={searchParams.get("postCode") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Post code"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="country"
                value={searchParams.get("country") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Country"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <div className={classes.flex}>
                <CheckBox
                  name="search_by_active_warehouses"
                  checked={!!searchParams.get("search_by_active_warehouses")}
                  handleChange={e => {
                    handleChange({
                      key: e.target.name,
                      value: e.target.checked ? "1" : ""
                    });
                  }}
                />{" "}
                <Typography variant="body2">Show Active Warehouses only </Typography>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};
export default WarehouseFilters;
