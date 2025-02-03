//width, height of each gate
gateSizeWidth = 60
gateSizeHeight = 40


//Class for logic gates, will likely be moved out of this main file.
class LogicGate {
    constructor(x, y, type) {
        
        //2D coordinates for logic gate object
        this.x = x;
        this.y = y;

        //What type of logic gate it is? AND, OR, etc?
        //Will either be a string, or we might mess around with inheritance.
        this.type = type;

        //2 bits for input sources
        this.inputs = null;

    }
    display() {
        rect(this.x, this.y, gateSizeWidth, gateSizeHeight, 10);
        textAlign(CENTER, CENTER);
        text(this.type, this.x + 30, this.y + 20);
    }
}

//Will be used to store all gates currently on screen. Work in progress.
let gates = [];

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

    //Initialize a gate? work in progress, will need to reference a "level database" for initializing "puzzles"
    gates.push(new LogicGate(200, 350, "AND"));
    //gates.push(new LogicGate(200, 300, "OR"));
}

// "draw() is called directly after setup()"
// "Executes the lines of code inside its curly brackets 60 times per second until the program is stopped or the noLoop() function is called."
function draw() {

    //If you want to see something fun, comment this out
    background('#4287f5');

    //Loops over every gate, and updates it
    for (let gate of gates) {
        gate.x = mouseX;
        gate.y = mouseY;
        gate.display();
    }
    
   
}


