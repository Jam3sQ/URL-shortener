var express = require('express'); 
var app = express(); 
var isUrl = require('is-url-superb'); //Package to validate url *Note Https doesnt work 
var MongoClient = require('mongodb').MongoClient;

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
        
        //Generate shortened link which is a four digit number 
        var shortLink = Math.floor(1000 + Math.random() * 9000);

        //store it using mongodb 
        MongoClient.connect('mongodb://localhost:27017/url-shorten', function(err, db) {
            if (err) throw err; 
            var links = {
                original: req.params.link, 
                shortened: shortLink
            };
            
            var collection = db.collection('linksdb'); 
            collection.insert(links, function(err, data){
                if (err) throw err;
            });
            console.log("confirm");
            
            db.close(); 
    
        }); 
      
    }
    else {
        console.log("Invalid url");
    }
})

app.get('/test/database', function(req, res){
    MongoClient.connect('mongodb://localhost:27017/url-shorten', function(err, db){
        if(err) throw err; 
        var collection = db.collection('linksdb'); 
        collection.find().toArray(function(err, data){
            if (err) throw err; 
            console.log(JSON.stringify(data)); 
        });
    })
})
app.listen(port); 