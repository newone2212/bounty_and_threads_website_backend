const express=require('express');
const router=express.Router();
const control=require("../controllers/index");

router.post("/createPostAd",control.compaign.createPostAd);
router.post("/createVedioAd",control.compaign.createVedioAd);
router.delete("/deletePostAd",control.compaign.deletePostAd);
router.patch("/updatePostAd",control.compaign.updatePostAd);
router.get("/getPostAd",control.compaign.getads);
router.post("/Intection",control.compaign.Interction);
router.post("/compaignFrom/:brand",control.compaign.createForm);
router.get("/getFormDetail",control.compaign.getFormDetail);
router.post("/getFormDetails/campaign",control.compaign.getFormDetailWithCamp);


//for admin panel two apis url
router.post("/getFormDetails/Brand",control.compaign.getFormDetailWithBrand);
router.post("/getCampaignDetails/Brand",control.compaign.getCampaignDetailWithBrand);
router.get("/InfluencerShow/:name",control.compaign.showInfluencer)

//faq api
router.post("/faq",control.compaign.FAQ);
router.post("/showfaq",control.compaign.ShowFAQ); 


router.post("/getFormDetails/campaign/Brand",control.compaign.getFormDetailWithBrandCamp);
router.post("/getFormDetails/campaign/Brand/Facebook",control.compaign.getFormDetailWithFaceBrandCamp);
router.post("/getFormDetails/campaign/Brand/Instagram",control.compaign.getFormDetailWithInstaBrandCamp);
router.post("/getFormDetails/campaign/Brand/Twitter",control.compaign.getFormDetailWithTwitBrandCamp);
router.post("/getFormDetails/campaign/Brand/Youtube",control.compaign.getFormDetailWithYouBrandCamp);
router.post("/getFormDetails/campaign/Facebook",control.compaign.getFormDetailWithFaceCamp);
router.post("/getFormDetails/campaign/Instagram",control.compaign.getFormDetailWithInstaCamp);
router.post("/getFormDetails/campaign/Twitter",control.compaign.getFormDetailWithTwitCamp);
router.post("/getFormDetails/campaign/Youtube",control.compaign.getFormDetailWithYouCamp);
router.post("/createTrendDashboard",control.compaign.filtertrendDashboard);
router.post("/contentFilter",control.compaign.filters);
router.post("/completeInterection",control.compaign.completedInterection);
router.post("/getInterectionDetails",control.compaign.showInterection);
router.post("/hashtagSearch",control.compaign.searchInstaHashtag);
module.exports=router;