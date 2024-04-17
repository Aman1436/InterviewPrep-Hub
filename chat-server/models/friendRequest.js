const mongoose=require("mongoose");
const requestSchema=new mongoose.Schema({
    sender:{
        //we will store object id
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    recipient:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});

//creaing a model
const FriendRequest=new mongoose.model("FriendRequest",requestSchema);
module.exports=FriendRequest;