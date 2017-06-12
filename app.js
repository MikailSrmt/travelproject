var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/coupletraveler");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

// SCHEMA SETUP

var placesSchema = new mongoose.Schema({
   name: String,
   image: String
   
});

var Places = mongoose.model("places", placesSchema);

// Places.create(
//     {
//         name : "Belgrad", image: "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg"
//     }, function(err,places){
//       if(err){
//           console.log(err);
//       } else{
//           console.log("Places Created Succesfully");
//           console.log(places);
//       }
//     });


app.get("/", function(req,res){
    res.render("landing")
});

app.get("/places", function(req,res){
    //Get All Places from DB
    Places.find({}, function (err,allPlaces) {
        // body...
        if(err){
            console.log(err)
        }else{
            res.render("places",{places : allPlaces}); 
        }
    })
});


app.post("/places", function(req,res){

   // get data from form and add to places array
    var name = req.body.name;
    var image = req.body.image;
    var newPlace = {name : name , image : image}
    //Create a new campground and save to DB
    Places.create(newPlace, function(err, justCreated){
       if(err){
           console.log(err);
       } else{
            //redirect back to places page (default is get)
            res.redirect("/places");
        }
    });
   
});

app.get("/places/new",function(req, res) {
    res.render("new.ejs");
});


app.listen(process.env.PORT,process.env.IP, function(){
       console.log("Couple Traveler Server Started!");
});