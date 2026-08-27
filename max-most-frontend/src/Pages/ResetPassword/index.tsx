import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useNavigate, useParams } from "react-router-dom";
import { InputValueAndLabel } from "../../Interfaces/global";
import { Card, CardActions, CardContent, Divider, Stack } from "@mui/material";
import Input from "../../Components/Input";
import LoadingButton from "../../Components/LoadingButton";
import { toast } from "react-toastify";
import { useResetPassword } from "../../Hooks/useUsers";

const ResetPassword: React.FC = () => {
  const { email, token } = useParams();
  const { mutateAsync, isLoading } = useResetPassword();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    confirm_password: "",
    password: ""
  });

  const handleChange = (e: InputValueAndLabel) => {
    setCredentials({ ...credentials, [e.label]: e.value });
  };
  const validateFields = () => {
    const fields: { [key: string]: string } = {
      confirm_password: "Confirm Password is required",
      password: "Password is required"
    };

    for (const [field, errorMessage] of Object.entries(fields)) {
      if (!credentials[field as keyof typeof credentials]) {
        toast.error(errorMessage);
        return false;
      }
    }
    if (credentials?.password?.length < 6) {
      toast.error("Passwords should be contain minimum 6 character");
      return false;
    } else if (credentials.password !== credentials.confirm_password) {
      toast.error("Passwords do not match");
      return false;
    } else if (!token || !email) {
      toast.error("Invalid params");
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    mutateAsync({ email, password: credentials.password, token }).then(() => {
      navigate("/login");
    });
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
          Reset Your Password
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit}>
          <CardContent>
            <Stack gap={1}>
              <Input
                label="Password :"
                handleChange={handleChange}
                name="password"
                placeholder="Enter your password"
                min={6}
                fullWidth
                type="password"
                required
              />
              <Input
                label="Confirm Password :"
                handleChange={handleChange}
                name="confirm_password"
                placeholder="Re-enter your password"
                fullWidth
                type="password"
                required
              />
            </Stack>
          </CardContent>
          <CardActions>
            <LoadingButton
              type="submit"
              loading={isLoading}
              fullWidth
              variant="contained"
            >
              {isLoading ? "Reseting..." : "Reset"}
            </LoadingButton>
          </CardActions>
          <Divider sx={{ my: 1 }} />
          <Typography textAlign={"center"}>
            Remember your password ?{" "}
            <Link to={"/login"} className="underline-hover">
              Log In
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ResetPassword;
