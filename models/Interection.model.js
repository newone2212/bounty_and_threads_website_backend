const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const interectionschema = new mongoose.Schema({
    brand_name:{
        type: String
    },
    influencer_name: { type: String },
    types:{
        type:String,
    },
    campname:{type:String},
    statusshow:{type:String}

})


const data=new mongoose.model('interection', interectionschema);

module.exports=data;