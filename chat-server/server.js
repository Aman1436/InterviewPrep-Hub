// const app=require("../chat-server/app"); //change the path if error occured
const app=require("../chat-server/app")
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


const http=require("http");
const server=http.createServer(app);

//3000,5000
const port=process.env.PORT || 8000;
server.listen(port,()=>{
    console.log(`App is running on ${port}`);
})