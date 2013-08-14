var io = require('socket.io').listen(60017);
var chat = new Object();
var count = new Object();
var sketch = new Object();
var lastSketchSentBy = new Object();
var connectionList = []; //nurse,member,url triples
var urlNumberCount = 0;
var userNumberCount = 0;

io.sockets.on('connection', function (socket) {

  socket.emit('Welcome'); 

  socket.on('Request Connection', function(data) {
console.log('request connection');
console.log('connectionList ' + connectionList);
    var matchFound = false;
if (data.userType == 'patient') {
console.log('looking for nurse o,x,x');
    for (i=0;i<connectionList.length;i++) {
      if ((connectionList[i][0] == '') && (connectionList[i][1] != '')) {
        connectionList[i][0]= userNumberCount;   
        socket.broadcast.to('user' + connectionList[i][1]).emit('Target Url', {url:connectionList[i][2]});
        socket.emit('Target Url', {url:connectionList[i][2]});
console.log('match found. patient found nurse.  go to ' + connectionList[i][2]);
        connectionList[i][0] = '';
        connectionList[i][1] = '';
        connectionList[i][2] = urlNumberCount;
        urlNumberCount++;
        i = connectionList.length
        matchFound = true;
      }
    }
} else {
console.log('looking for patient x,o,x');
    for (i=0;i<connectionList.length;i++) {
      if ((connectionList[i][0] != '') && (connectionList[i][1]=='')) {
        connectionList[i][1]= userNumberCount;
        socket.broadcast.to('user' + connectionList[i][0]).emit('Target Url', {url:connectionList[i][2]});
console.log('match found. nurse found patient. go to ' + connectionList[i][2]);
        connectionList[i][0] = '';
        connectionList[i][1] = '';
        connectionList[i][2] = urlNumberCount;
        urlNumberCount++;
        i = connectionList.length
        matchFound = true;
      }
    }

}
    if (matchFound == false) {
      var emptyEntryFound = false;
      //no match, replace in empty entry in list
      for (i=0;i<connectionList.length;i++) {
        if ((connectionList[i][0] == '') && (connectionList[i][1] == '')) {
console.log('no match, replace in empty entry in list');
          if (data.userType == 'patient') {
            connectionList[i][1] = userNumberCount;
          } else {
            connectionList[i][0] = userNumberCount;
          }
          socket.join('user' + userNumberCount);
          userNumberCount++; 
          connectionList[i][2]= urlNumberCount;
          urlNumberCount++;
          emptyEntryFound = true;
          i = connectionList.length;
        }
      }
      if (emptyEntryFound == false) {
console.log('no match, add new empty entry to list');
        // no match, add empty entry to end of list
        var newEntry = [];
        socket.join('user' + userNumberCount);
        if (data.userType == 'patient') {
          newEntry.push('');
          newEntry.push(userNumberCount);
        } else {
          newEntry.push(userNumberCount);
          newEntry.push('');
        }
        newEntry.push(urlNumberCount);
        connectionList.push(newEntry);
        userNumberCount++;
        urlNumberCount++;
      }
    }

  });

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
          //closePath(), beginPath()
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
        //lineTo()
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
      if (count[sessionId] == 0) {
        delete chat[sessionId];
        delete count[sessionId];
        delete sketch[sessionId];
      }
    });
  });

});    
