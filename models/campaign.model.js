const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const dataschema = new mongoose.Schema({
    brand_name:{
        type:String
    },
    nameOfCamp: {
        type: String
    },
    logo:{type:String},
    hashtag: { type: String },
    brief: { type: String },
    minFollower: {
        type:Number,        
    },
    Type:{
        type:String
    },
    from:{
        type:Date
    },
    to:{
        type:Date
    },
    media:{
        type:String
    },
    special:{
        type:String
    },
    prize:{
        type:Number
    },
    status:{
        type:Boolean
    },
    faq:[{
        ques:{
            type:String
        },
        ans:{
            type:String
        }
    }]
})


const dataset = new mongoose.model('campaign', dataschema);
module.exports=dataset;