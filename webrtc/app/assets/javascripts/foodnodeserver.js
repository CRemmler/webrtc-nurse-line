
var Box2D = require('box2dweb').Box2D;

var io = require('socket.io').listen(60003);
io.configure(function() {
  io.set('log level', 1);
}); 

var allDataDef = [];   //imageFileName, imageWidth, imageHeight
var allData = [];      //x, y, angle
var interval;
var ms = 20;
var intervalMilliseconds = 1000 / ms;
  var idList = [];
  
  var mouseXList = [];
  var mouseYList = [];
  var mouseDownList = [];
  var mouseJointList = [];


  var CANVAS_WIDTH = 400, CANVAS_HEIGHT = 300, SCALE = 30;
  var world;
  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ,  b2AABB = Box2D.Collision.b2AABB
            ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
            ;
   
    function init() {         
    world = new b2World(
           new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
    );
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new b2BodyDef;   
    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = CANVAS_WIDTH / 2 / SCALE;
    bodyDef.position.y = CANVAS_HEIGHT / SCALE;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox((CANVAS_WIDTH / SCALE) / 2, (8 / SCALE) / 2);
    world.CreateBody(bodyDef).CreateFixture(fixDef);         
    //create ceiling
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = CANVAS_WIDTH / 2 / SCALE;
    bodyDef.position.y = 0;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox((CANVAS_WIDTH / SCALE) / 2, (8 / SCALE) / 2);
    world.CreateBody(bodyDef).CreateFixture(fixDef);         
    // create left wall
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 0;
    bodyDef.position.y = CANVAS_HEIGHT / SCALE;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox((8 / SCALE) / 2, CANVAS_HEIGHT / SCALE);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    // create right wall
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = CANVAS_WIDTH / SCALE;
    bodyDef.position.y = CANVAS_HEIGHT / SCALE;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox((8 / SCALE) / 2, CANVAS_HEIGHT / SCALE) / 2;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    var w = CANVAS_WIDTH / 2 / SCALE
    addThisBox(0,w + Math.random() + 0.1,1,'bread.png',51,29,'box');
    addThisBox(1,w + Math.random() + 0.1,1,'cauliflower.png',40,41,'circle');
    addThisBox(2,w + Math.random() + 0.1,1,'carrot.png',70,12,'box');
    addThisBox(3,w + Math.random() + 0.1,1,'apple.png',35,38,'circle');
    addThisBox(4,w + Math.random() + 0.1,1,'orange.png',35,34,'circle');
    addThisBox(5,w + Math.random() + 0.1,1,'milk.png',35,51,'box');
    addThisBox(6,w + Math.random() + 0.1,1,'eggs.png',50,25,'box');
    addThisBox(7,w + Math.random() + 0.1,1,'lime.png',20,24,'circle');
    addThisBox(8,w + Math.random() + 0.1,1,'celery.png',80,28,'box');
    addThisBox(9,w + Math.random() + 0.1,1,'butter.png',51,17,'box');

  }
  
  function addThisBox(id,x,y,imageFileName,imageWidth,imageHeight,shape) {
  
      allDataDef.push(["/foodfight2/assets/" + imageFileName, -1 * imageWidth / 2,-1 * imageHeight / 2]);
    //var imgObj = new Image();
    //imgObj.src = "/assets/" + imageFileName;
    //      context.drawImage(imgObj,x,y);
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;     
    var fixDef = new b2FixtureDef;
    if (shape == 'box') {
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(
	    imageWidth / 2 / SCALE
		, imageHeight / 2 / SCALE
      );
    } else {
      fixDef.shape = new b2CircleShape(
        imageWidth / 2 / SCALE
      );
	}
    bodyDef.position.x = x;
    bodyDef.position.y = y;
    bodyDef.userData = {
      image: "/assets/" + imageFileName, 
      imageW: imageWidth,
      imageH: imageHeight,
      id: id
    };
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
  }


init();
  
function assignId() {
var tempIdList = idList;
  var id;
  var newOne = true;
  for (i=0;i<tempIdList.length;i++) {
    if (newOne == true) {
      if (tempIdList[i] == 0) {
        tempIdList[i] = 1;
        id = i;
        newOne = false;
      }
    }
  }
  if (newOne) {
    id = tempIdList.length;
    tempIdList.push(1);
    mouseXList.push(0);
    mouseYList.push(0);
    mouseDownList.push(0);
    mouseJointList.push(0);
  }
  idList = tempIdList;
  return id;
}
function removeId(id) {
  idList[id] = 0;
}
  
io.sockets.on('connection', function (socket) {

  socket.emit('Welcome'); 
 
  socket.on('All Ready', function(data) {
    var playerId = assignId();
    socket.set('playerId', playerId, function () { 
      socket.emit('Initialize', { allDataDef:allDataDef, playerId:playerId}); 
    });
  });

  socket.on('Mouse Move', function(data) {
    //data.mouseX, data.mouseY
    mouseXList[data.playerId] = data.mouseX;
    mouseYList[data.playerId] = data.mouseY;
    mouseDownList[data.playerId] = data.mouseDown;
  });

  socket.on('disconnect', function() {
    socket.get('playerId', function (err, playerId) {   
       removeId(playerId);       
    });
 });
  //////////
  // Interval Events
  //////////
  runTheInterval();
    
  function runTheInterval()
  { 
    clearInterval(interval);
    interval = setInterval(function()
    {
      update();
	}, intervalMilliseconds);
  }

///////////////
////Box 2d WEb
///////////////

 
  
  function getBodyAtMouse(mouseX,mouseY) {
    mousePVec = new b2Vec2(mouseX, mouseY);
    var aabb = new b2AABB();
    aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
    aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
    // Query the world for overlapping shapes.
    selectedBody = null;
    world.QueryAABB(getBodyCB, aabb);
    return selectedBody;
  }

  function getBodyCB(fixture) {
    if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
      if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
        selectedBody = fixture.GetBody();
        return false;
      }
    }
    return true;
  }
  


  function update() {
    var imageWidth, imageHeight;
    var tempX, tempY, tempAngle, pos;
    world.Step(
          1 / ms   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
    );     
    
for (i=0;i<idList.length;i++) {
  if (idList[i] == 1) {
    if ((mouseDownList[i] == true) && (!mouseJointList[i])) {
       var body = getBodyAtMouse(mouseXList[i],mouseYList[i]);
       if(body) {
         var md = new b2MouseJointDef();
         md.bodyA = world.GetGroundBody();
         md.bodyB = body;
         md.target.Set(mouseXList[i], mouseYList[i]);
         md.collideConnected = true;
         md.maxForce = 300.0 * body.GetMass();
         mouseJointList[i] = world.CreateJoint(md);
         body.SetAwake(true);
      }
    }
    if (mouseJointList[i]) {
      if (mouseDownList[i] == true) {
        mouseJointList[i].SetTarget(new b2Vec2(mouseXList[i], mouseYList[i]));
      } else {
        world.DestroyJoint(mouseJointList[i]);
        mouseJointList[i] = null;
      }
    }
  }
}
    //////////////
    // Draw Images
    //////////////
    allData = [0,0,0,0,0,0,0,0,0,0];          
    for (b = world.GetBodyList() ; b; b = b.GetNext())
    { 
  	  if (b.GetType() == b2Body.b2_dynamicBody)
	  {
 	    pos = b.GetPosition();	 
 	    tempX = pos.x * SCALE;
 	    tempY = pos.y * SCALE;
 	    tempAngle = b.GetAngle();
        imageWidth = b.m_userData.imageW;
        imageHeight = b.m_userData.imageH;
        allData[b.m_userData.id] = [tempX.toFixed(2),tempY.toFixed(2), tempAngle.toFixed(2)]
      }
    }
    for (i=0;i<idList.length;i++) {
      if (idList[i] == 1) {
        tempX = mouseXList[i] * SCALE;
 	    tempY = mouseYList[i] * SCALE;
        allData.push([tempX.toFixed(2),tempY.toFixed(2)]);
      }
    }
    world.ClearForces();
    socket.volatile.emit('Update', { allData:allData}); 
    socket.volatile.broadcast.emit('Update', { allData:allData}); 
  }
  
});    

