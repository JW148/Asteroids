class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.playerCoords = [];
    this.playerCoords.push(createVector(37.5, 0));
    this.playerCoords.push(createVector(-37.5, -50));
    this.playerCoords.push(createVector(-12.5, 0));
    this.playerCoords.push(createVector(-37.5, 50));
    this.playerScreenCoords = [];

    this.angle = 0;
    this.speed = 0;
    this.maxSpeed = 6;
    this.friction = 0.98;
    this.collision = false;
    this.zone = true;
  }

  update() {
    if (isLeft && !isRight) this.angle -= 0.06;
    if (isRight && !isLeft) this.angle += 0.06;
    if (isUp && !isDown) {
      if (this.speed < this.maxSpeed) this.speed += 0.2;
      else this.speed = this.maxSpeed;
    }
    if (isDown && !isUp) {
      if (this.speed > -this.maxSpeed) this.speed -= 0.1;
      else this.speed = -this.maxSpeed;
    }
    if (!isUp && !isDown) {
      if (this.speed > 0 || this.speed < 0) {
        this.speed *= this.friction;
      } else {
        this.speed = 0;
      }
    }
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    this.playerScreenCoords=this.pointsToScreenCoords(this.playerCoords);
    // print(this.playerScreenCoords[0].x, this.playerScreenCoords[0].y);
    stroke(0, 247, 107);
    strokeWeight(4);
    noFill(0);
    beginShape();
    for(let pt of this.playerCoords){
       vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }

  pointsToScreenCoords(points) {
    let screenPoints = [];
    for (let i = 0; i < points.length; i++) {
      screenPoints.push(screenPosition(points[i]));
    }
    return screenPoints;
  }
  
  checkBounds() {
    if (this.x > width + 50) this.x -= (width+80);
    if (this.x < -50) this.x += (width+80);
    if (this.y > height + 50) this.y -= (height+80);
    if (this.y < -50) this.y += (height+80);
  }

}