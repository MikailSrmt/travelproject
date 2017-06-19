var express = require("express");
var router  = express.Router();
var Place = require("../models/place");


// INDEX - show all places

router.get("/", function(req,res){
    //Get All Places from DB
    Place.find({}, function (err,allPlaces) {
        // body...
        if(err){
            console.log(err);
        }else{
            res.render("places/index",{places : allPlaces}); 
        }
    });
});

// CREATE - add new place to DB
router.post("/", isLoggedIn,function(req,res){

   // get data from form and add to places array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    };
    var newPlace = {name : name , image : image, description : desc, author:author};
    
    //Create a new place and save to DB
    Place.create(newPlace, function(err, justCreated){
       if(err){
           console.log(err);
       } else{
            //redirect back to places page (default is get)
            console.log(justCreated);
            res.redirect("/places");
        }
    });
});

// NEW - show form to create new place
router.get("/new",isLoggedIn,function(req, res) {
    res.render("places/new");
});

// SHOW - show detailed information about place

router.get("/:id", function(req, res) {
    // find place with provided ID
    Place.findById(req.params.id).populate("comments").exec(function(err,foundPlace){
        if(err){
            console.log(err);
        }else{
            console.log(foundPlace);
            // render show template with that place
            res.render("places/show",{place: foundPlace});
        }
    });
    
    
//EDIT PLACES ROUTE
router.get("/:id/edit",checkPlaceOwnership,function(req, res) {
        Place.findById(req.params.id, function(err, foundPlace){
            res.render("places/edit", {place : foundPlace});
        });
    });


//UPDATE PLACES ROUTE

router.put("/:id",checkPlaceOwnership, function(req,res){
   // find and update the correct place
   Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
      if(err){
          res.redirect("/places");
      } else{
           res.redirect("/places/" + req.params.id);
     } 
   });
   // redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",checkPlaceOwnership,function(req,res){
   Place.findByIdAndRemove(req.params.id, function (err) {
       // body...
      if(err){
          res.redirect("/places");
      } else{
          res.redirect("/places");
      }
   });
});

});
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkPlaceOwnership(req,res,next) {
    // body...
    if(req.isAuthenticated()){
            Place.findById(req.params.id, function(err, foundPlace){
               if(err){
                   res.redirect("back");
               } else{
                   if(foundPlace.author.id.equals(req.user._id)){
                       next();
                   }else{
                       res.redirect("back");
                   }
               }
            });
        }   else {
            res.redirect("back");
        }
}

module.exports = router;