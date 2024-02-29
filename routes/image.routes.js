const express = require("express");
const router=express.Router();
const control=require("../controllers/index");


router.post("/uploadImage/logo",control.image.uploadImage);
router.delete("/deleteImage",control.image.deleteImage);
router.get("/showImage",control.image.showImage);
router.post("/uploadImage/media",control.image.uploadVedio);
router.post("/uploadImage/BrandBackground",control.image.uploadImage);

module.exports=router;
