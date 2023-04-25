//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const path = require('path');
const https=require("https");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
//To get all the static files like css file and images to be loaded here.

app.use(express.static("public"));


app.get("/",function(req,res){
    console.log(res.statusCode);
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;
    const data={
        members:[
            {    
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
    }
    const jsonData=JSON.stringify(data);

    const url="https://us17.api.mailchimp.com/3.0/lists/de645fd63b";

    const options={
        method:"POST",
        auth:"bharg:7b81c1f8b601d5286d618a0e3d6db69e-us17"
    }

    const request=https.request(url,options,function(response){
        if (response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);

    request.end();
    
});

app.post("/failure",function(req,res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});


//API KEY:  7b81c1f8b601d5286d618a0e3d6db69e-us17
//Audience_list_id: de645fd63b