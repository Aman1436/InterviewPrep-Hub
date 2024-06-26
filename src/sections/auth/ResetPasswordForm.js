import React, { useState } from "react";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {Stack, Alert,Button} from "@mui/material";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { useTheme } from "@mui/material/styles";
import { ForgotPassword } from "../../redux/slices/auth";
import { useDispatch } from 'react-redux';

const ResetPasswordForm = () => {
  const dispatch=useDispatch();
  const [showPassword, setShowPassword] = useState(false);
    const theme=useTheme();
  // Using Yup->object form validation library
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email must be a valid email address")
  });
  
  const defaultValues = {
    email: "demo@tawk.com",
    
  };
  
  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  
  const { reset, setError, handleSubmit, formState: { errors,isSubmitting,isSubmitSuccessful } } = methods;
  
  const onSubmit = async (data) => {
    try {
      //data={email:""}
      // Submit data to backend
      dispatch(ForgotPassword(data))
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
      <RHFTextField name="email" label="Email address" />
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
      Send Request
      </Button>
      </Stack> 
      
    </FormProvider>
  );
};

export default ResetPasswordForm;
