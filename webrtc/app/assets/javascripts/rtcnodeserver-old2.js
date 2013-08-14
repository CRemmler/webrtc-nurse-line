

//var rtc = require('webrtc.io')
//rtc.listen(60018);

//rtc.on('connection', function() {
//  console.log("connection received");
//});

//require('ws');

//var io = require('webrtc.io').listen(60018);
//io.sockets.on('connection', function(socket) {
//  socket.on('chat', function(nick, message) {
//    socket.broadcast.emit('chat', nick, message);
//  });
//});



//var webRTC = require('webrtc.io').listen(60018);
  var express = require("express");
  var app = express();

app.listen(60018);
var webRTC = require('webrtc.io').listen(app);
var path = require('path');
console.log('dirname ' + __dirname);

app.get('/', function(req, res) {
  console.log('try to get');
   filepath = path.normalize('/var/www/web_apps/webrtc/app/views/home/session.html.erb');
   res.sendfile( filepath );
});

app.get('/scaffolds.css.scss', function(req, res) {
  console.log('scaffolds');
  res.sendfile('/var/www/web_apps/webrtc/app/assets/stylesheets/scaffolds.css.scss');
});

app.get('/webrtc.io.js', function(req, res) {
  console.log('webrtc');
  res.sendfile('/var/www/web_apps/webrtc/node_modules/webrtc.io/lib/webrtc.io.js');
});

webRTC.rtc.on('connection', function(rtc) {
  rtc.on('send_answer', function() {
  });

  rtc.on('disconnect', function() {
  });
});

