import React, { useState } from "react";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Link,Stack, Alert,InputAdornment,IconButton ,Button} from "@mui/material";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeSlash } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { LoginUser } from "../../redux/slices/auth";
const LoginForm = () => {

  const dispatch=useDispatch();
  const [showPassword, setShowPassword] = useState(false);
    const theme=useTheme();
  // Using Yup->object form validation library
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email must be a valid email address"),
    password: Yup.string().required("Password is required")
  });
  
  const defaultValues = {
    email: "demo@tawk.com",
    password: "demo1234"
  };
  
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  
  const { reset, setError, handleSubmit, formState: { errors,isSubmitting,isSubmitSuccessful } } = methods;
  
  const onSubmit = async (data) => {
    try{
      // Submit data to backend
      dispatch(LoginUser(data));
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", { ...error, message: error.message });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
      </Stack>
      <Stack spacing={2}>
      <RHFTextField name="email" label="Email address" />
      <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        </Stack>
        <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link component={RouterLink} to="/auth/reset-password" variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link>
        <Button
      fullWidth
      color="inherit"
      size="large"
      type="submit"
      variant="contained"
      sx={{
        bgcolor:"text.primary",
        color:(theme)=>theme.palette.mode==="light" ?"common.white":"grey.800",
        '&:hover':{
            bgcolor:"text.primary",
            color:()=>theme.palette.mode==='light'? "common.white":"grey.800",
        }
      }}
      >
        Login
      </Button>
      </Stack>      
    </FormProvider>
  );
};

export default LoginForm;
