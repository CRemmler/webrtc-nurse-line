var io = require('socket.io').listen(60017);
var chat = new Object();
var count = new Object();
var sketch = new Object();
var lastSketchSentBy = new Object();

io.sockets.on('connection', function (socket) {

  socket.emit('Welcome'); 

  socket.on('All Ready', function(data) {
    socket.set('sessionId', data.sessionId, function () { 
      socket.join('session' + data.sessionId);
      if (chat[data.sessionId] == undefined) {
        chat[data.sessionId] = '';
        count[data.sessionId] = 0;
        sketch[data.sessionId] = [];
        lastSketchSentBy[data.sessionId]='';
      } else {
        count[data.sessionId] = count[data.sessionId] + 1;
console.log('count foo ' + count[data.sessionId] + ' in ' + data.sessionId);
      }
     
      socket.set('playerId', count[data.sessionId], function () {
        socket.emit('Init Chat', {chat:chat[data.sessionId]});
        socket.emit('Init Sketch', {sketchList:sketch[data.sessionId]});
        socket.broadcast.to('session' + data.sessionId).emit('Init Chat', {chat:chat[data.sessionId]});
      });

    });
  });

  socket.on('New Chat', function(data) {
    socket.get('sessionId', function(err, sessionId) {
      chat[sessionId] = chat[sessionId] + data.chat;
      socket.emit('Chat', {chat:data.chat});
      socket.broadcast.to('session' + sessionId).emit('Chat', {chat:data.chat});
      lastSketchSentBy[sessionId] = sessionId;
    });
  });

  socket.on('Clear Chat', function(data) {
    socket.get('sessionId', function(err, sessionId) {
      chat[sessionId] = [];
      socket.emit('Clear This Chat');
      socket.broadcast.to('session' + sessionId).emit('Clear This Chat');
    });
  });


  socket.on('Clear Sketch', function(data) {
    socket.get('sessionId', function(err, sessionId) {
      sketch[sessionId] = [];
      socket.emit('Clear');
      socket.broadcast.to('session' + sessionId).emit('Clear');
    });
  });


  socket.on('Mouse Send', function(data) {
    socket.get('sessionId', function(err, sessionId) {
      socket.get('playerId', function(err, playerId) {
        if ((lastSketchSentBy[sessionId] != sessionId) && (data.action == 'lineTo')){
          thisSketch = [];
          thisSketch.push(0);
          thisSketch.push(0);
          thisSketch.push('closePath');
          sketch[sessionId].push(thisSketch);
          thisSketch = [];
          thisSketch.push(0);
          thisSketch.push(0);
          thisSketch.push('beginPath');
          sketch[sessionId].push(thisSketch);
        }
        thisSketch = [];
        thisSketch.push(data.x);
        thisSketch.push(data.y);
        thisSketch.push(data.action);
        sketch[sessionId].push(thisSketch);
        socket.emit('Draw', {x:data.x, y:data.y, action:data.action});
        socket.broadcast.to('session' + sessionId).emit('Draw', {x:data.x, y:data.y, action:data.action});
        lastSketchSentBy[sessionId] = sessionId;
      });
    });
  });

  socket.on('disconnect', function() {
    socket.get('sessionId', function (err, sessionId) {   
      socket.leave('session' + sessionId);
      count[sessionId] = count[sessionId] - 1;
  console.log('someone left. there are ' + count[sessionId] + ' left in the room ' + sessionId); 
     if (count[sessionId] == 0) {
        delete chat[sessionId];
        delete count[sessionId];
        delete sketch[sessionId];
      }
    });
  });

});    
