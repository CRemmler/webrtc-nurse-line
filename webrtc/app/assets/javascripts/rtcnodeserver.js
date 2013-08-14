  //var express = require("express");
  //var app = express();
  //var webRTC = require('webrtc.io').listen(app);

var app = require('express')();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

var port = process.env.PORT || 60018;
server.listen(port);


//var app = require('express').createServer();
//app.listen(60018);
//var webRTC = require('webrtc.io').listen(app);

  //app.listen(60018);

app.get('/', function(req, res) {
  res.send('Node server is running.');
});


webRTC.rtc.on('connect', function(rtc) {
console.log('connect');
});

webRTC.rtc.on('send answer', function(rtc) {
console.log('send answer');
});

webRTC.rtc.on('disconnect', function(rtc) {
console.log('disconnect');
});



