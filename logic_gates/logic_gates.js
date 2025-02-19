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

  // UPDATE OUTPUT
  update() {
    // AND GATE
    if (this.type === "AND") {
      this.output = this.inputA && this.inputB;
    }
    // OR GATE
    else if (this.type === "OR") {
      this.output = this.inputA || this.inputB;
    }
    // XOR GATE
    else if (this.type === "XOR") {
      this.output =
        (this.inputA && !this.inputB) || (!this.inputA && this.inputB);
    }
    // NOT GATE
    else if (this.type === "NOT") {
      this.output = !this.inputA;
    }
  }

  // DRAWING GATES
  display() {
    // STYLE SETTINGS (SIMULATE CSS)
    let gateColor = color(255, 204, 0);
    let inputColor = color(200);
    let outputColor = color(0, 255, 0);
    let inputHoverColor = color(0, 255, 0);
    let outputHoverColor = color(255, 0, 0);
    //
    let textsize = 15;
    let textColor = 'black';
    // 
    stroke(0);
    // 
    let s = this.scalar;
    // 
    textSize(textsize * s);
    // 
    // AND GATE
    if (this.type === "AND") {
      fill(textColor);
      text(this.type, this.x + 10 * s, this.y + 30 * s);
      noFill();
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
    }
    // OR GATE
    else if (this.type === "OR") {
      fill(textColor);
      text(this.type, this.x + 15 * s, this.y + 30 * s);
      noFill();
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
    }
    // XOR GATE
    else if (this.type === "XOR") {
      fill(textColor);
      text(this.type, this.x + 15 * s, this.y + 30 * s);
      noFill();
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
    // NOT GATE
    else if (this.type === "NOT") {
      fill(textColor);
      text(this.type, this.x + 2 * s, this.y + 30 * s);
      noFill();
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

    // INPUT LINES
    if (this.type === "AND") {
      line(this.x - 20 * s, this.y + 10 * s, this.x, this.y + 10 * s);
      line(this.x - 20 * s, this.y + 40 * s, this.x, this.y + 40 * s);
    } else if (this.type === "OR") {
      line(this.x - 20 * s, this.y + 10 * s, this.x + 5 * s, this.y + 10 * s);
      line(this.x - 20 * s, this.y + 40 * s, this.x + 5 * s, this.y + 40 * s);
    } else if (this.type === "XOR") {
      line(this.x - 20 * s, this.y + 10 * s, this.x + 5 * s, this.y + 10 * s);
      line(this.x - 20 * s, this.y + 40 * s, this.x + 5 * s, this.y + 40 * s);
    } else if (this.type === "NOT") {
      line(this.x - 20 * s, this.y + 25 * s, this.x, this.y + 25 * s);
    }

    // OUTPUT LINE
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // INPUT BUTTONS
    fill(this.inputA ? "green" : "red");
    if (this.type === "AND" || this.type === "OR" || this.type === "XOR") {
      ellipse(this.x - 20 * s, this.y + 10 * s, 15 * s, 15 * s);
      fill(this.inputB ? "green" : "red");
      ellipse(this.x - 20 * s, this.y + 40 * s, 15 * s, 15 * s);
    } else if (this.type === "NOT") {
      ellipse(this.x - 20 * s, this.y + 25 * s, 15 * s, 15 * s);
    }

    // OUTPUT
    fill(this.output ? "green" : "red");
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  // TOGGLE INPUT A
  toggleInputA() {
    if (
      this.type === "AND" ||
      this.type === "OR" ||
      this.type === "NOT" ||
      this.type === "XOR"
    ) {
      this.inputA = this.inputA ? 0 : 1;
    }
  }

  // TOGGLE INPUT B
  toggleInputB() {
    if (this.type === "AND" || this.type === "OR" || this.type === "XOR") {
      this.inputB = this.inputB ? 0 : 1;
    }
  }
}

function setup() {
  createCanvas(1000, 700);
  andGate = new LogicGate(100, 100, "AND", 2);
  orGate = new LogicGate(500, 100, "OR", 2);
  xorGate = new LogicGate(100, 350, "XOR", 2);
  notGate = new LogicGate(500, 350, "NOT", 2);
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

// TOGGLE INPUTS
function mousePressed() {
  let sAnd = andGate.scalar,
    sOr = orGate.scalar,
    sXor = xorGate.scalar,
    sNot = notGate.scalar;

  // AND GATE
  if (
    dist(mouseX, mouseY, andGate.x - 20 * sAnd, andGate.y + 10 * sAnd) <
    10 * sAnd
  ) {
    andGate.toggleInputA();
  }
  if (
    dist(mouseX, mouseY, andGate.x - 20 * sAnd, andGate.y + 40 * sAnd) <
    10 * sAnd
  ) {
    andGate.toggleInputB();
  }

  // OR GATE
  if (
    dist(mouseX, mouseY, orGate.x - 20 * sOr, orGate.y + 10 * sOr) <
    10 * sOr
  ) {
    orGate.toggleInputA();
  }
  if (
    dist(mouseX, mouseY, orGate.x - 20 * sOr, orGate.y + 40 * sOr) <
    10 * sOr
  ) {
    orGate.toggleInputB();
  }

  // XOR GATE
  if (
    dist(mouseX, mouseY, xorGate.x - 20 * sXor, xorGate.y + 10 * sXor) <
    10 * sXor
  ) {
    xorGate.toggleInputA();
  }
  if (
    dist(mouseX, mouseY, xorGate.x - 20 * sXor, xorGate.y + 40 * sXor) <
    10 * sXor
  ) {
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
