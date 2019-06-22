var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    seedDB          = require("./seeds");
    


// mongoose.connect("mongodb://localhost/yelp_camp");
var dbUrl =  "mongodb://localhost/yelp_camp";

mongoose.connect(dbUrl, { useNewUrlParser: true }, function(err) { console.log("mongoDB connected", err); })
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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


//ROUTE

app.get("/", function(req, res){
    res.render("landing")
})

app.get("/campgrounds", function(req, res){
     //Get all campground from DB
    //  console.log(req.user);
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         }else {
             
             res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser : req.user});
         }
     })
     
})

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    // res.send("YOU HIT THE POST ROUTE!!")
    var name = req.body.name;
    var image = req.body.image;
    var des = req.body.des;
    var newCampground = {name: name, image: image, description: des};
    // console.log(newCampground)
    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, campground){
        if(err) {
            console.log(err);
        } else{
            //console.log(campground)
            res.redirect("/campgrounds")
        }
    })
    
    //redirect back to campgrounds page
    // res.redirect("/campgrounds")
})

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            //render show template with that campground
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//  =======================
//  COMMENT ROUTE
//  =======================

app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res){
    //find campground by id 
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else {
            res.render("comments/new", {campground : campground});
        }
    })
    
});


//POST COMMENT

app.post("/campgrounds/:id/comments", isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // console.log(req.body.comment)
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
            
            
        }
    })
})

//=============
// AUTH ROUTE
//=============

//show register form

app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
});

// show login form

app.get("/login", function(req, res){
    res.render("login");
})

//handling login logic

app.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
}),function(req, res){
    
});


//LOGOUT

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});


//MIDDLEWARE

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has Started!!!");
})