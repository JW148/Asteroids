class Asteroid {

  constructor(id) {
    this.zoneParams = [];
    let randomZone = int(random(0,4));
    this.makeZones();
    this.x = this.zoneParams[randomZone][0];
    this.y = this.zoneParams[randomZone][1];
    this.speed = this.zoneParams[randomZone][2];
    this.rotSpeed = this.zoneParams[randomZone][3];
    this.dir = this.zoneParams[randomZone][4];
    this.id = id;
    this.zone = randomZone;


    this.polySides = 10;
    this.poly = [];
    this.asteroidScreenCoords = [];

    this.angle = 0;
    this.spawn = true;
    this.offScreen = false;
    this.hit = false;

    this.centerPoly();
  }

  makeZones() {
    let minSpeed = 1.5;
    let maxSpd = 4;
    let xMin = 50;
    let xMax = 55;
    let yMin = 50;
    let yMax = 55;
    let zone1 = [-random(xMin, xMax), random(300, height - 300), random(minSpeed, maxSpd), random(0.01, 0.08), random(330, 390)];
    let zone2 = [random(300, width - 300), -random(yMin, yMax), random(minSpeed, maxSpd), random(0.01, 0.08), random(60, 120)];
    let zone3 = [random(width + xMin, width + xMax), random(300, height - 300), random(minSpeed, maxSpd), random(0.01, 0.08), random(150, 210)];
    let zone4 = [random(300, width - 300), random(height + yMin, height + yMax), random(minSpeed, maxSpd), random(0.01, 0.08), random(240, 300)];
    this.zoneParams[0] = zone1;
    this.zoneParams[1] = zone2;
    this.zoneParams[2] = zone3;
    this.zoneParams[3] = zone4;
  }

  randomPolyPoints() {
    let a = 0;
    for (let i = 0; i < this.polySides; i++) {
      let x = cos(radians(a)) * random(30, 50);
      let y = sin(radians(a)) * random(30, 50);
      this.poly.push(createVector(x, y));
      a += random(15, 40);
    }
  }

  centerPoly() {
    this.randomPolyPoints();

    let smallestX = this.poly[0].x;
    let smallestY = this.poly[0].y;

    for (let i = 0; i < this.polySides; i++) {
      if (this.poly[i].x < smallestX) smallestX = this.poly[i].x;
      if (this.poly[i].y < smallestY) smallestY = this.poly[i].y;
    }

    let centerX;
    let centerY;
    let minX = this.poly[0].x;
    let maxX = this.poly[0].x;
    let minY = this.poly[0].y;
    let maxY = this.poly[0].y;
    for (let pv of this.poly) {
      if (pv.x < minX) minX = pv.x;
      if (pv.x > maxX) maxX = pv.x;
      if (pv.y < minY) minY = pv.y;
      if (pv.y > maxY) maxY = pv.y;
    }
    centerX = (maxX - minX) / 2;
    centerY = (maxY - minY) / 2;
    smallestX += centerX;
    smallestY += centerY;

    for (let pv of this.poly) {
      pv.x -= smallestX;
      pv.y -= smallestY;
    }
  }

  update() {
    this.x += cos(radians(this.dir)) * this.speed;
    this.y += sin(radians(this.dir)) * this.speed;
    if (this.spawn) this.checkSpawn(zones[this.zone].zoneScreenCoords);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle += this.rotSpeed);
    this.asteroidScreenCoords = this.pointsToScreenCoords(this.poly);
    stroke(255);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let pt of this.poly) {
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
    if (this.x > width + 100) this.offScreen = true;
    if (this.x < -100) this.offScreen = true;
    if (this.y > height + 100) this.offScreen = true;
    if (this.y < -100) this.offScreen = true;
  }

  checkSpawn(screenCoords) {
    this.spawn = this.polyPoly(screenCoords, this.asteroidScreenCoords);
  }

  checkHit(screenCoords) {
    this.hit = this.polyPoly(screenCoords, this.asteroidScreenCoords);
  }

  // POLYGON/POLYGON
  polyPoly(p1, p2) {

    // go through each of the vertices, plus the next vertex in the list
    let next = 0;
    for (let current=0; current<p1.length; current++) {

      // get next vertex in list
      // if we’ve hit the end, wrap around to 0
      next = current+1;
      if (next == p1.length) next = 0;

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = p1[current];    // c for “current”
      let vn = p1[next];       // n for “next”

      // now we can use these two points (a line) to compare to the
      // other polygon’s vertices using polyLine()
      let collision = this.polyLine(p2, vc.x, vc.y, vn.x, vn.y);
      if (collision) return true;

      // optional: check if the 2nd polygon is INSIDE the first
      collision = this.polyPoint(p1, p2[0].x, p2[0].y);
      if (collision) return true;
    }

    return false;
  }


  // POLYGON/LINE
  polyLine(vertices, x1, y1, x2, y2) {

    // go through each of the vertices, plus the next vertex in the list
    let next = 0;
    for (let current=0; current<vertices.length; current++) {

      // get next vertex in list
      // if we’ve hit the end, wrap around to 0
      next = current+1;
      if (next == vertices.length) next = 0;

      // get the PVectors at our current position
      // extract X/Y coordinates from each
      let x3 = vertices[current].x;
      let y3 = vertices[current].y;
      let x4 = vertices[next].x;
      let y4 = vertices[next].y;

      // do a Line/Line comparison
      // if true, return ‘true’ immediately and stop testing (faster)
      let hit = this.lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
      if (hit) {
        return true;
      }
    }

    // never got a hit
    return false;
  }


  // LINE/LINE
  lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

    // calculate the direction of the lines
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      return true;
    }
    return false;
  }


  // POLYGON/POINT
  // used only to check if the second polygon is INSIDE the first
  polyPoint(vertices, px, py) {
    let collision = false;

    // go through each of the vertices, plus the next vertex in the list
    let next = 0;
    for (let current=0; current<vertices.length; current++) {

      // get next vertex in list
      // if we’ve hit the end, wrap around to 0
      next = current+1;
      if (next == vertices.length) next = 0;

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = vertices[current];    // c for “current”
      let vn = vertices[next];       // n for “next”

      // compare position, flip ‘collision’ variable back and forth
      if ( ((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
        (px < (vn.x-vc.x) * (py-vc.y) / (vn.y-vc.y) + vc.x) ) {
        collision = !collision;
      }
    }
    return collision;
  }

}