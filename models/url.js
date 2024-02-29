const mongoose=require("mongoose");
const urlschema = new mongoose.Schema({
   url:{
    type:String
   },
})
const Imag_stor=new mongoose.model('Imag_stor',urlschema);

module.exports=Imag_stor;
