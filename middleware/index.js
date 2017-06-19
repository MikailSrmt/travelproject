// all middleware goes here
var Place = require("../models/place");
var Comment = require("../models/comment")
var middlewareObj = {};

middlewareObj.checkPlaceOwnership = function(req,res,next) {
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
    };

middlewareObj.checkCommentOwnership = function (req,res,next) {
    // body...
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err){
                   res.redirect("back");
               } else{
                   if(foundComment.author.id.equals(req.user._id)){
                       next();
                   }else{
                       res.redirect("back");
                   }
               }
            });
        }   else {
            res.redirect("back");
        }
    };
    
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};



module.exports = middlewareObj;

