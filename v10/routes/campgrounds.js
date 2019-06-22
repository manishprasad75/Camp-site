var express = require("express"); 
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//show all the campground
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

//Create a new Campground
router.post("/",middleware.isLoggedIn,function(req, res){
    //get data from form and add to campgrounds array
    // res.send("YOU HIT THE POST ROUTE!!")
    var name = req.body.name;
    var image = req.body.image;
    var des = req.body.des;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    var newCampground = {name: name, image: image, description: des, author: author};
    // console.log(req.user);
    // console.log(newCampground)
    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, campground){
        if(err) {
            console.log(err);
        } else{
            console.log(campground)
            res.redirect("/campgrounds");
        }
    });

});

router.get("/new", middleware.isLoggedIn,function(req, res){
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

//EDIT CAMPGROUND ROUTE

router.get("/:id/edit", checkCampgroundOwnership,function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                return res.redirect("back");
            }
            res.render("campgrounds/edit", {Campground : foundCampground});
            
        });     

});

//UPDATE CAMPGROUNDS
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    var updatedCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
    };
    Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});


//DELETE ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;