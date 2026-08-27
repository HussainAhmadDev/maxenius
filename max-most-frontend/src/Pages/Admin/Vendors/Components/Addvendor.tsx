import {
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  CardActions,
  Button
} from "@mui/material";
import Input from "../../../../Components/Input";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import Checkbox from "../../../../Components/Checkbox";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Vendor, VendorFormValues } from "../../../../Interfaces/vendorsType";
import {
  useCreateVendor,
  useUpdateVendor,
  useVendorById
} from "../../../../Hooks/useVendors";
import SelectField from "../../../../Components/SelectField";
import { currencyOptions } from "../../../../Constants";

function AddVendor() {
  const [values, setValues] = useState<VendorFormValues>({
    address: "",
    alternative_address: "",
    city: "",
    contact_name: "",
    contact_phone: "",
    country: "",
    currency: "",
    email: "",
    fax: "",
    is_active: false,
    name: "",
    post_code: "",
    region: "",
    secondary_phone: "",
    webpage: ""
  });
  const handleChange = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      setValues({ ...values, [label]: value });
    }
  };
  const { id } = useParams();
  const { data, isLoading: fetchLoading } = useVendorById(id!);
  const { mutate: createNewVendor, isLoading: createLoading } = useCreateVendor();
  const { mutate: updateNewVendor, isLoading: updateLoading } = useUpdateVendor(id!);
  const loading = fetchLoading || createLoading || updateLoading;
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const vals = { ...values } as unknown as Vendor;
    if (id) {
      updateNewVendor(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/vendors`);
          }
        }
      );
    } else {
      createNewVendor(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/vendors`);
          }
        }
      );
    }
  };
  useMemo(() => {
    if (data) {
      const {
        address,
        alternative_address,
        city,
        contact_name,
        contact_phone,
        country,
        currency,
        email,
        fax,
        is_active,
        name,
        post_code,
        region,
        secondary_phone,
        webpage
      } = data;
      setValues({
        address,
        alternative_address,
        city,
        contact_name,
        contact_phone,
        country,
        currency,
        email,
        fax,
        is_active: Boolean(is_active),
        name,
        post_code,
        region,
        secondary_phone,
        webpage
      });
    }
  }, [data, setValues]);
  return (
    <>
      <Card>
        <CardHeader
          title={`${id ? "Update" : "Add"} Vendor`}
          titleTypographyProps={{
            variant: "h4",
            fontWeight: "bold"
          }}
        />
        <Divider />
        <Box width={"100%"} maxWidth={"700px"} component={"form"} onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Vendor Name :"
                  name="name"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Contact Name :"
                  name={"contact_name"}
                  handleChange={handleChange}
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.contact_name}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Address :"
                  name="address"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.address}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Alternative Address :"
                  name="alternative_address"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.alternative_address}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="City/Town :"
                  name="city"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.city}
                  id="cy__UpadateVendorCity"
                />
              </Grid>

              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Region :"
                  name="region"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.region}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Post code :"
                  name="post_code"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.post_code}
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Country :"
                  name="country"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.country}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Contact Telephone :"
                  name="contact_phone"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.contact_phone}
                  type="tel"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Secondary Telephone :"
                  name="secondary_phone"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.secondary_phone}
                  type="tel"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Fax :"
                  name="fax"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.fax}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Email :"
                  name="email"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.email}
                  type="email"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Webpage :"
                  name="webpage"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.webpage}
                  type="url"
                  id="cy__Webpage"
                />
              </Grid>
              <Grid item xs={6}>
                <SelectField
                  handleSelect={({ value }, label) => handleChange({ label, value })}
                  label="Currency :"
                  name="currency"
                  options={currencyOptions}
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.currency}
                />
              </Grid>
              <Grid item xs={12}>
                <Checkbox
                  label="Mark as not-active"
                  handleChange={handleChange}
                  name="is_active"
                  loading={fetchLoading}
                  disabled={loading}
                  checked={!!values?.is_active}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "space-between",
              p: 2
            }}
          >
            <Button
              color="secondary"
              variant="contained"
              disabled={loading}
              onClick={() => navigate("/admin/vendors")}
            >
              Cancel
            </Button>{" "}
            <Button type="submit" variant="contained" disabled={loading} id="cy__SaveBtn">
              {id ? "Save" : "Add"} Vendor
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}
export default AddVendor;
