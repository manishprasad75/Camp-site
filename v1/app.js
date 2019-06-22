var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

 var campgrounds = [
            {name: "Salmon Creek", image: "https://farm6.staticflickr.com/5160/5899701350_8d3c601de7.jpg",},
            {name: "Granite", image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg"},
            {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1452700903139-b085a5399ed2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",},
            {name: "Salmon Creek", image: "https://farm6.staticflickr.com/5160/5899701350_8d3c601de7.jpg",},
            {name: "Granite", image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg"},
            {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1452700903139-b085a5399ed2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",},
            {name: "Salmon Creek", image: "https://farm6.staticflickr.com/5160/5899701350_8d3c601de7.jpg",},
            {name: "Granite", image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg"},
            {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1452700903139-b085a5399ed2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",},
            {name: "Salmon Creek", image: "https://farm6.staticflickr.com/5160/5899701350_8d3c601de7.jpg",},
            {name: "Granite", image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg"},
            {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1452700903139-b085a5399ed2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",},
        ]

app.get("/", function(req, res){
    res.render("landing")
})

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds : campgrounds});
})

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    // res.send("YOU HIT THE POST ROUTE!!")
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    // console.log(newCampground)
    campgrounds.push(newCampground);
    
    //redirect back to campgrounds page
    
    res.redirect("/campgrounds")
})

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs")
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has Started!!!");
})