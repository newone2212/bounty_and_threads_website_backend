const express = require("express");
const influncer_detail = require("../models/Influencers_model");
const update_stor = require("../models/update_model");
const axios = require("axios");
require("dotenv").config();
var cron = require('node-cron');
var redirect_uri ='https://dreabee-live.azurewebsites.net/';
const api = require('instagram-node').instagram();
api.use({
    client_id: process.env.INSTA_APP_ID,
    client_secret: process.env.INSTA_APP_SECRET
});
const Access_token=require("../models/Access_Token");
const { FacebookAdsApi } = require('facebook-nodejs-business-sdk');
const { Page } = require('facebook-nodejs-business-sdk');
const { Insights } = require('facebook-nodejs-business-sdk');
const { request, response } = require("../routes/routes.index");
const { config } = require("bluebird");
//const axios=require("axios");
module.exports = {
    verify:async(req,res)=>{
        try{
            const ala=req.body.email;
            console.log(ala);
            const username=req.body.username;
            if(username && !ala){
                const record=await influncer_detail.findOne({Influencer_username:username});
                if(record){
                    res.status(201).send(record);
                }else{
                    res.status(200).send("NotFound");
                }                
            }else{
                const record=await influncer_detail.findOne({Influencer_username:username,email:ala});
                if(record){
                    res.status(201).send(record);
                }else{
                    res.status(200).send("NotFound");
                }
            }

        }catch(error){
            res.status(400).send(error);
        }
    },
    checking:async(req,res)=>{
        try{
            const email=req.body.email;
            const record=await Access_token.findOne({username:email});
            if(record){
                res.status(201).send(record.access_token);
            }else{
                res.status(201).send("Call the redirect");
            }
        }catch(error){
            res.status(400).send(error);
        }
    },
    updatePageInfo: async (req, res) => {
        try {
            const username = req.body.email;
            const data_show = await influncer_detail.findOne({ email: username });
            if(data_show){
                const sender= await update_stor.findOne({username:username})
                if(!sender){
                    const user = new update_stor({
                        username: req.body.email,
                        dob: req.body.dob,
                        gender: req.body.gender,
                        categories: req.body.categories,
                        image: req.body.image,
                        materialStatus:req.body.materialStatus,
                        PreviousBrandAssociation:req.body.PreviousBrandAssociation,
                        MarriageDate:req.body.MarriageDate,
                        PaymentDetail:req.body.PaymentDetail,
                        instagram_Others_profiles:req.body.instagram_Others_profiles
                    });
                    user.save().then(() => {
                        res.status(201).send(user);
                    }).catch((error) => {
                        res.status(400).send(error);
                    });
                }else{
                    await update_stor.findOne({username:username}).updateOne({
                        $set:{
                            dob: req.body.dob,
                            gender: req.body.gender,
                            categories: req.body.categories,
                            image: req.body.image,
                            materialStatus: req.body.materialStatus,
                            PreviousBrandAssociation: req.body.PreviousBrandAssociation,
                            MarriageDate: req.body.MarriageDate,
                            PaymentDetail: req.body.PaymentDetail
                        },
                        $push:{
                            instagram_Others_profiles:req.body.instagram_Others_profiles
                        }
                    }).then((response)=>{
                        res.status(201).send("updated!!")
                    }).catch((error)=>{
                        res.status(400).send(error)
                    });
                }
            }else{
                res.status(400).send("record not found!!")
            }
        } catch (error) {
            res.status(403).send("invalid!!!");
        }
    },
    showUpdatedPageInfo: async (req, res) => {
        try {
            const name = req.params.username;
            const usernam = new update_stor.findOne({ username: name });
            // const photo=new Image_store.findOne({username:name});

            res.status(201).send({ usernam });
        } catch (error) {
            res.status(400).send("unable to fetch");
        }
    },
    LongTermToken: async (req, res) => {
        try {
            let instaAccessToken = req.body.accesstoken;
            let resp = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTA_APP_SECRET}&access_token=${instaAccessToken}`)
            let accessToken = resp.data.access_token;
            res.status(201).send(accessToken);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    refereshToken: async (req, res) => {
        try {
            cron.schedule('* * * * * 7', async (req, res) => {
                let oldAccessToken = req.body.accesstoken; // get from DB
                let resp = await axios.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${oldAccessToken}`);
                if (resp.data.access_token) {
                    let newAccessToken = resp.data.access_token;
                    // save newAccessToken to DB
                    const token = new Access_token({
                        access_token: newAccessToken,
                        username: req.body.username
                    });
                    token.save().then(() => {
                        console.log("saved");
                    }).catch((error) => {
                        console.log("error", error);
                    })
                    res.status(201).send("called");
                } else {
                    res.status(400).send("error");
                }
            });
            res.status(201).send("called");
        } catch (e) {
            console.log("Error=====", e.response.data);
        }

    },
    pipeline: async (req, res) => {
        try {
            const a = req.body.accessToken;
            res.send(a);
        } catch (error) {
            res.send(error);
        }
    },
    showIgData: async (req, res) => {
        try {
            let instaAccessToken = req.body.accesstoken; // get from DB
            let resp = await axios.get(`https://graph.instagram.com/me/media?fields=media_url&access_token=${instaAccessToken}`);
            resp = resp.data;
            console.log(resp);
            //let instaPhotos = resp.data.filter(d => d.media_type === "IMAGE").map(d => d.media_url);
            // Got insta photos
            res.status(201).send(resp)
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }


    },
    authorize_user: function (req, res) {
        res.redirect(api.get_authorization_url(redirect_uri, { scope: ['user_media', 'user_profile','instagram_manage_insights','manage_pages'], state: 'a state' }));
    },
    handleauth: function (req, res) {
        api.authorize_user(req.query.code, redirect_uri,function(err, result){
            if (err) {
                console.log(err.body);
                res.status(400).send("Didn't work");
            } else {
                console.log('Yay! Access token is ' + result.access_token);
                const token = result.access_token;
                res.status(201).send(token);
            }
        });
    }
}