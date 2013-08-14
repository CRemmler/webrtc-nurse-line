//var thisX = 0;
//var thisY = 0;
//document.addEventListener('touchstart', function(event) {
//  thisX = event.touches[0].pageX;
//  thisY = event.touches[0].pageY;
//$('#comments').text(thisX + "," + thisY);
//}, false);

jQuery(document).ready(function() {

 //////////
 // Canvas
 //////////
var myIconSelectedList;
var myIconList;

var myIconSelected;
var imageObj;
var stage;
var myLayer;
var theirLayer;
var layer;

   var CANVAS_WIDTH = 400, CANVAS_HEIGHT = 600, SCALE = 30;
  var context;
  var p = $("#container");
  var canvasPosition = p.position();
  var mouseDown = false;
  var playerId;
  var allDataList;
  var ms = 40;
  var base_image, base_image2, resizedHeight;
  var myX, myY;
  var encodedUrl;

  $('#submitUrl').bind('click', function() {
//    $('#container').html('');
    redrawEverything();


    var targetUrl = $("#targetUrl").val();
    encodedUrl = targetUrl;
    if (encodedUrl.search("http://") == -1) {
      encodedUrl = "http://" + encodedUrl;
    }
    encodedUrl = encodedUrl.replace(/\./g,"+++");
    encodedUrl = encodedUrl.replace(/\//g,"---");
    encodedUrl = escape(encodedUrl);


    drawBackground()

  });


 function drawBackground() {
//console.log('drawBackground'); 
   var baseImageWidth, baseImageHeight;
    var base_image = new Image();
        myLayer = new Kinetic.Layer();
        theirLayer = new Kinetic.Layer();
    base_image.onload = function () {
      baseImageWidth = this.width
      baseImageHeight = this.height
      resizedHeight = 600 * baseImageHeight / baseImageWidth
      var spacing = 32;
      resizedHeightAndSpacing = resizedHeight + spacing;

      stage = new Kinetic.Stage({
        container: "container",
        width: 600 + 4,
        height: resizedHeightAndSpacing + 4
      });
//var layer = ...
      layer = new Kinetic.Layer();

      // screenshot of web page
      var base_image2 = new Image();
      base_image2.onload = function() {
        var screenshotImage = new Kinetic.Image({
          x:0 + 2, y:spacing + 2,
          image:base_image2,
          width:600, height:resizedHeight
        });
        layer.add(screenshotImage);
        stage.add(layer);
      };
      base_image2.src = "//generative.edb.utexas.edu/webcrayons/url/" + encodedUrl + ".png";

      // outlines and fills around screenshot 
 //       layer = new Kinetic.Layer();
        var rect = new Kinetic.Rect({
          x: 0,
          y: 0,
          width: 553,
          height: spacing,
          fill: "#BDDEC0",
        });
        layer.add(rect);
        rect = new Kinetic.Rect({
          x: 1,
          y: spacing,
          width: 602,
          height: resizedHeight + 2,
          stroke: "black",
          strokeWidth: 2
        });
        layer.add(rect);
        rect = new Kinetic.Rect({
          x: 554,
          y: 1,
          width: 49,
          height: spacing - 1,
          fill: "white",
          stroke: "black",
          strokeWidth: 2
        });
        layer.add(rect);
        rect = new Kinetic.Rect({
          x: 555,
          y: spacing - 2,
          width: 47,
          height: 3,
          fill:"white",
        });
        layer.add(rect);
        stage.add(layer);

        myIconList = [];
        myIconSelectedList = [];
        myIconSelected = 0;
        // my icon

//        myLayer = new Kinetic.Layer();
//console.log('create their Layer');
//        theirLayer = new Kinetic.Layer();
        addMyIcon();

    }
    base_image.src = "//generative.edb.utexas.edu/webcrayons/url/" + encodedUrl + ".png";
  }
  function addMyIcon() {
//console.log('addMyIcon');
    myIconList.push('temp');
    myIconSelectedList.push('');
var myIconCount = myIconList.length - 1;

    imageObj = new Image();
    imageObj.onload = function() {
      myIconList[myIconCount] = new Kinetic.Image({
        x: 570,
        y: 4,
        image: imageObj,
        width: 25,
        height: 25,
        draggable:true
      });
      myLayer.add(myIconList[myIconCount]);
      addMyEventIcon(myIconCount);

      stage.add(myLayer);

      myIconSelectedList[myIconCount] = 'neverBeenSelected'

mouseSend();

    };
    imageObj.src = './assets/s0.png';
  }

  function addMyEventIcon(myIconCountTemp) {
    myIconList[myIconCountTemp].on('mousedown touchstart', function() {
      myIconSelected = myIconCountTemp;
    });
  }

//var thisX, thisY;
//$('body').bind('tap',function (event) { 
//  $('#comments').text('yep');
//  thisX = event.touches[0].pageX;
//  thisY = event.touches[0].pageY;

//  $('#comments').append('' + thisX + ' ' + thisY);
//});

$('#container').bind('touchend',function (event) {
  switch (myIconSelectedList[myIconSelected])
  { case 'selected':
//    thisX = parseFloat(thisX) - canvasPosition.left - 10;
//    thisY = parseFloat(thisY) - canvasPosition.top - 10; 
//$('#comments').append(" is " + thisX + ", " + thisY);
//$('#comments').append("(" + canvasPosition.left + " " + canvasPosition.top + ") ");
//$('#comments').append('---' + thisX - canvasPosition.left - 10 + ' ' + thisY - canvasPosition.top - 10)
//      myIconList[myIconSelected].transitionTo({
//        x: 100,
//        y: 100,
//        duration: 0.1
//      });
      break;
    case 'unselected':
      myIconSelectedList[myIconSelected] = 'selected';
      break;
    case 'neverBeenSelected':
      myIconSelectedList[myIconSelected] = 'selected';
      addMyIcon()
      break;
  }   
});

// drag out of container, then send it because you moved it
//$('#container').bind('mouseup',function(event) {
//  console.log('drop it');
//});

$('#clearStickers').bind('click',function() {

  myLayer.removeChildren();
  myLayer.clear();
  myIconList = [];
  myIconSelectedList = [];
  myIconSelected = 0;

  addMyIcon();

});

$('#container').bind('click',function (event) {
  //mouseSend();
  switch (myIconSelectedList[myIconSelected])
  {
    case 'selected':
      //xList[myIconSelected] = event.pageX - canvasPosition.left - 10;
      //yList[myIconSelected] = event.pageY - canvasPosition.top - 10;
      myIconList[myIconSelected].transitionTo({
        x: event.pageX - canvasPosition.left - 10,
        y: event.pageY - canvasPosition.top - 10,
        duration: 0.1,
        callback: function() {
          mouseSend();
        }
      });
      break;
//    case 'unselected': 
//      myIconSelectedList[myIconSelected] = 'selected';
//      break;
    case 'neverBeenSelected':
      myIconSelectedList[myIconSelected] = 'selected';
      myIconList[myIconSelected].transitionTo({
        x: event.pageX - canvasPosition.left - 10,
        y: event.pageY - canvasPosition.top - 10,
        duration: 0.1,
        callback: function() {
          addMyIcon();
        }
      });
      break;
  }
});


  function redrawEverything() {
    $('#container').html('');
  } 

  $('#targetUrl').val('http://www.google.com')

  $('#submitUrl').trigger('click');

  //////////////
  // SocketIO
  //////////////

  var socket = io.connect('http://generative.edb.utexas.edu:60015');


  socket.on('Welcome', function(data) {
    socket.emit('All Ready', {temp:'hey'});
//console.log('welcome');
  });


  socket.on('Initialize', function(data) {
    playerId = data.playerId;
//console.log('i am ' + playerId);
 });
 
  var theirX, theirY, theirIcons, theirId;

  socket.on('Update', function(data) {

    

  }); 

  socket.on('Update2', function(data) {

//    console.log('update');
    if (stage != undefined) {
      // data is a list of [x, y, icon]
      theirLayer.removeChildren();
//      theirLayer.clear(); 
      allDataList = data.allDataList;
//      console.log(allDataList);

      var theirImage;
      theirX = allDataList[0];
      theirY = allDataList[1];
      theirIcons = allDataList[2];
//      for (i=0;i < theirIcons.length;i++)
//      {
//        if ((theirIcons[i] != 0) && (i != playerId)) {
//          for (j=0;j < theirX[i].length - 1; j++) {
//console.log('theirX[' + i + '][' + j + ']');
      var i = 0;
      var j = 0;
      drawImage(i,j);
    }
  });

  function drawImage(i,j) {
    if (i == playerId ) {
      i++;
      if (i < theirX.length - 1) {
        drawImag;(i,j); }
    } else {
      if (theirX[0].length == 1) 
      {
        i++;
        if (i < theirX.length) {drawImage(i,j);}
      } else {
        imageObj = new Image();
        imageObj.onload = function() {
          thisX = theirX[i][j];
          thisY = theirY[i][j];
          //console.log('[' + i + ',' + j + '] ' + theirIcons[i] + '(' + thisX + ',' + thisY + ')');

          theirImage = new Kinetic.Image({
            x: thisX,
            y: thisY,
            image: imageObj,
            width: 25,
            height: 25
          });
          theirLayer.add(theirImage);
          stage.add(theirLayer);

          if (j < theirX[i].length - 2) { 
            j++; 
            drawImage(i,j);
          }
          else {
            if (i < theirX.length - 2) { 
              i++; j=0;
              drawImage(i,j);
            }
          }
        };
        imageObj.src = './assets/s0.png';
      }
    }
  //    theirLayer.clear();
  }

  function mouseSend() {
    xList = [];
    yList = [];
    if (myIconList[0] != 'temp') {
      for (i=0;i<myIconList.length;i++) {
        xList.push(parseInt(myIconList[i].getPosition().x))
        yList.push(parseInt(myIconList[i].getPosition().y))
      }
    }

    socket.emit('Mouse Move', { playerId:playerId, xList:xList, yList:yList});
  }
  

});
