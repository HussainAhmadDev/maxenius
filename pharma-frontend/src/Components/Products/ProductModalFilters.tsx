import * as React from "react";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

import Button from "../Button";
import Grid from "@mui/material/Grid";
import MuiIcon from "../icons/MuiIcons";
import TextInput from "../Form/TextInput";
import Typography from "@mui/material/Typography";
import { useLocation, useSearchParams } from "react-router-dom";
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
    checbox: {
      paddingLeft: "0px"
    },
    checkboxText: {
      fontSize: "12px",
      color: theme.palette.text.secondary
    }
  })
);
interface Props {
  readonly hasHeader?: boolean;
}

const queryParamsKeys = [...productParamsGeneralKeys];

const ProductFilters: React.FC<Props> = ({ hasHeader }) => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Event handlers
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

  // Set the default values of search_by_ship_to and search_by_bill_to to true.
  React.useEffect(() => {
    const initialParams = new URLSearchParams(searchParams);
    // If it's the trash page, also add is_trash to the query params
    ["/trash", "/trash/"].includes(pathname)
      ? initialParams.set("is_trash", "1")
      : initialParams.delete("is_trash");
    setSearchParams(initialParams);
    //eslint-disable-next-line
  }, [pathname]);

  return (
    <div>
      {hasHeader && (
        <Grid container justifyContent="space-between">
          <Grid item xs={12} lg={3}>
            <Typography variant="h6">Products</Typography>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Button
              text="Create Product"
              type="primaryOutlined"
              onClick={() => {
                //
              }}
              icon={<MuiIcon icon="add" />}
              disabled
            />
          </Grid>
        </Grid>
      )}
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item lg={3} xs={6}>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid item lg={4} xs={6}>
            <div className={classes.headerButton}>
              <Button
                disabled={!showFilters}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  queryParamsKeys.forEach(key => params.delete(key));
                  setSearchParams(params);
                }}
                text="Reset"
                type="secondary"
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
            <Grid lg={4} xs={12} item>
              <TextInput
                name="sku"
                value={searchParams.get("sku") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Product Number"
              />
            </Grid>
            <Grid lg={8} xs={12} item>
              <TextInput
                name="name"
                value={searchParams.get("name") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Product Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="type"
                value={searchParams.get("type") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Type"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="tags"
                value={searchParams.get("tags") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Tag"
                disabled
              />
            </Grid>

            <Grid lg={4} xs={12} item>
              <TextInput
                name="category"
                value={searchParams.get("category") || ""}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Category"
                disabled
              />
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
