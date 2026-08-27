import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "Components/Form/TextInput";
import Select from "Components/Form/Select";
import { useOrganizations } from "Hooks/useOrgs";
import { useBrands } from "Hooks/useBrands";
import { createFormReducer } from "Reducers/formReducer";
import { Grid, Typography } from "@mui/material";
import IncludeFilterList from "./IncludeFilterList";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexDiv: {
      display: "flex",
      width: "fit-content"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    selectDiv: {
      width: "100%"
    },
    smallText: {
      fontSize: "12px"
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "20px 0"
    },
    dataTypeHeading: {
      textTransform: "capitalize",
      fontWeight: 500
    },
    toggleButton: {
      textTransform: "capitalize"
    }
  })
);

interface Option {
  value: string;
  label: string;
}

interface ProductSelectorState {
  organization: string;
  brand: string;
  type: string;
  retail_price_from: string;
  retail_price_to: string;
  ship_price_from: string;
  ship_price_to: string;
}

const initialProductSelectorState = {} as ProductSelectorState;

const formReducer = createFormReducer<ProductSelectorState>(initialProductSelectorState);

const rows = [
  {
    id: "11",
    text: "Product No: 11"
  },
  {
    id: "12",
    text: "Product No: 12"
  },
  {
    id: "13",
    text: "Product No: 13"
  },
  {
    id: "14",
    text: "Product No: 14"
  },
  {
    id: "15",
    text: "Product No: 15"
  },
  {
    id: "16",
    text: "Product No: 16"
  },
  {
    id: "17",
    text: "Product No: 17"
  },
  {
    id: "18",
    text: "Product No: 18"
  },
  {
    id: "19",
    text: "Product No: 19"
  }
];

const ProductSelector = () => {
  const classes = useStyles();

  const { data: organizations } = useOrganizations();
  const [products, setProducts] =
    React.useState<Array<{ id: string; text: string }>>(rows);
  const [selectedProducts, setSelectedProducts] = React.useState<
    Array<{ id: string; text: string }>
  >([]);
  const [filterType, setFilterType] = React.useState("exclude");
  const organizationOptions =
    organizations?.results.map(organization => {
      return { value: organization.name, label: organization.name };
    }) ?? [];

  const { data: brands } = useBrands();
  const brandsOptions =
    brands?.results.map(brand => {
      return { value: brand.name, label: brand.name };
    }) ?? [];

  const productTypes: Array<Option> = [
    { label: "Digital Subscription", value: "Digital Subscription" },
    { label: "Physical Products", value: "Physical Products" },
    { label: "Digital Download", value: "Digital Download" }
  ];

  const [productSelectorState, dispatch] = React.useReducer(
    formReducer,
    initialProductSelectorState
  );

  const handlefilterTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterType: string | null
  ) => {
    if (newFilterType !== null) {
      setFilterType(newFilterType);
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: name,
      payload: value
    });
  };

  return (
    <>
      <div className={classes.header}>
        <div>
          <Typography variant="subtitle1" className={classes.dataTypeHeading}>
            Products
          </Typography>
        </div>
        <div>
          <ToggleButtonGroup
            size="small"
            color="error"
            value={filterType}
            exclusive
            onChange={handlefilterTypeChange}
            aria-label="filter Type"
          >
            <ToggleButton value="exclude" aria-label="exclude">
              <span className={classes.toggleButton}>Exclude</span>
            </ToggleButton>
            <ToggleButton value="include" aria-label="include">
              <span className={classes.toggleButton}>Include</span>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <Grid container alignItems="start" spacing={3}>
        <Grid item lg={4}>
          <>
            <div className={classes.flexAlign}>
              <div className={classes.labelDiv}>
                <p className={classes.label}>Organization:</p>
              </div>
              <div className={classes.selectDiv}>
                <Select
                  defaultValue={organizationOptions[0]}
                  options={organizationOptions}
                />
              </div>
            </div>
            <div className={classes.flexAlign}>
              <div className={classes.labelDiv}>
                <p className={classes.label}>Brand:</p>
              </div>
              <div className={classes.selectDiv}>
                <Select defaultValue={brandsOptions[0]} options={brandsOptions} />
              </div>
            </div>
            <div className={classes.flexAlign}>
              <div className={classes.labelDiv}>
                <p className={classes.label}>Type:</p>
              </div>
              <div className={classes.selectDiv}>
                <Select defaultValue={productTypes[0]} options={productTypes} />
              </div>
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="retail_price_from"
                margin="dense"
                variant="outlined"
                type="text"
                label="Retail Price From($)"
                placeholder="$0"
                value={productSelectorState.retail_price_from}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="retail_price_to"
                margin="dense"
                variant="outlined"
                type="text"
                label="Retail Price To($)"
                placeholder="$1,000.00"
                value={productSelectorState.retail_price_to}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="ship_price_from"
                margin="dense"
                variant="outlined"
                type="text"
                label="Ship Price From($)"
                placeholder="$0"
                value={productSelectorState.ship_price_from}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="ship_price_to"
                margin="dense"
                variant="outlined"
                type="text"
                label="Ship Price To($)"
                placeholder="$1,000.00"
                value={productSelectorState.ship_price_to}
                onChange={handleTextChange}
              />
            </div>
          </>
        </Grid>
        <Grid item lg={4}>
          <IncludeFilterList
            headingText="Product No's"
            headingButtonText="Add All"
            icon={<ArrowForwardIcon />}
            onRowClicked={(row: { id: string; text: string }) => {
              setSelectedProducts([
                ...selectedProducts,
                ...products.filter(order => order.id === row.id)
              ]);
              setProducts([...products.filter(order => order.id !== row.id)]);
            }}
            handleHeadingButton={() => {
              setSelectedProducts([...products, ...selectedProducts]);
              setProducts([]);
            }}
            data={products}
          />
        </Grid>
        <Grid item lg={4}>
          <IncludeFilterList
            headingText={
              filterType === "exclude" ? "Excluded Products" : "Included Products"
            }
            headingButtonText="Remove All"
            icon={<RemoveCircleOutlineIcon />}
            data={selectedProducts}
            onRowClicked={(row: { id: string; text: string }) => {
              setProducts([
                ...products,
                ...selectedProducts.filter(order => order.id === row.id)
              ]);
              setSelectedProducts([
                ...selectedProducts.filter(order => order.id !== row.id)
              ]);
            }}
            handleHeadingButton={() => {
              setProducts([...products, ...selectedProducts]);
              setSelectedProducts([]);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ProductSelector;
