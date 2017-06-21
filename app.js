var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    Place = require("./models/place"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    expressSession = require("express-session"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    placeRoutes = require("./routes/places"),
    indexRoutes = require("./routes/index")
//mongoose.connect("mongodb://localhost/coupletraveler");
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://slpAdmin:zxasqw12@ds131782.mlab.com:31782/coupletraveler");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

// PASSPORT CONFIGURATION

app.use(expressSession({
    secret : "Annie are you ok?",
    resave : false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//requiring routes
app.use("/",indexRoutes);
app.use("/places",placeRoutes);
app.use("/places/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP, function(){
       console.log("Couple Traveler Server Started!");
});