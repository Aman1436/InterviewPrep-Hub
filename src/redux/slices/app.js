import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT",
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
  users:[],
  friends:[],
  friendRequests:[],
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    //Toggle Sidebar
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },

    updateUsers(state,action){
      state.users=action.payload.users;
    },
    updateFriends(state,action){
      state.friends=action.payload.friends;
    },
    updateFriendRequests(state,action){
      state.friendRequests=action.payload.request;
    }
    
  },
});

//Reducer

export default slice.reducer;

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebar());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateSidebarType({
        type,
      })
    );
  };
}

export function showSnackbar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.openSnackbar({ severity, message }));
    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar());
    }, 4000);
  };
}

export const closeSnackbar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackbar());
};

export const FetchUsers=()=>{
  return async(dispatch,getState)=>{
    await axios.get("/users/get-users",{
      header:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${getState().auth.token}`,
      }
    }).then((response)=>{
      console.log(response);
      dispatch(slice.actions.updateUsers({users:response.data.data}));
    }).catch((error)=>{
      console.log(error);
    })
  }
}

export const FetchFriends=()=>{
  return async(dispatch,getState)=>{
    await axios.get("/users/get-friends",{
      header:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${getState().auth.token}`,
      }
    }).then((response)=>{
      console.log(response);
      dispatch(slice.actions.updateFriends({friends:response.data.data}));
    }).catch((error)=>{
      console.log(error);
    })
  }
}

export const FetchFriendRequests=()=>{
  return async(dispatch,getState)=>{
    await axios.get("/users/get-friend-request",{
      header:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${getState().auth.token}`,
      }
    }).then((response)=>{
      console.log(response);
      dispatch(slice.actions.updateFriendRequests({request:response.data.data}));
    }).catch((error)=>{
      console.log(error);
    })
  }
}