import React from "react";
import { AdvocacyIcon } from "Components/icons";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import TextInput from "Components/Form/TextInput";
import CustomButton from "Components/Button";
import { useForgetPassword } from "Hooks/useUsers";

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required")
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: "auto"
    },
    content: {
      marginTop: theme.spacing(5),
      maxWidth: "450px",
      margin: "auto"
    },
    logoDiv: {
      textAlign: "center",
      marginBottom: theme.spacing(3),
      width: "100%"
    },
    card: {
      padding: theme.spacing(3),
      background: theme.palette.background.default,
      boxShadow: "0px 20px 40px rgba(141, 147, 201, 0.08)",
      borderRadius: "10px",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    inputField: {
      borderColor: theme.palette.gray[300],
      borderRadius: "6px",
      width: "100%",
      background: theme.palette.background.default,
      marginTop: 16,
      marginBottom: 16
    },
    error: {
      background: "red",
      padding: 16,
      marginTop: 16,
      marginBottom: 16
    },
    errorMessage: {
      color: theme.palette.background.default
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      margin: "auto",
      marginBottom: "20px"
    }
  })
);

const ResetPassword = () => {
  const classes = useStyles();

  const { pathname } = window.location;
  const [, , email, token] = pathname.split("/");

  const { mutate } = useForgetPassword();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const obj = {
        email: email,
        token: token,
        password: values.password
      };

      mutate(obj);
    }
  });

  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.logoDiv}>
          <AdvocacyIcon />
        </div>
        <div className={classes.card}>
          <label htmlFor="password">
            <Typography variant="subtitle1">New Password</Typography>
          </label>
          <TextInput
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <label htmlFor="confirmPassword">
            <Typography variant="subtitle1">Confirm Password</Typography>
          </label>
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
            }
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <CustomButton
            text="Reset Password"
            type="primary"
            fullWidth={true}
            onClick={formik.handleSubmit}
          />
          <br />
        </div>
        <br />
      </div>
    </div>
  );
};

export default ResetPassword;

// import React from 'react'

// const ResetPassword = () => {
//     return (
//         <h2>
//             dfjaldf
//         </h2>
//     )
// }
// export default ResetPassword
