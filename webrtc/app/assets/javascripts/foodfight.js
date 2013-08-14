
jQuery(document).ready(function() {

  //////////
  // Preload Images
  //////////

  var image;
  $(images).each(function(){
     image = $('<img />').attr('src',this)
  });

  var images = [
    'foodfight2/assets/bread.png',
    'foodfight2/assets/cauliflower.png',
    'foodfight2/assets/carrot.png',
    'foodfight2/assets/apple.png',
    'foodfight2/assets/orange.png',
    'foodfight2/assets/milk.png',
    'foodfight2/assets/eggs.png',
    'foodfight2/assets/lime.png',
    'foodfight2/assets/celery.png',
    'foodfight2/assets/butter.png',
    'foodfight2/assets/cursor.png'
  ];


  //////////
  // Canvas
  //////////
//400 300
  var CANVAS_WIDTH = 400, CANVAS_HEIGHT = 300, SCALE = 30;
  var context = document.getElementById("canvas").getContext("2d");
  var allDataDef = [];
  var allData = [];
  var mouseX, mouseY;
  var p = $("#canvas");
  var canvasPosition = p.position();
  var mouseDown = false;
  var playerId;
  var ms = 40;

  //////////////
  // SocketIO
  //////////////

  var socket = io.connect('http://www.remmler.org:60003');

  socket.on('Welcome', function(data) {
    socket.emit('All Ready');
  });


  socket.on('Initialize', function(data) {  
    // data is a list of [imageFileName, imageWidth, imageHeight]
    allDataDef = data.allDataDef;
    playerId = data.playerId;
    console.log("playerId " + playerId); 
 });
  
  socket.on('Update', function(data) {
    // data is a list of [x, y, angle]

    if (allDataDef != [])    {
      allData = data.allData;
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      for (i=0;i<allDataDef.length;i++) {
        var imgObj = new Image();
        imgObj.src = allDataDef[i][0];          
        context.save();
        context.translate(allData[i][0],allData[i][1]);
 	context.rotate(allData[i][2]);
	context.drawImage(imgObj,allDataDef[i][1],allDataDef[i][2]);
	context.restore();
      }
      for (i=10;i<allData.length;i++) {
        var imgObj = new Image();
        imgObj.src = '/foodfight2/assets/cursor.png';          
        context.save();
	context.translate(allData[i][0], allData[i][1]);
	context.drawImage(imgObj,-5,-5);
	context.restore();    
      }
    }
  });


  function mouseSend() {
    socket.emit('Mouse Move', { playerId:playerId, mouseX:mouseX, mouseY:mouseY, mouseDown:mouseDown});
  }
  
  $('#canvas').bind('mouseout', function(event) {
    mouseDown = false;
    mouseSend();
  });
  
  $('#canvas').bind('mousedown', function(event) {
    mouseDown = true;
    mouseSend();
  });

  $('#canvas').bind('mouseup', function(event) {
    mouseDown = false;
    mouseSend();
  });
  
  var last = (new Date()).getTime();
  $('#canvas').bind('mousemove', function(event) {  
    var now = (new Date()).getTime();
    if (now - last > ms) {
      last = now;
      mouseX = (event.pageX - canvasPosition.left) / SCALE;
      mouseY = (event.pageY - canvasPosition.top) / SCALE;
      mouseSend();
    }
  });

});
