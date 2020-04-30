class Player {
  constructor(x, y) {
    this.pos = createVector(x, y);

    this.playerCoords = [];
    this.playerCoords.push(createVector(37.5, 0));
    this.playerCoords.push(createVector(-37.5, -50));
    this.playerCoords.push(createVector(-12.5, 0));
    this.playerCoords.push(createVector(-37.5, 50));
    this.playerScreenCoords = [];
    
    this.front = createVector(0,0);

    this.angle = 0;
    this.speed = createVector(0, 0);
    this.maxSpeed = 6;
    this.friction = 0.99;
    this.collision = false;
    this.zone = true;
  }

  update() {
    if (isLeft && !isRight) this.angle -= 0.065;
    if (isRight && !isLeft) this.angle += 0.065;
    if (isUp && !isDown) {
      this.boost();
    }
    this.pos.add(this.speed);
    this.speed.mult(this.friction);
  }

  boost() {
    let force = p5.Vector.fromAngle(this.angle);
    force.mult(0.2);
    this.speed.limit(9);
    this.speed.add(force);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    this.playerScreenCoords = this.pointsToScreenCoords(this.playerCoords);
    this.front = screenPosition(this.playerCoords[0]);
    stroke(0, 247, 107);
    strokeWeight(2);
    noFill(0);
    beginShape();
    for (let pt of this.playerCoords) {
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
    if (this.pos.x > width + 50) this.pos.x -= (width + 80);
    if (this.pos.x < -50) this.pos.x += (width + 80);
    if (this.pos.y > height + 50) this.pos.y -= (height + 80);
    if (this.pos.y < -50) this.pos.y += (height + 80);
  }

}