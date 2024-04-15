const sgMail=require("@sendgrid/mail");
const dotenv=require("dotenv");
dotenv.config({path:"../config.env"});
sgMail.setApiKey(process.env.SG_KEY);

const sendSGMail=async({
    to,
  sender,
  subject,
  html,
  attachments,
  text,

})=>{
    try{
        const from= "aryamanskate01@gmail.com";

        const msg={
            to: to, //email of recepient
            from: from, //this will be our verified sender
            subject: subject,
            html: html,
            // text: text,
            attachments,
        };
        return sgMail.send(msg);

    }
    catch(error){
        console.log(error);
    }
};

exports.sendEmail = async (args) => {
    if (!process.env.NODE_ENV === "development") {
      return Promise.resolve();
    } else {
      return sendSGMail(args);
    }
  };