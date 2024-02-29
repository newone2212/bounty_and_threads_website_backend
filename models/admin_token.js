const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt=require("jsonwebtoken");
//const bcrypt=require("bcryptjs");
const Brandaschema = new mongoose.Schema({
    token:{type:String},
    email:{type:String}
})

const token3=new mongoose.model('token3',Brandaschema);
module.exports=token3;