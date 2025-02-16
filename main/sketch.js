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

//Class for logic gates, will likely be moved out of this main file.
class LogicGate {
    constructor(x, y, type, scalar = 1) {
        
        //2D coordinates for logic gate object
        this.x = x;
        this.y = y;

        this.offsetX = 0
        this.offsetY = 0

        //What type of logic gate it is? AND, OR, etc?
        //Will either be a string, or we might mess around with inheritance.
        this.type = type;

        this.scalar = scalar;

        //2 bits for input sources, 1 for output
        this.inputA = false;
        this.inputB = false;
        this.output = false;

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
    update() {

        //update position of gate(s) being dragged, if any
        for (let dragged_gate of gates_being_dragged){
            dragged_gate.x = mouseX - dragged_gate.offsetX;
            dragged_gate.y = mouseY - dragged_gate.offsetY;
        }

        //references global hashmap to run gate logic
        this.output = gateLogic[this.type](this.inputA, this.inputB)

    }
    //Check if the mouse position is over a logic gate
    isMouseOver() {
        return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
               mouseY > this.y && mouseY < this.y + gateSizeHeight);
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

// Button parent class, gonna need to add a mousee event to this
class Button
{
    constructor(x, y)
    {
        // Coordinates for where the button will be placed
        this.x = x; 
        this.y = y;  
        this.name = "BUTTON";
        this.color = "Green";
    }
    // Action: Overrided by child class perform an action upon the button being pressed
    action() {};

    isMouseOver() 
    {
      return (mouseX > this.x && mouseX < this.x + gateSizeWidth &&
             mouseY > this.y && mouseY < this.y + gateSizeHeight);
    }

    // Display: Displays the button on the screen
    display()
    {
      stroke(0);
      fill(this.color);
      rect(this.x, this.y, gateSizeWidth, gateSizeHeight, 10);
      textAlign(CENTER, CENTER);
      text(this.name, this.x + 30, this.y + 20);
    }
}

class PlusButton extends Button
{ 
  constructor(x, y)
  {
    super(x, y);
    this.name = "+"
    this.open = false; 
  }
  action()
  {
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight, "AND"));
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight*2, "OR"));
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight*3, "XOR"));
      buttons.push(new GateInsertButton(this.x, this.y - gateSizeHeight*4, "NOT"));
  }
}

class GateInsertButton extends Button
{
  constructor(x, y, gateName)
  {
    super(x, y);
    this.name = gateName;
  }
  action()
  {
    gates.push(new LogicGate(this.x + 100, this.y, this.name));
  }
}

class DeleteButton extends Button
{
  constructor(x, y)
  {
    super(x, y);
    this.name = "Delete";
    this.color = "Red";
  }
}

//Will be used to store all gates currently on screen. Work in progress.
let gates = [];
let gates_being_dragged = [];

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

    //Set the background color to that intriguing shade of blue.
    background('#4287f5');

    // Place buttons on screen
    buttons.push(new PlusButton(200, 500));
    deleteButton = new DeleteButton(500, 500);

    //Initialize a gate? work in progress, will need to reference a "level database" for initializing "puzzles"
    gates.push(new LogicGate(100, 100, "AND"));
    gates.push(new LogicGate(500, 100, "OR"));
    gates.push(new LogicGate(100, 350, "XOR"));
    gates.push(new LogicGate(500, 350, "NOT"));
}

// "draw() is called directly after setup()"
// "Executes the lines of code inside its curly brackets 60 times per second until the program is stopped or the noLoop() function is called."
function draw() {

    //If you want to see something fun, comment this out
    background('#4287f5');

    
    // For each loop that displays each button in buttons
    for (let button of buttons)
    {
        button.display();
    }
    deleteButton.display();

    //Loops over every gate, and updates it
    for (let gate of gates) {
        //console.log(mouseX, mouseY)
        gate.update();
        gate.display();
        
        // Bugged: Can delete more than one gate at once
        if (gate.x > deleteButton.x && gate.x < deleteButton.x + gateSizeWidth &&
          gate.y > deleteButton.y && gate.y < deleteButton.y + gateSizeHeight)
        {
          gates.pop(gate);
        }
    }
   
}

// TOGGLE INPUTS
//Messy RN, but it works. Refactor later.
function mousePressed() {

    for (let button of buttons)
    {
      if (button.isMouseOver())
      {
        button.action();
      }
    }

    for (let gate of gates){

        if (gate.isMouseOver()){
            console.log("over")
            gate.offsetX = mouseX - gate.x
            gate.offsetY = mouseY - gate.y
            gates_being_dragged.push(gate)
        }

        if (gate.type != "NOT"){
            if (
                dist(mouseX, mouseY, gate.x - 20 * gate.scalar, gate.y + 10 * gate.scalar) <
                10 * gate.scalar
            ) {
                gate.toggleInputA();
            }
            if (
                dist(mouseX, mouseY, gate.x - 20 * gate.scalar, gate.y + 40 * gate.scalar) <
                10 * gate.scalar
            ) {
                gate.toggleInputB();
            }
        } else{
              // NOT GATE
                if (
                    dist(mouseX, mouseY, gate.x - 20 * gate.scalar, gate.y + 25 * gate.scalar) <
                    10 * gate.scalar
                ) {
                    gate.toggleInputA();
                }
            }
        }
}
  

