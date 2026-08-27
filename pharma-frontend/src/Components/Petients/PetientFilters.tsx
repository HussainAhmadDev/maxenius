import * as React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// Components
import Grid from "@mui/material/Grid";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import Select from "Components/Form/Select";
import Prompt from "Components/Prompt";
//hooks
import { useBrand } from "Context/BrandContext";
import { useTheme } from "@mui/material/styles";
import { useCreateCompany } from "Hooks/useCompanies";
//utils
import { getAllWebsites } from "Utils/states";
import { useWebsitesPrescription } from "Hooks/usePatients";

export interface Results {
  consumer_key?: string | null;
  consumer_secret?: string | null;
  id: string;
  site_url: string;
  title: string;
  value?: string;
  label?: string;
}
export interface IWebsites {
  results: Results[];
}
interface IData {
  data: IWebsites;
}
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
      marginTop: theme.spacing(1)
    },
    headerButton: {
      display: "flex",
      justifyContent: "flex-end"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    smallText: {
      fontSize: "12px"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    selectDiv: {
      width: "100%"
    },
    alignCheckBox: {
      marginTop: "1.3rem"
    },
    flexContainer: {
      display: "flex",
      alignItems: "center"
    },
    checkboxContainerSmall: {
      display: "flex",
      flexDirection: "column"
    }
  })
);
interface Props {
  readonly header?: boolean;
}

const CustomerFilters: React.FC<Props> = ({ header }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { activeBrand } = useBrand();
  const { mutate: createCompany } = useCreateCompany();
  const [showFilters] = React.useState<boolean>(true);
  const [showWarning, setShowWarning] = React.useState(false);
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSite, setSelectedSite] = React.useState<Results>({
    id: "",
    site_url: "",
    title: ""
  });

  const searchByBillTo = searchParams.get("search_by_bill_to");
  const searchByShipTo = searchParams.get("search_by_ship_to");

  const disableFields = React.useMemo(
    () => !(!!searchByBillTo || !!searchByShipTo),
    [searchByBillTo, searchByShipTo]
  );

  React.useEffect(() => {
    const initialParams = new URLSearchParams(searchParams);
    initialParams.set("search_by_bill_to", "1");
    initialParams.set("search_by_ship_to", "1");
    // If it's the trash page, also add is_trash to the query params
    ["/trash", "/trash/"].includes(pathname)
      ? initialParams.set("is_trash", "1")
      : initialParams.delete("is_trash");

    setSearchParams(initialParams);
    //eslint-disable-next-line
  }, [pathname]);

  //eslint-disable-next-line
  //@ts-ignore
  const { data }: IData = useWebsitesPrescription();

  const results: Results[] | [] = data?.results;

  return (
    <div>
      <Prompt
        promptMsg={
          "This will create a customer with the customer number only. You'll have to add the rest of the customer information after creation."
        }
        title={`Create new customer`}
        openModal={showWarning}
        onCancel={() => setShowWarning(false)}
        onProceed={() => {
          setShowWarning(false);
          createCompany(activeBrand);
        }}
      />
      {header && (
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item lg={3}>
            <h4 className={classes.heading}>Customer</h4>
          </Grid>
          <Grid item lg={2}>
            <Button
              text="Create Customer"
              type="primaryOutlined"
              icon={<MuiIcon icon="add" />}
              onClick={() => {
                setShowWarning(true);
              }}
              aria-label="create customer"
            />
          </Grid>
        </Grid>
      )}
      <div>
        <div className={classes.searchCustomerBody}>
          <Grid container direction="row" justifyContent="space-between">
            <Grid xs={6} item>
              <h5 className={classes.searchHeading}>Search</h5>
            </Grid>
          </Grid>
          {showFilters && (
            <Grid
              container
              direction="row"
              spacing={1}
              className={classes.formBody}
              aria-label="filters container"
              component="form"
            >
              <Grid lg={4} xs={12} item>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.labelDiv}>
                    <p className={classes.label}>Web Sites:</p>
                  </div>
                  <div className={classes.selectDiv}>
                    {results?.length > 0 && (
                      <Select
                        disabled={disableFields}
                        name="websites"
                        value={
                          selectedSite
                            ? {
                                label: selectedSite.label || "All",
                                value: selectedSite.value || ""
                              }
                            : undefined
                        }
                        options={getAllWebsites(results)}
                        onChange={value => setSelectedSite(value)}
                      />
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;
