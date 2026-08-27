import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Switch from "Components/Switch";
import TextInput from "Components/Form/TextInput";
import { FormikProps } from "formik";
import { CompanyData } from "Interfaces/Company";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    desc: {
      color: theme.palette.text.secondary
    }
  })
);
const TaxExemption: React.FC<{ formik: FormikProps<CompanyData> }> = ({ formik }) => {
  const classes = useStyles();

  return (
    <Grid container style={{ padding: 30 }} direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h6">Tax Exemption</Typography>
      </Grid>
      <Grid item xs={8} lg={8} alignItems="center" justifyContent="center">
        <Grid container item xs={8} justifyContent="space-between">
          <Grid item container xs={6} alignItems="center">
            <Typography className={classes.desc}>Tax Exemption ID</Typography>
            <TextInput
              inputProps={{ "aria-label": "Tax Exemption ID" }}
              type="text"
              name="tax_exempt_id"
              value={formik.values.tax_exempt_id}
              onChange={formik.handleChange}
              disabled={!formik.values.is_tax_exempt}
            />
          </Grid>
          <Switch
            checked={formik.values.is_tax_exempt}
            onClick={() => {
              formik.setFieldValue("is_tax_exempt", !formik.values.is_tax_exempt);
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TaxExemption;
