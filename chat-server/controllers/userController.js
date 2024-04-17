const FriendRequest = require("../models/friendRequest");
const User=require("../models/user");
const filterObj = require("../utils/filterObj");
exports.updateMe=async(req,res,next)=>{

    const {user} =req;

    //User will be allowed to edit the following: 
    const filteredBody=filterObj(req.body,
        "firstName",
        "lastName",
        "about",
        "avatar");

    const updated_user=await User.findByIdAndUpdate(user._id,filteredBody,{ new:true, validateModifiedOnly:true});

    res.status(200).json({
        status:"success",
        data:updated_user,
        message:"Profile Updated Successfully",
    })

}

exports.getUsers=async(req,res,next)=>{
    const all_users=await User.find({
        verified:true,
    }).select("firstName lastName _id");

    const this_user=req.user;
    
    //If sending friend request, simply exclude all our friends and our id also
    const remaining_users=all_users.filter((user)=>!this_user.friends.includes(user._id) 
    && user._id.toString()!==req.user._id.toString());

    res.status(200).json({
        status:"success",
        data:remaining_users,
        message:"User found successfully",
    })

}
//to get the friend request
exports.getRequests=async(req,res,next)=>{
    const requests=await FriendRequest.find({recipient: req.user._id}).populate("sender","_id firstName lastName");
    res.status(200).json({
        status:"success",
        data:requests,
        message:"Friend Request found successfully",
    })
    
}

//to get the list of our friends
exports.getFriends=async(req,res,next)=>{
    const friends=await User.findById(req.user._id).populate("friends","_id firstName lastName")

    res.status(200).json({
        status:"success",
        data:friends,
        message:"Friend found successfully",
    })
}