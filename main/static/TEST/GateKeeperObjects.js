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
    collidingNodes = [];

    //Not the most optimal
    //Ideally, only loop over gates that are being moved, since that's the only case where the game updates.
    //Then create a function to cascade node updates up the chain, so only candidate change are computed.
    update(){
        background(this.backColor)

        for (let obj of this.beingDragged){
            //console.log("BEING DRAGGED :" + o)

            //Y axis offset to reposition nodes
            let yOffsetBefore = obj.y;
            
            obj.drag(mouseX, mouseY)
            LogicGate.GateSHG.update(obj)

            //Y axis offset to reposition nodes
            let yOffsetAfter = obj.y;

            //UPDATE AND CHECK EVERY INPUT NODE ON GATE BEING DRAGGED
            for (let node of obj.inputNodes){ 
                
                node.move(obj.x-LogicGate.gNodeLeftOffset, node.y+yOffsetAfter-yOffsetBefore);

                GateNode.NodeSHG.update(node);

                //check for collision
                let collidingWithInputNodes = node.collidesWithList();

                //if (collidingWithInputNodes.length <= 0) { node.state = false; } 
                //else{
                    for (let collider of collidingWithInputNodes){
                        //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING

                        node.state = collider.state;
                        this.collidingNodes.push(collider)

                    }
                //}
            }

            //UPDATE AND CHECK THE SINGLE OUTPUT NODE ON GATE BEING DRAGGED
            obj.outputNode.move(obj.x+obj.width+LogicGate.gNodeRightOffset, obj.y+obj.height/2-LogicGate.gNodeSize/2)
            GateNode.NodeSHG.update(obj.outputNode)
            let collidingWithOutputNode = obj.outputNode.collidesWithList();
            //if (collidingWithOutputNode.length <= 0) { node.state = false; } 
            for (let collider of collidingWithOutputNode){
                //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING

                collider.state = obj.outputNode.state;
                this.collidingNodes.push(collider)

            }
        }

        //QUERY A REGION OF THE CANVAS; queryRegion(0,0,this.gameWidth,this.gameHeight) is the entire canvas.
        //May be able to improve performance by restricting query to only sections of the canvas that have been updated.
        //But alas, that is much harder than O(n) for-loop
        for (let gate of LogicGate.GateSHG.queryRegion(0,0,this.gameWidth,this.gameHeight)){

            gate.outputNode.state = gate.calculateOutput()

            gate.display() 

            //If not colliding node
            //RESET, make sure non-connected nodes are false
            for (let inNode of gate.inputNodes){
                if (this.collidingNodes.indexOf(inNode) === -1){
                    inNode.state = false;
                }
            }
        }

        this.collidingNodes = [];
    }

    handleDraggedObjects() {

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
    static createObject(x, y, width, height){
        let newObj = new LogicGate(x, y, width, height)
        LogicGate.GateSHG.insert(newObj)
        newObj.display()
        console.log(newObj)

        //Create nodes for gate; Change 15 here for bigger values
        let newInNode = new GateNode(x-LogicGate.gNodeLeftOffset, y+3*height/4 - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode)
        newObj.inputNodes.push(newInNode)
        newInNode = new GateNode(x-LogicGate.gNodeLeftOffset, y+height/4 - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode)
        newObj.inputNodes.push(newInNode)

        //Create output Node
        let newOutNode = new GateNode(x+width+LogicGate.gNodeRightOffset, y+height/2 - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newOutNode);
        newObj.outputNode = newOutNode;

    }

    calculateOutput(){
        //console.log(this.inputNodes[0])
        return !this.inputNodes[0].state;
    }

    collidesWithList(){
        let result = [];
        let candidates = LogicGate.GateSHG.findNearbyObjects(this);
        //console.log("CANDIDATES: " + JSON.stringify(candidates))
        for (let node of candidates){
            if (LogicGate.GateSHG.checkCollision(node, this)){
                result.push(node);
            }
        }
        //console.log("RESULT: " + JSON.stringify(result));
        return result;
    }

}

function preload() {
    // Load the sprite image before setup runs
    //img = loadImage('AND.png');
}

function setup(){

    game = new Game(1500, 900, '#4287f5');
    LogicGate.createObject(100, 100, 100, 80);
    LogicGate.createObject(200, 200, 100, 80);
    LogicGate.createObject(300, 100, 100, 80);
    LogicGate.createObject(300, 400, 100, 80);

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