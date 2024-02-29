const mongoose=require("mongoose");
const updatepageschema = new mongoose.Schema({
   username:{
      type:String,
   },
   dob:{
      type:Date,
   },
   gender:{
    type:String,
   },
   categories:{
    type:String
   },
   image:{
      type:String
   },
   materialStatus:{
      type:String,
      enum:['Married','UnMarried']
   },
   PreviousBrandAssociation:{type:String},
   MarriageDate:{type:Date},
   PaymentDetail:{type:String},
   instagram_Others_profiles:[{type:String}]

})
const update_store =new mongoose.model('update_store',updatepageschema);

module.exports=update_store;
