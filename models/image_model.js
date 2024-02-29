const mongoose=require("mongoose");
const Imageschema = new mongoose.Schema({
   name:{
      type:String,
   },
   image_url:{
    type:String,
   },
   username:{
      type:String
   }
})
const Image_store=new mongoose.model('Image_store',Imageschema);

module.exports=Image_store;
