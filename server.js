// server.js
// Already set up for express

var express = require('express');
var app = express();

//super easy and amazing api! https://www.npmjs.com/package/google-images
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.CSE_ID,  process.env.API_KEY);

//mongo setup **dont forget to add dependency in package.json**
var mongodb = require('mongodb');
var MONGODB_URI = process.env.DBURL;

var collection;
var startup = true;

app.use(express.static('public'));

app.get("/", function (request, response) {
  if (startup) connect();
  response.sendFile(__dirname + '/views/index.html');
});

// open port with a callback
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/search/:search", function(request, response) {
  if (startup) connect();
  
  var input = request.params.search;
  var value = request.query.page;
  if (value == undefined) value = 1
  
  var searchObj = {"search": input, "page": value, "time": Date.now()};
  collection.insertOne(searchObj);
  
  client.search(input, {page: value}).then(function(val) {
    response.send(val);
  }).catch(function(err) {
    var err = {err: err};
    response.send(err);
  });
});

app.get("/history", function (request, response) {
  if (startup) connect();
  collection.find({}, {_id: 0}).toArray(function(err, docs) {
    if (err) throw err;
    response.send(docs);
  });
});

//mongo stuff
function connect() {
  
  mongodb.MongoClient.connect(MONGODB_URI, function(err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      return;
    }
    collection = db.collection(process.env.COLLECTION);
    collection.find().forEach(function(doc, err) {
      if (err) throw err;
      //console.log(doc); //this is for outputting server contents
    }, function() {
      //callback function
      startup = false;
    });
  });
                              
}