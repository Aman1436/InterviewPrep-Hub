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
const NewPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
    const theme=useTheme();
  // Using Yup->object form validation library
  const NewPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().min(6,'Password must be atleast 6 characters').required("Password is required"),
    confirmPassword: Yup.string().required("Password is required").oneOf([Yup.ref('newPassword'),null,'Password must match']),
  });
  
  const defaultValues = {
    newPassword:"",
    confirmPassword:"",
  };
  
  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  
  const { reset, setError, handleSubmit, formState: { errors,isSubmitting,isSubmitSuccessful } } = methods;
  
  const onSubmit = async (data) => {
    try {
      // Submit data to backend
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
      <RHFTextField
          name="newPassword"
          label="New Password"
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
        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
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
        Submit
      </Button>
      </Stack>
      
    </FormProvider>
  );
};

export default NewPasswordForm;
