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
    line(this.x - 20 * s, this.y + 10 * s, this.x, this.y + 10 * s);
    if (this.type !== "NOT") {
      line(this.x - 20 * s, this.y + 40 * s, this.x, this.y + 40 * s);
    }

    // Output line
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // Input buttons
    fill(this.inputA ? "green" : "red");
    ellipse(this.x - 20 * s, this.y + 10 * s, 15 * s, 15 * s);
    if (this.type !== "NOT") {
      fill(this.inputB ? "green" : "red");
      ellipse(this.x - 20 * s, this.y + 40 * s, 15 * s, 15 * s);
    }

    // Output
    fill(this.output ? "green" : "red");
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  toggleInputA() {
    this.inputA = this.inputA ? 0 : 1;
  }

  toggleInputB() {
    this.inputB = this.inputB ? 0 : 1;
  }
}

function setup() {
  createCanvas(400, 200);
  andGate = new LogicGate(150, 30, "AND", 1);
  orGate = new LogicGate(150, 100, "OR", 1);
  notGate = new LogicGate(300, 65, "NOT", 1);
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
  if (
    dist(
      mouseX,
      mouseY,
      andGate.x - 20 * andGate.scalar,
      andGate.y + 10 * andGate.scalar
    ) <
    10 * andGate.scalar
  )
    andGate.toggleInputA();
  if (
    dist(
      mouseX,
      mouseY,
      andGate.x - 20 * andGate.scalar,
      andGate.y + 40 * andGate.scalar
    ) <
    10 * andGate.scalar
  )
    andGate.toggleInputB();
  if (
    dist(
      mouseX,
      mouseY,
      orGate.x - 20 * orGate.scalar,
      orGate.y + 10 * orGate.scalar
    ) <
    10 * orGate.scalar
  )
    orGate.toggleInputA();
  if (
    dist(
      mouseX,
      mouseY,
      orGate.x - 20 * orGate.scalar,
      orGate.y + 40 * orGate.scalar
    ) <
    10 * orGate.scalar
  )
    orGate.toggleInputB();
  if (
    dist(
      mouseX,
      mouseY,
      notGate.x - 20 * notGate.scalar,
      notGate.y + 10 * notGate.scalar
    ) <
    10 * notGate.scalar
  )
    notGate.toggleInputA();
}
