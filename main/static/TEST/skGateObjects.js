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

    static beingDragged = []

    //NOT FINISHED
    update(){
        for (const obj of Game.beingDragged) {
            //background(this.backColor)
            fill(this.backColor);
            noStroke();
            rect(obj.x-1, obj.y-1, obj.width+2, obj.height+2)

            //redraw only nearby gates
            let nbObjs = obj.collidesWithList()
            // for (let nb of nbObjs){
            //     rect(nb.x, nb.y, nb.width, nb.height)
            // }
            for (let nb of nbObjs){
                nb.display()
            }

            obj.drag(mouseX, mouseY);

            LogicGate.GateSHG.update(obj)
            
            //test
            obj.display()
            
        }
        
        //console.log("test")
        //for each draggable object
            //drag it
            //if object has Nodes (ie, is a gate/wire)
                //for each Node, SHG.update(Node)
        //for each Node object
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

    //static beingDragged = [];

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
    // constructor(inputNodes = []){
    //     this.inputNodes = inputNodes;
    // }

    inputNodes = [];
    //change size later
    static GateSHG = new SpatialHashGrid(20);

    //NOT FINISHED
    display(){
        image(img, this.x, this.y, this.width, this.height);
    }

    static createObject(x, y, width, height){
        let newObj = new LogicGate(x, y, width, height)
        LogicGate.GateSHG.insert(newObj)
        newObj.display()
        console.log(newObj)
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

//put into global scope
let game;

function preload() {
    // Load the sprite image before setup runs
    // Replace 'sprite.png' with your actual sprite image file
    img = loadImage('AND.png');
}

function setup(){

    game = new Game(1100, 600, '#4287f5');
    LogicGate.createObject(100, 100, 60, 50);
    LogicGate.createObject(200, 100, 60, 50);
    LogicGate.createObject(300, 100, 60, 50);

}

function draw(){

    //console.log(Game.beingDragged)
    game.update()
    //game.display()

}

function mouseReleased(){

    bd = Game.beingDragged

    for (let obj of bd){
        LogicGate.GateSHG.update(obj);
        bd.splice(bd.indexOf(obj), 1);
    }

    Game.beingDragged = []
}

function mousePressed(){

    //reference DraggableObjects Grid, push them into being dragged
    gatesThatMouseOverlaps = LogicGate.GateSHG.queryPoint(mouseX, mouseY);
    for (let gate of gatesThatMouseOverlaps){
        gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
        Game.beingDragged.push(gate)
    }

}