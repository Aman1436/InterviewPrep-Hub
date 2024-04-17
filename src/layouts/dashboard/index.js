import { Stack } from "@mui/material";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { showSnackbar } from "../../redux/slices/app";

const DashboardLayout = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  //getting the userId from the local storage
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + `#loaded`;
          window.location.reload();
        }
      };

      window.reload();

      if (!socket) {
        connectSocket(user_id);
      }
      // "new_friend_request"

      socket.on("new_friend_request", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("request_accepted", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
    }

    return () => {
      socket.off("new_friend_request");
      socket.off("reuest_accepted");
      socket.off("request_sent");
    };
  }, [isLoggedIn, socket]);

  // Handling the case if the user is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }
  return (
    <Stack direction="row">
      {/* import SideBar` */}
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
