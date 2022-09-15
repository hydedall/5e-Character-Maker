// DEPENDENCIES
require("dotenv").config();
const md5 = require("md5");
const express = require("express");
const mongoose = require ("mongoose");
const ejs=require("ejs");
const bodyParser= require("body-parser");
const app = express();

// MIDDLEWARE  & BODY PARSER
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));



// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// DATABASE CONFIGURATION
let posts=["Welcome Back"];
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const registerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        unique:true
    },

});


const SignUpModel = new mongoose.model("Customer",registerSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/write_journal",function(req,res){
   res.render("write_journal");
});
app.get("/write_journal",function(req,res){
    res.render("write_journal");
});
app.get("/welcome",function(req,res){
    res.render("welcome",{post:posts});
});
app.post("/login",function(req,res){
    res.redirect("/welcome");
})
app.post("/write_journal",function(req,res){
    const post={
        title :req.body.postTitle,
        content :req.body.postBody,
    };
     posts.push(post);
    res.redirect("/welcome");
})

app.post("/register",function(req,res){
    const password=md5(req.body.password);
    const cpassword=md5(req.body.cpassword);
    if(password===cpassword)
    {
       const Register = new  SignUpModel({
           firstname:req.body.fname,
           lastname:req.body.lname,
           email:req.body.username,
           password:password,
           confirmPassword:cpassword,
           phone:req.body.phone,
          
          
       })
   
       Register.save();
       res.render("welcome");
    }
    else
    res.send("Password is not matching");
})
app.post("/login",function(req,res){
    const pssword=md5(req.body.password);
    const email=req.body.username;
    SignUpModel.findOne({email:email},function(err,userFromDB){
    if((userFromDB))
    {
        if(userFromDB.password==pssword)
          res.render("welcome");
          else
          res.send("Invalid Credentials");
  
    }
    else{
        res.send("Invalid credentials")
       }
    });
   
})

// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`)
})

