const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const dataset = require("../models/campaign.model")
const InfluencerLink_store = require("../models/Influencer_Link");
const token1 = require("../models/influencer_token");
const express = require("express");
const request = require("request");
const axios = require("axios");
const influncer_detail = require("../models/Influencers_model");
const moment = require("moment");
const influencer_detail = require("../models/Influencers_model");
const Service=require("../services/otp.Services");
const OtpModel = require('../models/otpModel.models');
const update_stor = require("../models/update_model");
const util = require('util');
const postAsync = util.promisify(request.post);
const cron = require('node-cron');
const data=async()=>{
    const data1=influencer_detail.find().then((data1)=>{
        console.log(data1);
    for(i=0;i<data1.length;i++){
        //console.log(data1[i].username);
        if(data1[i].username==undefined){
            console.log("cant fetch rn")
        }else{
            influencerUpdateData(data1[i].username,data1[i].email);
            console.log("hii");
            console.log(data1[i].username);
        }
    }
    });
}
const influencerUpdateData=async(user_name,email)=>{
    const user = influncer_detail.findOne({ email:email })
        if (!user) {
            res.status(400).send("unauthorize user!!!")
        }
        const config = {
            headers: {
                'X-RapidAPI-Key': process.env.RapidKey,
                'X-RapidAPI-Host': process.env.RapidHost
            }
        };
        const userData = axios.get(
            `https://instagram28.p.rapidapi.com/user_info?user_name=${user_name}`, config)
            .then(async (old) => {
                console.log(old.data);
                //console.log(old.data.data.user.edge_owner_to_timeline_media.edges.node.display_url);
                // console.log()
                if (old.data.data.user.is_private != true) {
                    const dataSave = await influncer_detail.findOne({ email: req.body.Influencer_username }).updateOne({
                        $set: {
                            followers_count: old.data.data.user.edge_followed_by.count,
                            following_count: old.data.data.user.edge_follow.count,
                            post_profile_url: old.data.data.user.profile_pic_url,
                            bio: old.data.data.user.biography,
                            mediaCount: old.data.data.user.edge_owner_to_timeline_media.count,
                            username: user_name,
                            edeges: old.data.data.user.edge_owner_to_timeline_media.edges,
                        },
                        // $push:{
                        //     edeges: old.data.data.user.edge_owner_to_timeline_media.edges,
                        // }
                    })
                    console.log("hii");
                    res.status(201).send({ dataSave });
                } else {
                    res.status(200).send("Oops!! your account isn't public or professional...")
                }
            })
            .catch(error => {
                res.status(400).send("May  be you have exceeded you limit!!");
            })
    
}
cron.schedule('0 0 */7 * *',data);
module.exports = {
    //Influencer all data
    influencerAllData:async(req,res)=>{
        try{
            let record=[]
            const email=req.params.email;
            const influencerPersonalDetail=await influncer_detail.findOne({email:email});
            const influencerLinks=await InfluencerLink_store.findOne({username:email});
            const InfluencerUpdatePageInfo=await update_stor.findOne({username:email});
            record.push({"influencerPersonalDetail":influencerPersonalDetail,"influencerLinks":influencerLinks,"InfluencerUpdatePageInfo":InfluencerUpdatePageInfo});
            res.status(201).send(record);
        }catch{
            res.status(400).send(error)
        }
    },
    //router.post("/Influencer_link_account")
    verifyOtp: async(req, res) => {
        try {
            const otp = req.body.otp;
            const number=req.body.phone
            const verify = await OtpModel.findOne({otp:otp,phone:number});;
            if(verify){
            res.status(201).send("Number verified sucessfully!!")
            }else{
                res.status(400).send("incorrect otp!!");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getByName:async(req,res)=>{
        try{
            const name=req.params.name;
            const findit=await influencer_detail.findOne({Influencer_username:name});
            if(findit){
                res.status(201).send(findit);
            }else{
                res.status(201).send("record does not exist!!")
            }
        }catch(error){
            res.status(400).send(error);
        }
    },
    sendOtp: async (req, res) => {
        try {
            const otp = Service.generateOtp(5);
            console.log(otp);
            const number = req.body.phone;
            const name = req.body.name;
            const message = `hii ${name}! Your OTP for bounty and threads as influencer is ${otp}`;
            console.log(number);
            console.log(message);
            console.log(otp);
            const check = await OtpModel.findOne({ phone: number })
            if (!check) {
                const response = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`)
                if (response) {
                    const data = new OtpModel({
                        phone: number,
                        otp: otp
                    }).save();
                    res.status(201).send("Otp sent sucessfully");
                } else {
                    res.status(400).send("unable to send Otp");
                }
            } else {
                res.send("number is already registered!!")
            }

        }catch(error){
            res.status(400).send(error);
        }
    },
    influencerLinkStore: async (req, res) => {
        try {
            if (!req.body.username) {
                res.status(404).send("Email is not Authrozied!!!");
            }
            const { username, Instagram_link, Facebook_Link, Youtube_Link, Twitter_Link, website_Link } = req.body;
            const usernam = await influncer_detail.findOne({ email: req.body.username });
            const check = await InfluencerLink_store.findOne({ username: req.body.username });
            if (check) {
                InfluencerLink_store.findOne({ username: req.body.username }).updateOne(
                    {
                        $set:
                        {
                            Instagram_Link: Instagram_link,
                            Facebook_Link,
                            Youtube_Link,
                            Twitter_Link,
                            website_Link

                        }
                    })
                    .then(result => {
                        res.status(200).json({
                            updated_links: result
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({
                            error: err
                        })
                    })
            } else {
                const data = new InfluencerLink_store({
                    username,
                    Instagram_Link: Instagram_link,
                    Facebook_Link,
                    Youtube_Link,
                    Twitter_Link,
                    website_Link
                })
                console.log(data);
                data.save().then(() => {
                    res.status(201).send(data);
                }).catch((e) => {
                    res.status(400).send(e, "username is not registered");
                })
            }
        } catch (error) {
            res.status(404).send("forbbiden to enter register");
        }
    },
    EngagementRate: async (req, res) => {
        try {
            let total_likes_count = 0;
            let in_engagement = 0;
            let total_engagement = 0;
            let followers_count = 0;
            const old = await influencer_detail.findOne({ email: req.body.email });
            if (old) {
                followers_count = old.followers_count;
                console.log(followers_count);
                old.edeges.filter(e => {
                    let likes = e.node.edge_liked_by.count;
                    //console.log(likes);
                    //counting the per post engagement
                    in_engagement = (likes * 100) / followers_count
                    //counting total likes
                    total_likes_count = total_likes_count + likes;

                })
                //counting overall engagement
                total_engagement = (total_likes_count * 100) / followers_count;
                res.status(201).send({ "total_engagement": total_engagement, "total_likes_count": total_likes_count, "followers_count": followers_count, "in_engagement": in_engagement });
            } else {
                res.status(400).send("cannot found record");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    AddLink: async (req, res) => {
        const { username, Instagram_link, Facebook_Link, Youtube_Link, Twitter_Link, website_Link } = req.body;
        BrandsLink_store.findOneAndUpdate({ username: req.params.id },
            {
                $push:
                {
                    username,
                    Instagram_Link: Instagram_link,
                    Facebook_Link,
                    Youtube_Link,
                    Twitter_Link,
                    website_Link

                }
            })
            .then(result => {
                res.status(200).json({
                    updated_links: result
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
    },
    removeInfluencer: async (req, res) => {
        //router.delete("/remover_influencer/:id")
        try {
            const deleteid = await influncer_detail.findByIdAndDelete(req.params.id);
            if (!req.params.id) {
                return res.status(400).send(err);
            }
            res.send(deleteid);
        } catch (err) {
            res.status(400).send("cannot delete", err);
        }

    },
    influencerDataCount: async (req, res) => {
        //router.get("/Get_influencers_data_count",async(req,res)=>{
        try {
            const influencer_data = await influncer_detail.find();
            const ll = influencer_data.length.toString();
            console.log(ll);
            res.status(201).send(ll);

        } catch (err) {
            res.send(err);
        }
    },
    influencerResetPassword: async (req, res) => {
        //router.patch("/resetpassword_influencer/:id")
        try {
            const oldpassword = req.body.old;
            const id = req.params.id;
            const newpassword = req.body.neew;
            const cpassword = req.body.cpassword;
            const old = await influncer_detail.findOne({ email: id });
            console.log(old);
            const check = await bcrypt.compare(oldpassword, old.password);
            if (!check) {
                res.send("password is incorrect!!")
            }
            else {
                if (newpassword == cpassword) {
                    let lt = await bcrypt.hash(newpassword, 10);
                    console.log(lt);
                    const ll = (await lt).toString();
                    console.log(ll);
                    const Brand_data = await influncer_detail.findOne({ email: id }).updateOne({
                        $set: { password: ll }
                    }).then(() => {
                        res.status(201).send("succesfully checked");
                    }).catch((error) => {
                        res.status(400).send("error");
                    });
                }
                else {
                    res.send("passwrod not matched");
                }
            }
        } catch (error) {
            res.send(error + "error occured");
        }
    },
    influencerRegister: async (req, res) => {
        //router.post("/Influencer_Register")
        console.log(req.body);

        const password = req.body.password;
        const cpassword = req.body.repassword;
        console.log("hii");
        if (password == cpassword) {
            const user = new influncer_detail({
                Influencer_username: req.body.Influencer_username,
                Influencer_Firstname: req.body.Influencer_Firstname,
                Influencer_Lastname: req.body.Influencer_Lastname,
                email: req.body.email,
                types: req.body.type,
                Street_Address: req.body.Street_Address,
                city: req.body.city,
                State: req.body.State,
                postal_code: req.body.postal_code,
                password: req.body.password,
                repassword: req.body.repassword,
                phone: req.body.phone,
                Instagram_link: req.body.Instagram_link,
            });
            console.log(user);

            //console.log(cookie);
            user.save().then(() => {
                res.status(201).send(user);
            }).catch((error) => {
                res.status(400).send(error);
            });


        } else {
            res.status(400).send("password is not matching");
        }

    },
    influencerLogin: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user_email = await influncer_detail.findOne({ email: email });
            const ismatch = await bcrypt.compare(password, user_email.password);
            const paru = jwt.sign({ email: email }, process.env.SECRET_FOR_TOKEN);
            const name = user_email.Brands_name;
            const ola1 = new token1({
                token: paru,
                email: email
            })
            ola1.save().then(() => {
                console.log("token generated");
            }).catch(() => {
                console.log("token undefined");
            });
            if (!ismatch) {
                res.status(400).send("invalid email or password credentials");
                //just need to change send to render and then the page in doble quates for routes
            } else {
                res.status(201).send({ paru, name });
            }
        } catch (err) {
            res.status(400).send("invalid data entry");
        }
    },
    getInfluencerById: async (req, res) => {
        //router.get("/Get_influencer_data/:id")
        try {
            const _id = req.params.id;
            const infuencer_data = await influncer_detail.findById(_id);
            if (!infuencer_data) {
                return res.status(400).send();
            } else {
                res.send(infuencer_data);
            }
        }
        catch (err) {
            res.send(err);
        }

    },
    getInfluencerByUsername: async (req, res) => {
        //router.get("/Get_influencer_data_username/:email")
        try {
            const username = req.params.email;
            const infuencer_data = await influncer_detail.findOne({ email: username });
            if (!infuencer_data) {
                return res.status(400).send();
            } else {
                res.send(infuencer_data);
            }
        }
        catch (err) {
            res.send(err);
        }

    },
    getInfluencerData: async (req, res) => {
        try {
            const influencer_data = await influncer_detail.find();
            res.send(influencer_data);

        } catch (err) {
            res.send(err);
        }
    },
    influencerLinkShow: async (req, res) => {
        try {
            const username = req.params.email;
            const Brand_data = await InfluencerLink_store.findOne({ username: username });
            if (!Brand_data) {
                return res.status(400).send("error");
            } else {
                res.send(Brand_data);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    influencerLogout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((currentelement) => {
                return currentelement.token != req.token
            });
            res.clearCookie("jwt");

            console.log("logout succesfully!!");
            const savep = await req.user.save();
            res.send("logout successfully!!");

        } catch (error) {
            res.status(400).send(error);
        }
    },
    influencerUpdateById: async (req, res) => {
        try {
            const _id = req.params.id;
            const pass = req.body.password;
            const alan = await bcrypt.hash(pass, 10);
            const bush = (await alan).toString();
            const Brand_data = await influncer_detail.findByIdAndUpdate(_id, {
                $set: {
                    Influencer_username: req.body.Influencer_username,
                    Influencer_Firstname: req.body.Influencer_Firstname,
                    Influencer_Lastname: req.body.Influencer_Lastname,
                    email: req.body.email,
                    Street_Address: req.body.Street_Address,
                    city: req.body.city,
                    State: req.body.State,
                    postal_code: req.body.postal_code,
                    password: bush,
                    repassword: undefined,
                    phone: req.body.phone,
                    Instagram_link: req.body.Instagram_link
                }
            }).then(() => {
                res.send("updated");
            }).catch((error) => {
                res.send("unable to update");
            });;

        }
        catch (err) {
            res.send(err);
        }
    },
    influencerByType: async (req, res) => {
        if (!req.body.type) {
            res.status(400).send("type is not specified");
        }
        const findit = await influncer_detail.findOne({ types: req.body.type }).then((findit) => {
            res.status(201).send(findit);
        }).catch((error) => {
            res.status(503).send("unable to set the query");
        })
    },
    influencerUpdateInstaData: (req, res) => {
        const user = influncer_detail.findOne({ email: req.body.Influencer_username })
        if (!user) {
            res.status(400).send("unauthorize user!!!")
        } else {
            const user_name = req.body.user_name;
            const config = {
                headers: {
                    'X-RapidAPI-Key': process.env.RapidKey,
                    'X-RapidAPI-Host': process.env.RapidHost
                }
            };
            const userData = axios.get(
                `https://instagram28.p.rapidapi.com/user_info?user_name=${user_name}`, config)
                .then(async (old) => {
                    console.log(old.data);
                    //console.log(old.data.data.user.edge_owner_to_timeline_media.edges.node.display_url);
                    // console.log()
                    if (old.data.data.user.is_private != true) {
                        const dataSave = await influncer_detail.findOne({ email: req.body.Influencer_username }).updateOne({
                            $set: {
                                followers_count: old.data.data.user.edge_followed_by.count,
                                following_count: old.data.data.user.edge_follow.count,
                                post_profile_url: old.data.data.user.profile_pic_url,
                                bio: old.data.data.user.biography,
                                mediaCount: old.data.data.user.edge_owner_to_timeline_media.count,
                                username: user_name,
                                edeges: old.data.data.user.edge_owner_to_timeline_media.edges,
                            },
                            // $push:{
                            //     edeges: old.data.data.user.edge_owner_to_timeline_media.edges,
                            // }
                        })
                        console.log("hii");
                        res.status(201).send({ dataSave });
                    } else {
                        res.status(200).send("Oops!! your account isn't public or professional...")
                    }
                })
                .catch(error => {
                    res.status(400).send("May  be you have exceeded you limit!!");
                })
        }

    },
    influencerStoreHashtag: async (req, res) => {
        if (!req.body.Influencer_username && !req.body.hashtag) {
            res.status(400).send("inappropriate data!!");
        }
        const user = await influncer_detail.findOne({ email: req.body.Influencer_username })
        if (!user) {
            res.status(400).send("unauthorize user!!!")
        }
        const dataSave = await influncer_detail.findOne({ email: req.body.Influencer_username }).updateOne({
            $push: {
                Hastag: req.body.hastag
            }
        }).then((dataSave) => {
            res.status(201).send(dataSave);
        }).catch(error => {
            res.status(400).send(error);
        })
    },
    applyService: async (req, res) => {
        try {
            if (req.body.isActive == true) {
                let date = new Date();
                console.log(date);
                let pota = [];
                let statusapply = ["applied", "null"];
                let camp = req.body.name;
                console.log(camp);
                pota.push({ "statusapply": statusapply, "camp": camp });
                console.log(pota);
                let check = await influencer_detail.findOne({ email: req.body.email, detail: { $elemMatch: { "statusapply": { $in: statusapply }, "camp": camp } } });
                console.log(check)
                if (check) {
                    res.status(201).send("YOU HAVE ALREADY APPLIED FOR THIS CAMPAIGN!...")
                }
                else {
                    console.log("hii");
                    const dates = await dataset.findOne({ nameOfCamp: req.body.name });
                    console.log(dates.from);
                    if ((moment(date).diff(dates.from) >= 0) && (moment(dates.to).diff(date) >= 0)) {

                        const data = await influncer_detail.findOne({ email: req.body.email }).updateOne({
                            $push: {
                                detail: {
                                    statusapply: "applied",
                                    camp: req.body.name,
                                    statusshow: undefined,
                                    dateofApply: date,

                                }
                            }
                        }).then(async (data) => {
                            console.log(data);
                            const data2 = await influncer_detail.findOne({ email: req.body.email })
                            const number = data2.phone;
                            console.log(number);
                            const name = data2.Influencer_username;
                            console.log(name);
                            const message = `Hii! ${name} congratulations you have sucessfully applied for this campaign`
                            const response = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`)
                            //console.log("done");
                        }).catch((error) => {
                            res.status(400).send(error);
                        })
                        res.status(201).send("Applied...");
                    }else{
                        res.status(200).send("Campaign is not started yet!..");
                    }
                }

            } else {
                res.status(201).send("you  cannot apply for campaign");
            }
        } catch (error) {
            res.status(400).send("page  error occured")
        }
    },
    //Interested pass like that...
    SelectInterest:async(req,res)=>{
        try{
            let interest=req.body.status;
            const data = await influncer_detail.find({ email:req.body.email, detail: { $elemMatch: { statusshow: "Approved", camp: req.body.name } } }).updateOne({
                $set:{
                    'detail.$.statusfinal': req.body.status
                }

            })
            if(data){
                res.status(201).send(`your Intersest is ${interest}`)
            }else{
                res.status(400).send("Unable to update the info")
            }

        }catch(error){
            res.status(400).send(error);
        }
    },
    approveShow:async(req,res)=>{
        try{
            let record=[];
            const data = await influncer_detail.find({ email:req.params.email,detail: { $elemMatch: { statusshow: "Approved" }} }).then((Element)=>{
                Element.filter(s=>{
                    s.detail.filter(e=>{
                        if(e.statusfinal=="null"){
                            console.log(e.camp);
                            record.push({"NameOfCamp":e.camp})
                        }
                    })
                })
            })
            if(record.length!=0){
                res.status(201).send(record);
            }else{
                res.status(200).send("No Record found!!")
            }
        }catch(error){
            res.status(400).send(error)
        }
    }
}
