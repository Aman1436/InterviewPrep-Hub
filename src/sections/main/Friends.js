import React, { useEffect } from "react";
import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
} from "../../redux/slices/app";
import { FriendComponent, FriendRequestComponent ,UserComponent} from "../../components/Friends";

const UserList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchUsers());
  }, []);
  const { users } = useSelector((state) => state.app);
  return (
    <>
      {users.map((el, idx) => {
        // render usercomponent
        return <UserComponent key={el._id} {...el}/>;
      })}
    </>
  );
};

const FriendList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchFriends());
  }, []);
  const { friends } = useSelector((state) => state.app);
  return (
    <>
      {friends.map((el, idx) => {
        //el=>{_id,sender:{_id,firstName,lastName,img,online}}
        // render friend request component
        return <FriendComponent key={el._id} {...el} />;
      })}
    </>
  );
};

const FriendRequestLists = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, []);
  const { friendRequests } = useSelector((state) => state.app);
  return (
    <>
      {friendRequests.map((el, idx) => {
        //TODO=> render usercomponent
        return <FriendRequestComponent key={el._id} {...el.sender} id={el._id}/>;
      })}
    </>
  );
};
const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      keepMounted
      onClose={handleClose}
      sx={{ p: 4 }}
    >
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>
      {/* Dialog Content */}
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.5}>
            {(() => {
              switch (value) {
                case 0:
                  return <UserList />; //display all users
                case 1:
                  return <FriendList />; // display all friends
                case 2:
                  <FriendRequestLists />; // display all friends request
                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
