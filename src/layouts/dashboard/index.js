import { Stack } from "@mui/material";
import React from "react";
import { Outlet,Navigate } from "react-router-dom";
import SideBar from "./SideBar";
const isAuthenticated=true;
const DashboardLayout = () => {
  // Handling the case if the user is not logged in
  if(!isAuthenticated){
    return <Navigate to="/auth/login"/>
  }
    return (
    <Stack direction="row">
      {/* import SideBar` */}
      <SideBar/>
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
