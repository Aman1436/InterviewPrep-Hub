import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { showSnackbar } from "../../redux/slices/app";

const DashboardLayout = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  //getting the userId from the local storage
  const user_id = window.localStorage.getItem("user_id");
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + `#loaded`;
          window.location.reload();
        }
      };

      //window.location.reload();
      window.onload();
      if (!socket) {
        connectSocket(user_id);
      }
      // "new_friend_request"
      socket.on("new_message", (data) => {
        const message = data.message;
        console.log(current_conversation, data);
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });
      socket.on("new_friend_request", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("request_accepted", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });

      socket.on("start_chat", (data) => {
        console.log(data); //
        //const
      });
    }

    return () => {
      socket?.off("new_friend_request");
      socket?.off("reuest_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat");
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
