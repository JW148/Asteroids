class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = 2;
    this.opacity = int(random(50, 255));
  }

  display() {
    fill(255, this.opacity);
    noStroke();
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
}