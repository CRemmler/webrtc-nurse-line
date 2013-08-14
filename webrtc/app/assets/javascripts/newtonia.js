var thisPageX = 0;
var thisPageY = 0;

document.addEventListener('touchmove', function(event) {
  thisPageX = event.targetTouches[event.targetTouches.length - 1].pageX;
  thisPageY = event.targetTouches[event.targetTouches.length - 1 ].pageY;
//$('#comments').text(thisX + "," + thisY);
}, false);

jQuery(document).ready(function() {

 //////////
 // Canvas
 //////////
  var imageObj;
  var stage;
  var myLayer;
  var theirLayer;
  var layer;
  var stage2;
  var layer2;

  var myIcons = new Object();
  var myIconCounter;
  var spacing;
  var myIconSelected = new Object();
  var myIconSelectedCounter;

  var theirIcons = new Object();
  var theirIconCounter = 0;

  var tempTheirIconsHash;
  
   
 
  var p = $("#container");
  var canvasPosition = p.position();
  var mouseDown = false;
  var playerId;
  var allDataList;
  var base_image, base_image2, resizedHeight;
  var encodedUrl;

  var iconList = ['0','11','22','33','44','55','66','77','88','99','100','111','122','133','144','5','16','27','38','49','50','61','72','83','94','105','116','127','138','149','10','21','32','43','54','65','76','87','98','109','110','121','132','143','4','15','26','37','48','59','60','71','82','93','104','115','126','137','148','9','30','41','52','63','74','85','96','107','118','129','130','141','2','13','24','35','46','57','68','79','80','91','102','113','124','135','146','7','18','29','40','51','62','73','84','95','106','117','128','139','140','1','12','23','34','45','56','67','78','89','90','101','112','123','134','145','6','17','28','39','20','31','42','53','64','75','86','97','108','119','120','131','142','3','14','25','36','47','58','69','70','81','92','103','114','125','136','147','8','19',]


  var mode;
  var iconSize;
  var displayType;

  $('#mode').bind('change', function() {
    mode = $(this).val();
    if (mode == 'run') {
      socket.emit('Get Update');
    }
  });

  $('#size').bind('change', function() {
    iconSize = parseFloat($(this).val());
  //  for (k in myIcons) {
  //    myIcons[k].setWidth(iconSize);
  //    myIcons[k].setHeight(iconSize);
  //  }
    for (k in theirIcons) {
      theirIcons[k].setWidth(iconSize);
      theirIcons[k].setHeight(iconSize);
    }
    stage.add(myLayer);
    stage2.add(theirLayer);
  });

  $('#display').bind('change', function() {
    displayType = $(this).val();

    if (displayType == show) {

    } else {

    }

  });

  $('#submitUrl').bind('click', function() {
    redrawEverything();
    var targetUrl = $("#targetUrl").val();
    encodedUrl = targetUrl;
    if (encodedUrl.search("http://") == -1) {
      encodedUrl = "http://" + encodedUrl;
    }
    encodedUrl = encodedUrl.replace(/\./g,"+++");
    encodedUrl = encodedUrl.replace(/\//g,"---");
    encodedUrl = escape(encodedUrl);
    drawBackground();
    drawBackground2();
  });

 function drawBackground2() {
    var baseImageWidth, baseImageHeight;
    var base_image = new Image();
    var resizedHeightAndSpacing;
    theirLayer = new Kinetic.Layer();
      spacing = 32;

    base_image.onload = function () {
      baseImageWidth = this.width
      baseImageHeight = this.height
      resizedHeight = 500 * baseImageHeight / baseImageWidth
      resizedHeightAndSpacing = resizedHeight + spacing;

      stage2 = new Kinetic.Stage({
        container: "container2",
        width: 502,
        height: resizedHeightAndSpacing
      });
      layer2 = new Kinetic.Layer();

      //screenshot of the web page
      var base_image2 = new Image();
      base_image2.onload = function() {
        var screenshotImage = new Kinetic.Image({
          x:0, y:spacing,
          image:base_image2,
          width:502, height:resizedHeight
        });
        layer2.add(screenshotImage);

       rect = new Kinetic.Rect({
          x: 0,
          y: 0,
          width: 502,
          height: spacing,
          fill: "white",
        });
       layer2.add(rect);
       stage2.add(layer2);


        $('#share').trigger('click');
      };
      base_image2.src = "//generative.edb.utexas.edu/webcrayons/url/" + encodedUrl + ".png";
    }
    base_image.src = "//generative.edb.utexas.edu/webcrayons/url/" + encodedUrl + ".png";

  }

 

  function drawBackground() {
    var baseImageWidth, baseImageHeight;
    var base_image = new Image();
        myLayer = new Kinetic.Layer();
  //      theirLayer = new Kinetic.Layer();
    var resizedHeightAndSpacing;
    base_image.onload = function () {
      baseImageWidth = this.width
      baseImageHeight = this.height
      resizedHeight = 500 * baseImageHeight / baseImageWidth
      spacing = 32;
      resizedHeightAndSpacing = resizedHeight + spacing;

      stage = new Kinetic.Stage({
        container: "container",
        width: 502,
        height: resizedHeightAndSpacing
      });
      layer = new Kinetic.Layer();

      // screenshot of web page
      var base_image2 = new Image();
      base_image2.onload = function() {
        var screenshotImage = new Kinetic.Image({
          x:0, y:spacing,
          image:base_image2,
          width:502, height:resizedHeight
        });
        layer.add(screenshotImage);
        stage.add(layer);
      };
      base_image2.src = "//generative.edb.utexas.edu/webcrayons/url/" + encodedUrl + ".png";

      // outlines and fills around screenshot 
var rect; 
       rect = new Kinetic.Rect({
          x: 0,
          y: 0,
          width: 502,
          height: spacing,
          fill: "#f9ffd4 ",
        });
    //    layer.add(rect);
    //    rect = new Kinetic.Rect({
    //      x: 1,
    //      y: spacing,
    //      width: 602,
    //      height: resizedHeight + 2,
    //      stroke: "black",
    //      strokeWidth: 2
    //    });
    //    layer.add(rect);
    //    rect = new Kinetic.Rect({
    //      x: 554,
    //      y: 1,
    //      width: 49,
    //      height: spacing - 1,
    //      fill: "white",
    //      stroke: "black",
    //      strokeWidth: 2
    //    });
    //    layer.add(rect);
    //    rect = new Kinetic.Rect({
    //      x: 555,
    //      y: spacing - 2,
    //      width: 47,
    //      height: 3,
    //      fill:"white",
    //    });
        layer.add(rect);
        stage.add(layer);
        myIconCounter = 0;
        myIconSelectedCounter = 0;
        addMyIcon();
    }
    base_image.src = "//generative.edb.utexas.edu/webcrayons/url/" + encodedUrl + ".png";

  }

  function addAllTheirIcons(addTheirIconList) {
    var index = addTheirIconList.length - 1
    var thisX = addTheirIconList[index][0];
    var thisY = addTheirIconList[index][1];
    var idString = addTheirIconList[index][2];
    var image = addTheirIconList[index][3];

//console.log('add ' + idString + ' to (' + thisX + ',' + thisY + ')');
    imageObj = new Image();
    imageObj.onload = function() {
      theirIcons[idString] = new Kinetic.Image({
        x: thisX,
        y: thisY,
        image: imageObj,
        width: iconSize,
        height: iconSize
      });
      theirLayer.add(theirIcons[idString]);
      addTheirIconList.pop();
      if (addTheirIconList.length > 0) {
        addAllTheirIcons(addTheirIconList);
      } else {
        removeExtras();
        if (stage2 != undefined) {stage2.add(theirLayer);}
      }
console.log('adding group ' + image + ' looks like ' + iconList[image]);
    };
    imageObj.src = './assets/s' + iconList[image] + '.png';
  }

  function addMyIcon() {
    myIconSelected[myIconCounter] = 'neverBeenSelected';

    if (myIcons[myIconCounter] == undefined) {
      imageObj = new Image();
      imageObj.onload = function() {
        myIcons[myIconCounter] = new Kinetic.Image({
          x: 470,
          y: 4,
          image: imageObj,
          width: iconSize,
          height: iconSize,
          draggable:true
        });

        myLayer.add(myIcons[myIconCounter]);
        stage.add(myLayer);
        addMyIconEvent(myIconCounter);

        myIconCounter = myIconCounter + 1;
console.log('added practice ' + playerId + ' looks like ' + iconList[playerId]);
//        mouseSend();
      };
      imageObj.src = './assets/s' + iconList[playerId] + '.png';
    } else {
      myIcons[myIconCounter].setPosition(470,4);
      myIcons[myIconCounter].show();
      myIconCounter = myIconCounter + 1;
      stage.add(myLayer);
//      mouseSend();
    }
  }

  $('#share').bind('click',function() {
    mouseSend();
  });

  function addMyIconEvent(myIconCountTemp) {
    myIcons[myIconCountTemp].on('mousedown touchend', function() {
      myIconSelectedCounter = myIconCountTemp;
    });
  }

  $('#clearStickers').bind('click',function() {
    for (var k in myIcons) {
      if (k != '0') {
        myIcons[k].hide();
      }
    }
    myIconCounter = 0;
    myIconSelectedCounter = 0;
    addMyIcon();
    mouseSend();
  });

  $('#container').bind('touchend',function (event) {
    var thisX = thisPageX - canvasPosition.left - 10;
    var thisY = thisPageY - canvasPosition.top - 10;
   switch (myIconSelected[myIconSelectedCounter])
    {
      case 'selected':
        myIcons[myIconSelectedCounter].transitionTo({
          x: thisX,
          y: thisY,
          duration: 0.1,
          callback: function() {
            //mouseSend();
          }
        });
        break;
      case 'neverBeenSelected':
        myIconSelected[myIconSelectedCounter] = 'selected';
        myIcons[myIconSelectedCounter].transitionTo({
          x: thisX,
          y: thisY,
          duration: 0.1
        });
        addMyIcon();
      break;
    } 
  });

  $('#container').bind('click',function (event) {
    var thisX = event.pageX - canvasPosition.left - 10;
    var thisY = event.pageY - canvasPosition.top - 10;
    switch (myIconSelected[myIconSelectedCounter])
    {
      case 'selected':
        myIcons[myIconSelectedCounter].transitionTo({
          x: thisX,
          y: thisY,
          duration: 0.1,
          callback: function() {
//            mouseSend();
          }
        });
        break;
      case 'neverBeenSelected':
        myIconSelected[myIconSelectedCounter] = 'selected';
        myIcons[myIconSelectedCounter].transitionTo({
          x: thisX,
          y: thisY,
          duration: 0.1
        });
        addMyIcon();
      break;
    }
  });

  function redrawEverything() {

    $('#container').html('');
    $('#container2').html('');
    $('#mode').val('run');
    mode = $('#mode').val();
    $('#size').val('25');
    iconSize = parseFloat($('#size').val());
    $('#display').val('show');
    displayType = $('#display').val();
//    if (socket != undefined) { socket.emit('Get Update');}
    myIcons = new Object();
    theirIcons = new Object(); 

  } 

  $('#targetUrl').val('http://www.google.com')

  $('#submitUrl').trigger('click');

  //////////////
  // SocketIO
  //////////////

  var socket = io.connect('http://generative.edb.utexas.edu:60015');

  socket.on('Welcome', function(data) {
    socket.emit('All Ready', {temp:'hey'});
  });

  socket.on('Initialize', function(data) {
    playerId = data.playerId;

    $('#myImage').html("<img src = './assets/s" + iconList[playerId] + ".png' height='20' width='20'>");
//    mouseSend();
 });
 
  var theirX = [];
  var theirY = [];
  var theirIconIds = [];

  socket.on('Update', function(data) {
if (mode == 'run') {
    // whose icon is at which x, y, and what is their iconId?
    theirX = data.allDataList[0];
    theirY = data.allDataList[1];
    theirIconIds = data.allDataList[2];
//console.log('UPDATE I am ' + playerId);
console.log(theirX + " " + theirY + " " + theirIconIds);

    var addTheirIconEntry;
    var addTheirIconList = [];

    tempTheirIconsHash = new Object();

    for (k in theirIcons) {
      tempTheirIconsHash[k]='exists';
    }

    var idString;
    for (i=0; i<theirIconIds.length; i++) {
      if (spacing != undefined) {
        var k = theirIconIds[i].length - 1
        idString = 'id' + i + '-' + k;
        if (theirIcons[idString] == undefined) {
           addTheirIconEntry = [];
           addTheirIconEntry.push((i%18)*23 + 2);
           addTheirIconEntry.push(3);
           addTheirIconEntry.push(idString);
           addTheirIconEntry.push(i);
  //         addTheirIconList.push(addTheirIconEntry);
        } 
      }
      if ((theirIconIds[i] != '') && (spacing != undefined)) {
        for (j=0; j<theirIconIds[i].length - 1; j++) {
          //id-0-14 is the '14' of playerId 0 with icon s0.png
          idString = 'id' + i + '-' + j;
//console.log('idString ' + idString + ' spacing ' + spacing);
          if (theirIcons[idString] == undefined) {
            //make a new one
//console.log('make a new one for ' + idString);
           addTheirIconEntry = [];
           addTheirIconEntry.push(theirX[i][j]);
           addTheirIconEntry.push(theirY[i][j]);
           addTheirIconEntry.push(idString);
           addTheirIconEntry.push(i);
           addTheirIconList.push(addTheirIconEntry);
          } else {
            if ((theirX[i][j] == theirIcons[idString].getPosition().x) &&
                (theirY[i][j] == theirIcons[idString].getPosition().y)) {
              //leave it alone
//console.log('leave ' + idString + ' alone');
            } else {
              //move it
//console.log('move ' + idString);
              theirIcons[idString].setPosition(theirX[i][j],theirY[i][j]);
              if (theirIcons[idString].isVisible() == false) { 
                theirIcons[idString].show(); 
              }
            }
          }
        }
      }
    }
    if (addTheirIconList.length > 0) {
      addAllTheirIcons(addTheirIconList);
    } else {
      removeExtras();
      if (stage2 != undefined) {stage2.add(theirLayer);}
//console.log('done');

    }
}
  }); 

  function removeExtras() {
    for (i=0; i<theirIconIds.length; i++) {
      if (theirIconIds[i] != '') {
        for (j=0; j<theirIconIds[i].length - 1; j++) {
          idString = 'id' + i + '-' + j;
          delete tempTheirIconsHash[idString];
        }
      }
    }
    for (k in tempTheirIconsHash) {
      theirIcons[k].hide();
//console.log('HIDE ' + k);
    }
  }


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
          theirImage = new Kinetic.Image({
            x: thisX,
            y: thisY,
            image: imageObj,
            width: iconSize,
            height: iconSize
          });
          theirLayer.add(theirImage);
          stage2.add(theirLayer);

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
        imageObj.src = './assets/s' + iconList[theirIconIds[i]] + '.png';
      }
    }
  }

  function mouseSend() {
    var xList = [];
    var yList = [];
    var iconIdList = [];

    for (var k in myIcons) {
      if (myIcons[k].isVisible() == true) {
        xList.push(parseInt(myIcons[k].getPosition().x));
        yList.push(parseInt(myIcons[k].getPosition().y));
        iconIdList.push(playerId);
      }
    }
//console.log('mouseSend ' + xList + " " + yList + " " + iconIdList);
    socket.emit('Mouse Move', { playerId:playerId, xList:xList, yList:yList, iconIdList:iconIdList});
  }
  

});
