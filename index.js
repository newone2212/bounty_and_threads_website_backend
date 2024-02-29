const express = require('express');
const cors=require("cors");
const app=express();
require("dotenv").config();
const PORT = process.env.PORT || 8081;
const host='0.0.0.0';
const path = require("path");
const axios=require("axios");
// require("./db/conn");
const bodyparser =require("body-parser");
const cookieparser=require("cookie-parser");
const fileupload=require("express-fileupload");
const staticpath=path.join(__dirname,'./src');
// var allowedDomains = ['http://localhost:3000','https://bountyandthreads.geekcreativeagency.com/'];
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.options('*', cors()); 

// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8081");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
//     next();
// }); 
app.use(cors({
    origin:['http://localhost:3000','https://bountyandthreads.geekcreativeagency.com/']
}))
app.use(fileupload({
    useTempFiles:true
}));
app.use(cookieparser());
app.set('veiw engine','handlebars');
//INSTAGRAM CODE FOR TOKEN AND CODE GENERATION
app.use(express.static(staticpath));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.get("/",(req,res)=>{
    res.render('index');
});

const routes = require("./routes/routes.index");
app.use('/api', routes)
app.use((err,req,res,next)=>{
    err.statuCode = err.statusCode(500);
    err.message=err.message("Internal Server Error");
    res.status(err.statuCode).json({
        message:err.message,
    });
});

app.listen(PORT,host,()=>
{
    console.log(`listening to port at ${PORT}`)
    
})

