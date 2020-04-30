p5.disableFriendlyErrors = true; // disables FES

let isUp, isDown, isLeft, isRight, callMethod, clicked, addBullet, paused;

let gameMode, score, numLives;

let stars = [];

let zones = [];

let asteroids = new Map();

let p;

let lives = [];

let bullets = [];

let _font;

let s;

let sounds = [];

let playBtn, helpBtn;

function preload() {
  _font = loadFont('assets/fonts/lucon.ttf');

  soundFormats('wav');
  sounds.push(loadSound('assets/sound/menuMove'));
  sounds.push(loadSound('assets/sound/endGame'));
  sounds.push(loadSound('assets/sound/asteroidHit'));
  sounds.push(loadSound('assets/sound/laser'));
  sounds.push(loadSound('assets/sound/pauseIn'));
  sounds.push(loadSound('assets/sound/menuSelect'));
  sounds.push(loadSound('assets/sound/pauseOut'));
  sounds.push(loadSound('assets/sound/playerAsteroidCollision'));
}

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  frameRate(60);
  addScreenPositionFunction();

  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  callMethod = true;
  clicked = false;
  addBullet = false;
  paused = false;

  gameMode = 0;
  score = 0;
  numLives = 2;

  s = new Sound(sounds);

  let numStars = int((width * height) / (PI * sq(25)));
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }

  playBtn = new Btn(width / 2, height / 2 - 50, 300, 100, "Play", _font);
  helpBtn = new Btn(width / 2, height / 2 + 100, 300, 100, "Help", _font);

  zones.push(new Zone(-100, 0, 100, height));
  zones.push(new Zone(0, -100, width, 100));
  zones.push(new Zone(width, 0, 100, height));
  zones.push(new Zone(0, height, width, 100));


  let numAsteroids;
  if ((width * height * pixelDensity()) < 1000000) numAsteroids = 6;
  if ((width * height * pixelDensity()) > 1500000) numAsteroids = 12;

  for (let i = 0; i < numAsteroids; i++) {
    asteroids.set(i, new Asteroid(i));
  }

  p = new Player(width / 2, height / 2);

  lives.push(new Life(150, 25, 270));
  lives.push(new Life(200, 25, 270));
  lives.push(new Life(250, 25, 270));
}

function draw() {
  background(25);

  for (let z of zones) {
    z.display();
  }

  for (let s of stars) {
    s.display();
  }

  switch (gameMode) {
    case 0:
      menu();
      break;
    case 1:
      play();
      break;
    case 2:
      gameOver();
      break;
    case 3:
      help();
      break;
  }
}

function menu() {

  let asteroidsToDelete = [];
  for (let a of asteroids.values()) {
    a.display();
    a.update();
    if (a.spawn == false) a.checkBounds();
    if (a.offScreen == true && a.spawn == false) asteroidsToDelete.push(a);
  }

  for (let a of asteroidsToDelete) {
    let randomZone = int(random(0, 4));
    asteroids.set(a.id, new Asteroid(a.id, ));
  }

  playBtn.display();
  playBtn.checkMouseOver();
  if (playBtn.mouseOver && callMethod) {
    s.menuMoveSound();
    callMethod = false;
  }
  if (playBtn.mouseOver && clicked) {
    s.menuSelectSound();
    gameMode = 1;
  }
  helpBtn.display();
  helpBtn.checkMouseOver();
  if (helpBtn.mouseOver && callMethod) {
    s.menuMoveSound();
    callMethod = false;
  }
  if (helpBtn.mouseOver && clicked) {
    s.menuSelectSound();
    gameMode = 3;
  }
  if (playBtn.mouseOver == false && helpBtn.mouseOver == false) callMethod = true;
}

function play() {
  fill(255);
  textAlign(CENTER);
  textSize(36);
  textFont(_font);
  text("Lives: ", 80, 35);
  for (let l of lives) {
    l.display();
  }
  text("Score: " + str(score), width / 2, 35);

  let bulletsToDelete = [];
  if (p.collision == false) {
    p.display();
    p.update();
    p.checkBounds();

    for (let b of bullets) {
      b.display();
      b.update();
      b.checkBounds();
      if (b.offScreen) bulletsToDelete.push(b);
    }
  }
  // let startTime = millis();
  let asteroidsToDelete = [];
  for (let a of asteroids.values()) {
    a.display();
    a.update();
    if (a.spawn == false) {
      a.checkBounds();

        //asteroid - player collision
        a.checkHit(p.playerScreenCoords);
        if (a.hit) {
          s.playerAsteroidCollisionSound();
          //delete all asteroids then respawn them
          for (let as of asteroids.values()) {
            asteroidsToDelete.push(as);
          }
          p.pos.x = width / 2;
          p.pos.y = height / 2;
          p.speed.x = 0;
          p.speed.y = 0;
          if (lives.length > 0) {
            lives.pop();
            numLives--;
          }
          if (lives.length == 0) {
            s.endGameSound();
            gameMode = 2;
          }
          p.collision = false;
        }

        //asteroid - bullet collision here
        for (let b of bullets) {
          a.checkHit(b.bulletScreenCoords);
          if (a.hit) {
            s.asteroidHitSound();
            score += 10;
            bulletsToDelete.push(b);
            asteroidsToDelete.push(a);
          }
        }
    }
    if (a.offScreen == true && a.spawn == false) asteroidsToDelete.push(a);
  }
  // print(millis() - startTime);

  for (let a of asteroidsToDelete) {
    let randomZone = int(random(0, 4));
    asteroids.set(a.id, new Asteroid(a.id));
  }

  bullets = bullets.filter(function(el) {
    return !bulletsToDelete.includes(el);
  });
}

function gameOver() {
  fill(255);
  textAlign(CENTER);
  textFont(_font);
  textSize(75);
  text("Game Over", width / 2, height / 2);
  textSize(50);
  text("Score: " + str(score), width / 2, height / 2 + 50);
  text("Press enter to play again", width / 2, height / 2 + 100);
}

function help() {
  let spacing = 200;
  fill(255);
  textAlign(CENTER);
  textSize(28);
  textFont(_font);
  text("Use arrow keys to control your spacecraft.", width / 2, 45 + spacing);
  text("Use space to shoot the asteroids and avoid getting hit!", width / 2, 90 + spacing);
  text("You have 3 lives to try and achieve the top score.", width / 2, 135 + spacing);
  text("You can hit p to pause the game at any time.", width / 2, 180 + spacing);
  text("Enabling 'high performance' mode on your device", width / 2, 225 + spacing);
  text("could help with performance issues.", width / 2, 270 + spacing);
  text("Press backspace to return to the menu.", width / 2, 315 + spacing);
}

function keyPressed() {
  switch (keyCode) {
    case 37: //left
      isLeft = true;
      break;
    case 39: //right
      isRight = true;
      break;
    case 38: //up
      isUp = true;
      break;
    case 40: //down
      isDown = true;
      break;
    case 32: //space
      if (gameMode == 1) {
        bullets.push(new Bullet(p.front.x, p.front.y, p.angle));
        s.laserSound();
      }
      break;
    case 13: //enter
      if (gameMode == 2) {
        score = 0;
        numLives = 2;
        lives.push(new Life(150, 25, 270));
        lives.push(new Life(200, 25, 270));
        lives.push(new Life(250, 25, 270));
        gameMode = 0;
      }
      if (gameMode == 0) gameMode = 1;
      break;
    case 8: //backspace
      if (gameMode == 3) gameMode = 0;
      break;
    case 80: //p
      paused = !paused;
      if (paused) {
        s.pauseInSound();
        noLoop();
      } else {
        s.pauseOutSound();
        loop();
      }
  }
}

function keyReleased() {
  switch (keyCode) {
    case 37: //left
      isLeft = false;
      break;
    case 39: //right
      isRight = false;
      break;
    case 38: //up
      isUp = false;
      break;
    case 40: //down
      isDown = false;
      break;
  }
}

function mousePressed() {
  clicked = true;
}

function mouseReleased() {
  clicked = false;
}