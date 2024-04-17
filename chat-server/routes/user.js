const router=require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.patch("/update-me", authController.protect, userController.updateMe);
//Using patch for updation 

router.get("/get-users",authController.protect,userController.getUsers);
router.get("/get-friends",authController.protect,userController.getFriends);
router.get("/get-friend-requests",authController.protect,userController.getRequests);

module.exports=router;