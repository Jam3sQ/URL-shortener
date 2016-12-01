'use strict'; 

var express = require('express'); 
var app = express(); 
var isUrl = require('is-url-superb'); //Package to validate url *Note Https doesnt work 
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI ||'mongodb://Jam3sQ:Pinecone1@ds115798.mlab.com:15798/heroku_n2wwm54z'; //url to connect to database 

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
        MongoClient.connect(url, function(err, db) {
            if (err) throw err; 
            var links = {
                original: req.params.link, 
                shortened: shortLink
            };
            
            res.send(JSON.stringify(links)); 
            
            var collection = db.collection('linksdb'); 
            collection.insert(links, function(err, data){
                if (err) throw err;
            });
            db.close(); 
    
        }); 
      
    }
    
    //Create else if to see if parameter is a four digit number 
    else if (req.params.link >= 1000 && req.params.link < 10000){
        MongoClient.connect(url, function(err, db){
            if(err)throw err; 
            var collection = db.collection('linksdb'); 
            collection.find({shortened:Number(req.params.link)}).toArray(function(err, data){
                if(err) throw err; 
                
                //Look in the database to see if the 4 digit number is a shortened link
                if (data.length > 0){
                    //if it is then redirect to original link
                    res.redirect('http://' + data[0].original); 
                }
                else {
                    //Return JSON response 
                    console.log("Link not found")
                }
            }); 
            db.close(); 
        }); 
    }
    
    else {
        res.send("This is not a url in the database"); 
    }
})

//Check database contents 
app.get('/database/test', function(req, res){
    MongoClient.connect(url, function(err, db){
        if(err) throw err; 
        var collection = db.collection('linksdb'); 
        collection.find().toArray(function(err, data){
            if (err) throw err; 
            res.send(JSON.stringify(data))
        });
    })
})

//Clear contents of database 
app.get('/database/clear', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        var collection = db.collection('linksdb'); 
        collection.remove(); 
        res.send("Links cleared!");
    })
})

app.listen(port); 