const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt=require("jsonwebtoken");
//const bcrypt=require("bcryptjs");
const Brandaschema = new mongoose.Schema({
    token:{type:String},
    email:{type:String}
})

const token2=new mongoose.model('token2',Brandaschema);
module.exports=token2;