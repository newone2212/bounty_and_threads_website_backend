const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const reportschema = new mongoose.Schema({
    report_title:{
        type: String
    },
    hashtag: { type: String },
    mentions:{
        type:String,
    },
    username:{
        type:String
    }

})


const data=new mongoose.model('report', reportschema);

module.exports=data;