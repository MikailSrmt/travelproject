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
    var newPlace = {name : name , image : image, description : desc};
    //Create a new place and save to DB
    Place.create(newPlace, function(err, justCreated){
       if(err){
           console.log(err);
       } else{
            //redirect back to places page (default is get)
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

});
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;