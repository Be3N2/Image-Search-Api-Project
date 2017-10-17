// server.js
// Already set up for express

var express = require('express');
var app = express();

//super easy and amazing api! https://www.npmjs.com/package/google-images
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.CSE_ID,  process.env.API_KEY);

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// open port with a callback
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/search/:search", function(request, response) {
  var input = request.params.search;
  var value = request.query.page;
  
  client.search(input, {page: value}).then(function(val) {
    response.send(val);
  }).catch(function(err) {
    var err = {err: err};
    response.send(err);
  });
  
});
