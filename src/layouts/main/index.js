import React from "react";
import { Outlet } from "react-router-dom";
import {Container} from "@mui/material";
import Logo from "../../assets/Images/logo.ico";
import {Stack} from '@mui/material'

const MainLayout = () => {
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
