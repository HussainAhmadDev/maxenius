import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "Components/Button";
import CheckBox from "Components/CheckBox";
import TextInput from "Components/Form/TextInput";
import DatePicker from "Components/Form/Date";
import { brandParamsGeneralKeys as queryParamsKeys } from "Utils/queryParamKeys";

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

const BrandFilters: React.FC<Props> = () => {
  const classes = useStyles();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Event handlers
  // This function stores the input values inside query parameters
  const handleChange = ({ key, value }: { key: string; value: string }) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleDateChange = (date: Date | null, key: string) => {
    if (date) {
      date
        ? handleChange({ key, value: date.toISOString() })
        : handleChange({ key, value: "" });
    }
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
                name="organization"
                value={searchParams.get("organization") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Organization"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="ein"
                value={searchParams.get("ein") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="EIN"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="email"
                value={searchParams.get("email") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="email"
                label="Email"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="office_phone"
                value={searchParams.get("office_phone") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="number"
                label="Office Phone"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="fax"
                value={searchParams.get("fax") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="numebr"
                label="Fax"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="url"
                value={searchParams.get("url") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="URL"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <DatePicker
                onChange={(date: Date | null) => handleDateChange(date, "login_from")}
                value={
                  searchParams.has("login_from")
                    ? new Date(searchParams.get("login_from") as string)
                    : null
                }
                label="Last Login From"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <DatePicker
                onChange={(date: Date | null) => handleDateChange(date, "login_to")}
                value={
                  searchParams.has("login_to")
                    ? new Date(searchParams.get("login_to") as string)
                    : null
                }
                label="Last Login To"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="domain"
                value={searchParams.get("domain") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Domain"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="address"
                value={searchParams.get("address") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="city"
                value={searchParams.get("city") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address City"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="state"
                value={searchParams.get("state") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address State"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="address_phone"
                value={searchParams.get("address_phone") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="number"
                label="Address Phone"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="address_email"
                value={searchParams.get("address_email") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="emaikl"
                label="Address Email"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <div className={classes.flex}>
                <CheckBox
                  name="search_by_active_brands"
                  checked={!!searchParams.get("search_by_active_brands")}
                  handleChange={e => {
                    handleChange({
                      key: e.target.name,
                      value: e.target.checked ? "1" : ""
                    });
                  }}
                />{" "}
                <Typography variant="body2">Show Active Brands only </Typography>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};
export default BrandFilters;
