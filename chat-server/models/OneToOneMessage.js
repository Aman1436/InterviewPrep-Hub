const mongoosse = require("mongoose");

const OnetoOneMessageSchema = new mongoosse.Schema({
   //it is a list of participants who are doing conversation 
   participants:[{
      type: mongoosse.Schema.ObjectId,
      ref: "User",
   }],
   messages:[
      {
         to: {
            type: mongoosse.Schema.ObjectId,
            ref: "User",
         },
         from: {
            type: mongoosse.Schema.ObjectId,
            ref: "User",
         },
         type: {
            type: String,
            enum: ["Text", "Media", "Document", "Link"],
         },
         created_at:{
            type: Date,
            default: Date.now(),
         },
         text:{
            type: String,
         },
         file:{
            type: String,
         },


      }
   ]
});

const OnetoOneMessage = new mongoosse.model("OnetoOneMessage", OnetoOneMessageSchema);
   
module.exports = OnetoOneMessage;
