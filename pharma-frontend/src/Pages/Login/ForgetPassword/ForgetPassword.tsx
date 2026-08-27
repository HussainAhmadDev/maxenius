import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Typography } from "@material-ui/core";
import TextInput from "Components/Form/TextInput";
import CustomButton from "Components/Button";
import { AdvocacyIcon } from "Components/icons";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { ILocation } from "Interfaces/Router";
import { useForgetPassword, useResetPassword, useVerifyToken } from "Hooks/useUsers";

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
    checkboxDiv: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    checkboxDivSmallScreen: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    redText: {
      color: theme.palette.primary.main
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
export interface IFormik {
  email?: string;
  password?: string;
  token?: string;
  message?: string;
  origin?: string;
}

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(4, "Password should be of minimum 8 characters length")
    .required("Password is required")
});

export const ForgetPassword: React.FC = () => {
  const [showVerify, setShowVerify] = React.useState(false);
  const [showResetPassword, setShowResetPassword] = React.useState(false);

  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation() as ILocation;
  const { data: emailResponse, mutate: verifyEmail } = useForgetPassword();
  const { data: tokenResponse, mutate: verifyToken } = useVerifyToken();
  const { data: resetPasswordResponse, mutate: resetPassword } = useResetPassword();

  React.useEffect(() => {
    if (
      emailResponse?.message?.includes(
        "Verification Token sent successfully on email address"
      )
    ) {
      setShowVerify(true);
      setShowResetPassword(false);
    }
  }, [emailResponse]);
  React.useEffect(() => {
    if (tokenResponse?.message?.includes("Your token is verify")) {
      setShowResetPassword(true);
    }
  }, [tokenResponse]);

  React.useEffect(() => {
    if (resetPasswordResponse?.message?.includes("Your Password of email is Reset")) {
      navigate("/login");
    }
    //eslint-disable-next-line
  }, [resetPasswordResponse]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      token: ""
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      // mutate({ username: values.email, password: values.password });
    }
  });

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : {};
    const previousLocation = state?.from || "/";
    if (parsedUser.email) {
      navigate(previousLocation, { replace: true });
    }
    //eslint-disable-next-line
  }, [navigate, state?.from]);

  const handleFormSubmit = async (values: IFormik) => {
    try {
      if (showVerify && !showResetPassword) {
        await verifyToken({ token: values.token });
      }
      if (showResetPassword) {
        await resetPassword({ email: values.email, password: values.password });
      } else if (!showVerify) {
        await verifyEmail({ email: values.email });

        setShowResetPassword(false);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("Error occurred during email verification or password reset:", error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.logoDiv}>
          <AdvocacyIcon />
        </div>
        <div className={classes.card}>
          <Typography variant="h6" align="center">
            {showResetPassword
              ? "Reset Password"
              : showVerify
              ? "Token Verification"
              : "Forget Password"}
          </Typography>
          <br />
          <br />
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email">
              <Typography variant="subtitle1">Email</Typography>
            </label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={showVerify || showResetPassword ? true : false}
            />

            {showVerify && (
              <>
                <label htmlFor="token">
                  <Typography variant="subtitle1">Verify Token</Typography>
                </label>
                <TextInput
                  id="token"
                  name="token"
                  type="text"
                  value={formik?.values?.token}
                  onChange={formik.handleChange}
                  error={formik.touched.token && Boolean(formik.errors.token)}
                  helperText={formik.touched.token && formik.errors.token}
                  disabled={showResetPassword ? true : false}
                />
              </>
            )}

            {showResetPassword && (
              <>
                <br />
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
                {/* {error && ( */}
                {/* <div className={classes.error}>
                                        <Typography className={classes.errorMessage}>{error.message}</Typography>
                                    </div> */}
                {/* )} */}
              </>
            )}

            <CustomButton
              onClick={() => handleFormSubmit(formik.values)}
              text={`${
                showResetPassword
                  ? "Reset Password"
                  : showVerify
                  ? "Verify Token"
                  : "Verify Email"
              }`}
              type="primary"
              fullWidth={true}
              // loading={isLoading}
              submit="submit"
            />
          </form>
          <br />
        </div>
        <br />
        <div className={classes.footer}>
          <Typography variant="caption"> &copy; Advocacy</Typography>
          <Typography variant="caption"> &bull; Terms of Service</Typography>
          <Typography variant="caption"> &bull; Privacy Policy</Typography>
        </div>
      </div>
    </div>
  );
};
