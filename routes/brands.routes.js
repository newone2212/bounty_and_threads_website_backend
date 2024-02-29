const express = require("express");
const router=express.Router();
const control=require("../controllers/index");
const auth=require("../authentication/auth");
const app=express();
router.post("/brandsLogin",control.brands.brandsLogin);
router.post("/brandsRegister",control.brands.brandsRegister);
router.post("/brandsLinkStore",control.brands.brandsLinkStore);
router.post("/addBrandsLink/:id",control.brands.AddLink);
router.delete("/brandsRemove/:id",control.brands.removeBrands);
router.patch("/resetPasswordbrands/:id",control.brands.resetPasswordBrands);
router.get("/getbrandsData",control.brands.getBrandsData);
router.get("/getbrandsDataById/:id",control.brands.getBrandsById);
router.get("/getbrandsDataByUsername/:email",control.brands.getBrandsByUsername);
router.get("/getbrandsDataCount",control.brands.getBrandsDataCount);
router.get("/logutbrands",auth.brands,control.brands.brandsLogout);
router.put("/brandsUpdateById/:id",control.brands.brandsUpdateById)
router.get("/brandsLinkShow/:email",control.brands.brandsLinkShow);
router.post("/createDashboard",control.brands.createBrandDashboard);
router.post("/dashboard",control.brands.getDashboard);
router.get("/applyShow/:name",control.brands.applyShow);
router.get("/approveShow/:name",control.brands.approveShow);
router.get("/disapproveShow/:name",control.brands.disapproveShow);
router.post("/approveService",control.brands.appoveService);
router.get("/InterestedShow/:name",control.brands.InterestShow);
router.get("/NotInterestedShow/:name",control.brands.NotInterestShow);
router.post("/finalApprovalService",control.brands.finalAppovedService);
router.post("/otpVerify",control.brands.verifyOtp);
router.post("/sendOtp",control.brands.sendOtp);



module.exports=router;
