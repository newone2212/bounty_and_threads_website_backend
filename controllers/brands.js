const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const BrandsLink_store = require("../models/Brands_Link");
const token2 = require("../models/brands_token");
const express = require("express");
const Service=require("../services/otp.Services");
const OtpModel = require('../models/otpModel.models');
const request = require("request");
const util = require('util');
const postAsync = util.promisify(request.post);
const Brand_detail = require("../models/brands_model");
const influncer_detail = require("../models/Influencers_model");
const Brands_dashboard = require("../models/brandsdashboard.model");
const Image_store = require("../models/image_model");
const { error } = require("console");

module.exports = {
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
    sendOtp:async (req, res) => {
        try {
            console.log("hii")
            const otp = Service.generateOtp(5);
            console.log(otp);
            const number = req.body.phone;
            const name = req.body.name;
            const message = `hii ${name}! Your OTP for bounty and threads as brands is ${otp}`;
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
    brandsLinkStore: async (req, res) => {
        try {
            if (!req.body.username) {
                res.status(404).send("Email is not Authrozied!!!");
            }
            const { username, Instagram_link, Facebook_Link, Youtube_Link, Twitter_Link, website_Link } = req.body;
            console.log(Instagram_link);
            const usernam = await Brand_detail.findOne({ email: req.body.username });
            const check = await BrandsLink_store.findOne({ username: req.body.username });
            if (check) {
                BrandsLink_store.findOne({ username: req.body.username }).updateOne(
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
                const data = new BrandsLink_store({
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

    //add link
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
    removeBrands: async (req, res) => {
        //router.delete("/remover_Brand/:id")
        try {
            const deleteid = await Brand_detail.findByIdAndDelete(req.params.id);
            if (!req.params.id) {
                return res.status(400).send(err);
            }
            res.send(deleteid);
        } catch (err) {
            res.status(400).send("cannot delete", err);
        }

    },
    resetPasswordBrands: async (req, res) => {
        try {
            const oldpassword = req.body.old;
            const id = req.params.id;
            const newpassword = req.body.neew;
            const cpassword = req.body.cpassword;
            const old = await Brand_detail.findOne({ email: id });
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
                    const Brand_data = await Brand_detail.findOne({ email: id }).updateOne({
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
    brandsRegister: async (req, res) => {
        console.log(req.body);
        const password = req.body.password;
        const cpassword = req.body.repassword;
        if (password == cpassword) {
            const user = new Brand_detail(
                {
                    Brands_name: req.body.Brands_name,
                    Brands_username: req.body.Brands_username,
                    email: req.body.email,
                    Street_Address: req.body.Street_Address,
                    city: req.body.city,
                    State: req.body.State,
                    postal_code: req.body.postal_code,
                    password: req.body.password,
                    repassword: req.body.repassword,
                    phone: req.body.phone,
                    Instagram_link: req.body.Instagram_link,
                }
            );

            //console.log(cookie);
            user.save().then(() => {
                res.status(201).send(user);
            }).catch((error) => {
                res.status(400).send(error)
            });


        } else {
            res.status(400).send("password is not matching");
        }
    },
    brandsLogin: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user_email = await Brand_detail.findOne({ email: email });
            const ismatch = bcrypt.compare(password, user_email.password);
            const paru = jwt.sign({ email: email }, process.env.SECRET_FOR_TOKEN);
            const ola1 = new token2({
                token: paru,
                email: email
            })
            const name =
                ola1.save().then(() => {
                    console.log("token generated");
                }).catch(() => {
                    console.log("token undefined");
                });
            if (!ismatch) {
                res.status(400).send("invalid email or password credentials");
                //just need to change send to render and then the page in doble quates for routes
            } else {
                res.status(201).send({"token":paru,"email":user_email.email });
            }

        } catch (err) {
            res.status(400).send("invalid data entry");
        }
    },
    getBrandsById: async (req, res) => {
        try {
            const _id = req.params.id;
            const Brand_data = await Brand_detail.findById(_id);
            if (!Brand_data) {
                return res.status(400).send();
            } else {
                res.send(Brand_data);
            }
        }
        catch (err) {
            res.send(err);
        }
    },
    getBrandsByUsername: async (req, res) => {
        try {
            const username = req.params.email;
            const Brand_data = await Brand_detail.findOne({ email: username });
            if (!Brand_data) {
                return res.status(400).send();
            } else {
                res.send(Brand_data);
            }
        }
        catch (err) {
            res.send(err);
        }
    },
    getBrandsData: async (req, res) => {
        try {
            const Brands_data = await Brand_detail.find();
            res.send(Brands_data);

        } catch (err) {
            res.send(err);
        }
    },
    brandsLinkShow: async (req, res) => {
        try {
            const username = req.params.email;
            const Brand_data = await BrandsLink_store.findOne({ username: username });
            if (!Brand_data) {
                return res.status(400).send("error");
            } else {
                res.send(Brand_data);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    brandsUpdateById: async (req, res) => {
        //router.put("/update_brands_data/:id")
        try {
            const _id = req.params.id;
            const pass = req.body.password;
            const ala = bcrypt.hash(pass, 10);
            const Brand_data = await Brand_detail.findByIdAndUpdate(_id, {
                $set: {
                    Brands_name: req.body.Brands_name,
                    Brands_username: req.body.Brands_username,
                    email: req.body.email,
                    Street_Address: req.body.Street_Address,
                    city: req.body.city,
                    State: req.body.State,
                    postal_code: req.body.postal_code,
                    password: ala,
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
    getBrandsDataCount: async (req, res) => {
        try {
            const Brands_data = await Brand_detail.find();
            const ll = Brand_detail.length.toString();
            console.log(ll);
            res.status(201).send(ll);

        } catch (err) {
            res.send(err);
        }
    },
    brandsLogout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((currentelement) => {
                return currentelement.token != req.token
            });
            res.clearCookie("jwt");

            console.log("logout succesfully!!");
            const savep = await req.user.save();
            res.send("logout successfully!!");

        } catch (error) {
            res.status(500).send(error);
        }
    },
    createBrandDashboard: async (req, res) => {
        try {
            const {
                Brands_name,
                corporate,
                email,
                mobileNumber,
                logo,
                background
            } = req.body
            if (!Brands_name) {
                res.status(400).send("brands name is unregistered");
            }

            console.log("hii")
            console.log(Brands_name)
            const brand = await Brand_detail.findOne({Brands_name:Brands_name });
            console.log(brand);
            console.log("hii")
            if (!brand) {
                res.status(400).send("brand is unauthorize!!!")
            }
            const foundimage = await Image_store.findOne({ username:Brands_name, name: background });
            if (!foundimage) {
                res.status(400).send(error);
            }
            const foundimage2 = await Image_store.findOne({ username:Brands_name, name: logo });
            if (!foundimage2) {
                res.status(400).send(error);
            }
            const create = new Brands_dashboard({
                Brands_name,
                corporate,
                email,
                mobileNumber,
                logo: foundimage2.image_url,
                backImage: foundimage.image_url
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
    getDashboard: async (req, res) => {
        try {
            if (!req.body.brandname) {
                res.status(400).send("error")
            }
            // console.log(brandname)
            const sponsered = req.body.value;
            console.log(sponsered);
            switch (sponsered) {
                case "true":
                    let findit = await Brands_dashboard.findOne({ Brands_name: req.body.brandname, Sponsered: true });
                    res.status(201).send(findit);
                    break;
                case "false":
                    let findita = await Brands_dashboard.findOne({ Brands_name: req.body.brandname });
                    res.status(201).send(findita);
                    break;

                default:
                    res.send("invalid entry");
                    break;
            }
        } catch (error) {
            res.status(400).send("error")
        }

    },
    applyShow: async (req, res) => {
        try {
            let valueStore = []
            const data = await influncer_detail.find({
                detail: {
                    $elemMatch: {
                        statusapply: "applied",
                        camp: req.params.name
                    }
                }
            })
                .then(async (Element) => {
                    console.log(Element);
                    const name = req.params.name;
                    const data1 = await Element.filter(Element => {
                        valueStore.push({
                            "name": Element.Influencer_username
                            , "Campname": name, "email": Element.email, "followers": Element.followers_count, "following": Element.following_count, "mediaCount": Element.mediaCount, "instaUsername": Element.
                                username
                        })
                    })
                    res.status(201).send(valueStore);

                })
            //res.status(201).send(data);
        } catch (error) {
            res.status(400).send("something went wrong..")
        }
    },
    approveShow: async (req, res) => {
        try {
            let valueStore = [];
            const data = await influncer_detail.find({ detail: { $elemMatch: { statusshow: "Approved", camp: req.params.name } } })
                .then(async (Element) => {
                    console.log(Element);
                    const name = req.params.name;
                    const data1 = await Element.filter(Element => {
                        valueStore.push({
                            "name": Element.Influencer_username
                            , "Campname": name, "email": Element.email, "followers": Element.followers_count, "following": Element.following_count, "mediaCount": Element.mediaCount, "instaUsername": Element.
                                username
                        })
                    })
                })
                res.status(201).send(valueStore);
            //res.status(201).send(data);
        } catch (error) {
            res.status(400).send("something went wrong..")
        }
    },
    InterestShow: async (req, res) => {
        try {
            let valueStore = [];
            const data = await influncer_detail.find({ detail: { $elemMatch: { statusfinal: "Interested", camp: req.params.name } } })
                .then(async (Element) => {
                    console.log(Element);
                    const name = req.params.name;
                    const data1 = await Element.filter(Element => {
                        valueStore.push({
                            "name": Element.Influencer_username
                            , "Campname": name, "email": Element.email, "followers": Element.followers_count, "following": Element.following_count, "mediaCount": Element.mediaCount, "instaUsername": Element.
                                username
                        })
                    })
                    if (valueStore.length != 0) {
                        res.status(201).send(valueStore);
                    } else {
                        res.status(200).send("No Record Found!")
                    }

                })
            //res.status(201).send(data);
        } catch (error) {
            res.status(400).send("something went wrong..")
        }
    },
    NotInterestShow: async (req, res) => {
        try {
            let valueStore = [];
            const data = await influncer_detail.find({ detail: { $elemMatch: { statusfinal: "NotInterested", camp: req.params.name } } })
                .then(async (Element) => {
                    console.log(Element);
                    const name = req.params.name;
                    const data1 = await Element.filter(Element => {
                        valueStore.push({
                            "name": Element.Influencer_username
                            , "Campname": name, "email": Element.email, "followers": Element.followers_count, "following": Element.following_count, "mediaCount": Element.mediaCount, "instaUsername": Element.
                                username
                        })
                    })
                    if (valueStore.length != 0) {
                        res.status(201).send(valueStore);
                    } else {
                        res.status(200).send("No Record Found!")
                    }

                })
            //res.status(201).send(data);
        } catch (error) {
            res.status(400).send("something went wrong..")
        }
    },
    disapproveShow: async (req, res) => {
        try {
            let valueStore = [];
            const data = await influncer_detail.find({ detail: { $elemMatch: { statusshow: "Disapproved", camp: req.params.name } } })
                .then(async (Element) => {
                    console.log(Element);
                    const name = req.params.name;
                    const data1 = await Element.filter(Element => {
                        valueStore.push({
                            "name": Element.Influencer_username
                            , "Campname": name, "email": Element.email, "followers": Element.followers_count, "following": Element.following_count, "mediaCount": Element.mediaCount, "instaUsername": Element.
                                username
                        })
                    })
                    res.status(201).send(valueStore);

                })
            //res.status(201).send(data);
        } catch (error) {
            res.status(400).send("something went wrong..")
        }
    },
    appoveService: async (req, res) => {
        try {
            if (req.body.isActive == 'no') {
                const data = await influncer_detail.findOne({ email: req.body.email }).updateOne({ detail: { $elemMatch: { camp: req.body.name } } }, {
                    $set: {

                        'detail.$.statusapply': "null",
                        'detail.$.camp': req.body.name,
                        'detail.$.statusshow': "Disapproved",
                        'detail.$.statusfinal':"null"
                    }

                }).then(async () => {
                    //console.log(data);
                    const data2 = await influncer_detail.findOne({ email: req.body.email })
                    const number = data2.phone;
                    console.log(number);
                    const name = data2.Influencer_username;
                    console.log(name);
                    const message = `Hii ${name}, Oops!!!you have Disapproved by the brand for this ${req.body.name}`;
                    const send = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`);
                }).catch((error)=>{
                    console.log(error);
                });
                res.status(201).send("Disapproved");
            }
            else if (req.body.isActive == 'yes') {
                const data = await influncer_detail.findOne({ email: req.body.email, detail: { $elemMatch: { camp: req.body.name } } }).updateOne({
                    $set: {

                        'detail.$.statusapply': "null",
                        'detail.$.camp': req.body.name,
                        'detail.$.statusshow': "Approved",
                        'detail.$.statusfinal': "null"
                    }
                }).then(async() => {
                    //console.log(data);
                    const data2 = await influncer_detail.findOne({ email: req.body.email })
                    console.log(data2);
                    const number = data2.phone;
                    console.log(number);
                    const name = data2.Influencer_username;
                    console.log(name);
                    const message = `Hii! ${name} congratulations you have Approved by the brand for this ${req.body.name}`;
                    const send = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`);
                }).catch((error)=>{
                    console.log(error);
                });
                res.status(201).send("Approved");
            }
            else if (req.body.isActive == 'pend') {
                res.status(201).send("Pending case");
            } else {
                res.status(400).send("page  error occured")
            }

        } catch (error) {
            res.status(400).send("page  error occured")
        }
    },
    finalAppovedService: async (req, res) => {
        try {
            if (req.body.isActive == 'no') {
                const data = await influncer_detail.findOne({ email: req.body.email }).updateOne({ detail: { $elemMatch: { camp: req.body.name , statusfinal: "Interested"} } }, {
                    $set: {

                        'detail.$.statusapply': "null",
                        'detail.$.statusfinal':'done',
                        'detail.$.camp': req.body.name,
                        'detail.$.statusshow': "Disapprove"
                    }

                }).then(async () => {
                    //console.log(data);
                    const data2 = await influncer_detail.findOne({ email: req.body.email })
                    const number = data2.phone;
                    console.log(number);
                    const name = data2.Influencer_username;
                    console.log(name);
                    const message = `Hii ${name}, Oops!!!you have Removed by the brand for this ${req.body.name}`;
                    const send = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`);
                }).catch((error)=>{
                    console.log(error);
                });
                res.status(201).send("Disapproved");
            }
            else if (req.body.isActive == 'yes') {
                const data = await influncer_detail.findOne({ email: req.body.email, detail: { $elemMatch: { camp: req.body.name,statusfinal:"Interested" } } }).updateOne({
                    $set: {

                        'detail.$.statusapply': "null",
                        'detail.$.statusfinal': "notDone",
                        'detail.$.camp': req.body.name,
                        'detail.$.statusshow': "Approve"
                    }
                }).then(async() => {
                    //console.log(data);
                    const data2 = await influncer_detail.findOne({ email: req.body.email })
                    console.log(data2);
                    const number = data2.phone;
                    console.log(number);
                    const name = data2.Influencer_username;
                    console.log(name);
                    const message = `Hii! ${name} congratulations you have Sucessfully Approved by the brand for this ${req.body.name}`;
                    const send = await postAsync(` 
  https://app.messageautosender.com/message/new?username=geekanimals&password=geek1234&receiverMobileNo=${number}&receiverName=${name}&message=${message}`);
                }).catch((error)=>{
                    console.log(error);
                });
                res.status(201).send("Approved");
            }
            else if (req.body.isActive == 'pend') {
                res.status(201).send("Pending case");
            } else {
                res.status(400).send("page  error occured")
            }

        } catch (error) {
            res.status(400).send("page  error occured")
        }
    }

}