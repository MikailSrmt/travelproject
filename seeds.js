var mangoose = require("mongoose"),
    Place = require("./models/place"),
    Comment = require("./models/comment");
var data = [
    
        {
            "name" : "Toronto", 
            "image" : "https://thechive.files.wordpress.com/2015/10/whats-the-deal-with-toronto-canada-17-photos-17.jpg?quality=85&strip=info", 
            "description" : "Toronto is a beatiful place with loads of snow!!"
        },
        {
            "name" : "Fethiye", 
            "image" : "http://www.importantgroup.com.tr/userfiles/image/fethiye/large%20600/0019.jpg", 
            "description" : "Oludeniz is one of the best places in the world!"
        },
        {
            "name" : "Belgrad", 
            "image" : "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg", 
            "description" : "Belgrad tells you the histroy. Go and listen her.."
        },
        {
            "name" : "Austin", 
            "image" : "http://www.foreclosuredataonline.com/images/resources/austin-tx/austin-texas.jpg", 
            "description" : "The Liberal Capital in the republician state wow!"
        }
]
    
function seedDB() {
    // body... 
    Place.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed places!");
        //add places
        data.forEach(function(seed){
           Place.create(seed, function(err, place){
               if(err){
                   console.log(err)
               }else{
                   console.log("Place added")
                   //create comment
                   Comment.create(
                       {
                            text: "Very nice place thank you for sharing",
                            author: "Kemal"
                       }, function(err,comment){
                          if(err){
                              console.log(err)
                          } else{
                              place.comments.push(comment);
                              place.save();
                              console.log("Created new comment")
                          }
                       });
               }
           }); 
        });    
});

}    
module.exports = seedDB;