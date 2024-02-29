const jwt=require("jsonwebtoken");
const influencer_Register=require("../models/Influencers_model");
const  brands_register=require("../models/brands_model");
const admin_register=require("../models/admin_model");

const influencer = async(req,res,next)=>{
    try{
        const token= req.cookies.jwt;
        const verifyuser=jwt.verify(token,process.env.SECRET_FOR_TOKEN);
        console.log(verifyuser);
        const user=await influencer_Register.findOne({_id:verifyuser._id});
        req.token=token;
        req.user=user;
        next();

    }catch(err){
        res.status(401).send(err,"you are not validated!!");

    }
}
const brands = async(req,res,next)=>{
    try{
        const token= req.cookies.jwt;
        const verifyuser=jwt.verify(token,process.env.SECRET_FOR_TOKEN);
        console.log(verifyuser);
        const user=await brands_register.findOne({_id:verifyuser._id});
        req.token=token;
        req.user=user;
        next();

    }catch(err){
        res.status(401).send(err,"you are not validated!!");

    }
}
const admin = async(req,res,next)=>{
    try{
        const token= req.cookies.jwt;
        const verifyuser=jwt.verify(token,process.env.SECRET_FOR_TOKEN);
        console.log(verifyuser);
        const user=await admin_register.findOne({_id:verifyuser._id});
        req.token=token;
        req.user=user;
        next();

    }catch(err){
        res.status(401).send(err,"you are not validated!!");

    }
}


module.exports={influencer,brands,admin};