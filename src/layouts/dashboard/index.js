import { Stack } from "@mui/material";
import React from "react";
import { Outlet,Navigate } from "react-router-dom";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const {isLoggedIn}=useSelector((state)=>state.auth);
  // Handling the case if the user is not logged in
  if(!isLoggedIn){
    return <Navigate to="/auth/login"/>
  }
    return (
    <Stack direction="row">
      {/* import SideBar` */}
      <SideBar/>
      <Outlet/>
    </Stack>
  );
};

export default DashboardLayout;
