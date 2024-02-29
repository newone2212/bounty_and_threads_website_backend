const express = require("express");
const router=express.Router();
const control=require("../controllers/index")

router.get('/authorize_user',control.auth.authorize_user);
router.post('/handleauth',control.auth.handleauth); 
router.post("/longTermToken",control.auth.LongTermToken);
router.post("/refereshToken",control.auth.refereshToken);
router.post("/updatePageInfo",control.auth.updatePageInfo);
router.get("/showUpdatedPageInfo/:username",control.auth.showUpdatedPageInfo);
router.get("/pipeline",control.auth.pipeline);
router.post("/showIgData",control.auth.showIgData)
router.post("/verifying",control.auth.verify);
router.post("/checking",control.auth.checking);
//router.post("/refreshTokenGenerator",control.auth.refreshTokenGenerator);

module.exports=router;
