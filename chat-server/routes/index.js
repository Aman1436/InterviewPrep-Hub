//Creating routes in different file and combining back together in index.js file
const router=require("express").Router();
const authRoute=require("./auth");
const userRoute=require("./user");


router.use("/auth",authRoute);
router.use("/user",userRoute);

module.exports=router;