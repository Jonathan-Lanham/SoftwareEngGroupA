//put into global scope
let game;

class Game{
    constructor(gameWidth, gameHeight, backColor, scale=1){
        let x = (windowWidth - width) / 2 - gameWidth/2;
        let y = (windowHeight - height) / 2 - gameHeight/2;
        canvas = createCanvas(gameWidth, gameHeight);
        canvas.position(x, y);
        canvas.style('border', '2px solid black')
        background(backColor);

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.backColor = backColor;
    }

    beingDragged = [];
    exitPoints = null;
    entrancePoints = null;
    //Not Finished With Connections
    connectionLines = [];

    handleDraggedObjects(){
        for (let obj of this.beingDragged){
            console.log("BEING DRAGGED :" + obj)

            //Y axis offset to reposition nodes
            let yOffsetBefore = obj.y;
            
            obj.drag(mouseX, mouseY)

            //Y axis offset to reposition nodes
            let yOffsetAfter = obj.y;

            if (obj instanceof LogicGate){
                LogicGate.GateSHG.update(obj)
                this.updateInputNodes(obj, yOffsetAfter-yOffsetBefore);
                this.updateOutputNode(obj);
            }

        }
    }

    updateInputNodes(gate, changeInY){
        //UPDATE AND CHECK EVERY INPUT NODE ON GATE BEING DRAGGED
        for (let node of gate.inputNodes){ 
            node.move(gate.x-LogicGate.gNodeLeftOffset, node.y+changeInY);
            GateNode.NodeSHG.update(node);
        }
    }

    updateOutputNode(obj){
        //UPDATE AND CHECK THE SINGLE OUTPUT NODE ON GATE BEING DRAGGED
        obj.outputNode.move(obj.x+obj.width+LogicGate.gNodeRightOffset, obj.y+obj.height/2-LogicGate.gNodeSize/2)
        GateNode.NodeSHG.update(obj.outputNode)
    }

    checkForWin(statesArray, objectsArray) {

        // Compare each element
        for (let i = 0; i < statesArray.length; i++) {
          if (statesArray[i] !== objectsArray[i].state) {
            return false; // Found a mismatch
          }
        }
        
        // Winner winner chicken dinner
        window.alert("You Won!");
        return true;
    }

    transferStateToCollidingNodes(nodeObject){// this.transferStateToCollidingNodes(gate.outputNode)
        let collidesWithNode = nodeObject.collidesWithList();
        for (let collider of collidesWithNode){
            //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING
            collider.state = nodeObject.state;
        }
    }

    takeStateFromCollidingNodes(nodeObject){
        let collidesWithNode = nodeObject.collidesWithList();
        for (let collider of collidesWithNode){
            //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING
            nodeObject.state = collider.state;
        }
    }

    //Not the most optimal, may refactor later, separate some things into functions, but for now it works.
    //The most complicated part of the project, so its fine for now.
    //Ideally, only loop over gates that are being moved, since that's the only case where the game updates.
    //Then create a function to cascade node updates up the chain, so only candidate change are computed.
    //But that's REALLY hard. I salute you, if you want to try. $10 if you manage to do it.
    update(){
        background(this.backColor)

        this.handleDraggedObjects();

        //Display entrance points, transfer state to input nodes.
        this.entrancePoints.display();
        for (let entrNode of this.entrancePoints.entNodes){
            this.transferStateToCollidingNodes(entrNode);
        }

        //Process and display Connection Line Nodes
        for (let line of this.connectionLines){

            this.takeStateFromCollidingNodes(line.inputNode)

            line.outputNode.state = line.inputNode.state;

            this.transferStateToCollidingNodes(line.outputNode);
            line.display();

            line.outputNode.state = line.inputNode.state = false;
        }

        //QUERY A REGION OF THE CANVAS; queryRegion(0,0,this.gameWidth,this.gameHeight) is the entire canvas.
        //May be able to improve performance by restricting query to only sections of the canvas that have been updated.
        //But alas, that is much harder than O(n) for-loop
        for (let gate of LogicGate.GateSHG.queryRegion(0,0,this.gameWidth,this.gameHeight)){

            // Input Nodes get state from whatever they collide with, including other input nodes.
            // let collidingWithInputNodes = gate.collidesWithList();
            // for (let collider of collidingWithInputNodes){
            //     //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING
            //     gate.state = collider.state;
            // }

            //Input Nodes get state from ONLY output Nodes, and vice versa.
            //Only check things that collide with output nodes, essentially.
            this.transferStateToCollidingNodes(gate.outputNode)

            //Calculate output of the gate object, ie, AND OR NOT XOR NAND logic
            gate.outputNode.state = gate.calculateOutput()

            gate.display() 

            //RESET, make sure non-connected nodes are false. Gets recomputed before displayed.
            for (let inNode of gate.inputNodes){
                inNode.state = false;
            }
        }

        this.exitPoints.display();

        this.checkForWin(this.exitPoints.arrayOfNodeStates, this.exitPoints.endNodes)

        for (let eNode of this.exitPoints.endNodes){
            //else, reset these to be recomputed next frame.
            eNode.state = false;
        }
    }

}

//Not finished
class Connection{
    constructor(arrayOfLines){
        this.arrayOfLines = arrayOfLines
        this.inputNode = new GateNode(arrayOfLines[0].x- LogicGate.gNodeSize/2, arrayOfLines[0].y - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, this);
        this.outputNode = new GateNode(arrayOfLines[arrayOfLines.length-1].x- LogicGate.gNodeSize/2, arrayOfLines[arrayOfLines.length-1].y - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, this);
    }

    static createConnection(lineArray){
        let newLine = new Connection(lineArray);
        game.connectionLines.push(newLine);
    }

    display(){
        noFill();
        stroke('#00008B');
        beginShape();
    
        // Add each point to the shape
        for (let i = 0; i < this.arrayOfLines.length; i++) {
            const point = this.arrayOfLines[i];
            vertex(point.x, point.y);
        }
        
        // End the shape without closing it (we just want a line, not a closed shape)
        endShape();

        this.inputNode.display();
        this.outputNode.display();
    }
}

class ExitPoints{
    constructor(x, y, width, height, arrayOfNodeStates){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.arrayOfNodeStates = arrayOfNodeStates;
        this.endNodes = []

        //Equally Space Nodes Across ExitPoints object range
        let i = 0;
        //How far away should Nodes be from the edge?
        let offsetYAxis = 100
        let equallySpaceNodes = (height-offsetYAxis)/(arrayOfNodeStates.length - 1)

        for (let state of arrayOfNodeStates){
            //Borrow Logic Gate Node Size; May change Later.
            //Do something with states later?

            let newNode = new GateNode(x + this.width/2 - LogicGate.gNodeSize/2, y + (offsetYAxis/2) + i * equallySpaceNodes - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, this);
            GateNode.NodeSHG.insert(newNode);
            this.endNodes.push(newNode);
            ++i;
        }
    }
    static eNodeOffsetY = 20;
    display(){ 
        noFill();
        stroke('#5E5C6C')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        for (let eNode of this.endNodes){
            eNode.display();
        }
    }
}

class EntrancePoints{
    constructor(x, y, width, height, arrayOfNodeStates){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.arrayOfNodeStates = arrayOfNodeStates;
        this.entNodes = []

        //Equally Space Nodes Across ExitPoints object range
        let i = 0;
        //How far away should Nodes be from the edge?
        let offsetYAxis = 100
        let equallySpaceNodes = (height-offsetYAxis)/(arrayOfNodeStates.length - 1)

        for (let state of arrayOfNodeStates){
            //Borrow Logic Gate Node Size; May change Later.
            //Do something with states later?

            let newNode = new GateNode(x + this.width/2 - LogicGate.gNodeSize/2, y + (offsetYAxis/2) + i * equallySpaceNodes - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, this);
            newNode.state = state;
            GateNode.NodeSHG.insert(newNode);
            this.entNodes.push(newNode);
            ++i;
        }
    }
    static eNodeOffsetY = 20;
    display(){ 
        noFill();
        stroke('#5E5C6C')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        for (let eNode of this.entNodes){
            eNode.display();
        }
    }


}

class DraggableObject{
    constructor(x, y, width ,height){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    pointIsWithin(x_coord, y_coord){
        return (x_coord > this.x && x_coord < this.x + this.width && y_coord > this.y && y_coord < this.y + this.height);
    }

    startDragging(){
        DraggableObject.beingDragged.push(this);
    }

    stopDragging(){
        DraggableObject.beingDragged = [];
    }
    changeOffsets(x, y){
        this.offsetX = x;
        this.offsetY = y;
    }
    drag(mx, my){
        this.x = mx - this.offsetX;
        this.y = my - this.offsetY;
    }
    display(){ rect(this.x, this.y, this.width, this.height) }
}

class LogicGate extends DraggableObject{

    inputNodes = [];

    outputNode = null;

    static GateSHG = new SpatialHashGrid(20);

    //change node offsets and size
    static gNodeLeftOffset = 25;
    static gNodeRightOffset = 10;
    static gNodeSize = 15;

    //NOT FINISHED. MAY USE SPRITES LATER.
    display() {
        drawGenericGate(this.x, this.y, this.width, this.height, this.width/4);
        drawGateNodes(this);
    }

    //Override for subclasses of Gates. eg, NOT will only have one node.
    static createObject(x, y, width, height, gateClass=LogicGate){
        let newObj = new gateClass(x, y, width, height);
        gateClass.GateSHG.insert(newObj);
        newObj.display();
        console.log(newObj);

        //Create nodes for gate; Change 15 here for bigger values
        let newInNode = new GateNode(x-gateClass.gNodeLeftOffset, y+3*height/4 - gateClass.gNodeSize/2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode);
        newObj.inputNodes.push(newInNode);
        newInNode = new GateNode(x-gateClass.gNodeLeftOffset, y+height/4 - gateClass.gNodeSize/2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode);
        newObj.inputNodes.push(newInNode);

        //Create output Node
        let newOutNode = new GateNode(x+width+gateClass.gNodeRightOffset, y+height/2 - gateClass.gNodeSize/2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newOutNode);
        newObj.outputNode = newOutNode;

    }

    calculateOutput(){
        //console.log(this.inputNodes[0])
        return !(this.inputNodes[0].state && this.inputNodes[1].state);
    }

    //Finds all Logic Gates that this gate collides with; May be useful later on;
    // collidesWithList(){
    //     let result = [];
    //     let candidates = LogicGate.GateSHG.findNearbyObjects(this);
    //     //console.log("CANDIDATES: " + JSON.stringify(candidates))
    //     for (let node of candidates){
    //         if (LogicGate.GateSHG.checkCollision(node, this)){
    //             result.push(node);
    //         }
    //     }
    //     //console.log("RESULT: " + JSON.stringify(result));
    //     return result;
    // }

}

class AndGate extends LogicGate{
    display(){
        drawAndGate(this.x, this.y, this.width, this.height, this.width/4);
        drawGateNodes(this);
    }
    calculateOutput(){
        return (this.inputNodes[0].state && this.inputNodes[1].state);
    }
}

class NandGate extends LogicGate{
    display(){
        drawNandGate(this.x, this.y, this.width, this.height, this.width/4);
        drawGateNodes(this);
    }
    calculateOutput(){
        return !(this.inputNodes[0].state && this.inputNodes[1].state);
    }
}

function preload() {
    // Load the sprite image before setup runs
    //img = loadImage('AND.png');
}

function setup(){

    //Read From JSON File

    //Directly tied to game instance
    game = new Game(1500, 900, '#4287f5');
    game.entrancePoints = new EntrancePoints(100, 200, 50, 500, [false, true, true]);
    game.exitPoints = new ExitPoints(1350, 200, 50, 500, [false, true, true]);

    Connection.createConnection([{x: 200, y: 200}, {x: 500, y: 200}, {x: 500, y: 300}, {x: 700, y: 300}]);
    Connection.createConnection([{x: 200, y: 500}, {x: 500, y: 500}, {x: 500, y: 600}, {x: 700, y: 600}]);

    //Tied to Logic Gate SHG
    LogicGate.createObject(100, 100, 100, 80);
    LogicGate.createObject(200, 200, 100, 80);
    LogicGate.createObject(300, 100, 100, 80);
    LogicGate.createObject(300, 400, 100, 80);
    AndGate.createObject(700, 400, 100, 80, AndGate);
    NandGate.createObject(700, 600, 100, 80, NandGate);

}

function draw(){

    game.update()

}

function mouseReleased(){

    bd = game.beingDragged

    for (let obj of bd){
        LogicGate.GateSHG.update(obj);
        //Remove object from array
        //bd.splice(bd.indexOf(obj), 1);
    }

    game.beingDragged = []
}

function mousePressed(){

    //reference DraggableObjects Grid, push them into being dragged
    gatesThatMouseOverlaps = LogicGate.GateSHG.queryPoint(mouseX, mouseY);
    for (let gate of gatesThatMouseOverlaps){
        gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
        game.beingDragged.push(gate)
    }

}