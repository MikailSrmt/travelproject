var express = require("express");
var router  = express.Router({mergeParams:true});
var Place = require("../models/place");
var Comment = require("../models/comment");
///===============
/// COMMENT ROUTES
///===============

router.get("/new",isLoggedIn, function(req, res) {
    // find place by id
    Place.findById(req.params.id, function(err, place){
       if(err){
           console.log(err);
       } else{
            res.render("comments/new", {place:place});
       }
    });
});

router.post("/",isLoggedIn ,function(req,res){
   //lookup place using ID
   Place.findById(req.params.id, function(err, place) {
      if(err){
          console.log(err);
          res.redirect("/places");
      }else{
          Comment.create(req.body.comment, function(err,comment){
              if(err){
                  console.log(err);
              }else{
                  // add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment¡
                  comment.save();
                  place.comments.push(comment);
                  place.save();
                  res.redirect('/places/'+ place._id);
              }
          });
      } 
   });
});

// COMMENTS UPDATE ROUTE

router.get("/:comment_id/edit", checkCommentOwnership, function (req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
            res.redirect("back");
       } else {
            res.render("comments/edit", {place_id:req.params.id, comment:foundComment});
       }
    });
});

// COMMENT UPDATE

router.put("/:comment_id", checkCommentOwnership ,function (req,res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else{
          res.redirect("/places/" + req.params.id);
      }
   });
});

// COMMENTS DESTROY

router.delete("/:comment_id",checkCommentOwnership, function(req,res){
   //findByIdAndRemove
   Comment.findByIdAndRemove(req.params.comment_id, function (err) {
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/places/" + req.params.id);
       }
   })
});

//middleware
function checkCommentOwnership(req,res,next) {
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
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;