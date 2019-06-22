var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    methodOverride  = require("method-override"),
    LocalStrategy   = require("passport-local"),
    seedDB          = require("./seeds");
    
    
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
    

// mongoose.connect("mongodb://localhost/yelp_camp");
var dbUrl =  "mongodb://localhost/yelp_camp";

mongoose.connect(dbUrl, { useNewUrlParser: true }, function(err) { console.log("mongoDB connected", err); });
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// seedDB(); //Seed the database

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Manish became one of the best developer",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//TO MAKE AVAILABLE currentUser TO ALL THE ROUTES
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has Started!!!");
})