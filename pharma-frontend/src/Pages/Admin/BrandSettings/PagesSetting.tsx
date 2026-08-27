import * as React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useBrand } from "Context/BrandContext";
import Button from "Components/Button";
import { usePagesSetting, usePagesSettingUpdate } from "Hooks/useBrands";
import CircularProgress from "@material-ui/core/CircularProgress";

type BrandSettings = {
  [key: string]: boolean;
};

export const BrandSettings: React.FC = () => {
  const { brandDetail } = useBrand();

  const { data, isLoading } = usePagesSetting(brandDetail?.id);

  const { mutate, isLoading: settingUpdateLoading } = usePagesSettingUpdate();

  const [pagesSettings, setPagesSetting] = React.useState<BrandSettings | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (data) {
      const initialState = data.reduce((acc, item) => {
        return { ...acc, [item.key]: item.value };
      }, {});

      setPagesSetting(initialState);
    }
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pagesSettings &&
      setPagesSetting({
        ...pagesSettings,
        [event.target.name]: event.target.checked
      });
  };

  const transformToLabel = (input: string): string => {
    const modifiedInput = input === "/" ? "dashboard" : input;
    const formattedString = modifiedInput.replace(/\/|-/g, " "); // Replace / and - with space
    return formattedString
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const updateHandler = () => {
    pagesSettings && mutate(pagesSettings);
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
        <h3> Show / Hide Options</h3>

        <FormLabel component="legend">Brand: {brandDetail?.name}</FormLabel>
      </Box>

      <Box sx={{ display: "flex" }}>
        <FormControl component="fieldset" variant="standard">
          <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
            {!isLoading ? (
              data?.map(item => {
                return (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={pagesSettings ? pagesSettings[item.key] : false}
                        onChange={handleChange}
                        name={item.key}
                      />
                    }
                    label={transformToLabel(item.key)}
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
              text="Update Show / Hide Options"
              loading={settingUpdateLoading}
              disabled={settingUpdateLoading || isLoading || !data}
            />
          </Box>
        </FormControl>
      </Box>
    </div>
  );
};

export default BrandSettings;
