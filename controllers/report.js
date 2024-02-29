const bodyparser = require("body-parser");
const InfluencerLink_store = require("../models/Influencer_Link");
const token1 = require("../models/influencer_token");
const express = require("express");
const request = require("request");
const axios = require("axios");
const data = require("../models/Interection.model");
const report = require("../models/report.model");
const influncer_detail = require("../models/Influencers_model");
module.exports = {
    createReport: async (req, res) => {
        try {
            const {
                report,
                hash,
                instausername
            } = req.body
            const hashdata = await influncer_detail.findOne({ Hastag: hash});
            const instausernamedata = await influncer_detail.findOne({ username: instausername })
            if (!instausernamedata) {
                res.status(400).send(error);
            }
            const name = instausernamedata.Influencer_username;
            const datait = await data.findOne({ influencer_name: name });
            const savreport= new report({
                report_title:report,
                hashtag: hash,
                username:name
            }).save();
            res.status(201).send({instausernamedata,datait,hashdata});
        } catch (error) {
            res.status(400).send(error);
        }
    },
    // createReport: async (req, res) => {
    //     try {
    //         const {
    //             report,
    //             hash,
    //             instausername
    //         } = req.body
    //         const hashdata = await influncer_detail.find({ Hastag: hash}).count();
    //         const instausernamedata = await influncer_detail.findOne({ username: instausername })
    //         if (!instausernamedata) {
    //             res.status(400).send(error);
    //         }
    //         const name = instausernamedata.Influencer_username;
    //         const datait = await data.findOne({ influencer_name: name }).count();
    //         const savreport= new report({
    //             report_title:report,
    //             hashtag: hash,
    //             username:name
    //         }).save();
    //         res.status(201).send({instausernamedata,datait,hashdata});
    //     } catch (error) {
    //         res.status(400).send(error);
    //     }
    // }
}