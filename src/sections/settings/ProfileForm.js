import React, { useCallback, useState } from "react";
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
const ProfileForm = () => {
  // Using Yup->object form validation library
  const LoginSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    about: Yup.string().required("About is required"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
  });
  
  const defaultValues = {
    name: "",
    about: ""
  };
  
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  
  const { reset,setValue, watch,control,setError, handleSubmit, formState: { errors,isSubmitting,isSubmitSuccessful } } = methods;

//   Get all the value from the form
  const values=watch();
  const handleDrop=useCallback((acceptedFiles)=>{
    const file=acceptedFiles[0];
    const newFile=Object.assign(file,{
        preview: URL.createObjectURL(file)
    })
    if(file){
        setValue("avatarUrl",newFile,{shouldValidate:true});
    }
  },[setValue])
  
  const onSubmit = async (data) => {
    try {
      // Submit data to backend
      console.log("Data",data);
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", { ...error, message: error.message });
    }
  };
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
        <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">
            {errors.afterSubmit.message}
        </Alert>}
      {/* using helperText to disply the message */}
      <RHFTextField name="name" label="Name" helperText={"This namer is visible to your contacts"} />
      <RHFTextField multiline rows={3} maxRous={5} name="about" label="About"/>
    
      </Stack>   
      <Stack direction={"row"} justifyContent="end">
        <Button color="primary" size="large" type="submit" variant="outlined">Save</Button>
        </Stack> 

        </Stack>
        
    </FormProvider>
  );
};

export default ProfileForm;
