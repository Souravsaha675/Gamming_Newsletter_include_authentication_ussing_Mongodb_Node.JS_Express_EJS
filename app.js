const express=require("express");
const bodyparser=require("body-parser");
const request =require("request");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bcrypt=require("bcrypt");
const saltRounds=10;

const app=express();

app.set('view engine','ejs');

app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect("mongodb+srv://admin-souravsaha675:s21072000@cluster0-tvv6o.mongodb.net/gameDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const gameingSchema= new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String
});

const User = new mongoose.model("User",gameingSchema);

app.route("/") 
    .get(function(req,res){
        res.render("signup");
    }) 
    
    .post(function(req,res){
       
        User.findOne({email:req.body.email},function(err,founduser){
            if(err){
                console.log(err);
            } else{
                if(!founduser){
                    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                        const newuser = new User({
                            firstname: req.body.fname,
                            lastname: req.body.lname,
                            email: req.body.email,
                            password: hash
                        });
                        newuser.save(function (err) {
                            if (!err) {
                                res.redirect("/index");
                            } else {
                                res.redirect("/");
                            }
                        });
                    });
                   
                } else{
                    res.redirect("/login");
                }
            }
        });
    });

app.route("/login")
    .get(function(req,res){
        res.render("login");
    })

    .post(function(req,res){
        const username=req.body.email;
        const password=req.body.password;

        User.findOne({email:username},function(err,founduser){
            if(err){
                console.log(err);
            } else{
                if(founduser){
                    bcrypt.compare(password,founduser.password,function(err,result){
                        if(result===true){
                            res.redirect("/index");
                        }
                        if(result===false){
                            res.render("<h1>password is incorret</h1>");
                        }
                    });
                } else{
                    res.redirect("/signup");
                }
            }
        });
    });


app.route("/index")
    .get(function(req,res){
        res.render("index");
    });


app.route("/blog-post")
    .get(function (req, res) {
        res.render("blog-post");
    });

app.route("/logout")
    .get(function (req, res) {
        //req.logout();
        res.redirect("/");
    });

app.listen(process.env.PORT || 8000,function(){
    console.log("server is running on port 8000.");
})

//

//