const mongoose=require("mongoose");
const Otpschema = new mongoose.Schema({
    phone: {
        type:String,
        unique:true
    },
    otp:{type:Number},
});
const OtpModel=new mongoose.model('OtpModel',Otpschema);

module.exports=OtpModel;
