class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
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
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  display() {
    push();
    translate(this.x, this.y);
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
    if (this.x < 5 || this.x > width + 5) this.offScreen =  true;
    else if (this.y < 5 || this.y > height + 5) this.offScreen = true;
    else this.offScreen =  false;
  }
}