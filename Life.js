class Life {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;

    this.playerCoords = [];
    this.playerCoords.push(createVector(37.5, 0));
    this.playerCoords.push(createVector(-37.5, -50));
    this.playerCoords.push(createVector(-12.5, 0));
    this.playerCoords.push(createVector(-37.5, 50));

    this.coords = [];
    for (let i = 0; i < this.playerCoords.length; i++) {
      this.coords.push(this.playerCoords[i].div(3));
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    noStroke();
    fill(255);
    beginShape();
    for(let pt of this.coords){
       vertex(pt.x, pt.y); 
    }
    endShape(CLOSE);
    pop();
  }
}