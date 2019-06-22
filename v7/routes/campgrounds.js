var express = require("express"); 
var router = express.Router();
var Campground = require("../models/campground");



router.get("/", function(req, res){
     //Get all campground from DB
    //  console.log(req.user);
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         }else {
             
             res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser : req.user});
         }
     });
     
});

router.post("/", function(req, res){
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
            res.redirect("/campgrounds");
        }
    });

});

router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


module.exports = router;