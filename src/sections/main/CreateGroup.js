import React from 'react'
import {DialogTitle,Dialog,Slide,DialogContent,Stack} from "@mui/material"
import * as Yup from "yup";
import {FormProvider, useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFTextField } from '../../components/hook-form';
//Todo=>create a reusable comp
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  const CreateGroupForm=({})=>{
    const NewGroupSchema=Yup.object().shape({
        title:Yup.string().required("Title is required"),
        members:Yup.array().min(2,"Must have atleast two members")
    });
    const defaultValues={
        title:"",
        members:[]
    }
    const methods=useForm({
        resolver:yupResolver(NewGroupSchema),
        defaultValues
    });
    const { reset,watch, setError, handleSubmit, formState: { errors,isSubmitting,isSubmitSuccessful ,isValid} } = methods;

    const onSubmit=async(data)=>{
        try{
//Api call
   console.log("DATA",data);
        }
        catch(error){
            console.log("error",error)
        }
    }
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Stack spacing={3}>
       <RHFTextField name="title" label="Title"/>
        </Stack>
        </FormProvider>
    )
        
    
  
  }
const CreateGroup = ({open,handleClose}) => {
  return (
   <Dialog fullWidth maxWitdh="xs" open={open} TransitionComponent={Transition
   } keepMounted sx={{p:4}}>
    {/*Title */}
    <DialogTitle>
        Create New Group
    </DialogTitle>
    {/*Content */}
    <DialogContent>
        {/*Form */}
    <CreateGroupForm/>
    </DialogContent>
   </Dialog>
  )
}

export default CreateGroup