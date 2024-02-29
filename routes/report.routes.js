const express = require("express");
const router=express.Router();
const control=require("../controllers/index")


router.post("/report",control.report.createReport);

module.exports=router;