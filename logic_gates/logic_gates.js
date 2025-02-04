let andGate, orGate, notGate;

class LogicGate {
  constructor(x, y, type, scalar = 1) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.scalar = scalar;
    this.inputA = 0;
    this.inputB = 0;
    this.output = 0;
  }

  update() {
    if (this.type === "AND") {
      this.output = this.inputA && this.inputB;
    } else if (this.type === "OR") {
      this.output = this.inputA || this.inputB;
    } else if (this.type === "NOT") {
      this.output = !this.inputA;
    }
  }

  display() {
    stroke(0);
    noFill();
    let s = this.scalar;
    if (this.type === "AND") {
      arc(
        this.x + 30 * s,
        this.y + 25 * s,
        60 * s,
        50 * s,
        PI + HALF_PI,
        TWO_PI + HALF_PI
      );
      line(this.x, this.y, this.x + 30 * s, this.y);
      line(this.x, this.y + 50 * s, this.x + 30 * s, this.y + 50 * s);
      line(this.x, this.y, this.x, this.y + 50 * s);
    } else if (this.type === "OR") {
      arc(
        this.x + 30 * s,
        this.y + 25 * s,
        60 * s,
        50 * s,
        PI + HALF_PI,
        TWO_PI + HALF_PI
      );
      bezier(
        this.x,
        this.y,
        this.x + 10 * s,
        this.y + 10 * s,
        this.x + 10 * s,
        this.y + 40 * s,
        this.x,
        this.y + 50 * s
      );
      line(this.x, this.y, this.x + 30 * s, this.y);
      line(this.x, this.y + 50 * s, this.x + 30 * s, this.y + 50 * s);
    } else if (this.type === "NOT") {
      triangle(
        this.x,
        this.y,
        this.x,
        this.y + 50 * s,
        this.x + 50 * s,
        this.y + 25 * s
      );
      circle(this.x + 55 * s, this.y + 25 * s, 10 * s);
    }

    // Input lines
    if (this.type === "AND") {
      line(this.x - 20 * s, this.y + 10 * s, this.x, this.y + 10 * s);
      line(this.x - 20 * s, this.y + 40 * s, this.x, this.y + 40 * s);
    } else if (this.type === "OR") {
      line(this.x - 20 * s, this.y + 10 * s, this.x + 5 * s, this.y + 10 * s);
      line(this.x - 20 * s, this.y + 40 * s, this.x + 5 * s, this.y + 40 * s);
    } else if (this.type === "NOT") {
      line(this.x - 20 * s, this.y + 25 * s, this.x, this.y + 25 * s);
    }

    // Output line
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // Input buttons
    fill(this.inputA ? "green" : "red");
    if (this.type === "AND" || this.type === "OR") {
      ellipse(this.x - 20 * s, this.y + 10 * s, 15 * s, 15 * s);
      fill(this.inputB ? "green" : "red");
      ellipse(this.x - 20 * s, this.y + 40 * s, 15 * s, 15 * s);
    } else if (this.type === "NOT") {
      ellipse(this.x - 20 * s, this.y + 25 * s, 15 * s, 15 * s);
    }

    // Output
    fill(this.output ? "green" : "red");
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  toggleInputA() {
    if (this.type === "AND" || this.type === "OR" || this.type === "NOT") {
      this.inputA = this.inputA ? 0 : 1;
    }
  }

  toggleInputB() {
    if (this.type === "AND" || this.type === "OR") {
      this.inputB = this.inputB ? 0 : 1;
    }
  }
}

function setup() {
  createCanvas(1000, 700);
  andGate = new LogicGate(100, 100, "AND", 2);
  orGate = new LogicGate(300, 300, "OR", 1);
  notGate = new LogicGate(600, 600, "NOT", 0.5);
}

function draw() {
  background(220);
  andGate.update();
  orGate.update();
  notGate.update();
  andGate.display();
  orGate.display();
  notGate.display();
}

function mousePressed() {
  let sA = andGate.scalar,
    sO = orGate.scalar,
    sN = notGate.scalar;

  if (
    dist(mouseX, mouseY, andGate.x - 20 * sA, andGate.y + 10 * sA) <
    10 * sA
  ) {
    andGate.toggleInputA();
  }
  if (
    dist(mouseX, mouseY, andGate.x - 20 * sA, andGate.y + 40 * sA) <
    10 * sA
  ) {
    andGate.toggleInputB();
  }

  if (dist(mouseX, mouseY, orGate.x - 20 * sO, orGate.y + 10 * sO) < 10 * sO) {
    orGate.toggleInputA();
  }
  if (dist(mouseX, mouseY, orGate.x - 20 * sO, orGate.y + 40 * sO) < 10 * sO) {
    orGate.toggleInputB();
  }

  if (
    dist(mouseX, mouseY, notGate.x - 20 * sN, notGate.y + 25 * sN) <
    10 * sN
  ) {
    notGate.toggleInputA();
  }
}
