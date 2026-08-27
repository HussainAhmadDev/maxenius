import * as React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "Components/Button";
import { AdvocacyIcon } from "Components/icons";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "Context/AuthContext";
import { useGetUserToken } from "Hooks/useLogin";
import { toast } from "react-toastify";

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
      color: theme.palette.primary.main,
      cursor: "pointer"
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

export const LoginPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const token = getToken() as unknown as string;

  const { user: authUser } = useAuth0();

  const { mutate: userGetToken } = useGetUserToken();

  const { loginWithRedirect, isLoading: loading } = useAuth0();

  React.useEffect(() => {
    const fetchData = async () => {
      if (authUser?.email && !token) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay if necessary
          userGetToken({
            email: authUser?.email
          });
          navigate("/");
        } catch (error) {
          toast.error("Network error! try again");
        }
      }
    };

    fetchData();
    //eslint-disable-next-line
  }, [token, authUser]);

  const submitHandler = async () => {
    await loginWithRedirect();
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.logoDiv}>
          <AdvocacyIcon />
        </div>
        <div className={classes.card}>
          {/* <CustomLoader /> */}

          <CustomButton
            text="Go to Login Page"
            type="primary"
            fullWidth={true}
            loading={loading}
            submit="submit"
            onClick={submitHandler}
          />
          <br />
        </div>
        <br />
      </div>
    </div>
  );
};

// import * as React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import * as yup from "yup";
// import { Typography } from "@material-ui/core";
// import TextInput from "Components/Form/TextInput";
// import CustomButton from "Components/Button";
// import CheckBox from "Components/CheckBox";
// import { AdvocacyIcon } from "Components/icons";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import { useFormik } from "formik";
// import { useAuthToken } from "Hooks/useLogin";
// import { useMediaQuery } from "@mui/material";
// import { ILocation } from "Interfaces/Router";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     wrapper: {
//       margin: "auto"
//     },
//     content: {
//       marginTop: theme.spacing(5),
//       maxWidth: "450px",
//       margin: "auto"
//     },
//     logoDiv: {
//       textAlign: "center",
//       marginBottom: theme.spacing(3),
//       width: "100%"
//     },
//     card: {
//       padding: theme.spacing(3),
//       background: theme.palette.background.default,
//       boxShadow: "0px 20px 40px rgba(141, 147, 201, 0.08)",
//       borderRadius: "10px",
//       marginLeft: theme.spacing(2),
//       marginRight: theme.spacing(2)
//     },
//     checkboxDiv: {
//       paddingTop: theme.spacing(1),
//       paddingBottom: theme.spacing(1),
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between"
//     },
//     checkboxDivSmallScreen: {
//       paddingTop: theme.spacing(1),
//       paddingBottom: theme.spacing(1),
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       flexDirection: "column"
//     },
//     flex: {
//       display: "flex",
//       alignItems: "center"
//     },
//     redText: {
//       color: theme.palette.primary.main,
//       cursor: 'pointer'
//     },
//     inputField: {
//       borderColor: theme.palette.gray[300],
//       borderRadius: "6px",
//       width: "100%",
//       background: theme.palette.background.default,
//       marginTop: 16,
//       marginBottom: 16
//     },
//     error: {
//       background: "red",
//       padding: 16,
//       marginTop: 16,
//       marginBottom: 16
//     },
//     errorMessage: {
//       color: theme.palette.background.default
//     },
//     footer: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-around",
//       margin: "auto",
//       marginBottom: "20px"
//     }
//   })
// );

// const validationSchema = yup.object({
//   email: yup.string().email("Enter a valid email").required("Email is required"),
//   password: yup
//     .string()
//     .min(4, "Password should be of minimum 8 characters length")
//     .required("Password is required")
// });

// // interface State {
// //   from: string;
// // }

// export const LoginPage: React.FC = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();
//   const { state } = useLocation() as ILocation;
//   const { error, mutate, isLoading } = useAuthToken();
//   const isSmallScreen = useMediaQuery("(max-width:600px)");

//   const [checked, setChecked] = React.useState(true);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setChecked(event.target.checked);
//   };

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: ""
//     },
//     validationSchema: validationSchema,
//     onSubmit: values => {
//       mutate({ username: values.email, password: values.password });
//     }
//   });

//   React.useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const parsedUser = storedUser ? JSON.parse(storedUser) : {};
//     const previousLocation = state?.from || "/";
//     if (parsedUser.email) {
//       navigate(previousLocation, { replace: true });
//     }
//   }, [navigate, state?.from]);

//   return (
//     <div className={classes.wrapper}>
//       <div className={classes.content}>
//         <div className={classes.logoDiv}>
//           <AdvocacyIcon />
//         </div>
//         <div className={classes.card}>
//           <Typography variant="h6" align="center">
//             Sign In to your account
//           </Typography>
//           <br />
//           <br />
//           <form onSubmit={formik.handleSubmit}>
//             <label htmlFor="email">
//               <Typography variant="subtitle1">Email</Typography>
//             </label>
//             <TextInput
//               id="email"
//               name="email"
//               type="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               error={formik.touched.email && Boolean(formik.errors.email)}
//               helperText={formik.touched.email && formik.errors.email}
//             />
//             <br />
//             <label htmlFor="password">
//               <Typography variant="subtitle1">Password</Typography>
//             </label>
//             <TextInput
//               id="password"
//               name="password"
//               type="password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//             />
//             {error && (
//               <div className={classes.error}>
//                 <Typography className={classes.errorMessage}>{error.message}</Typography>
//               </div>
//             )}
//             <div
//               className={
//                 isSmallScreen ? classes.checkboxDivSmallScreen : classes.checkboxDiv
//               }
//             >
//               <div className={classes.flex}>
//                 <CheckBox checked={checked} handleChange={handleChange} />
//                 <Typography variant="subtitle1">Stay Signed In</Typography>
//               </div>
//               <div>
//                 <Typography onClick={() => navigate('/forget-password')} variant="subtitle1" className={classes.redText}>
//                   Forgot Password?
//                 </Typography>
//               </div>
//             </div>
//             <br />
//             <CustomButton
//               text="Sign In"
//               type="primary"
//               fullWidth={true}
//               loading={isLoading}
//               submit="submit"
//             />
//           </form>
//           <br />

//         </div>
//         <br />
//         <div className={classes.footer}>
//           <Typography variant="caption"> &copy; Advocacy</Typography>
//           <Typography variant="caption"> &bull; Terms of Service</Typography>
//           <Typography variant="caption"> &bull; Priacy Policy</Typography>
//         </div>
//       </div>
//     </div>
//   );
// };
