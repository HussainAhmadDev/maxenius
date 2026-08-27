import {
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  CardActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import Input from "../../../../Components/Input";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import Checkbox from "../../../../Components/Checkbox";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateWebsite,
  useUpdateWebsite,
  useWebsiteByID
} from "../../../../Hooks/useWebsites";

import { Website, WebsiteCreateBody } from "../../../../Interfaces/webstiteType";
import { toast } from "react-toastify";
import { getBrandDetails } from "../../../../Hooks/api";
import SelectField from "../../../../Components/SelectField";

const LabelTemplateEnum = {
  PRESET: "preset",
  DEFAULT: "default"
};

const platformOptions = [
  { label: "Shopify", value: "shopify" },
  { label: "eBay", value: "ebay" },
  { label: "WooCommerce", value: "woocommerce" }
];

function CreateWebsite() {
  const [values, setValues] = useState<Partial<Website>>({
    title: "",
    consumer_key: "",
    consumer_secret: "",
    site_url: "https://",
    authorization_key: "",
    brand_id: "",
    prescription: false,
    is_trash: false,
    label_template: LabelTemplateEnum.PRESET,
    platform: ""
  });

  const handleChange = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      setValues({ ...values, [label]: value });
    }
  };

  const { id } = useParams();
  const { data, isLoading: fetchLoading } = useWebsiteByID(id!);
  const { mutate: createNewWebsite, isLoading: createLoading } = useCreateWebsite();
  const { mutate: updateWebsite, isLoading: updateLoading } = useUpdateWebsite(id);
  const active_brand = getBrandDetails();
  const loading = fetchLoading || createLoading || updateLoading;
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredKeys = [
      "title",
      "consumer_key",
      "consumer_secret",
      "site_url",
      "authorization_key",
      "prescription",
      "is_trash",
      "label_template",
      "platform"
    ];
    const missingKeys = requiredKeys.filter(key => values[key as keyof Website] === "");
    const displayedMissingKeys = missingKeys.map(key => key.split("_").join(" "));

    if (missingKeys.length > 0) {
      toast.error(`Following keys are missing: ${displayedMissingKeys.join(", ")}`);
      return;
    }
    const vals = {
      ...values
    } as WebsiteCreateBody;
    if (id) {
      updateWebsite(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/websites`);
          }
        }
      );
    } else {
      createNewWebsite(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/websites`);
          }
        }
      );
    }
  };

  useMemo(() => {
    if (data) {
      const {
        title,
        consumer_key,
        consumer_secret,
        site_url,
        authorization_key,
        brand_id,
        prescription,
        is_trash,
        label_template
      } = data;
      setValues({
        title,
        consumer_key,
        consumer_secret,
        site_url,
        authorization_key,
        brand_id,
        prescription,
        is_trash,
        label_template
      });
    }
  }, [data, setValues]);

  return (
    <>
      <Card>
        <CardHeader
          title={`${id ? "Update" : "Create"} Website`}
          titleTypographyProps={{
            variant: "h4",
            fontWeight: "bold"
          }}
        />
        <Divider />
        <Box width={"100%"} maxWidth={"700px"} component={"form"} onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              {id && (
                <Grid item xs={6}>
                  <Input
                    handleChange={handleChange}
                    label="Organization ID :"
                    name="organization_id"
                    loading={fetchLoading}
                    disable={true}
                    value={active_brand?.organization_id ?? ""}
                  />
                </Grid>
              )}
              {id && (
                <Grid item xs={6}>
                  <Input
                    handleChange={handleChange}
                    label="Brand ID:"
                    name="brand_id"
                    loading={fetchLoading}
                    disable={true}
                    value={active_brand?.id ?? ""}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Title :"
                  name="title"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.title}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  label="Site URL :"
                  name="site_url"
                  handleChange={handleChange}
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.site_url}
                  type="url"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Consumer Secret :"
                  name="consumer_secret"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.consumer_secret}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Consumer Key :"
                  name="consumer_key"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.consumer_key}
                />
              </Grid>

              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Authorization Key :"
                  name="authorization_key"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.authorization_key}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectField
                  handleSelect={({ value }) => {
                    setValues({ ...values, brand_id: value });
                  }}
                  options={[
                    { label: "preset", value: "preset" },
                    { label: "default", value: "default" }
                  ]}
                  label="Label Template :"
                  name="label_template"
                  value={values?.label_template}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={values?.platform || ""}
                    onChange={e => {
                      setValues({ ...values, platform: e.target.value });
                    }}
                    label="Platform"
                  >
                    {platformOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Checkbox
                  label="Prescription"
                  handleChange={handleChange}
                  name="prescription"
                  loading={fetchLoading}
                  disabled={loading}
                  checked={!!values?.prescription}
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
              onClick={() => navigate("/admin/websites")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {id ? "Save" : "Create"} Website
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}

export default CreateWebsite;
