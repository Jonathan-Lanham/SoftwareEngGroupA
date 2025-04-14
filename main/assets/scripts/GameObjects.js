//put into global scope
let game;

class Game {
    constructor(gameWidth, gameHeight, backColor, sizeOfNodes=15) {
        let x = (windowWidth - width) / 2 - gameWidth / 2;
        let y = (windowHeight - height) / 2 - gameHeight / 2;
        canvas = createCanvas(gameWidth, gameHeight);
        //canvas.position(x, y);
        canvas.style('border', '2px solid black')
        background(backColor);

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.backColor = backColor;

        this.running = false; // Checks if gates are running
        this.levelCompleted = false;

        Game.sizeOfNodes = sizeOfNodes;
        LogicGate.gNodeSize = sizeOfNodes;
        LogicGate.gNodeLeftOffset = sizeOfNodes*2;
        LogicGate.gNodeRightOffset = sizeOfNodes;

        this.gameSounds = new GameSounds();
  
        // Load sounds
        

    }

    static sizeOfNodes = 15;

    beingDragged = [];
    exitPoints = null;
    entrancePoints = null;
    //Not Finished With Connections
    connectionLines = [];

    insertGate(x, y, width, height, gateClass = LogicGate, scale=1) {
        gateClass.createObject(x * scale, y * scale, width * scale, height * scale, gateClass);
    }

    insertComponent(x, y, width, height, scale=1){
        switchComponent.createObject(x * scale, y * scale, width * scale, height * scale)
    }

    insertConnection(arrayOfPoints, scale=1) {
        Connection.createConnection(arrayOfPoints, scale=scale);
    }

    handleDraggedObjects() {
        for (let obj of this.beingDragged) {
            console.log("BEING DRAGGED :" + obj)

            //Y axis offset to reposition nodes
            let yOffsetBefore = obj.y;

            obj.drag(mouseX, mouseY)

            //Y axis offset to reposition nodes
            let yOffsetAfter = obj.y;

            if (obj instanceof LogicGate) {
                LogicGate.GateSHG.update(obj)
                this.updateInputNodes(obj, yOffsetAfter - yOffsetBefore);
                this.updateOutputNode(obj);
            }

            if (obj instanceof switchComponent) {
                switchComponent.ComponentSHG.update(obj)
                this.updateCompNodes(obj)
                // this.updateInputNodes(obj, yOffsetAfter - yOffsetBefore);
                // this.updateOutputNode(obj);
            }

        }
    }

    updateCompNodes(comp) {
        //UPDATE AND CHECK EVERY INPUT NODE ON GATE BEING DRAGGED
        //console.log(comp)
        comp.gameNode.move(comp.x + comp.width  + LogicGate.gNodeSize, comp.y + comp.height/2 - LogicGate.gNodeSize/2)
        GateNode.NodeSHG.update(comp.gameNode);
        // for (let node of gate.inputNodes) {
        //     node.move(comp.x, comp.y);
        //     GateNode.NodeSHG.update(node);
        // }
    }

    updateInputNodes(gate, changeInY) {
        //UPDATE AND CHECK EVERY INPUT NODE ON GATE BEING DRAGGED
        for (let node of gate.inputNodes) {
            node.move(gate.x - LogicGate.gNodeLeftOffset, node.y + changeInY);
            GateNode.NodeSHG.update(node);
        }
    }

    updateOutputNode(obj) {
        //UPDATE AND CHECK THE SINGLE OUTPUT NODE ON GATE BEING DRAGGED
        obj.outputNode.move(obj.x + obj.width + LogicGate.gNodeRightOffset, obj.y + obj.height / 2 - Game.sizeOfNodes / 2)
        GateNode.NodeSHG.update(obj.outputNode)
    }

    checkForWin(statesArray, objectsArray) {

        // Compare each element
        for (let i = 0; i < statesArray.length; i++) {
            if (statesArray[i] != objectsArray[i].state) {
                return false; // Found a mismatch
            }
        }

        // Winner winner chicken dinner
        // window.alert("You Won!");
        game.gameSounds.play('win_sound', volume=1)
        showWin();
        this.levelCompleted = true;
        return true;
    }

    transferStateToCollidingNodes(nodeObject) {// this.transferStateToCollidingNodes(gate.outputNode)
        //console.log(nodeObject)
        //VISUALIZE HASH
        if (nodeObject._cellKeys) {
            stroke('purple')
            noFill()
            for (let key of nodeObject._cellKeys) {
                let xAndy = key.split(',')
                rect(xAndy[0] * 20, xAndy[1] * 20, 20, 20);
            }
        }
        //-----
        let collidesWithNode = nodeObject.collidesWithList();
        for (let collider of collidesWithNode) {
            //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING
            collider.state = nodeObject.state;
        }
    }

    //NOT USED, LEAVING HERE IN CASE IT'S USEFUL
    takeStateFromCollidingNodes(nodeObject) {
        let collidesWithNode = nodeObject.collidesWithList();
        for (let collider of collidesWithNode) {
            //THIS NODE COLLIDED WITH COLLIDER, DO SOMETHING
            nodeObject.state = collider.state;
        }
    }

    //Not the most optimal, may refactor later, separate some things into functions, but for now it works.
    //The most complicated part of the project, so its fine for now.
    //Ideally, only loop over gates that are being moved, since that's the only case where the game updates.
    //Then create a function to cascade node updates up the chain, so only candidate change are computed.
    //But that's REALLY hard. I salute you, if you want to try. $10 if you manage to do it.
    update() {

        background(this.backColor)

        this.handleDraggedObjects();

        //Display entrance points, transfer state to input nodes.
        if (this.entrancePoints){
            this.entrancePoints.display();
            for (let entrNode of this.entrancePoints.entNodes) {
                this.transferStateToCollidingNodes(entrNode);
            }
        }

        if (this.exitPoints){
            this.exitPoints.displayOnlyBox();
        }

        for (let comp of switchComponent.ComponentSHG.queryRegion(0, 0, this.gameWidth, this.gameHeight)) {
            comp.display()
        }

        //Process and display Connection Line Nodes
        for (let line of this.connectionLines) {

            //Don't need to pull state, everything else is pushing state
            //this.takeStateFromCollidingNodes(line.inputNode)

            line.outputNode.state = line.inputNode.state;

            this.transferStateToCollidingNodes(line.outputNode);
            line.display();

            line.outputNode.state = line.inputNode.state = false;
        }

        for (let comp of switchComponent.ComponentSHG.queryRegion(0, 0, this.gameWidth, this.gameHeight)) {
            this.transferStateToCollidingNodes(comp.gameNode)
        }

        //QUERY A REGION OF THE CANVAS; queryRegion(0,0,this.gameWidth,this.gameHeight) is the entire canvas.
        //May be able to improve performance by restricting query to only sections of the canvas that have been updated.
        //But alas, that is much harder than O(n) for-loop
        for (let gate of LogicGate.GateSHG.queryRegion(0, 0, this.gameWidth, this.gameHeight)) {

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
            for (let inNode of gate.inputNodes) {
                inNode.state = null;
            }
        }

        if (this.exitPoints){
            this.exitPoints.displayOnlyChildNodes();
        }
        
        // Will only check if level is complete once gates are running
        if (this.running)
        {
            // if (this.levelCompleted === false){
                this.checkForWin(this.exitPoints.arrayOfNodeStates, this.exitPoints.endNodes)
                this.running = false;
            // }
        }

        if (this.exitPoints){
            for (let eNode of this.exitPoints.endNodes) {
                //else, reset these to be recomputed next frame.
                eNode.state = false;
            }
        }

    }

}



