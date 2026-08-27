import * as React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useBrand } from "Context/BrandContext";
import Button from "Components/Button";
import { useVendorsSettingUpdate, useVendorsSetting } from "Hooks/useBrands";
import CircularProgress from "@material-ui/core/CircularProgress";

type BrandSettings = {
  [key: string]: boolean;
};

export const VendorsSetting: React.FC = () => {
  const { brandDetail } = useBrand();

  const { data, isLoading } = useVendorsSetting(brandDetail?.id);

  const { mutate, isLoading: settingUpdateLoading } = useVendorsSettingUpdate();

  const [vendorSetting, setVendorSetting] = React.useState<BrandSettings | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (data) {
      const initialState = data.reduce((acc, item) => {
        return { ...acc, [item.vendor_id]: item.is_active };
      }, {});

      setVendorSetting(initialState);
    }
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    vendorSetting &&
      setVendorSetting({
        ...vendorSetting,
        [event.target.name]: event.target.checked
      });
  };
  const updateHandler = () => {
    vendorSetting && mutate(vendorSetting);
  };

  return (
    <div
      style={{
        padding: 30,
        background: "#f1f1f1",
        margin: "20px",
        borderRadius: "5px",
        borderBottom: "2px solid red",
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)"
      }}
    >
      <Box>
        <h3> Allowed Vendors</h3>
        <FormLabel component="legend">Brand: {brandDetail?.name}</FormLabel>
      </Box>

      <Box sx={{ display: "flex" }}>
        <FormControl component="fieldset" variant="standard">
          <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
            {!isLoading ? (
              data?.map((item, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={vendorSetting ? vendorSetting[item.vendor_id] : false}
                        onChange={handleChange}
                        name={item?.vendor_id?.toString()}
                      />
                    }
                    label={item.key}
                  />
                );
              })
            ) : (
              <div style={{ width: "100%", textAlign: "center", paddingTop: "30px" }}>
                <CircularProgress />
              </div>
            )}
          </FormGroup>
          <Box style={{ marginTop: 20 }}>
            <Button
              onClick={updateHandler}
              variant="contained"
              text="Update Vendor Setting"
              loading={settingUpdateLoading}
              disabled={settingUpdateLoading || isLoading || !data}
            />
          </Box>
        </FormControl>
      </Box>
    </div>
  );
};

export default VendorsSetting;
