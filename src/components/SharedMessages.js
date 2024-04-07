import React from 'react'
import {Box,Stack,IconButton,Typography} from "@mui/material"
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { UpdateSidebarType } from './../redux/slices/app';
import {X} from 'phosphor-react';

const SharedMessages = () => {
  const theme= useTheme();
  const dispatch=useDispatch();
  return (
   <Box sx={{width:320,height:"100vh"}}>
    <Stack sx={{height:"100%"}}>
     {/*Header */}
     <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            direction={"row"}
            sx={{
              height: "100%",
              p: 2,
            }}
            alignItems={"center"}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <CaretLeft/>
            </IconButton>
            <Typography variant="subtitle2">Contact Info</Typography>
            
          </Stack>
        </Box>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          p={3}
          spacing={3}
        >
          
        </Stack>
    </Stack>
   </Box> 
  )
}

export default SharedMessages;