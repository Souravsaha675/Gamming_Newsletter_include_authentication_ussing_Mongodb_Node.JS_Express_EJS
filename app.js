const express=require("express");
const bodyparser=require("body-parser");
const request =require("request");

const app=express();

app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(`${__dirname}/signup.html`)
});

app.post("/",function(req,res){
    var firstname =req.body.fname;
    var lastname = req.body.lname;
    var email =req.body.email;

    var data={
        members:[
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                  FNAME:firstname,
                  LNAME:lastname,
                }
            }
        ]
    };

    var jsonData=JSON.stringify(data);  

    var option={
        url: "https://us18.api.mailchimp.com/3.0/lists/57d26a4c9d",
        method: "POST",
        headers:{
            "Authorization": "sourav 38a556ec481df075398c4c58936fcccd - us18"
        },
        body:jsonData
    }

    request(option,function(error,response ,body){
        if(error){
            res.sendFile(__dirname+"/failure.html");
        }
        else{
           if(response.statusCode===200){
               res.sendFile(__dirname+"/success.html");
           }
           else{
               res.sendFile(`${__dirname}/failure.html`);
           }
        }

    });
    
});

app.post("/failure",function(req,res){

    res.redirect("/");

});

app.listen(process.env.PORT || 8000,function(){
    console.log("server is running on port 8000.");
})

//

//