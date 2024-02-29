const dataset = require("../models/dataset");
module.exports = {

    createDataset: async (req, res) => {
        try {
            if(!req.body.hash){
                res.status(400).send("inappropriate info!!");
            }
            const hash = req.body.hash;
            const savedata = new dataset({
                hash: hash
            });
            savedata.save().then(() => {
                res.status(201).send(savedata);
            }).catch((error) => {
                res.status(400).send(error);
            });
        } catch (error) {
            res.status(404).send("errro===", error);
        }

    },
    getdataset: async (req, res) => {
        try {
            const finde = await dataset.find();
            res.status(201).send(finde);
        }catch (error) {
            res.status(400).send(error);
        }

    }
}