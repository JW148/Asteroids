class Zone {

  constructor(x, y, _width, _height) {
    this.x = x;
    this.y = y;
    this._width = _width;
    this._height = _height;

    this.zoneCoords = [];
    this.zoneCoords.push(createVector(0, 0));
    this.zoneCoords.push(createVector(this._width, 0));
    this.zoneCoords.push(createVector(this._width, this._height));
    this.zoneCoords.push(createVector(0, this._height));
    this.zoneScreenCoords = [];
  }

  display() {
    push();
    translate(this.x, this.y);
    this.zoneScreenCoords = this.pointsToScreenCoords(this.zoneCoords);
    fill(32);
    beginShape();
    for(let pt of this.zoneCoords){
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

}