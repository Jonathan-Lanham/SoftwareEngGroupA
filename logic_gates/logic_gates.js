let andGate, orGate, xorGate, notGate;

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
    } else if (this.type === "XOR") {
      this.output =
        (this.inputA && !this.inputB) || (!this.inputA && this.inputB);
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
    } else if (this.type === "XOR") {
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
      bezier(
        this.x - 5 * s,
        this.y,
        this.x + 5 * s,
        this.y + 10 * s,
        this.x + 5 * s,
        this.y + 40 * s,
        this.x - 5 * s,
        this.y + 50 * s
      );
      line(this.x, this.y, this.x + 30 * s, this.y);
      line(this.x, this.y + 50 * s, this.x + 30 * s, this.y + 50 * s);
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
    } else if (this.type === "XOR") {
      line(this.x - 20 * s, this.y + 10 * s, this.x + 5 * s, this.y + 10 * s);
      line(this.x - 20 * s, this.y + 40 * s, this.x + 5 * s, this.y + 40 * s);
    }

    // Output line
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // Input buttons
    fill(this.inputA ? "green" : "red");
    if (this.type === "AND" || this.type === "OR" || this.type === "XOR") {
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
    if (this.type === "AND" || this.type === "OR" || this.type === "NOT" || this.type === "XOR") {
      this.inputA = this.inputA ? 0 : 1;
    }
  }

  toggleInputB() {
    if (this.type === "AND" || this.type === "OR" || this.type === "XOR") {
      this.inputB = this.inputB ? 0 : 1;
    }
  }
}

function setup() {
  createCanvas(1000, 700);
  andGate = new LogicGate(100, 100, "AND", 1);
  orGate = new LogicGate(200, 200, "OR", 1);
  xorGate = new LogicGate(300, 300, "XOR", 1);
  notGate = new LogicGate(400, 400, "NOT", 1);
}

function draw() {
  background(220);
  andGate.update();
  orGate.update();
  notGate.update();
  xorGate.update();
  andGate.display();
  orGate.display();
  notGate.display();
  xorGate.display();
}

function mousePressed() {
  let sAnd = andGate.scalar,
    sOr = orGate.scalar,
    sXor = xorGate.scalar,
    sNot = notGate.scalar;

  // AND GATE
  if (dist(mouseX, mouseY, andGate.x - 20 * sAnd, andGate.y + 10 * sAnd) < 10 * sAnd) {
    andGate.toggleInputA();
  }
  if (dist(mouseX, mouseY, andGate.x - 20 * sAnd, andGate.y + 40 * sAnd) < 10 * sAnd) {
    andGate.toggleInputB();
  }

  // OR GATE
  if (dist(mouseX, mouseY, orGate.x - 20 * sOr, orGate.y + 10 * sOr) < 10 * sOr) {
    orGate.toggleInputA();
  }
  if (dist(mouseX, mouseY, orGate.x - 20 * sOr, orGate.y + 40 * sOr) < 10 * sOr) {
    orGate.toggleInputB();
  }

  // XOR GATE
  if (dist(mouseX, mouseY, xorGate.x - 20 * sXor, xorGate.y + 10 * sXor) < 10 * sXor) {
    xorGate.toggleInputA();
  }
  if (dist(mouseX, mouseY, xorGate.x - 20 * sXor, xorGate.y + 40 * sXor) < 10 * sXor) {
    xorGate.toggleInputB();
  }

  // NOT GATE
  if (
    dist(mouseX, mouseY, notGate.x - 20 * sNot, notGate.y + 25 * sNot) <
    10 * sNot
  ) {
    notGate.toggleInputA();
  }
}
