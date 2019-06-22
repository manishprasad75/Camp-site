var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/yelp_camp");
var dbUrl =  "mongodb://localhost/yelp_camp";

mongoose.connect(dbUrl, { useNewUrlParser: true }, function(err) { console.log("mongoDB connected", err); })
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


//SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String, 
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f6c77aa6e9b7be_340.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!",
        
//     },function(err, campground){
//         if(err){
//             console.log(err);
//         }else {
//             console.log("NEWLY CREATED CAMPGROUND: ")
//             console.log(campground);
//         }
//     });


app.get("/", function(req, res){
    res.render("landing")
})

app.get("/campgrounds", function(req, res){
     //Get all campground from DB
     
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         }else {
             
             res.render("index", {campgrounds : allCampgrounds});
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
    res.render("new.ejs")
})

app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
    
    
   
    // res.render("show")
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has Started!!!");
})