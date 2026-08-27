import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { AuthResponse, InputValueAndLabel } from "../../Interfaces/global";
import { useAuth } from "../../Hooks/useAuth";
import { useUser } from "../../Contexts/userContext";
import { Card, CardActions, CardContent, Stack } from "@mui/material";
import { parseJwt } from "../../Hooks/api";
import Input from "../../Components/Input";
import LoadingButton from "../../Components/LoadingButton";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, updateAccessToken } = useUser();
  const { postData, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: InputValueAndLabel) => {
    setCredentials({ ...credentials, [e.label]: e.value });
  };
  const validateFields = () => {
    const fields: { [key: string]: string } = {
      username: "Email is required",
      password: "Password is required"
    };

    for (const [field, errorMessage] of Object.entries(fields)) {
      if (!credentials[field as keyof typeof credentials]) {
        toast.error(errorMessage);
        return false;
      }
    }

    return true;
  };
  const login_navigate = async () => {
    try {
      const response: AuthResponse = await postData(credentials);
      const { access_token } = response;
      updateAccessToken(access_token);
      const { data } = parseJwt(access_token);
      updateUser(data);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Box maxWidth={400} width="100%">
      <Box textAlign={"center"}>
        <Box
          component={"img"}
          src="/assets/maxeniusLogo.png"
          my={1}
          sx={{ width: "70%" }}
        />
      </Box>
      <Card sx={{ p: 1, py: 2 }}>
        <Typography
          fontSize={20}
          fontWeight={"bold"}
          color={"common.black"}
          textAlign={"center"}
        >
          Log In to Your Account
        </Typography>
        <Box
          component={"form"}
          onSubmit={e => {
            e.preventDefault();
            if (validateFields()) {
              login_navigate();
            }
          }}
        >
          <CardContent>
            <Stack gap={1}>
              <Input
                label="Email Address :"
                id="cy__loginEmail"
                handleChange={handleChange}
                name="username"
                placeholder="Enter your email"
                fullWidth
                type="email"
                required
              />
              <Input
                label="Password :"
                id="cy__loginPass"
                handleChange={handleChange}
                name="password"
                placeholder="Enter your password"
                fullWidth
                type="password"
                autoComplete="password"
                required
              />
            </Stack>
          </CardContent>
          <CardActions>
            <LoadingButton
              id="cy__loginbtn"
              type="submit"
              loading={isLoading}
              fullWidth
              variant="contained"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </LoadingButton>
          </CardActions>
          {/* <Divider sx={{ my: 1 }} />
          <Typography textAlign={"center"}>
            Don't have an account ?{" "}
            <Link to={"/signup"} className="underline-hover">
              Sign Up
            </Link>
          </Typography> */}
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
