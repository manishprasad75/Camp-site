var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment")


// mongoose.connect("mongodb://localhost/yelp_camp");
var dbUrl =  "mongodb://localhost/yelp_camp";

mongoose.connect(dbUrl, { useNewUrlParser: true }, function(err) { console.log("mongoDB connected", err); })
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


//ROUTE

app.get("/", function(req, res){
    res.render("landing")
})

app.get("/campgrounds", function(req, res){
     //Get all campground from DB
     
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         }else {
             
             res.render("campgrounds/index", {campgrounds : allCampgrounds});
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

app.get("/campgrounds/:id/comments/new", function(req, res){
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

app.post("/campgrounds/:id/comments", function(req, res){
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
    //lookup campground using ID
    //create new comment
    //connect new comment to campground
    //redirect to campground show page
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has Started!!!");
})