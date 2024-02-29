const mongoose=require("mongoose");
const Access_tokenschema = new mongoose.Schema({
    access_token: {type:String},
    username:{type:String},
});
const Access_token=new mongoose.model('Access_token',Access_tokenschema);

module.exports=Access_token;
