const express = require("express");
// const router=express.Router();
const app=express();
const auth = require('./instagramBasicDisplay.routes');
const admin = require('./admin.routes');
const brands = require('./brands.routes');
const dataset= require('./dataset.routes');
const influencer= require('./influencer.routes');
const image= require('./image.routes');
const compaign=require('./compaign.routes');
const report=require('./report.routes');
//const  app = require("express");
app.use('/BasicDisplay',auth);
app.use('/Influencer',influencer);
app.use('/Admin',admin);
app.use('/Brands',brands);
app.use('/Dataset',dataset);
app.use('/Image',image);
app.use('/Campaign',compaign);
app.use('/Report',report);
module.exports=app