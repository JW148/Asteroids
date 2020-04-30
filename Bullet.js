class Bullet {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.angle = angle;

    this.coords = [];
    this.size = 3;
    this.coords.push(createVector(-this.size, -this.size));
    this.coords.push(createVector(this.size, -this.size));
    this.coords.push(createVector(this.size, this.size));
    this.coords.push(createVector(-this.size, this.size));
    this.bulletScreenCoords = [];

    this.speed = 10;
    this.collision = false;
    this.offScreen = false;
  }

  update() {
    this.pos.x += cos(this.angle) * this.speed;
    this.pos.y += sin(this.angle) * this.speed;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    this.bulletScreenCoords = this.pointsToScreenCoords(this.coords);
    noStroke(0);
    fill(255);
    beginShape();
    for (let pt of this.coords) {
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
    if (this.pos.x < 5 || this.pos.x > width + 5) this.offScreen =  true;
    else if (this.pos.y < 5 || this.pos.y > height + 5) this.offScreen = true;
    else this.offScreen =  false;
  }
}