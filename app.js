var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Places = require("./models/place"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")

mongoose.connect("mongodb://localhost/coupletraveler");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
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
            res.render("places/index",{places : allPlaces}); 
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
    res.render("places/new");
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
            res.render("places/show",{place: foundPlace});
        }
    });

});

///===============
/// COMMENT ROUTES
///===============

app.get("/places/:id/comments/new", function(req, res) {
    // find place by id
    Places.findById(req.params.id, function(err, place){
       if(err){
           console.log(err)
       } else{
            res.render("comments/new", {place:place})
       }
    });
});

app.post("/places/:id/comments",function(req,res){
   //lookup place using ID
   Places.findById(req.params.id, function(err, place) {
      if(err){
          console.log(err)
          res.redirect("/places")
      }else{
          Comment.create(req.body.comment, function(err,comment){
              if(err){
                  console.log(err);
              }else{
                  place.comments.push(comment);
                  place.save();
                  res.redirect('/places/'+ place._id);
              }
          });
          console.log(req.body.comment);
      } 
   });
   //create new comment
   //connect new comment to place
   //redirect place show page
});

app.listen(process.env.PORT,process.env.IP, function(){
       console.log("Couple Traveler Server Started!");
});