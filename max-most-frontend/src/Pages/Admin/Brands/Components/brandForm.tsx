import { Box, Button, Card, CardActions, CardContent, Grid } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../../../Components/Input";
import TextArea from "../../../../Components/Textarea";
import { useMemo, useState } from "react";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import SelectField from "../../../../Components/SelectField";
import { CurrencyLabel, currencyOptions, currencySymbols } from "../../../../Constants";
import { useBrand, useCreateBrand, useUpdateBrand } from "../../../../Hooks/useBrand";
import LoadingButton from "../../../../Components/LoadingButton";
import { getBrandDetails } from "../../../../Hooks/api";

const BrandForm = () => {
  const { id } = useParams();
  const activeBrand = getBrandDetails();

  const { data: brand, isLoading: brandFetchLoading } = useBrand(id || "");
  const { mutateAsync: createBrand, isLoading: createLoading } = useCreateBrand();
  const { mutateAsync: updateBrand, isLoading: updateLoading } = useUpdateBrand();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    description: "",
    url: "https://",
    currency: "",
    organization_id: activeBrand?.organization_id,
    address_id: activeBrand?.address_id?.toString()
  });

  const currencySymbol = useMemo(
    () => currencySymbols[values?.currency?.toUpperCase() as CurrencyLabel],
    [values]
  );
  const handleChange = (val: InputValueAndLabel) => {
    if (val.label) {
      setValues({ ...values, [val.label]: val.value });
    } else {
      console.error("Label is undefined");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      updateBrand({ ...values, currency_symbol: currencySymbol, id });
    } else {
      createBrand({ ...values, currency_symbol: currencySymbol }).then(() =>
        navigate("/admin/brands")
      );
    }
  };

  useMemo(() => {
    if (brand) {
      const { name, organization_id, address_id, currency, description, url } = brand;
      setValues({ name, organization_id, address_id, currency, description, url });
    }
  }, [brand, setValues]);
  return (
    <Card>
      <Box component={"form"} onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            {id && (
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  name="Organization"
                  label="Organization ID :"
                  value={activeBrand?.organization_id}
                  handleChange={handleChange}
                  loading={brandFetchLoading}
                  required
                  disable
                />
              </Grid>
            )}
            <Grid item md={4} sm={6} xs={12}>
              <Input
                name="name"
                label="Brand Name :"
                value={values.name}
                handleChange={handleChange}
                loading={brandFetchLoading}
                required
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Input
                name="url"
                label="URL :"
                type="url"
                value={values.url}
                handleChange={handleChange}
                loading={brandFetchLoading}
                required
              />
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <SelectField
                name="currency"
                label="Currency :"
                options={currencyOptions}
                value={values.currency}
                loading={brandFetchLoading}
                subValue={currencySymbol}
                handleSelect={opt => {
                  handleChange({ label: "currency", value: opt.label });
                }}
                required
              />
            </Grid>
            <Grid xs={12} item>
              <TextArea
                label="Description"
                name="description"
                value={values.description}
                handleChange={handleChange}
                loading={brandFetchLoading}
                maxLength={265}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Link
            to={"/admin/brands"}
            style={{ pointerEvents: createLoading || brandFetchLoading ? "none" : "all" }}
          >
            <Button
              variant="contained"
              color="secondary"
              disabled={createLoading || brandFetchLoading}
            >
              Cancel
            </Button>
          </Link>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={createLoading || updateLoading}
            disabled={brandFetchLoading}
          >
            {id ? "Save" : "Add"} Brand
          </LoadingButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default BrandForm;
