var thisPageX = 0;
var thisPageY = 0;

//document.addEventListener('touchmove', function(event) {
//  thisPageX = event.targetTouches[event.targetTouches.length - 1].pageX;
//  thisPageY = event.targetTouches[event.targetTouches.length - 1 ].pageY;
//$('#comments').text(thisX + "," + thisY);
//}, false);

jQuery(document).ready(function() {

 //////////
 // Canvas
 //////////

  if ($('#status').attr('data-page') == 'home-session') { 
    var s = $("#sketch");
    var sketchPosition = s.position();
    var sketch = s[0].getContext('2d');
    sketch.fillStyle = "#e5eff4"
    sketch.strokeStyle = "black"
    sketch.lineWidth = 5
    sketch.lineCap = "round"

    sketch.fillRect(0,0,330,290);

    var last = (new Date()).getTime();
    var now;
    var ms = 40;
    var dragging = false;
  }

  $('#sketch').bind('mousedown', function(event) {
    var x,y;
    dragging = true;
    sketch.beginPath();
    offset = $(this).offset()
    x = event.pageX - offset.left
    y = event.pageY - offset.top
    mouseSend(x,y,'moveTo');
  });
  $('#sketch').bind('mouseup', function(event) {
    if (dragging == true) { mouseSend(0,0,'closePath'); }
    dragging = false;
  });
  $('#sketch').bind('mousemove', function(event) {
    if (dragging == true) {
      var x,y;
      now = (new Date()).getTime();
      if (now - last > ms) {
        last = now;
        offset = $(this).offset()
        x = event.pageX - offset.left
        y = event.pageY - offset.top
        mouseSend(x,y,'lineTo');
      }
    }
  });
  $('#sketch').bind('mouseout', function(event) {
    if (dragging == true) { mouseSend(0,0,'closePath');}
    dragging = false;
  });

//  $('#container').bind('touchend',function (event) {
//    var thisX = thisPageX - canvasPosition.left - 10;
//    var thisY = thisPageY - canvasPosition.top - 10;
//  });

//  $('#container').bind('click',function (event) {
//    var thisX = event.pageX - canvasPosition.left - 10;
//    var thisY = event.pageY - canvasPosition.top - 10;
//  });

  //////////////
  // Chat
  //////////////
  var firstChat = true;

  $('#chatInput').attr('value','Enter Comment');

  $('#chatInput').bind('click', function() {
    if (firstChat == true) {
      firstChat = false;
      $(this).attr('value',' ');
      $(this).css('color','black');
    } 
  });

  $('#sendChat').bind('click', function() {
//    console.log('got ' + $('#chatInput').val() );
    socket.emit('New Chat',{sessionId:sessionId, chat:($('#chatInput').val() + '<br>') });
    firstChat = true;
    $('#chatInput').attr('value',' ');
  }); 

  $('#clearChat').bind('click', function() {
    socket.emit('Clear Chat');
  });

  $('#connectTo').bind('change', function() {
    if ($(this).val() == 'patient') {
      $('#userType').html('nurse.');
    } else {
      $('#userType').html('patient.');
    }
  });
  
  $('#connect').bind('click', function() {
    socket.emit('Request Connection', {userType:$('#connectTo').val()});
    if ($('#connectTo').val() == 'patient') {
      $('#waitingRoomResponse').append('<p>Thank you. Please wait for the next available nurse.');
    } else {
      $('#waitingRoomResponse').append('<p>Thank you. Please wait for the next available patient.');    
    }
  });


  $('#clearSketch').bind('click', function() {
    socket.emit('Clear Sketch');
  });

  //////////////
  // SocketIO
  //////////////
  
        var sessionId = 2;
  
          var thisLocation = $(location).attr('href');
  sessionId = thisLocation.substr(40,thisLocation.length)
  var room = sessionId;
  if ($('#status').attr('data-page') == 'home-session') {

//  var room='foo'  
  var videos = [];
  var anotherUser = false;
  var PeerConnection = window.PeerConnection || window.webkitPeerConnection00;
  if (PeerConnection) {
          rtc.createStream({"video": true, "audio": true}, function(stream) {
            $('#me').attr('src', URL.createObjectURL(stream));
//            document.getElementById('you').src = URL.createObjectURL(stream);
//            videos.push(document.getElementById('you'));
            rtc.attachStream(stream, 'me');
            //subdivideVideos();
          });
  }else {
//    $('#videoTwo').html('<p>Video using WebRTC not supported. <p> Use Chrome (at least Version 23)');

//     alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
  }

//    console.log('connecting to 60018 ' + sessionId);
 //       rtc.connect('ws://generative.edb.utexas.edu:60018',sessionId);

//rtc.connect('ws://107.20.223.140/','foo');

rtc.connect('ws://generative.edb.utexas.edu:60018',room);
//console.log('connected');
        rtc.on('add remote stream', function(stream, remoteSessionId) {

          if (anotherUser == false) {
console.log('second user');
console.log('remoteSession' + remoteSessionId);
     //       if (remoteSessionId == sessionId) {

              rtc.attachStream(stream,'you');
              anotherUser = true;
    //        }
          }
        });
        rtc.on('disconnect stream', function(data) {
console.log('disconnect String');
//          $('#me').html('');
$('#youVideo').html("<video id='you' class='flip' autoplay></video>");

        });

}
  //////////////
  // SocketIO
  //////////////

  var chat;

  var socket = io.connect('http://generative.edb.utexas.edu:60017');
  socket.on('Welcome', function() {
    socket.emit('All Ready', {sessionId:sessionId});
//    console.log('All Ready from ' + sessionId);
  });
  
  socket.on('Target Url', function(data) {
//    console.log(data.url);
    $('#waitingRoomResponse').append("<p>Please meet at <a href='./" + data.url + "'>Room " + data.url + "</a>" ); 
  });

  function mouseSend(x,y,action) {
    socket.emit('Mouse Send', {x:x, y:y, action:action});
  };

  function drawIt(x,y,action) {
    switch (action) {
      case "moveTo":
        sketch.beginPath();
        sketch.moveTo(x,y);
        break;
      case "lineTo":
        sketch.lineTo(x,y);
        sketch.stroke();
        break;
      case "closePath":
        sketch.closePath();
        break;
    }
  }

  socket.on('Draw', function(data) {
    var x = data.x;
    var y = data.y;
    var action = data.action;
    drawIt(x,y,action);
  });

  socket.on('Clear', function(data) {
    sketch.fillRect(0,0,330,290);
  });

  socket.on('Clear This Chat', function() {
    $('#chatLog').html('');
  });

  var theirX = [];
  var theirY = [];
  var theirIconIds = [];

  socket.on('Init Chat', function(data) {
//    console.log('chat is ' + data.chat); 
    $('#chatLog').html(data.chat); 
  });

  socket.on('Init Sketch', function(data) {
   // console.log('' + data.sketchList);
    var sketchList = data.sketchList;
    for (i=0; i<sketchList.length; i++) {
      drawIt(sketchList[i][0],sketchList[i][1],sketchList[i][2]);
    }
  });

  socket.on('Chat', function(data) {
    $('#chatLog').append(data.chat);
  });

  

});
