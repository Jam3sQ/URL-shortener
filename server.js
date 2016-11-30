var express = require('express'); 
var app = express(); 
var isUrl = require('is-url-superb'); //Package to validate url *Note Https doesnt work 
// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect('mongodb://localhost:27017/learnyoumongo', function(err, db) {
//     if (err) throw err; 
    
// }); 

//Create port variable 
var port = process.env.PORT || 8080; 

//Routes 
app.get('/', function(req, res){
    //Homepage 
    res.send("Hi");
})

//Shorten the link 
app.get('/:link', function(req, res){
    //Check if the link is in the valid format 
    
    if(isUrl(req.params.link)){
    //store it using mongodb 
    //create a shortened link and link it to the same link 
        //Create a unique four digit code using random numbers 
        //
    }
    else {
        console.log("Invalid url");
    }
})
app.listen(port); 