//Creating the express app(APP SETUP)
const express=require("express"); //web framework for Node.js

// Using morgan we will be able to receive the endpoints of login, time spent
const morgan=require("morgan");

//using rateLimit and helmet for security purpose of the website
//using expressRateLimit-> to handle the crashing of website at the time of repeated thousands of requests
const rateLimit=require("express-rate-limit");

//Helmet: secure the express app by adding additional security headers for security perspective
const helmet=require("helmet");

// const mongosanitize=require("express-mongo-sanitize");

const xss= require("xss-clean");
const bodyParser=require("body-parser")//Will parse the body before handling to any other handler in the server

const cors = require("cors");
const app = express();

//Middlewares
app.use(cors({
    origin:"*",
    methods:["GET","PATCH","POST","DELETE","PUT"],
    credentials:true,
}));

app.use(express.json({limit:"10kb"})) //setting the limit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(helmet());

if(process.env.NODE_ENV=="development"){
    app.use(morgan("dev"));
}

const limiter=rateLimit({
    max: 3000,
    windowMs: 60*60*1000, // in one hour
    message:"Too many requests from this IP, Please try again in an an hour"
})

app.use("/tawk",limiter);

// app.use(express.urlencoded({
//     extended:true,
// }))

// app.use(mongosanitize());
app.use(xss());




module.exports=app;
