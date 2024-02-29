const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const BrandsDashschema = new mongoose.Schema({
    Brands_name: {
        type: String,
        required: true,
        minlength: 3,
        unique:true
    },
    corporate: {
        type: String
    },
    email: {
        type: String,
        unique: [
            true, "Email is mandatory"
        ],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email")
            }

        },
        required: [
            true, "email filed is mandatory"
        ]

    },
    mobileNumber: {
        type: Number,
        unique: [
            true, "Email is mandatory"
        ],
        required: [
            true, "email filed is mandatory"
        ]
    },
    logo: {
        type: String
    },
    backImage: {
        type: String
    },


})

const Brands_dashboard = new mongoose.model('Brands_dashboard', BrandsDashschema);

module.exports = Brands_dashboard;