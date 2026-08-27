import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography
} from "@mui/material";
import { useBrands } from "Hooks/useBrands";
import { UserData } from "Interfaces/User";
import { FormikProps } from "formik";
import React from "react";

interface Props {
  formik: FormikProps<Partial<UserData>>;
  data?: Partial<UserData>;
}

const UserBrand = ({ formik, data }: Props) => {
  const { data: brands } = useBrands();

  return (
    <>
      <Box my={2}>
        <Typography variant="h6">Allowed Brands</Typography>
      </Box>
      <Box my={2}>
        <Typography variant="body1">Add User Brands</Typography>
      </Box>

      <FormControl
        component="fieldset"
        variant="standard"
        error={formik.touched.brands && Boolean(formik.errors.brands)}
      >
        <FormGroup row={true}>
          {brands?.results.map(({ id, name }) => (
            <FormControlLabel
              key={id}
              label={name}
              control={
                <Checkbox
                  name="brands"
                  value={id}
                  onChange={formik.handleChange}
                  sx={{ "&.Mui-checked": { color: "#FF173D" } }}
                  checked={
                    data &&
                    typeof data.brands === "object" &&
                    data.brands.some(brandId => brandId === id)
                  }
                />
              }
            />
          ))}
        </FormGroup>
        <FormHelperText>{formik.touched.brands && formik.errors.brands}</FormHelperText>
      </FormControl>
    </>
  );
};

export default UserBrand;
