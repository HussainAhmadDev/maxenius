import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { useVendorsSettings, useVendorsSettingsUpdate } from "../../../../Hooks/useBrand";
import { getBrandDetails } from "../../../../Hooks/api";
import { useMemo, useState } from "react";
import { PageAllowedToBrand } from "../../../../Interfaces/brandType";
import Checkbox from "../../../../Components/Checkbox";
import LoadingButton from "../../../../Components/LoadingButton";
import { InputValueAndLabel } from "../../../../Interfaces/global";

const VenodsSettings = () => {
  const brandDetail = getBrandDetails();
  const { data, isLoading } = useVendorsSettings(brandDetail?.id);
  const { mutateAsync, isLoading: updateLoading } = useVendorsSettingsUpdate();
  const [settings, setSettings] = useState<PageAllowedToBrand[]>([]);

  const handleChange =
    (id: string) =>
    ({ value }: InputValueAndLabel) => {
      const updatedSettings = [...settings];
      const ind = updatedSettings?.findIndex(el => el?.vendor_id === id);
      if (ind !== -1) {
        updatedSettings[ind].is_active = Boolean(value);
      }
      setSettings(updatedSettings);
    };

  const handleUpdate = () => {
    mutateAsync(
      settings.reduce((acc, item) => {
        return { ...acc, [item.vendor_id]: item.is_active };
      }, {})
    );
  };

  useMemo(() => {
    if (data?.length) {
      setSettings(data);
    }
  }, [data, setSettings]);

  const columns = data && data?.length > 10 ? 3 : 2;

  return (
    <Card>
      <CardHeader
        title={"Allowed Vendors"}
        titleTypographyProps={{
          fontSize: 20,
          fontWeight: "bold"
        }}
      />
      <Divider />

      <CardContent sx={{ maxHeight: 400, overflowY: "auto" }}>
        <Typography variant="h5" fontSize={16} fontWeight={"500"} mb={1}>
          Brand: {brandDetail?.name}
        </Typography>

        <Box maxWidth={columns === 3 ? "!00%" : 700}>
          {isLoading ? (
            <Stack
              width={"100%"}
              direction={"row"}
              columnGap={5}
              sx={{ flexWrap: { sm: "nowrap", xs: "wrap" } }}
              rowGap={2}
            >
              <Stack width={"100%"} gap={2}>
                {[...Array(5)].map((_, ind) => (
                  <Skeleton
                    width={"100%"}
                    height={40}
                    variant="rounded"
                    key={ind}
                    animation="wave"
                  />
                ))}
              </Stack>
              <Stack width={"100%"} gap={2}>
                {[...Array(5)].map((_, ind) => (
                  <Skeleton
                    width={"100%"}
                    height={40}
                    variant="rounded"
                    key={ind}
                    animation="wave"
                  />
                ))}
              </Stack>
            </Stack>
          ) : (
            <Grid container columnSpacing={10} rowSpacing={2}>
              {settings?.map((item, key) => (
                <Grid item xs={12} sm={6} md={columns === 3 ? 4 : 6} key={key}>
                  <Checkbox
                    fullWidth
                    label={item?.key?.replace(/\/|-/g, " ")}
                    checked={item?.is_active}
                    name={item?.key}
                    disabled={updateLoading}
                    sx={{ textTransform: "capitalize" }}
                    handleChange={handleChange(item.vendor_id)}
                  />
                  <Divider />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2 }}>
        <LoadingButton variant="contained" loading={updateLoading} onClick={handleUpdate}>
          Update Vendors Settings
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default VenodsSettings;
