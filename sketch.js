var ground, groundImg;
var cloud, cloudImg;
var trex, trexImg;
var groundLine;
var obstacle;
var obs1Img, obs2Img, obs3Img, obs4Img, obs5Img, obs6Img;
var gameState = "serve";
var deadTrex;
var obstacleGroup;
var score = 0;
var gameOver, gameOverImg;
var restart, restartImg;
var cloudGroup;
var checkpoint;
var jump;
var die;

function preload() {
  groundImg = loadImage("ground2.png");
  trexImg = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  cloudImg = loadImage("cloud.png");
  obs1Img = loadImage("obstacle1.png");
  obs2Img = loadImage("obstacle2.png");
  obs3Img = loadImage("obstacle3.png");
  obs4Img = loadImage("obstacle4.png");
  obs5Img = loadImage("obstacle5.png");
  obs6Img = loadImage("obstacle6.png");
  deadTrex = loadImage("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  checkpoint = loadSound("checkpoint.mp3");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ground = createSprite(width / 2, (height / 3) * 2);
  ground.addImage(groundImg);

  groundLine = createSprite(width / 2, ((height / 3) * 2) + 15, width, 10);
  groundLine.visible = false;

  trex = createSprite(100, ((height / 3) * 2) - 18);
  trex.addAnimation("trex", trexImg);
  trex.addAnimation("deadTrex", deadTrex);
  trex.scale = 0.7;
  trex.setCollider("rectangle", 0, 0, trex.width + 100, trex.height + 25)

  gameOver = createSprite(width/2, (height/2) - 50)
  restart = createSprite(width/2, (height/2) + 10)
  gameOver.addImage(gameOverImg);
  restart.addImage(restartImg);
  restart.scale = 0.75
  gameOver.scale = 1.25

  obstacleGroup = new Group();
  cloudGroup = new Group();

}

function draw() {
  background(0);
  textSize(50);
  if (gameState == "serve") {
    text("Press Space Bar", (width / 2) - 200, height / 2);
    serve();
  }
  if (gameState == "play") {
    play();
  }
  trex.collide(groundLine);
  textSize(20);
  text("Score = "+ score, 20, 30)

  if (gameState == "end"){
    end()
  }
  drawSprites();
}

function serve() {
  if (keyDown("space") && gameState == "serve") {
    ground.velocityX = -8 //+ (score/100);
    gameState = "play";
  }
  gameOver.visible = false;
  restart.visible = false;
}

function play() {
  if (keyDown("space") && trex.y > 275) {
    trex.velocityY = -10;
    jump.play();
  }
  if (ground.x < 100) {
    ground.x = ground.width / 2;
  }
  createClouds();
  createObstacles();
  trex.velocityY = trex.velocityY + 1
  if (obstacleGroup.isTouching(trex)) {
    jump.play();
    trex.velocityY = -10;
    //gameState = "end";
    //die.play();
  }
  //score = score + Math.round(getFrameRate()/100);
  if (frameCount % 2 == 0) {
    score = score + 1
  }
  //gameOver.visible = false;
  //restart.visible = false;
  if (score > 0 && (score % 100 == 0)){
    checkpoint.play();
  }
}

function end(){
  ground.velocityX = 0;
  obstacleGroup.setVelocityXEach(0);
  cloudGroup.setVelocityXEach(0);
  trex.changeAnimation("deadTrex", deadTrex);
  trex.y = ((height / 3) * 2) - 18;
  gameOver.visible = true;
  restart.visible = true;
  obstacleGroup.setLifetimeEach(-1);
  cloudGroup.setLifetimeEach(-1);
  if (mousePressedOver(restart)){
    gameState = "serve";
    score = 0;
    trex.changeAnimation("trex", trexImg);
    cloudGroup.destroyEach();
    obstacleGroup.destroyEach();
  }
}

function createClouds() {
  if (frameCount % 120 == 0) {
    cloud = createSprite(width, random(height / 6, height / 3));
    cloud.velocityX = -2;
    cloud.addImage(cloudImg);

    cloud.lifetime = 700;
    cloud.depth = trex.depth;
    trex.depth += 1;
    cloudGroup.add(cloud);
  }
}

function createObstacles() {
  if (frameCount % 60 == 0) {
    obstacle = createSprite(width, ((height / 3) * 2) - 20);
    obstacle.velocityX = -8 //+ (score/100);
    var obstacleType = Math.round(random(1, 6));
    switch (obstacleType) {
      case 1:
        obstacle.addImage(obs1Img);
        break;
      case 2:
        obstacle.addImage(obs2Img);
        break;
      case 3:
        obstacle.addImage(obs3Img);
        break;
      case 4:
        obstacle.addImage(obs4Img);
        break;
      case 5:
        obstacle.addImage(obs5Img);
        break;
      case 6:
        obstacle.addImage(obs6Img);
        break;
      default:
        break;
    }
    obstacle.scale = 0.75;
    obstacle.lifetime = 700;
    obstacleGroup.add(obstacle);
  }
}