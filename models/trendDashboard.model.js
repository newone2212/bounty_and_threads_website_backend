const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const TrendDashschema = new mongoose.Schema({
    Brands_name:{
        type : String,
        required : true,
        minlength:3
    },
    Hastag:{
        type:String
    },
    from:{
        type:Date
    },
    to:{
        type:Date
    },
    metric:{
        type:String
    },
    State:{
        type:String,
        
        required:true
    },
    Grnularity:{
        type:String,
        enum:['month','week','day']
    },
    Sponsered:{
        type:Boolean,  
    },
    interest:{
        type:String
    }
    
})

const Trend_dashboard=new mongoose.model('Trend_dashboard',TrendDashschema);

module.exports=Trend_dashboard;