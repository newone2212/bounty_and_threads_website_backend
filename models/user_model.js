const mongoose = require('mongoose');
const validator=require('validator');
require("dotenv").config();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const userschema = new mongoose.Schema({
    user_name:{
        type : String,
        required : true,
        minlength:3
    },
    email:{
        type:String,
        unique:[
            true,"Email is mandatory"
        ],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email")
            }
        },
        required:[
            true,"email filed is mandatory"
        ]
    },
    password:{
        type : String,
        required:[true]
    },
    repassword:{
        type : String,
    },
    phone:{
        type:Number,
        maxlength:10,
        minlength:10,
        unique:true,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
})



userschema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10);
        this.repassword=undefined;
    }
    next();
})

const users_detail=new mongoose.model('users_detail',userschema);

module.exports=users_detail;