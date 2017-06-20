var express = require("express");
var router  = express.Router();
var Place = require("../models/place");
var middleware = require("../middleware")


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
router.post("/", middleware.isLoggedIn,function(req,res){

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
router.get("/new",middleware.isLoggedIn,function(req, res) {
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
router.get("/:id/edit",middleware.checkPlaceOwnership,function(req, res) {
        Place.findById(req.params.id, function(err, foundPlace){
            if(err){
                req.flash("error", "Something went wrong!");
            }
            res.render("places/edit", {place : foundPlace});
        });
    });


//UPDATE PLACES ROUTE

router.put("/:id",middleware.checkPlaceOwnership, function(req,res){
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
router.delete("/:id",middleware.checkPlaceOwnership,function(req,res){
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

module.exports = router;