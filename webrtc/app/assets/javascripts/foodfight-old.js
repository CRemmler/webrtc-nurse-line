
jQuery(document).ready(function() {


  //////////
  // Box2dWeb
  //////////

  var CANVAS_WIDTH = 400, CANVAS_HEIGHT = 300, SCALE = 30;

  var world;
  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var context = document.getElementById("canvas").getContext("2d")
           	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
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
 
 
         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
 
         window.setInterval(update, 1000 / 60);

 var w = CANVAS_WIDTH / 2 / SCALE
    addThisBox("bread",w + Math.random() + 0.1,1,'bread.png',51,29,'box');
    addThisBox("cauliflower",w + Math.random() + 0.1,1,'cauliflower.png',40,41,'circle');
    addThisBox("carrot",w + Math.random() + 0.1,1,'carrot.png',70,12,'box');
    addThisBox("apple",w + Math.random() + 0.1,1,'apple.png',35,38,'circle');
    addThisBox("orange",w + Math.random() + 0.1,1,'orange.png',35,34,'circle');
    addThisBox("milk",w + Math.random() + 0.1,1,'milk.png',35,51,'box');
    addThisBox("eggs",w + Math.random() + 0.1,1,'eggs.png',50,25,'box');
    addThisBox("lime",w + Math.random() + 0.1,1,'lime.png',20,24,'circle');
    addThisBox("celery",w + Math.random() + 0.1,1,'celery.png',80,28,'box');
    addThisBox("butter",w + Math.random() + 0.1,1,'butter.png',51,17,'box');
  
  }
  
  var isMouseDown = false;
  var mouseX = undefined;
  var mouseY = undefined;
  var p = $("#canvas");
  var canvasPosition = p.position();
  var selectedBody;
  var mouseJoint = null;


  $('#canvas').bind('mouseout', function(event) {
    $('#canvas').unbind('mousemove', handleMouseMove);
    isMouseDown = false;
    mouseX = undefined;
    mouseY = undefined;
  });

 
  $('#canvas').bind('mousedown', function(event) {
    isMouseDown = true;
    $('#canvas').bind('mousemove', handleMouseMove);
  });
  
  $('#canvas').bind('mouseup', function(event) {
   $('#canvas').unbind('mousemove', handleMouseMove);
    isMouseDown = false;
    mouseX = undefined;
    mouseY = undefined;
  });
  
  var handleMouseMove = function(e) {
    mouseX = (e.clientX - canvasPosition.left) / 30;
    mouseY = (e.clientY - canvasPosition.top) / 30;
  };
  
  function getBodyAtMouse() {
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
  
  function addThisBox(id,x,y,imageFileName,imageWidth,imageHeight,shape) {
      var imgObj = new Image();
 
      imgObj.src = "/assets/" + imageFileName;
      context.drawImage(imgObj,x,y);
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
              whatever:"carolyn",
              imageW: imageWidth,
              imageH: imageHeight,
              id: id
            };
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;
 
         world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

 function update() {
         var imageWidth, imageHeight;
         world.Step(
               1 / 60   //frame-rate
            ,  10       //velocity iterations
            ,  10       //position iterations
         );
        
         context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

         ///////
           if(isMouseDown && (!mouseJoint)) {
               var body = getBodyAtMouse();
               if(body) {
                  var md = new b2MouseJointDef();
                  md.bodyA = world.GetGroundBody();
                  md.bodyB = body;
                  md.target.Set(mouseX, mouseY);
                  md.collideConnected = true;
                  md.maxForce = 300.0 * body.GetMass();
                  mouseJoint = world.CreateJoint(md);
                  body.SetAwake(true);
               }
            }
            
            if(mouseJoint) {
               if(isMouseDown) {
                  mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
               } else {
                  world.DestroyJoint(mouseJoint);
                  mouseJoint = null;
               }
            }
         ///////
         
  //       world.DrawDebugData();
         
         for (b = world.GetBodyList() ; b; b = b.GetNext())
      	 {
	          if (b.GetType() == b2Body.b2_dynamicBody)
	          {
	              var pos = b.GetPosition();	 
     			  imageWidth = b.m_userData.imageW;
     			  imageHeight = b.m_userData.imageH;
               	  var imgObj = new Image(imageWidth,imageHeight);
                  imgObj.src = b.m_userData.image;           
	              context.save();
	              context.translate(pos.x * SCALE, pos.y * SCALE);
	              context.rotate(b.GetAngle());
	              context.drawImage(imgObj,-1 * imageWidth / 2,-1 * imageHeight / 2);
	             context.restore();
              }
     	}
     	
        world.ClearForces();
  }
   
  init();
  
  
    socket.on('user introduction', function(data) {
      if (userConnected == false) { 
console.log('user introduction');
      }
    });
    
    

});