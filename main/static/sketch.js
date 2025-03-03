//width, height of each gate
gateSizeWidth = 60
gateSizeHeight = 50

//global hash object for updating gate output
const gateLogic = {
  "AND": (a, b) => a && b,
  "OR": (a, b) => a || b,
  "XOR": (a, b) => (a && !b) || (!a && b),
  "NOT": (a) => !a
};

class GateObject {
  constructor(x, y, scalar = 1) {

    //2D coordinates for logic gate object
    this.x = x;
    this.y = y;

    this.offsetX = 0
    this.offsetY = 0

    this.scalar = scalar;

    this.output = false;

  }

  display() { };
  update() { };
}

class AndGate extends LogicGate {
  constructor(x, y, scalar = 1) {
    super(x, y);

    this.inputA = false;
    this.inputB = false;
  }

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
    strokeWeight(1);
    // 
    let s = this.scalar;
    // 
    textSize(textsize * s);
    // 

    fill(textColor);
    text(this.type, this.x + 25 * s, this.y + 27 * s);
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


    // INPUT LINES
    line(this.x - 20 * s, this.y + 10 * s, this.x, this.y + 10 * s);
    line(this.x - 20 * s, this.y + 40 * s, this.x, this.y + 40 * s);

    // OUTPUT LINE
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // INPUT BUTTONS
    fill(this.inputA ? "green" : "red");
    ellipse(this.x - 20 * s, this.y + 10 * s, 15 * s, 15 * s);
    fill(this.inputB ? "green" : "red");
    ellipse(this.x - 20 * s, this.y + 40 * s, 15 * s, 15 * s);

    // OUTPUT
    fill(this.output ? "green" : "red");
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  update() {

    //update position of gate(s) being dragged, if any
    for (let dragged_gate of gates_being_dragged) {
      dragged_gate.x = mouseX - dragged_gate.offsetX;
      dragged_gate.y = mouseY - dragged_gate.offsetY;
    }

    let s = this.scalar;
    let color = get(this.x - 20 * s, this.y + 10 * s,);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputA = true;
    }
    else {
      this.inputA = false;
    }

    color = get(this.x - 20 * s, this.y + 40 * s);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputB = true;
    }
    else {
      this.inputB = false;
    }

    this.output = gateLogic[this.type](this.inputA, this.inputB)
  }

  //Check if the mouse position is over a logic gate
  isMouseOver() {
    return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
      mouseY > this.y && mouseY < this.y + gateSizeHeight);
  }
}

class OrGate extends LogicGate {
  constructor(x, y, scalar = 1) {
    super(x, y);

    this.inputA = false;
    this.inputB = false;
  }

  // DRAWING GATES
  display() {
    // STYLE SETTINGS (SIMULATE CSS)
    let gateColor = color(255, 204, 0);
    let inputColor = color(200);
    let outputColor = color(0, 255, 0);
    let inputHoverColor = color(0, 255, 0);
    let outputHoverColor = color(255, 0, 0);

    let textsize = 15;
    let textColor = 'black';

    stroke(0);
    strokeWeight(1);

    let s = this.scalar;
    textSize(textsize * s);

    fill(textColor);
    text(this.type, this.x + 28 * s, this.y + 27 * s);
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


    // INPUT LINES
    line(this.x - 20 * s, this.y + 10 * s, this.x + 5 * s, this.y + 10 * s);
    line(this.x - 20 * s, this.y + 40 * s, this.x + 5 * s, this.y + 40 * s);

    // OUTPUT LINE
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // INPUT BUTTONS
    fill(this.inputA ? "green" : "red");
    ellipse(this.x - 20 * s, this.y + 10 * s, 15 * s, 15 * s);
    fill(this.inputB ? "green" : "red");
    ellipse(this.x - 20 * s, this.y + 40 * s, 15 * s, 15 * s);

    // OUTPUT
    fill(this.output ? "green" : "red");
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  update() {

    //update position of gate(s) being dragged, if any
    for (let dragged_gate of gates_being_dragged) {
      dragged_gate.x = mouseX - dragged_gate.offsetX;
      dragged_gate.y = mouseY - dragged_gate.offsetY;
    }

    let s = this.scalar;

    let color = get(this.x - 20 * s, this.y + 10 * s,);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputA = true;
    }
    else {
      this.inputA = false;
    }

    color = get(this.x - 20 * s, this.y + 40 * s);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputB = true;
    }
    else {
      this.inputB = false;
    }

    this.output = gateLogic[this.type](this.inputA, this.inputB)
  }

  //Check if the mouse position is over a logic gate
  isMouseOver() {
    return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
      mouseY > this.y && mouseY < this.y + gateSizeHeight);
  }
}

class XorGate extends GateObject {
  constructor(x, y, scalar = 1) {
    super(x, y);

    this.inputA = false;
    this.inputB = false;
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
    strokeWeight(1);
    // 
    let s = this.scalar;
    // 
    textSize(textsize * s);
    // 

    fill(textColor);
    text(this.type, this.x + 30 * s, this.y + 27 * s);
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



    line(this.x - 20 * s, this.y + 10 * s, this.x + 5 * s, this.y + 10 * s);
    line(this.x - 20 * s, this.y + 40 * s, this.x + 5 * s, this.y + 40 * s);

    // OUTPUT LINE
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // INPUT BUTTONS
    fill(this.inputA ? "green" : "red");

    ellipse(this.x - 20 * s, this.y + 10 * s, 15 * s, 15 * s);
    fill(this.inputB ? "green" : "red");
    ellipse(this.x - 20 * s, this.y + 40 * s, 15 * s, 15 * s);

    // OUTPUT
    fill(this.output ? "green" : "red");
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  update() {

    //update position of gate(s) being dragged, if any
    for (let dragged_gate of gates_being_dragged) {
      dragged_gate.x = mouseX - dragged_gate.offsetX;
      dragged_gate.y = mouseY - dragged_gate.offsetY;
    }

    let s = this.scalar;

    let color = get(this.x - 20 * s, this.y + 10 * s,);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputA = true;
    }
    else {
      this.inputA = false;
    }

    color = get(this.x - 20 * s, this.y + 40 * s);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputB = true;
    }
    else {
      this.inputB = false;
    }

    this.output = gateLogic[this.type](this.inputA, this.inputB)
  }

  //Check if the mouse position is over a logic gate
  isMouseOver() {
    return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
      mouseY > this.y && mouseY < this.y + gateSizeHeight);
  }
}

//Class for logic gates, will likely be moved out of this main file.
class NotGate {
  constructor(x, y, scalar = 1) {
    super(x, y);

    this.input = false;
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
    strokeWeight(1);
    // 
    let s = this.scalar;
    // 
    textSize(textsize * s);
    // 

    fill(textColor);
    text(this.type, this.x + 19 * s, this.y + 27 * s);
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



    line(this.x - 20 * s, this.y + 25 * s, this.x, this.y + 25 * s);


    // OUTPUT LINE
    line(this.x + 60 * s, this.y + 25 * s, this.x + 80 * s, this.y + 25 * s);

    // INPUT BUTTONS
    fill(this.input ? "green" : "red");

    if (this.input == false && this.output == false) {
      fill("grey");
    }
    ellipse(this.x - 20 * s, this.y + 25 * s, 15 * s, 15 * s);


    // OUTPUT
    fill(this.output ? "green" : "red");
    if (this.input == false && this.output == false) {
      fill("grey");
    }
    ellipse(this.x + 80 * s, this.y + 25 * s, 15 * s, 15 * s);
  }

  update() {

    //update position of gate(s) being dragged, if any
    for (let dragged_gate of gates_being_dragged) {
      dragged_gate.x = mouseX - dragged_gate.offsetX;
      dragged_gate.y = mouseY - dragged_gate.offsetY;
    }

    let s = this.scalar;

    let color = get(this.x - 20 * s, this.y + 25 * s);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.inputA = true;
      this.output = false;
    }
    else if (color[1] === 0 && color[2] === 0 && color[0] > 0) {
      this.inputA = false;
      this.output = true;
    }
    else {
      this.inputA = false;
      this.output = false;
    }
  }

  // //Check if the mouse position is over a logic gate
  isMouseOver() {
    return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
      mouseY > this.y && mouseY < this.y + gateSizeHeight);
  }
  // // TOGGLE INPUT A
  // toggleInputA() {
  //   if (
  //     this.type === "AND" ||
  //     this.type === "OR" ||
  //     this.type === "NOT" ||
  //     this.type === "XOR"
  //   ) {
  //     this.inputA = this.inputA ? 0 : 1;
  //   }
  // }

  // // TOGGLE INPUT B
  // toggleInputB() {
  //   if (this.type === "AND" || this.type === "OR" || this.type === "XOR") {
  //     this.inputB = this.inputB ? 0 : 1;
  //   }
  // }
}

class Connection extends GateObject {
  constructor(startX, startY, endX, endY, scalar = 1) {

    //2D coordinates for start and end points
    super(startX, startY);
    this.endX = endX;
    this.endY = endY;

    this.scalar = scalar;

    this.input = false;

  }

  display() {
    stroke(0);
    strokeWeight(3);
    let s = this.scalar;

    line(this.x, this.y, (this.endX + this.x) / 2, this.y);
    line((this.endX + this.x) / 2, this.y, (this.endX + this.x) / 2, this.endY);
    line((this.endX + this.x) / 2, this.endY, this.endX, this.endY);

    fill(this.output ? "green" : "red");
    strokeWeight(1);
    ellipse(this.x * s, this.y * s, 15 * s, 15 * s);
    ellipse(this.endX * s, this.endY * s, 15 * s, 15 * s);
  }

  update() {
    let color = get(this.x, this.y);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.input = true;
    }
    else {
      this.input = false;
    }
    this.output = this.input;

  }
}

class EntrancePoint {
  constructor(x, y, state, scalar = 1) {

    //2D coordinates for start and end points
    this.x = x;
    this.y = y;

    this.scalar = scalar;

    this.state = state;
  }

  display() {
    stroke(0);
    strokeWeight(3);
    let s = this.scalar

    fill(this.state ? "green" : "red");
    strokeWeight(1);
    ellipse(this.x * s, this.y * s, 15 * s, 15 * s);
  }
}

class ExitPoint {
  constructor(x, y, scalar = 1) {

    //2D coordinates for start and end points
    this.x = x;
    this.y = y;

    this.scalar = scalar;

    this.state = false;
  }

  display() {
    stroke(0);
    let s = this.scalar;

    fill(this.state ? "green" : "red");
    strokeWeight(1);
    ellipse(this.x * s, this.y * s, 15 * s, 15 * s);
  }

  update() {
    let color = get(this.x, this.y);
    if (color[0] === 0 && color[2] === 0 && color[1] > 0) {
      this.state = true;
    }
    else {
      this.state = false;
    }
  }
}

// Button parent class, gonna need to add a mousee event to this
class Button {
  constructor(x, y) {
    // Coordinates for where the button will be placed
    this.x = x;
    this.y = y;
    this.name = "BUTTON";
    this.color = "Green";
  }
  // Action: Overrided by child class perform an action upon the button being pressed
  action() { };

  isMouseOver() {
    return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
      mouseY > this.y && mouseY < this.y + gateSizeHeight);
  }

  // Display: Displays the button on the screen
  display() {
    stroke(0);
    fill(this.color);
    rect(this.x, this.y, gateSizeWidth, gateSizeHeight, 10);
    textAlign(CENTER, CENTER);
    text(this.name, this.x + 30, this.y + 20);
  }
}

class PlusButton extends Button {
  constructor(x, y) {
    super(x, y);
    this.name = "+"
    this.open = false;
  }
  action() {
    if (!this.open) {
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight, "AND"));
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight * 2, "OR"));
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight * 3, "XOR"));
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight * 4, "NOT"));
      this.open = true;
    }
    else {
      for (let i = 0; i < 4; i++) buttons.pop();
      this.open = false;
    }
  }
}

class GateInsertButton extends Button {
  constructor(x, y, gateName) {
    super(x, y);
    this.name = gateName;
  }
  action() {
    gates.push(new LogicGate(this.x + 100, this.y, this.name));
  }
}

class DeleteButton extends Button {
  constructor(x, y) {
    super(x, y);
    this.name = "Delete";
    this.color = "Red";
  }
}

//Will be used to store all gates currently on screen. Work in progress.
let gates = [];
let gates_being_dragged = [];

let connections = [];
let startPoints = [];
let endPoints = [];

function mouseReleased() {
  gates_being_dragged = []; // Clear all dragged objects on release
}

// List for buttons
let buttons = [];
let deleteButton;

//Initial setup; Only runs once
// "It can be used to set default values for your project."
//We may need to move things from here to "draw()" if they should be updated every frame, eg window size?
function setup() {

  //Create the Canvas based on the width and height of the window
  //AKA, the canvas element takes up the entire page.
  //If we want to do some html/css design, then we will have to readjust this.
  createCanvas(1100, 600);

  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas = createCanvas(1100, 600);
  canvas.position(x, y);

  canvas.style('border', '2px solid black');

  //Set the background color to that intriguing shade of blue.
  background('#4287f5');

  // Place buttons on screen
  buttons.push(new PlusButton(200, 500));
  deleteButton = new DeleteButton(500, 500);

  //Initialize a gate? work in progress, will need to reference a "level database" for initializing "puzzles"
  //Reference local storage for gates.
  const storedObjects = localStorage.getItem('initialize_objects');
  console.log(storedObjects);

  if (storedObjects) {
    const initialize_objects = JSON.parse(storedObjects);
    console.log(initialize_objects);
    console.log(initialize_objects.Name);
    document.getElementById("Level-Name").innerHTML = initialize_objects.Name;

    for (let g of initialize_objects.Gates) {
      if (g.type === "AND"){
        gates.push(new AndGate(g.x, g.y));
      }
      else if (g.type === "OR"){
        gates.push(new OrGate(g.x, g.y));
      }
      else if (g.type === "XOR"){
        gates.push(new XorGate(g.x, g.y));
      }
      else if (g.type === "NOT"){
        gates.push(new NotGate(g.x, g.y));
      }
    }

    for (let c of initialize_objects.Connections) {
      connections.push(new Connection(c.startX, c.startY, c.endX, c.endY));
    }

    for (let s of initialize_objects.Start) {
      startPoints.push(new EntrancePoint(s.x, s.y, s.state));
      print(s.x);
      print(s.y);
      print(s.state);
    }

    for (let e of initialize_objects.End) {
      endPoints.push(new ExitPoint(e.x, e.y));
    }
  } else {

    window.location.href = "../templates/level_select.html";

  }

  // === OPTIONS MENU LOGIC ===
  const optionsBtn = document.getElementById("options-btn");
  const optionsMenu = document.getElementById("options-menu");
  const closeOptions = document.getElementById("close-options");
  const backToMain = document.getElementById("back-to-main");

  optionsBtn.addEventListener("click", () => {
    optionsMenu.classList.toggle("show");
  });

  closeOptions.addEventListener("click", () => {
    optionsMenu.classList.remove("show");
  });

  backToMain.addEventListener("click", () => {
    window.location.href = "../templates/index.html";
  });

  document.addEventListener("click", (event) => {
    if (!optionsBtn.contains(event.target) && !optionsMenu.contains(event.target)) {
      optionsMenu.classList.remove("show");
    }
  });

  // Handle volume control
  const volumeSlider = document.getElementById("volume-slider");
  volumeSlider.addEventListener("input", (event) => {
    console.log("Volume:", event.target.value);
    // Add logic to update game sound volume
  });

  // Handle music control
  const musicSlider = document.getElementById("music-slider");
  musicSlider.addEventListener("input", (event) => {
    console.log("Music Volume:", event.target.value);
    // Add logic to update background music
  });
}

// "draw() is called directly after setup()"
// "Executes the lines of code inside its curly brackets 60 times per second until the program is stopped or the noLoop() function is called."
function draw() {

  //If you want to see something fun, comment this out
  background('#4287f5');

  // For each loop that displays each button in buttons
  for (let button of buttons) {
    button.display();
  }
  deleteButton.display();

  for (let start of startPoints) {
    start.display();
  }

  //Loops over every gate, and updates it
  for (let gate of gates) {
    //console.log(mouseX, mouseY)
    gate.update();
    gate.display();

    // Bugged: Can delete more than one gate at once
    if (gate.x > deleteButton.x && gate.x < deleteButton.x + gateSizeWidth &&
      gate.y > deleteButton.y && gate.y < deleteButton.y + gateSizeHeight) {
      gates.splice(gates.indexOf(gate), 1);
    }
  }

  for (let connection of connections) {
    connection.update();
    connection.display();
  }

  for (let gate of gates) {
    //console.log(mouseX, mouseY)
    gate.update();
    gate.display();

    // Bugged: Can delete more than one gate at once
    if (gate.x > deleteButton.x && gate.x < deleteButton.x + gateSizeWidth &&
      gate.y > deleteButton.y && gate.y < deleteButton.y + gateSizeHeight) {
      gates.splice(gates.indexOf(gate), 1);
    }
  }

  for (let connection of connections) {
    connection.update();
    connection.display();
  }

  for (let gate of gates) {
    //console.log(mouseX, mouseY)
    gate.update();
    gate.display();

    // Bugged: Can delete more than one gate at once
    if (gate.x > deleteButton.x && gate.x < deleteButton.x + gateSizeWidth &&
      gate.y > deleteButton.y && gate.y < deleteButton.y + gateSizeHeight) {
      gates.splice(gates.indexOf(gate), 1);
    }
  }

  for (let connection of connections) {
    connection.update();
    connection.display();
  }

  for (let end of endPoints) {
    end.update();
    end.display();
  }
}

// TOGGLE INPUTS
//Messy RN, but it works. Refactor later.
function mousePressed() {

  for (let button of buttons) {
    if (button.isMouseOver()) {
      button.action();
    }
  }

  for (let gate of gates) {

    if (gate.isMouseOver()) {
      console.log("over")
      gate.offsetX = mouseX - gate.x
      gate.offsetY = mouseY - gate.y
      gates_being_dragged.push(gate)
    }

    // No longer works and is not needed
    // if (gate.type != "NOT") {
    //   if (
    //     dist(mouseX, mouseY, gate.x - 20 * gate.scalar, gate.y + 10 * gate.scalar) <
    //     10 * gate.scalar
    //   ) {
    //     gate.toggleInputA();
    //   }
    //   if (
    //     dist(mouseX, mouseY, gate.x - 20 * gate.scalar, gate.y + 40 * gate.scalar) <
    //     10 * gate.scalar
    //   ) {
    //     gate.toggleInputB();
    //   }
    // } else {
    //   // NOT GATE
    //   if (
    //     dist(mouseX, mouseY, gate.x - 20 * gate.scalar, gate.y + 25 * gate.scalar) <
    //     10 * gate.scalar
    //   ) {
    //     gate.toggleInputA();
    //   }
    // }
  }
}


