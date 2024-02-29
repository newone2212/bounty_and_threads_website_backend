const express = require("express");
const router=express.Router();
const control=require("../controllers/index");


router.post("/createDataset",control.dataset.createDataset);
router.get("/getdataset",control.dataset.getdataset);
module.exports=router;
