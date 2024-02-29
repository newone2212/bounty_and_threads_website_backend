const fs = require('fs');
const Image_store = require("../models/image_model");
const FacebookAdsApi = require('facebook-nodejs-ads-sdk');
const Brand_detail = require("../models/brands_model");
const influncer_detail = require("../models/Influencers_model");
const data = require("../models/Interection.model");
const dataset = require("../models/campaign.model")
const BrandsLink_store = require("../models/Brands_Link");
const Brands_dashboard = require("../models/brandsdashboard.model");
const axios = require("axios");
const { count } = require('console');
const moment = require("moment");
const request=require('request');
const util = require('util');
const postAsync = util.promisify(request.post);
const Trends_dashboard = require("../models/trendDashboard.model");
const cron = require('node-cron');
const old = async () => {
    let data = new Date();
    const find = await dataset.find();
    console.log(find);
    for (i = 0; i <= find.lenght; i++) {
        if ((moment(date).diff(find[i].to) < 0)) {
            await dataset.find({ nameOfCamp: find[i].nameOfCamp }).update({
                $set: {
                    status: false
                }
            })
        }
    }
}

cron.schedule('0 0 * * *', old);
//cron.start();
module.exports = {
    createPostAd: (req, res) => {
        try {
            const access_token = req.body.token;
            const app_secret = process.env.FACE_ID;
            const app_id = process.env.FACE_SECRET;
            const account_id = req.body.id;
            const api = FacebookAdsApi.init(access_token);

            const AdAccount = api.AdAccount;
            const Campaign = api.Campaign;
            const AdSet = api.AdSet;
            const AdCreative = api.AdCreative;
            const Ad = api.Ad;

            const campaign_name = req.body.name;
            const objective = Campaign.Objective.conversions;
            const campaign = new Campaign(null, account_id, {
                name: campaign_name,
                objective: objective,
            });

            campaign
                .create()
                .then((campaign) => {
                    const campaign_id = campaign.id;
                    const ad_set_name = req.body.setname;
                    const targeting_spec = {
                        age_min: parseInt(req.body.minAge),
                        age_max: parseInt(req.body.maxAge),
                        gender: 1,
                    };
                    const daily_budget = req.body.budget;
                    const billing_event = AdSet.BillingEvent.impressions;
                    const ad_set = new AdSet(null, account_id, {
                        name: ad_set_name,
                        campaign_id: campaign_id,
                        targeting: targeting_spec,
                        daily_budget: daily_budget,
                        billing_event: billing_event,
                    });
                    ad_set
                        .create()
                        .then((ad_set) => {
                            const ad_set_id = ad_set.id;
                            const creative = new AdCreative(null, account_id, {
                                name: req.body.creativename,
                                object_story_spec: {
                                    page_id: req.body.pageid,
                                    link_data: {
                                        call_to_action: {
                                            type: req.body.creativeType,
                                            value: {
                                                link: req.body.websitelink,
                                            },
                                        },
                                        message: req.body.message,
                                        image_hash: req.body.imagehash,
                                    },
                                },
                            });
                            creative
                                .create()
                                .then((creative) => {
                                    const creative_id = creative.id;
                                    const ad_name = req.body.ad_name;
                                    const ad = new Ad(null, account_id, {
                                        name: ad_name,
                                        adset_id: ad_set_id,
                                        creative: {
                                            creative_id: creative_id,
                                        },
                                        status: Ad.Status.paused,
                                    });
                                    ad.create().then((ad) => {
                                        res.status(201).send('Ad created:', ad);
                                    });
                                })
                                .catch((error) => {
                                    console.error('Failed to create ad creative:', error);
                                });
                        })
                        .catch((error) => {
                            console.error('Failed to create ad set:', error);
                        });
                })
                .catch((error) => {
                    res.send('Failed to create campaign:', error);
                });

        } catch (error) {
            res.status(500).send(error)
        }
    },
    createVedioAd: async (req, res) => {
        try {
            const access_token = req.body.token;
            const app_secret = process.env.FACE_ID;
            const app_id = process.env.FACE_SECRET;
            const account_id = req.body.id;

            const api = FacebookAdsApi.init(access_token);

            const AdAccount = api.AdAccount;

            const page_id = req.body.pageid;
            const video_path = req.body.vedioFilePath;
            const message = req.body.message;

            AdAccount.get(account_id, (err, account) => {
                const video = fs.readFileSync(video_path);

                account.createAdVideo([], {
                    name: req.body.adVedioName,
                    file: video,
                }, (err, videoAsset) => {
                    const adCreative = account.createAdCreative([], {
                        name: rea.body.adCreativeName,
                        object_story_spec: {
                            page_id: page_id,
                            video_data: {
                                description: message,
                                video_id: videoAsset.id,
                            },
                        },
                    });

                    const ad = account.createAd([], {
                        name: req.body.adName,
                        adset_id: req.body.assetId,
                        creative: {
                            creative_id: adCreative.id,
                        },
                        status: 'PAUSED',
                    });
                    res.send('Video posted:', ad);
                });
            });

        } catch (error) {
            res.status(500).send('cant post the vedio', error)
        }
    },
    getads: (req, res) => {
        try {
            const access_token = req.body.token;
            const app_secret = process.env.FACE_ID;
            const app_id = process.env.FACE_SECRET;
            const account_id = req.body.id;

            const api = FacebookAdsApi.init(access_token);

            const AdAccount = api.AdAccount;

            AdAccount.get(account_id, (err, account) => {
                account.getAds([], {
                    'effective_status': ['ACTIVE', 'PAUSED'],
                }, (err, ads) => {
                    if (err) {
                        console.log(err);
                    } else {
                        ads.forEach((ad) => {
                            if (ad.adset.name === '<your-ad-set-name>') {
                                account.getInsights([], {
                                    'ad_ids': [ad.id],
                                    'time_range': { 'since': `${req.body.startDate}`, 'until': `${req.bodyendDate}` },
                                    'level': 'ad',
                                }, (err, insights) => {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        res.send(insights);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    updatePostAd: (req, res) => {
        const access_token = req.body.token;
        const app_secret = process.env.FACE_ID;
        const app_id = process.env.FACE_SECRET;
        const account_id = req.body.id;


        const api = FacebookAdsApi.init(access_token);

        const AdAccount = api.AdAccount;

        const message = req.body.message;

        AdAccount.get(account_id, (err, account) => {
            account.getAds([], {
                'effective_status': ['ACTIVE', 'PAUSED'],
            }, (err, ads) => {
                if (err) {
                    console.log(err);
                } else {
                    ads.forEach((ad) => {
                        if (ad.adset.name === '<your-ad-set-name>') {
                            account.getAdCreative(ad.creative.id, (err, adCreative) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    adCreative.update([], {
                                        object_story_spec: {
                                            page_id: req.body.pageid,
                                            video_data: {
                                                description: message,
                                            },
                                        },
                                    }, (err, updatedCreative) => {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.status(201).send('Post updated:', updatedCreative);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    deletePostAd: (req, res) => {
        const access_token = req.body.token;
        const app_secret = process.env.FACE_ID;
        const app_id = process.env.FACE_SECRET;
        const account_id = req.body.id;

        const api = FacebookAdsApi.init(access_token);

        const AdAccount = api.AdAccount;

        AdAccount.get(account_id, (err, account) => {
            account.getAds([], {
                'effective_status': ['ACTIVE', 'PAUSED'],
            }, (err, ads) => {
                if (err) {
                    console.log(err);
                } else {
                    ads.forEach((ad) => {
                        if (ad.adset.name === rea.body.adsetname) {
                            account.getAdCreative(ad.creative.id, (err, adCreative) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    adCreative.delete((err) => {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.status(201).send('Post deleted.');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    createForm: async (req, res) => {
        try {
            if (!req.body.campaign) {
                res.status(400).send("name is not specified");
            }
            const foundimage = await Image_store.findOne({ username: req.body.campaign, name: req.body.logo });
            if (!foundimage) {
                res.status(400).send(error);
            }
            console.log(foundimage);
            const foundImage2 = await Image_store.findOne({ username: req.body.campaign, name: req.body.media });
            if (!foundImage2) {
                res.status(400).send(error);
            }
            const create = new dataset({
                brand_name: req.params.brand,
                nameOfCamp: req.body.campaign,
                logo: foundimage.image_url,
                hashtag: req.body.hashtag,
                brief: req.body.brief,
                minFollower: req.body.minFollower,
                Type: req.body.type,
                from: req.body.from,
                to: req.body.to,
                media: foundImage2.image_url,
                special: req.body.special,
                prize: req.body.prize,
                faq:[],
                status: true

            }).save().then((create) => {
                res.status(201).send(create)
            }).catch((error) => {
                res.status(400).send(error)
            })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    FAQ:async(req,res)=>{
        try{
            const {faq,camp}=req.body;
            console.log(faq);

            const record=dataset.findOne({nameOfCamp:camp}).updateOne({
                $push:{
                    faq:faq
                }
            }).then((response)=>{
                res.status(201).send("Updated Sucessfully")
            }).catch((error)=>{
                res.status(400).send("Unable to Post...server Error....")
            })

        }catch(error){
            res.status(400).send("Unable to Post...server Error....")
        }
    },
    ShowFAQ:async(req,res)=>{
        try{
            const {camp}=req.body;
            const record=await dataset.findOne({nameOfCamp:camp});
            //console.log(record)
            if(record.length!=0){
                res.status(201).send({"faq":record.faq,"CampName":camp});
            }else{
                res.status(400).send("Unable to fetch...server Error....")
            }

        }catch(error){
            res.status(400).send("Unable to fetch...server Error....")
        }
    },

    getFormDetailWithInstaBrandCamp: async (req, res) => {
        try {
            const {
                brand,
                type,
                Instagram_Link
            } = req.body
            let brandname = await Brand_detail.find({ Brands_name: brand });
            let campaingn = await dataset.find({ Type: type, brand_name: brandname.Brands_name, status: true });
            let platform = await BrandsLink_store.find({ Instagram_Link: Instagram_Link })
            if (!platform) {
                res.status(400).send("link didn't found!!!");
            }
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithFaceBrandCamp: async (req, res) => {
        try {
            const {
                brand,
                type,
                Facebook_Link
            } = req.body
            let brandname = await Brand_detail.find({ Brands_name: brand });
            let campaingn = await dataset.find({ Type: type, brand_name: brandname.Brands_nam, status: true });
            let platform = await BrandsLink_store.find({ Facebook_Link: Facebook_Link })
            if (!platform) {
                res.status(400).send("link didn't found!!!");
            } if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getCampaignDetailWithBrand:async(req,res)=>{
        try{
            let brand=req.body.brand;
            let brandname = await Brand_detail.findOne({ Brands_name: brand });
            if (brandname.length!=0) {
                let campaingn = await dataset.find({ brand_name: brandname.Brands_name, status: true });
                    res.status(201).send(campaingn)
                } else {
                    const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                    res.status(200).send(message)
                }
        }catch(error){
            res.status(400).send("Inappropriate Credentaials")
        }
    },
    getFormDetailWithTwitBrandCamp: async (req, res) => {
        try {
            const {
                brand,
                type,
                Twitter_Link
            } = req.body
            let brandname = await Brand_detail.find({ Brands_name: brand });
            let campaingn = await dataset.find({ Type: type, brand_name: brandname.Brands_name, status: true });
            let platform = await BrandsLink_store.find({ Twitter_Link: Twitter_Link })
            if (!platform) {
                res.status(400).send("link didn't found!!!");
            }
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },

    getFormDetailWithYouBrandCamp: async (req, res) => {
        try {
            const {
                brand,
                type,
                Youtube_Link
            } = req.body
            let brandname = await Brand_detail.find({ Brands_name: brand });
            let campaingn = await dataset.find({ Type: type, brand_name: brandname.Brands_name, status: true });
            let platform = await BrandsLink_store.find({ Youtube_Link: Youtube_Link })
            if (!platform) {
                res.status(400).send("link didn't found!!!");
            }
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithBrandCamp: async (req, res) => {
        try {
            const {
                brand,
                type,
            } = req.body
            let brandname = await Brand_detail.findOne({ Brands_name: brand });
            let campaingn = await dataset.find({ Type: type, brand_name: brandname.Brands_name, status: true });
            //let platform = BrandsLink_store.find({ Youtube_Link:Youtube_Link })
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithBrand: async (req, res) => {
        try {
            const brand = req.body.brand;
            let valueStore = []
            
            
            console.log(brand);
            let brandname = await Brand_detail.findOne({ Brands_name: brand });
            console.log(brandname);
            if (brandname.length!=0) {
                let campaingn = await dataset.find({ brand_name: brandname.Brands_name, status: true });
                let show = await data.find({brand_name:brand});

                if (campaingn.length != 0 && show.length != 0) {
                    res.status(201).send({ "CampaignDetails": campaingn, "InfluencerDetails": show })
                } else {
                    const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                    res.status(200).send(message)
                }
            } else {
                res.status(201).send("No Record Found...");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetail: async (req, res) => {
        try {
            //console.log(type);
            let campaingn = await dataset.find({ status: true });
            console.log("hii");
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithCamp: async (req, res) => {
        try {
            const {
                type,
            } = req.body
            console.log(type);
            let campaingn = await dataset.find({ Type: type, status: true });
            console.log("hii");
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithYouCamp: async (req, res) => {
        try {
            const {
                Youtube_Link
            } = req.body
            //let brandname = Brand_detail.findOne({ Brands_name: brand });
            //let campaingn = dataset.findOne({ Type: type });
            let platform = await BrandsLink_store.find({ Youtube_Link: Youtube_Link })
            const flag = platform.username;
            let campaingn = await dataset.find({ brand_name: flag, status: true });

            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithTwitCamp: async (req, res) => {
        try {
            const {
                Twitter_Link
            } = req.body
            //let brandname = Brand_detail.findOne({ Brands_name: brand });
            //let campaingn = dataset.findOne({ Type: type });
            let platform = await BrandsLink_store.find({ Twitter_Link: Twitter_Link })
            const flag = platform.username;
            let campaingn = await dataset.find({ brand_name: flag, status: true });

            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithFaceCamp: async (req, res) => {
        try {
            const {
                Facebook_Link
            } = req.body
            //let brandname = Brand_detail.findOne({ Brands_name: brand });
            //let campaingn = dataset.findOne({ Type: type });
            let platform = await BrandsLink_store.find({ Facebook_Link: Facebook_Link })
            const flag = platform.username;
            let campaingn = await dataset.find({ brand_name: flag, status: true });

            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getFormDetailWithInstaCamp: async (req, res) => {
        try {
            const {
                Instagram_Link
            } = req.body
            //let brandname = Brand_detail.findOne({ Brands_name: brand });
            //let campaingn = dataset.findOne({ Type: type });
            let platform = await BrandsLink_store.find({ Instagram_Link: Instagram_Link })
            const flag = platform.username;
            let campaingn = await dataset.find({ brand_name: flag, status: true });
            if (campaingn.length != 0) {
                res.status(201).send(campaingn)
            } else {
                const message = "YOU HAVEN'T CREATED CAMPAIGN!!..."
                res.status(200).send(message)

            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    filtertrendDashboard: async (req, res) => {
        try {
            if (!req.body.brandname) {
                res.status(400).send("inappropriate info!!");
            }
            const create = new Trends_dashboard({
                Brands_name: req.body.brandname,
                Hastag: req.body.hashtag,
                from: req.body.from,
                to: req.body.to,
                metric: req.body.metric,
                State: req.body.Location,
                Grnularity: req.body.Grnularity,
                Sponsered: req.body.Sponsered,
                interest: req.body.interest
            });
            console.log("hii");
            create.save().then(() => {
                res.status(201).send(create)
            }).catch((error) => {
                res.status(400).send(error);
            })

        } catch (error) {
            res.status(400).send("brand not found");
        }
    },
    filters: async (req, res) => {
        try {
            const {
                brand,
                loc,
                hash,
                from,
                metric,
                Grnularity,
                to,
                sponcered,
                interest
            } = req.body;
            const show = await Trends_dashboard.findOne({ Brands_name: brand });
            console.log(show)
            if (show.Hastag == hash || show.State == loc || show.Sponsered == sponcered || show.Grnularity == Grnularity || show.interest == interest) {
                res.status(200).send(show)
            }else{
                res.status(400).send("record not found");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    Interction: (req, res) => {
        try {
            const { brandname, influencername, type, name } = req.body;
            if (!brandname || !influencername) {
                res.status(400).send("inapropriate info")
            }
            console.log(brandname);
            console.log("hii")
            const brand = Brand_detail.findOne({ Brands_name: brandname });

            const influencer = influncer_detail.findOne({ Influencer_username: influencername, detail: { $elemMatch: { statusshow: "Approve" ,statusfinal:"notDone" } } });
            if (!influencer) {
                res.status(400).send("Your application is in pending state")
            }
            const Interction = new data({
                brand_name: brandname,
                influencer_name: influencername,
                types: type,
                campname: name,
                statusshow: "OnGoing.."
            })
                .save().then(() => {
                    res.status(201).send("stored");
                }).catch((error) => {
                    res.status(400).send(error);
                })

        } catch (error) {
            res.send(error)
        }

    },
    searchInstaHashtag: async (req, res) => {
        const hash_tag = req.body.hash_tag
        const config = {
            headers: {
                'X-RapidAPI-Key': process.env.RapidKey,
                'X-RapidAPI-Host': process.env.RapidHost
            }
        };
        const userData = await axios.get(
            `https://instagram28.p.rapidapi.com/hash_tag_medias?hash_tag=${hash_tag}`, config)
            .then((response) => {
                res.send(response.data);
                // console.log(response.data)
            })
            .catch(error => {
                res.status(400).send(error);
            })
    },
    completedInterection: async (req, res) => {
        try {
            const data1 = await influncer_detail.findOne({ Influencer_username: req.body.influencer }).updateOne({ detail: { $elemMatch: { camp: req.body.camp, statusshow: "Approve" } } }, {
                $set: {
                    'detail.$.statusshow': "Completed"
                }
            });
            console.log("hii");
            if (data1) {
                console.log("hii");
                const find = await data.findOne({ influencer_name: req.body.influencer, statusshow: "OnGoing.." }).updateOne({
                    $set: {
                        statusshow: " Completed!!"
                    }
                });
                if (!find) {
                    res.status(201).send("error");
                } else {
                    const data2 = await influncer_detail.findOne({ Influencer_username: req.body.influencer })
                    const number=data2.phone;
                    console.log(number);
                    const name=data2.Influencer_username;
                    console.log(name);
                    const message=`Hii! ${name} congratulations you have sucessfully completed this campaign`
                    const response = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`)
                    res.status(201).send("completed");
                }
            } else {
                res.send("error ")
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    showInterection: async (req, res) => {

        try {
            const findit = await data.find({ influencer_name: req.body.influencer, statusshow: req.body.statusshow });
            res.status(201).send(findit);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    showInfluencer:async(req,res)=>{
        try{
            const show=await data.find({campname:req.params.name});
            if(show.length!=0){
                res.status(201).send(show)
            }else{
                res.status(400).send("NO Inluencer applied for the brands");
            }
        }catch(error){
            res.status(400).send(error)
        }
    }
    
}