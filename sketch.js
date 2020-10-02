var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var diesound, jumpsound, checkpointsound;
var obs;
var cloud, cloudimg, cloudgrp;
var trex, trexani, trexheaddown, trexded;
var edges;
var ground, groundani, inviground;
var o1, o2, o3, o4, o5, o6, obgrp;
var score;
var rand;
var restart, restartimg;
var gameover, gameoverimg;
var msg;
localStorage["High Score"] = 0;

function preload() {
  trexani = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trexheaddown = loadImage("trexhead.png");
  groundani = loadImage("ground2.png");
  cloudimg = loadImage("cloud.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  trexded = loadImage("trex_collided.png");
  restartimg = loadImage("restart.png");
  gameoverimg = loadImage("gameOver.png")
  diesound = loadSound("ded.mp3");
  jumpsound = loadSound("jump.mp3");
  checkpointsound = loadSound("checkPoint.mp3");

}

function setup() {
  msg = "Kiwi!";

  createCanvas(600, 200);
  edges = createEdgeSprites();
  trex = createSprite(50, 170, 10, 10);
  inviground = createSprite(300, 185, 600, 10);
  ground = createSprite(300, 180, 600, 10);
  ground.addImage("groundanimation", groundani);
  trex.addAnimation("trexanimation", trexani);
  trex.scale = 0.5;
  trex.addAnimation("fsdf", trexheaddown)
  trex.addAnimation("idk", trexded);
  gameover = createSprite(300, 70, 50, 10);
  gameover.addImage("go", gameoverimg);
  gameover.scale = 0.5;
  restart = createSprite(300, 110, 30, 30);
  restart.addImage("res", restartimg);
  restart.scale = 0.4;
  gameover.visible = false;
  restart.visible = false;
  //trex.changeImage(trexheaddown);
  score = 0;
  cloudgrp = createGroup();
  obgrp = createGroup();
  // trex.debug=true;
  trex.setCollider("circle", 0, 0, 40);
}

function draw() {

  //console.log(gamestate)

  if (gamestate === PLAY) {
    ground.velocityX = -(8 + 5 * score / 100);
    score = score + Math.round(getFrameRate() / 60);
    if (keyDown("space") && trex.y >= 156) {
      trex.velocityY = -15;
      jumpsound.play();

    }


    spawncloud();
    spawnobstacle();


    if (keyWentDown(DOWN_ARROW)) {
      trex.changeAnimation("fsdf", trexheaddown);
      trex.scale = 1;
      trex.y = ground.y;
      trex.collide(inviground);
      // trex.debug=true;
      trex.setCollider("circle", 0, -1, 10);

    }

    if (keyWentUp(DOWN_ARROW)) {

      //trex.debug=true;
      trex.setCollider("circle", 0, 0, 40);

    }
    trex.velocityY = trex.velocityY + 1;

    if (ground.x < 0) {
      ground.x = ground.width / 2;


    }

    if (obgrp.isTouching(trex)) {
      gamestate = END;

      diesound.play();
      trex.scale = 0.5;




    }
  } else if (gamestate === END) {
    ground.velocityX = 0;
    obgrp.setVelocityXEach(0);
    cloudgrp.setVelocityXEach(0);
    cloudgrp.setLifetimeEach(-2);
    obgrp.setLifetimeEach(-2);
    trex.velocityY = 0;
    trex.changeAnimation("idk", trexded);
    gameover.visible = true;
    restart.visible = true;
localStorage["High Score"]=localStorage["High Score"];
    if (mousePressedOver(restart)) {
      reset();


    }


  }



  background("white")
  textSize(20);
  // score=score+1;

  text("score:" + score, 510, 20);

  //inviground.shapeColor="white";
  inviground.visible = false;

  if (score > 0 && score % 100 === 0) {
    checkpointsound.play();
  }



  trex.collide(inviground);

  if (keyWentUp(DOWN_ARROW)) {
    trex.changeAnimation("trexanimation", trexani);
    trex.scale = 0.5;
  }

  text(mouseX + "," + mouseY, mouseX, mouseY)

  drawSprites();
  if (gamestate === END) {
    text("high Score:" + localStorage["High Score"], 100, 100);

  }
}

function spawncloud() {
  if (World.frameCount % 60 === 0) {

    cloud = createSprite(600, 20, 74, 34);
    cloud.velocityX = -3;
    cloud.addImage("cloud", cloudimg);
    cloud.scale = 0.6;
    cloud.y = Math.round(random(30, 120));

    trex.depth = cloud.depth;
    trex.depth = trex.depth + 1;
    restart.depth = cloud.depth;
    restart.depth = restart.depth + 1;
    gameover.depth = cloud.depth;
    gameover.depth = gameover.depth + 1;
    cloud.lifetime = 210;
    cloudgrp.add(cloud);
  }

}

function spawnobstacle() {
  if (World.frameCount % 80 === 0) {
    obs = createSprite(600, 165, 12, 12);
    obs.velocityX = -(8 + 5 * score / 100);
    obs.scale = 0.4;

    var rand1 = Math.round(random(1, 6));
    switch (rand1) {
      case 1:
        obs.addImage(o1);
        break;
      case 2:
        obs.addImage(o2);
        break;
      case 3:
        obs.addImage(o3);
        break;
      case 4:
        obs.addImage(o4);
        break;
      case 5:
        obs.addImage(o5);
        break;
      case 6:
        obs.addImage(o6);
        break;
    }
    obs.lifetime = 140;
    obgrp.add(obs);

  }
}

function reset() {
  gamestate = PLAY;
  // trex.changeAnimation(trexani);
  trex.changeAnimation("trexanimation", trexani);
  obgrp.destroyEach();
  cloudgrp.destroyEach();
  gameover.visible = false;
  restart.visible = false;
  if (localStorage["High Score"] < score) {
    localStorage["High Score"] = score;

  }

  score = 0;
}