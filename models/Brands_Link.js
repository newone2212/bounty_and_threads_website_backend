const mongoose=require("mongoose");
const Linkschema = new mongoose.Schema({
    username:{
        type:String,
    },
    // Instagram_Link:{
    //     type: [String],
    //     default: []
    // },
    Instagram_Link:{type:String},
    Facebook_Link:{type:String},
    Youtube_Link:{type:String},
    Twitter_Link:{type:String},
    website_Link:{type:String}
})
const BrandsLink_store=new mongoose.model('BrandsLink_store',Linkschema);

module.exports=BrandsLink_store;
