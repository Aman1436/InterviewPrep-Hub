import React from "react";
import {Box, IconButton, Typography,Stack} from '@mui/material';
import { CircleDashed } from "phosphor-react";

const Chats=()=>{
return (
    <Box sx={{position:"relative",height:"100%",width:320,backgroundColor:"#F8FAFF",boxShadow:'0px 0px 2px rgba(0,0,0,0.25'}}>
   <Stack >
   <Typography variant="h5">
     Chats
   </Typography>
   <IconButton>
    <CircleDashed/>
   </IconButton>
   </Stack>
    </Box>
);

}

export default Chats;
