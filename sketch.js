var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var cloudGroup, obstacleGroup;
var over,overImage;
var restart,restartImage;
var jumpSound,dieSound,checkpointSound;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  cloudImage = loadImage("cloud.png")
  groundImage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  overImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
}

function setup() {
  background(220)
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = true;
  trex.setCollider("rectangle",0,0,100,trex.height);

  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //generate random numbers
  var rand =  Math.round(random(1,100))
  //console.log(rand)
  score = 0;
  
  over = createSprite(300,60);
  over.addImage(overImage);
  over.visible = false;
  over.scale = 0.5;

  restart = createSprite(300,110);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;


  cloudGroup = new Group();
  obstacleGroup = createGroup();

  localStorage["highScore"] = 0;
}

function draw() {
  //set background color
  background(180);
  
  text("High Score = "+ localStorage["highScore"],350,50);
  //score = score+ round(getFrameRate()/60);
  
  text("Score = "+ score,500,50);
  
  if(gameState === PLAY){
    ground.velocityX = -(4+3*score/100);
    
  if(frameCount%3 === 0){
    score = score+1
    }
  if(keyDown("space")&& trex.y >= 161) {
    trex.velocityY = -13;
    jumpSound.play();
    }

  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  if(score%100 === 0 && score>0){
    checkpointSound.play();
  }

   

  trex.velocityY = trex.velocityY + 0.8

    spawnClouds()
    spawnObstacles()
    
    if(trex.isTouching(obstacleGroup)){
      gameState = END;
      dieSound.play();
    // trex.velocityY = -13;
      //jumpSound.play();
    }

  }

  else if (gameState === END){
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setLifetimeEach(2);
    obstacleGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    restart.visible = true;
    over.visible = true;
    trex.changeAnimation("collided");

    if(mousePressedOver(restart)){
  reset();

    }
  }

  console.log(gameState)

  trex.collide(invisibleGround);
  
  //Spawn Clouds

  
  //console.log(frameCount)
  drawSprites();
}

//function to spawn the clouds
function spawnClouds(){
  if(frameCount %60 === 0){
 var cloud = createSprite(600,100,30,50) 
 cloud.velocityX = -3;
 cloud.scale = 0.7
 cloud.addImage(cloudImage);   
 cloud.y = round(random(60,120));
 cloud.depth = trex.depth;
 trex.depth = trex.depth +1;
 cloud.lifetime = 210;
 cloudGroup.add(cloud);  
  }
}

 function spawnObstacles(){
   if(frameCount %80 === 0){
   var obstacle = createSprite(600,165,50,50);
   obstacle.velocityX = -(4+3*score/100);
   var rand = round(random(1,6));
   switch(rand){
     case 1: obstacle.addImage(obstacle1);   
             break;
     case 2: obstacle.addImage(obstacle2);
             break;
     case 3: obstacle.addImage(obstacle3);
             break;
     case 4: obstacle.addImage(obstacle4);
             break;
     case 5: obstacle.addImage(obstacle5);
             break;   
     case 6: obstacle.addImage(obstacle6);
             break;
             default: break;
   }
     obstacle.scale = 0.5
     obstacle.lifetime = 150
     obstacleGroup.add(obstacle)
   }
      
 }


 function reset(){
   gameState = PLAY;
   cloudGroup.destroyEach();
   obstacleGroup.destroyEach();
   restart.visible = false;
   over.visible = false;
   trex.changeAnimation("running");
   if(localStorage["highScore"] <score){
   localStorage["highScore"] = score;
   }
   score = 0;
   console.log("highScore " + localStorage["highScore"]);
 }


