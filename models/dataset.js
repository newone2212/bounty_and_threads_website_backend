const mongoose = require('mongoose');
const validator = require("validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const datasetschema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
    }
})



const dataset = new mongoose.model('dataset', datasetschema);

module.exports = dataset;