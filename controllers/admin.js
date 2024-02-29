const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const token3 = require("../models/admin_token");
const update_store = require("../models/update_model");
const express = require("express");
const data = require("../models/Interection.model");
const influncer_detail = require("../models/Influencers_model");
const Brand_detail = require("../models/brands_model");
const dataset = require("../models/dataset");
const admin_detail = require("../models/admin_model");
module.exports = {
    adminLogin: async (req, res) => {
        //router.post("/Admin_login")
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user_email = await admin_detail.findOne({ email: email, requestState: "Approved" });
            if (!user_email) {
                res.status(400).send("You are not Approved by super Admin!!")
            } else {
                const ismatch = await bcrypt.compare(password, user_email.password);
                const paru = jwt.sign({ email: email }, process.env.SECRET_FOR_TOKEN);
                let Id = user_email._id;
                const ola1 = new token3({
                    token: paru,
                    email: email,
                })
                ola1.save().then(() => {
                    console.log("token generated");
                }).catch(() => {
                    console.log("token undefined");
                });

                if (ismatch) {
                    res.status(201).send({ paru, Id });
                    //just need to change send to render and then the page in doble quates for routes
                } else {
                    res.status(400).send("bad request");
                }
            }

        } catch (err) {
            res.status(400).send("invalid data entry");
        }
    },
    approveShow:async(req,res)=>{
        try {
            const approval = await admin_detail.find({ requestState: "pending" })
            res.status(201).send(approval)
        } catch (error) {
            res.status(400).send(error);
        }
    },
    approveRequest: async (req, res) => {
        try {
            const approval = await admin_detail.findOne({ email: req.body.email, requestState: "pending" }).updateOne({
                $set: {
                    requestState: "Approved"
                }
            })
            res.status(201).send("Approved!!")
        } catch (error) {
            res.status(400).send(error)
        }
    },
    adminRegister: async (req, res) => {
        console.log(req.body);
        const requestState="pending";
        const password = req.body.password;
        const cpassword = req.body.repassword;
        if (password == cpassword) {
            const user = new admin_detail({
                admin_name: req.body.admin_name,
                email: req.body.email,
                password: req.body.password,
                repassword: req.body.repassword,
                address: req.body.address,
                phone: req.body.phone,
                requestState:requestState
            });

            //console.log(cookie);
            user.save().then(() => {
                res.status(201).send(user);

            }).catch((error) => {
                res.send(400).status(error);
            });


        } else {
            res.status(400).send("password is not matching");
        }

    },
    updateAdminByIdInPatch: async (req, res) => {
        //router.patch("/update_admin/:id")
        try {
            if (req.body.password != null || req.body.repassword != null) {
                res.status(400).send("updating password is prohibited!!")
            }
            else {
                const id = req.params.id;
                const neww = await admin_detail.findByIdAndUpdate({ _id: id }, req.body).then(() => {
                    res.status(201).send("data updated");
                }).catch((error) => {
                    res.status(400).send("unable to update the data");
                })
            }
        } catch (error) {
            res.send(404).send("unable to process your process");
        }

    },
    resetPasswordAdmin: async (req, res) => {
        //router.patch("/resetpassword_admin/:id")
        try {
            const oldpassword = req.body.old;
            const id = req.params.id;
            const newpassword = req.body.neew;
            const cpassword = req.body.cpassword;
            const old = await admin_detail.findOne({ _id: id });
            console.log(old);
            const check = await bcrypt.compare(oldpassword, old.password);
            if (!check) {
                res.send("password is incorrect!!")
            }
            else {
                if (newpassword == cpassword) {
                    let lt = await bcrypt.hash(newpassword, 10);
                    console.log(lt);
                    const ll = await (lt).toString();
                    console.log(ll)
                    const Brand_data = await admin_detail.findByIdAndUpdate(id, {
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
    getAdminData: async (req, res) => {
        try {
            const Brands_data = await admin_detail.find({requestState: "Approved"});
            res.send(Brands_data);

        } catch (err) {
            res.send(err);
        }
    },
    adminLogout: async (req, res) => {
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
    removeAdmin: async (req, res) => {
        //router.delete("/remover_Brand/:id")
        try {
            //making the validation for tha data required
            if (!req.params.id && !req.params.username) {
                res.status(400).send("Unauthorize For The Action!!...")
            }
            console.log("hii");
            const id = req.params.id;
            const username = req.params.username;
            console.log(id);
            const find = await admin_detail.findOne({ admin_name: username });
            console.log("hii");
            console.log(find.admin_name);
            //checking wheather it is super Admin or not
            if (find.admin_name != "superAdmin") {
                res.status(201).send("you are not authorize for performing that action only superAdmin can perform it....")
            } else {
                console.log("hii");
                //deleting the admin from database
                const deleteid = await admin_detail.findByIdAndDelete(req.params.id);
                res.status(201).send(`Admin with id=${id} is removed`);
            }

        } catch (err) {
            res.status(400).send("cannot delete", err);
        }

    },
    verifyAdmin: async (req, res) => {
        try {
            if (!req.params.username) {
                res.status(400).send("Unauthorize For The Action!!...")
            }
            let ala = 0;
            //o means not a super Admin
            const find = await admin_detail.findOne({ admin_name: req.params.username });
            if (!find) {
                res.send("invalid details");
            } else {
                if (find.admin_name != 'superAdmin') {
                    res.status(201).send(`ala=${ala}`);
                } else {

                    //1 means super Admin
                    ala = 1;
                    res.status(201).send(`ala=${ala}`);
                }
            }
        } catch (err) {
            res.status(400).send("error", err);
        }

    },
    updateAdminByIdInPut: async (req, res) => {
        //router.put("/update_admin_data/:id")
        try {
            const _id = req.params.id;
            const pass = req.body.password;
            const ala = await bcrypt.hash(pass, 10);
            const bush = await ala.toString();
            console.log(bush)
            const Brand_data = await admin_detail.findByIdAndUpdate(_id, {
                $set: {
                    admin_name: req.body.admin_name,
                    email: req.body.email,
                    password: bush,
                    address: req.body.address,
                    phone: req.body.phone
                }
            }).then(() => {
                res.status(200).send("updated");
            }).catch((error) => {
                res.status(400).send("unable to update");
            });

        }
        catch (err) {
            res.send(err);
        }

    },
    getAdminDataById: async (req, res) => {
        try {
            const Id = req.params.id;
            console.log(Id);
            const foundimage = await admin_detail.findOne({ _id: Id });
            res.status(201).send(foundimage);
        } catch (err) {
            res.status(400).send(err);
        }
    },
    getAdminDataByUsername: async (req, res) => {
        try {
            const Id = req.params.username;
            console.log(Id);
            const foundimage = await admin_detail.findOne({ email: Id });
            res.status(201).send(foundimage);
        } catch (err) {
            res.status(400).send(err);
        }
    },
    genderDistribution: async (req, res) => {
        try {
            let malecount = 0;
            let femalecount = 0;
            let other = 0;
            const data = await update_store.find();
            console.log(data);
            for (i = 0; i < data.length; i++) {
                console.log(data[i].gender);
                if (data[i].gender == "Male") {
                    malecount = malecount + 1;
                } else if (data[i].gender == "Female") {
                    femalecount = femalecount + 1;
                } else {
                    other = other + 1;
                }
            };
            res.status(200).send({ "malecount": malecount, "femalecount": femalecount, "Other": other });
        } catch (error) {
            res.status(400).send(error)
        }
    },
    influencerActivity: async (req, res) => {
        try {
            let record = [];
            let count = 0;
            const info = await influncer_detail.find();

            for (i = 0; i < info.length; i++) {
                console.log("hii");
                const datal = await data.find({ influencer_name: info[i].Influencer_username })
                console.log(datal)
                if (datal) {
                    for (j = 0; j < datal.length; j++) {
                        console.log(info[i].influencer_name)
                        if (datal[j].influencer_name == info[i].Influencer_username) {
                            count = count + 1;
                            console.log("hii");
                        }

                    }
                    record.push({ "name": info[i].Influencer_username, "count": count })
                    count = 0;
                } else {
                    console.log("nope!!");
                }
            }
            res.status(201).send(record);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    hashtagShow: async (req, res) => {
        try {
            let record = [];
            const info = await influncer_detail.distinct("Hastag");
            console.log(info[0]);
            for (i = 0; i < info.length; i++) {
                console.log(info[i]);
                let count = 0;
                count = await influncer_detail.find({ Hastag: { $eq: info[i] } }).count();
                record.push({ "name": info[i], "count": count });
            }
            res.status(201).send(record);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    brandActivity: async (req, res) => {
        try {
            let record = [];
            let count = 0;
            const info = await Brand_detail.find();

            for (i = 0; i < info.length; i++) {
                console.log("hii");
                const datal = await data.find({ brand_name: info[i].Brands_name })
                console.log(datal)
                if (datal) {
                    for (j = 0; j < datal.length; j++) {
                        console.log(info[i].Brands_name)
                        if (datal[j].brand_name == info[i].Brands_name) {
                            count = count + 1;
                            console.log("hii");
                        }

                    }
                    record.push({ "name": info[i].Brands_name, "count": count })
                    count = 0;
                } else {
                    console.log("nope!!");
                }
            }
            res.status(201).send(record);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}