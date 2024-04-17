import React from "react";
import { Outlet,Navigate} from "react-router-dom";
import {Container} from "@mui/material";
import Logo from "../../assets/Images/logo.ico";
import {Stack} from '@mui/material'
import {useSelector} from "react-redux"
const MainLayout = () => {
  const {isLoggedIn}=useSelector((state)=>state.auth);
  if(isLoggedIn){
    return <Navigate to="/app"/>
  }
  return (
    <>
      <Container sx={{mt:5}} maxWidht="sm">
        <Stack spacing={5}>
          <Stack sx={{width:"100%"}} direction="column" alignItems={"center"}>
            <img style={{height:120,width:120}} src={Logo} alt="Logo"/>
          </Stack>

        </Stack>
      <Outlet />
      </Container>

    </>
  );
};

export default MainLayout;
