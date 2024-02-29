const mongoose = require('mongoose');
mongoose.connect("mongodb://client-db:2zFWfeeIVrkOZ2WtyMrIKPJBCN7feoGXkkEY1emxh00ft2vMXGcsAOe4ndNRqbQD2iIXqh7uqFZxACDb57cGcQ==@client-db.mongo.cosmos.azure.com:10255/test?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@client-db@").then((db)=>{
    console.log("connection is succesful");
}).catch((err)=>{
    console.log("no connection",err);
})


//mongodb+srv://paru123:jaigopal123_@cluster0.trzg2kg.mongodb.net/test

const db = mongoose.connection;


db.on('error', (err) => {
  console.error('connection error:', err);
});

db.once('open', function() {
  console.log("Connected to MongoDB!");
  const User = require("../models/admin_model");
  User.findOne({ admin_name: "superAdmin" }).then((user) =>{
    if (!user) {
      console.log("Admin user does not exist, creating...");
      const admin = new User({
        admin_name: "superAdmin",
        password: "secret",
        phone: 9314604196,
        address:"super adimin address is null",
        email:"parth.wfa@gmail.com",
        requestState:"Approved"
      });
      admin.save().then(()=> {
        console.log(" superAdmin user created successfully.");
      }).catch((error)=>{
        console.log(error);
        //console.log("superAdmin user already exists.");
      });
    } else {
      console.log("superAdmin user already exists.");
    }
   });
   //.catch((error)=>{
  //   console.log("superAdmin user already exists.");
  // });
});