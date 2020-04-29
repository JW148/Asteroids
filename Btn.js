class Btn {
  constructor(x, y, _width, _height, s, f) {
    this.x = x;
    this.y = y;
    this._width = _width;
    this._height = _height;
    this.s = s;
    this.mouseOver = false;
    this.f = f;
  }

  display() {
    stroke(255);
    if (this.mouseOver) fill(255);
    else fill(0);
    rect(this.x - this._width / 2, this.y - this._height / 2, this._width, this._height);
    if (this.mouseOver) fill(0);
    else fill(255);
    push();
    translate(this.x - this._width / 2, this.y - this._height / 2);
    textAlign(CENTER);
    textFont(this.f);
    textSize(36);
    text(this.s, this._width / 2, this._height / 2 + 10);
    pop();
  }

  checkMouseOver() {
    if (mouseX >= this.x - this._width / 2 && mouseX <= this.x - this._width / 2 + this._width &&
      mouseY >= this.y - this._height / 2 && mouseY <= this.y - this._height / 2 + this._height) {
      this.mouseOver = true;
    } else {
      this.mouseOver = false;
    }
  }
}