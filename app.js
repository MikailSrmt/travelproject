var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var places = [
        {name : "Toronto", image: "https://thechive.files.wordpress.com/2015/10/whats-the-deal-with-toronto-canada-17-photos-17.jpg?quality=85&strip=info"},
        {name : "Fethiye", image: "http://www.importantgroup.com.tr/userfiles/image/fethiye/large%20600/0019.jpg"},
        {name : "Belgrad", image: "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg"},
        {name : "Toronto", image: "https://thechive.files.wordpress.com/2015/10/whats-the-deal-with-toronto-canada-17-photos-17.jpg?quality=85&strip=info"},
        {name : "Fethiye", image: "http://www.importantgroup.com.tr/userfiles/image/fethiye/large%20600/0019.jpg"},
        {name : "Belgrad", image: "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg"},
        {name : "Toronto", image: "https://thechive.files.wordpress.com/2015/10/whats-the-deal-with-toronto-canada-17-photos-17.jpg?quality=85&strip=info"},
        {name : "Fethiye", image: "http://www.importantgroup.com.tr/userfiles/image/fethiye/large%20600/0019.jpg"},
        {name : "Belgrad", image: "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg"},
        {name : "Toronto", image: "https://thechive.files.wordpress.com/2015/10/whats-the-deal-with-toronto-canada-17-photos-17.jpg?quality=85&strip=info"},
        {name : "Fethiye", image: "http://www.importantgroup.com.tr/userfiles/image/fethiye/large%20600/0019.jpg"},
        {name : "Belgrad", image: "http://www.theodora.com/wfb/photos/serbia/republic_square_in_belgrade_serbia_photo_misho_ognjanovic.jpg"}
    ]

app.get("/", function(req,res){
    res.render("landing")
});

app.get("/places", function(req,res){
    
    res.render("places",{places : places}); 
});


app.post("/places", function(req,res){

   // get data from form and add to places array
    var name = req.body.name;
    var image = req.body.image;
    var newPlace = {name : name , image : image}
    places.push(newPlace);

   //redirect back to places page (default is get)
   res.redirect("/places");
   
});

app.get("/places/new",function(req, res) {
    res.render("new.ejs");
});


app.listen(process.env.PORT,process.env.IP, function(){
       console.log("Couple Traveler Server Started!");
});