var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Places = require("./models/place");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/coupletraveler");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
seedDB();


// Places.create(
//     {
//         name : "Austin", 
//         image: "http://www.foreclosuredataonline.com/images/resources/austin-tx/austin-texas.jpg",
//         description: "The Liberal Capital in the republician state wow!"
//     }, function(err,places){
//       if(err){
//           console.log(err);
//       } else{
//           console.log("Places Created Succesfully");
//           console.log(places);
//       }
//     });

//  {"name" : "Toronto", "image" : "https://thechive.files.wordpress.com/2015/10/whats-the-deal-with-toronto-canada-17-photos-17.jpg?quality=85&strip=info"},
//  {"name" : "Fethiye", "image" : "http://www.importantgroup.com.tr/userfiles/image/fethiye/large%20600/0019.jpg"},
//  {"name" : "Belgrad", "image" : "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg"}, 
//  {"name" : "Austin" , "image" : "http://www.foreclosuredataonline.com/images/resources/austin-tx/austin-texas.jpg"}
// INDEX - show all places

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
            res.render("index",{places : allPlaces}); 
        }
    })
});

// CREATE - add new place to DB
app.post("/places", function(req,res){

   // get data from form and add to places array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newPlace = {name : name , image : image, description : desc}
    //Create a new place and save to DB
    Places.create(newPlace, function(err, justCreated){
       if(err){
           console.log(err);
       } else{
            //redirect back to places page (default is get)
            res.redirect("/places");
        }
    });
});

// NEW - show form to create new place
app.get("/places/new",function(req, res) {
    res.render("new");
});

// SHOW - show detailed information about place

app.get("/places/:id", function(req, res) {
    // find place with provided ID
    Places.findById(req.params.id).populate("comments").exec(function(err,foundPlace){
        if(err){
            console.log(err);
        }else{
            console.log(foundPlace);
            // render show template with that place
            res.render("show",{place: foundPlace});
        }
    });

});


app.listen(process.env.PORT,process.env.IP, function(){
       console.log("Couple Traveler Server Started!");
});