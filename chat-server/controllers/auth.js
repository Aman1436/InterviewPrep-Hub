//for using jsonwebtoken
const jwt=require("jsonwebtoken");




//Now performing the CRUD operations

const User=require("../models/user");

//defining the sign token function
const signToken=(userId)=>jwt.sign({userId},process.env.JWT_SECRET);





exports.login = async (req, res,next) => {
   //getting the email and password from the request body

   const { email, password } = req.body;

   if(!email || !password){
       return res.status(400).json({status :'error',message:"Both email and password are required"});
   }
   //Finding the user in the database from the username and password provided
   const userDoc = await User.findOne({ email: email }).select("+password");

   //If user not found
   if(!userDoc||!(await userDoc.correctPassword(password,userDoc.password))){
       return res.status(400).json({status :'error',message:"Email  or password is incorrect"});
   }

   //If user and password matched
   const token = signToken(userDoc._id);
   res.status(200).json({status :'success',message:"Logged in successfully",data: { token }});
 


}
