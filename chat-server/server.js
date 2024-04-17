// const app=require("../chat-server/app"); //change the path if error occured
const app=require("../chat-server/app")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose=require("mongoose");
dotenv.config({ path: "./config.env" });

const {Server}=require("socket.io");


//whenever we are going to have an uncaught exception ,we are going to handle it gracefully
process.on('uncaughtException', (err) => {
    console.log(err);
    console.log("UNCAUGHT Exception! Shutting down ...");
process.exit(1);}
)

// const app = require("./app");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

const { promisify } = require("util");
const User = require("./models/user");
const http=require("http");
const server=http.createServer(app);
//Creating the instance of socket.io
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

mongoose.connect(DB,{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false,
    // useUnifiedTopology:true
}).then((con)=>{
    console.log("DB connection successfull");
}).catch((err)=>{
    console.log(err); 
})




//3000,5000
const port=process.env.PORT || 8000;
server.listen(port,()=>{
    console.log(`App is running on ${port}`);
})

io.on("connection",async(socket)=>{
    console.log(socket);
    const user_id=socket.handshake.query("user_id");
    const socket_id=socket.id;
    console.log(`User connected ${socket_id}`);

    if(user_id){
        await User.findByIdAndUpdate(user_id,{socket_id});
    }

    socket.on("friend_request",async(data)=>{
        console.log(data.to);
        //{to: "(user id example) 654354"}

        const to=await User.findById(data.to);

        //TODO=>create a friend request

        io.to(to.socket_id).emit("new_friend_request",{
            //
        })

    })

})
//for unhandledRejection
process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log("UNHANDLED REJECTION! Shutting down ...");
    server.close(() => {
      process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
    });
  });