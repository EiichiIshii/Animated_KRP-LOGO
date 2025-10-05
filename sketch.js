let num = 150;
let ps = new Array(num);
let w;

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = min(width, height);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100);

  for (let i = 0; i < num; i++) {
    ps[i] = new Particles(num);
  }
}

function draw() {
  background(0, 0, 0);

  for (let i = 0; i < num; i++) {
    ps[i].update();
    ps[i].display();
  }
}

class Particles {
  constructor(num) {
    this.x = random(-width / 4, width + width / 4);
    this.y = random(-height / 4, height + height / 4);
    this.sw = int(random(2));
    if (this.sw == 0) {
      this.amx = random(-1, 1);
      this.amy = 0;
    } else if (this.sw == 1) {
      this.amx = 0;
      this.amy = random(-1, 1);

    }
    this.r = random(w / 18, w / 6);
    this.hue = random([30, 60, 240]);
    this.sat = random([0, 100]);
    this.lgn = random(100);
    this.currentAngle = int(random(4)) * 90;
    this.targetAngle = 0;
    this.isRotating = false;
    this.rotateTimer = 0;
    this.rotateInterval = random(60, 180);
  }

  update() {
    this.x += this.amx;
    this.y += this.amy;

    if (this.x < -width / 4 || this.x > width + width / 4) {
      this.amx = -this.amx;
    }
    if (this.y < -height / 4 || this.y > height + height / 4) {
      this.amy = -this.amy;
    }

    this.rotateTimer++;
    if (!this.isRotating && this.rotateTimer > this.rotateInterval) {
      let dir = random([1, -1]);
      this.targetAngle = this.currentAngle + 90 * dir;
      this.isRotating = true;
      this.rotateTimer = 0;
      this.rotateInterval = random(60, 180);

      this.sw = int(random(2));
      if (this.sw == 0) {
        this.amx = random(-1, 1);
        this.amy = 0;
      } else if (this.sw == 1) {
        this.amx = 0;
        this.amy = random(-1, 1);

      }
    }

    if (this.isRotating) {
      let diff = this.targetAngle - this.currentAngle;
      this.currentAngle += diff * 0.15;
      if (abs(diff) < 0.5) {
        this.currentAngle = this.targetAngle;
        this.isRotating = false;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    rotate(this.currentAngle);

    let ag = 360 / 6;
    let r = this.r / 1.5;
    let lr = r / 10;
    let lgt = map(noise(this.lgn), 0, 1, 0, 100);
    this.lgn += 0.05;

    translate(0, -lr * 1.05);
    scale(1.5);
    scale(0.9, 0.8);

    push();
    scale(1.1, 1);
    fill(this.hue, this.sat, lgt);
    noStroke();
    beginShape();
    vertex(
      (r / 2 + lr / 2) * cos(180 + ag / 2),
      (r / 2) * sin(180 + ag / 2)
    );
    vertex((r / 2 + lr / 2) * cos(270), (r / 2) * sin(270));
    vertex(
      (r / 2 + lr / 2) * cos(360 - ag / 2),
      (r / 2) * sin(360 - ag / 2)
    );
    vertex(
      (r / 2 + lr / 2) * cos(360 - ag / 2),
      (r / 2) * sin(360 - ag / 2) + lr * 1.5
    );
    vertex((r / 2 + lr / 2) * cos(270), (r / 2) * sin(270) + lr * 1.9);
    vertex(
      (r / 2 + lr / 2) * cos(180 + ag / 2),
      (r / 2) * sin(180 + ag / 2) + lr * 1.5
    );
    endShape();
    pop();

    stroke(this.hue, this.sat, lgt);
    strokeWeight(lr * 1.5);
    noFill();
    translate(0, r / 4);

    beginShape();
    for (let a = 90; a <= 360 + 90; a += ag) {
      vertex((r / 2) * cos(a), (r / 3) * sin(a));
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let i = 0; i < num; i++) {
    ps[i] = new Particles(num);
  }
}
