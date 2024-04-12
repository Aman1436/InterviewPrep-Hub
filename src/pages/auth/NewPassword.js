import React from "react";
import { Link,Typography,Stack } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import { Link as RouterLink } from "react-router-dom";
import NewPasswordForm from "../../sections/auth/NewPasswordForm";
const NewPassword = () => {
  return (
    <>
      <Stack spacing={{ mb: 5, position: "relative" }}>
        <Typography variant="h3">Reset Password</Typography>
        <Typography sx={{ color: "text.secondary", mb: 5 }}>
          Please set your new password
        </Typography>
      </Stack>
      {/*New PasswordForm */}

     <NewPasswordForm/>

      <Link
        component={RouterLink}
        to="/auth/login"
        color={"inherit"}
        variant="subtitle2"
        sx={{ mt: 3, mx: "auto", alignItems: "center", display: "inline" }}
      >
        <CaretLeft />
        Return to sign in
      </Link>
    </>
  );
};

export default NewPassword;
