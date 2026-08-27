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
import { usePagesSettings, usePagesSettingsUpdate } from "../../../../Hooks/useBrand";
import { getBrandDetails } from "../../../../Hooks/api";
import { useMemo, useState } from "react";
import { BrandSettings } from "../../../../Interfaces/brandType";
import Checkbox from "../../../../Components/Checkbox";
import LoadingButton from "../../../../Components/LoadingButton";
import { InputValueAndLabel } from "../../../../Interfaces/global";

const ShowHide = () => {
  const brandDetail = getBrandDetails();
  const { data, isLoading } = usePagesSettings(brandDetail?.id);
  const { mutateAsync, isLoading: updateLoading } = usePagesSettingsUpdate(
    brandDetail?.id
  );
  const [settings, setSettings] = useState<BrandSettings>({});
  const handleChange = ({ label, value }: InputValueAndLabel) => {
    setSettings({ ...settings, [label]: Boolean(value) });
  };
  const handleUpdate = () => {
    mutateAsync({ ...settings, dashboard: true });
  };
  useMemo(() => {
    if (data?.length) {
      const initialState = data.reduce((acc, item) => {
        return { ...acc, [item.key]: item.value };
      }, {});

      setSettings(initialState);
    }
  }, [data, setSettings]);
  return (
    <Card>
      <CardHeader
        title={"Show / Hide Options"}
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

        <Box maxWidth={700}>
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
              {Object.keys(settings)?.map((item, key) => (
                <Grid item sm={6} xs={12} key={key}>
                  <Checkbox
                    label={item?.replace(/\/|-/g, " ")}
                    checked={settings[item]}
                    name={item}
                    fullWidth
                    disabled={updateLoading || item === "dashboard"}
                    sx={{ textTransform: "capitalize" }}
                    handleChange={handleChange}
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
          Update Options
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default ShowHide;
