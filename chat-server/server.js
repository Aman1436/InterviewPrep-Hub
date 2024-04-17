// const app=require("../chat-server/app"); //change the path if error occured
const app = require("../chat-server/app");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io");

//whenever we are going to have an uncaught exception ,we are going to handle it gracefully
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1);
});

// const app = require("./app");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

const { promisify } = require("util");
const User = require("./models/user");
const http = require("http");
const FriendRequest = require("./models/friendRequest");
const server = http.createServer(app);
//Creating the instance of socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false,
    // useUnifiedTopology:true
  })
  .then((con) => {
    console.log("DB connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

//3000,5000
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App is running on ${port}`);
});

io.on("connection", async (socket) => {
  //console.log(socket);
  console.log(JSON.stringify(socket.handshake.query));
  const user_id = socket.handshake.query("user_id");

  const socket_id = socket.id;
  console.log(`User connected ${socket_id}`);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, { socket_id });
  }

  socket.on("friend_request", async (data) => {
    console.log(data.to);
    //{to: "(user id example) 654354"}

    //data =>{to ,from}
    const to_user = await User.findById(data.to).select("socket_id");
    const from_user = await User.findById(data.from).select("socket_id");

    //create a friend request

    await FriendRequest.create({
      sender: data.from,
      recipient: data.to,
    });

    //TODO=>create a friend request

    //emit event=> "new_friend_request"
    io.to(to_user.socket_id).emit("new_friend_request", {
      //
      message: "New friend request received.",
    });
    //emit event=>"request_sent"
    io.to(from_user.socket_id).emit("request_sent", {
      message: "Request sent succesfully.",
    });
  });

  socket.on("end", function () {
    console.log("Closing the connection");
    socket.disconnect(0);
  });
});

socket.on("accept_request", async (data) => {
  console.log(data);

  const request_doc = await FriendRequest.findById(data.request_id);
  conasole.log(request_doc);

  //request_id

  const sender = await User.findById(request_doc.sender);
  const receiver = await User.findById(request_doc.recipient);

  sender.friends.push(request_doc.recipient);
  receiver.friends.push(request_doc.sender);

  //for getting the updated data
  await receiver.save({ new: true, validateModifiedOnly: true });
  await sender.save({ new: true, validateModifiedOnly: true });

  //deleting the friend request
  await FriendRequest.findByIdAndDelete(data.request_id);

  //notifying the sender and receiver that they have become friends now
  //emitted event to sender
  io.to(sender.socket_id).emit("request_accepted", {
    message: "Friend request accepted.",
  });
  //emmited event to receiver
  io.to(receiver.socket_id).emit("request_accepted", {
    message: "Friend request accepted.",
  });
});

//for unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
  });
});
