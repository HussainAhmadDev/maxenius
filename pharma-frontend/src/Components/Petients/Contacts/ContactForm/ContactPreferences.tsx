import * as React from "react";
import { Typography, Checkbox, Avatar } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import MuiIcon from "../../../icons/MuiIcons";
import { ContactFormValidation } from "Interfaces/Company";
import { FormikProps } from "formik";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "30px"
    },
    cardBody: {
      width: "100%",
      height: "116px",
      borderRadius: "6px",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      padding: "10px",
      paddingTop: "5px",
      cursor: "pointer"
    },
    cardBodySelected: {
      width: "100%",
      height: "116px",
      cursor: "pointer",
      borderRadius: "6px",
      border: `1px solid ${theme.palette.primary.main}`,
      padding: "10px",
      paddingTop: "5px"
    },
    title: {
      marginTop: "10px"
    },
    cardIcon: {
      textAlign: "center",
      marginTop: "-20px"
    },
    avatar: {
      margin: "auto",
      height: "50px",
      width: "50px",
      backgroundColor: theme.palette.gray[100]
    },
    container: {
      marginTop: "40px",
      marginBottom: "100px"
    }
  })
);

interface Props {
  formik: FormikProps<ContactFormValidation>;
}
const ContactPreferences: React.FC<Props> = ({ formik }) => {
  const classes = useStyles();

  const handleChange = (
    key: "do_not_email" | "do_not_call" | "do_not_text" | "do_not_mail"
  ) => {
    formik.setFieldValue(key, !formik.values[key], true);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6">Contact Preferences</Typography>
      <Grid className={classes.container} container spacing={1}>
        <Grid item xs={6} lg={3}>
          <div
            className={
              formik.values.do_not_email ? classes.cardBody : classes.cardBodySelected
            }
            onClick={() => handleChange("do_not_email")}
          >
            <div>
              <Checkbox
                value={!formik.values.do_not_email}
                checked={!formik.values.do_not_email}
              />
            </div>
            <div className={classes.cardIcon}>
              <Avatar className={classes.avatar}>
                <MuiIcon
                  fontSize="large"
                  color={formik.values.do_not_email ? "disabled" : "primary"}
                  icon="emailOutlined"
                />
              </Avatar>
              <Typography variant="subtitle2" className={classes.title}>
                Contact by Email
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} lg={3}>
          <div
            className={
              formik.values.do_not_call ? classes.cardBody : classes.cardBodySelected
            }
            onClick={() => handleChange("do_not_call")}
          >
            <div>
              <Checkbox
                value={!formik.values.do_not_call}
                checked={!formik.values.do_not_call}
              />
            </div>
            <div className={classes.cardIcon}>
              <Avatar className={classes.avatar}>
                <MuiIcon
                  fontSize="large"
                  color={formik.values.do_not_call ? "disabled" : "primary"}
                  icon="callOutlined"
                />
              </Avatar>
              <Typography variant="subtitle2" className={classes.title}>
                Contact by Call
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} lg={3}>
          <div
            className={
              formik.values.do_not_text ? classes.cardBody : classes.cardBodySelected
            }
            onClick={() => handleChange("do_not_text")}
          >
            <div>
              <Checkbox
                value={!formik.values.do_not_text}
                checked={!formik.values.do_not_text}
              />
            </div>
            <div className={classes.cardIcon}>
              <Avatar className={classes.avatar}>
                <MuiIcon
                  fontSize="large"
                  color={formik.values.do_not_text ? "disabled" : "primary"}
                  icon="messageOutlined"
                />
              </Avatar>
              <Typography variant="subtitle2" className={classes.title}>
                Contact by Text
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} lg={3}>
          <div
            className={
              formik.values.do_not_mail ? classes.cardBody : classes.cardBodySelected
            }
            onClick={() => handleChange("do_not_mail")}
          >
            <div>
              <Checkbox
                value={!formik.values.do_not_mail}
                checked={!formik.values.do_not_mail}
              />
            </div>
            <div className={classes.cardIcon}>
              <Avatar className={classes.avatar}>
                <MuiIcon
                  fontSize="large"
                  color={formik.values.do_not_mail ? "disabled" : "primary"}
                  icon="busOutlined"
                />
              </Avatar>
              <Typography variant="subtitle2" className={classes.title}>
                Contact by Mail
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContactPreferences;
