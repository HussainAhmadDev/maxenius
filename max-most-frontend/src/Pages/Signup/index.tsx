import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardActions, CardContent, Divider, Grid } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateUser } from "../../Hooks/useAuth";
import Input from "../../Components/Input";
import { Link } from "react-router-dom";
import LoadingButton from "../../Components/LoadingButton";
import { InputValueAndLabel } from "../../Interfaces/global";

const Signup: React.FC = () => {
  const [userDetail, setUserDetail] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const { mutate, isLoading } = useCreateUser();
  const inputHandle = (e: InputValueAndLabel) => {
    const name = e.label;
    const value = e.value;

    setUserDetail({ ...userDetail, [name]: value });
  };
  const validateFields = () => {
    const fields: { [key: string]: string } = {
      firstName: "First Name is required",
      lastName: "Last Name is required",
      username: "Email is required",
      password: "Password is required",
      confirmPassword: "Confirm Password is required"
    };

    for (const [field, errorMessage] of Object.entries(fields)) {
      if (!userDetail[field as keyof typeof userDetail]) {
        toast.error(errorMessage);
        return false;
      }
    }

    if (userDetail.password !== userDetail.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (userDetail?.password?.length < 6) {
      toast.error("Passwords should be contain minimum 6 character");
      return false;
    }

    return true;
  };

  const signupHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields()) {
      const obj = {
        first_name: userDetail?.firstName,
        last_name: userDetail?.lastName,
        email: userDetail?.username,
        password: userDetail?.password
      };
      mutate(obj);
    }
  };
  return (
    <Box maxWidth={400} width="100%">
      <Box textAlign={"center"}>
        <Box component={"img"} src="/assets/maxeniusBgRemove.svg" my={1} />
      </Box>
      <Card sx={{ p: 1, py: 2 }}>
        <Typography
          fontSize={20}
          fontWeight={"bold"}
          color={"common.black"}
          textAlign={"center"}
        >
          Create Your Account
        </Typography>
        <Box component={"form"} onSubmit={signupHandler}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid sm={6} xs={12} item>
                <Input
                  label="First Name :"
                  handleChange={inputHandle}
                  name="firstName"
                  placeholder="Enter your first name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid sm={6} xs={12} item>
                <Input
                  label="Last Name :"
                  handleChange={inputHandle}
                  name="lastName"
                  placeholder="Enter your last name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Email Address:"
                  handleChange={inputHandle}
                  name="username"
                  placeholder="Enter your email"
                  fullWidth
                  type="email"
                  required
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Password :"
                  handleChange={inputHandle}
                  name="password"
                  placeholder="Enter your password"
                  fullWidth
                  type="password"
                  required
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Confirm Password :"
                  handleChange={inputHandle}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  fullWidth
                  type="password"
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </LoadingButton>
          </CardActions>
          <Divider sx={{ my: 1 }} />
          <Typography textAlign={"center"}>
            Already have an account ?{" "}
            <Link to={"/login"} className="underline-hover">
              Log In
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Signup;
