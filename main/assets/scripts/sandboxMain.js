let trashcan;

function preload() {
    trashcan = loadImage('../assets/images/trash-bin-3.png');
}

function setup() {

    //Base scale off of viewport size.
    let scale = window.innerWidth / 2560;

    console.log(window.innerWidth)

    //Until then, sample a level here
    //Directly tied to game instance
    game = new Game(2560 * scale, window.innerHeight - 122, '#4287f5', sizeOfNodes = 15 * scale);

    game.gameScale = scale;

    console.log("GAME" + JSON.stringify(game.gameSounds));
    game.gameSounds.loadSounds({
        gate_pickup: '../assets/sounds/pickup_gate.wav',
        //Difficult to implement since collision is checked every frame, will come back to it later
        reverse_circuit: '../assets/sounds/reverse_circuit.wav',
        connect_circuit: '../assets/sounds/connect_circuit.wav',
        win_sound: '../assets/sounds/win_sound.mp3'
    });

    //game.insertGate(500, 500, 100, 80, AndGate, scale=scale)

}

//For visualization/debugging
function visualizeGridCells() {
    stroke(55, 55, 55, 50)
    // Draw vertical lines
    for (let x = 0; x <= width; x += 20) {
        line(x, 0, x, height);
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += 20) {
        line(0, y, width, y);
    }
}

let draggingConnections = [];

function draw() {

    game.update()

    if (point1) {
        noFill()
        stroke('black')
        rect(point1[0], point1[1], mouseX - point1[0], mouseY - point1[1])
    }
    //For visualization/debugging
    visualizeGridCells();

    //Query point in center of trashcan
    //If they are, remove from being_dragged, remove from SHG
    image(trashcan, game.gameWidth - 65, 0, 60, 70);
    //rect(game.gameWidth - 40, 30, 10, 15)

    gates_to_delete = LogicGate.GateSHG.queryRegion(game.gameWidth - 40, 30, 10, 15)
    for (let gate of gates_to_delete) {
        LogicGate.GateSHG.remove(gate)
    }
    components_to_delete = switchComponent.ComponentSHG.queryRegion(game.gameWidth - 40, 30, 10, 15)
    for (let comp of components_to_delete) {
        switchComponent.ComponentSHG.remove(comp)
    }

    //Delete Connections
    //Query Node SHG For overlapping with delete
    //If Nodes parent is a Connection object, reference game.connectionLines and delete it
    connections_to_delete = GateNode.NodeSHG.queryRegion(game.gameWidth - 40, 30, 10, 15);
    for (let conn_node of connections_to_delete){
        if(conn_node.parentObject instanceof Connection){
            parentConn = conn_node.parentObject
            GateNode.NodeSHG.remove(parentConn.inputNode)
            GateNode.NodeSHG.remove(parentConn.outputNode)
            draggingConnections.splice(draggingConnections.indexOf(conn_node.parentObject), 1);
            game.connectionLines.splice(game.connectionLines.indexOf(conn_node.parentObject), 1);
        }
    }

    for (let conn_to_drag of draggingConnections){
        console.log(conn_to_drag)
        conn_to_drag.drag(mouseX, mouseY)
    }

}

selectingMultiple = false;
point1 = null;

function getCornerPoints(point1, point2) {
    // Find the top-left point (minimum x and y values)
    const topLeft = [
        Math.min(point1[0], point2[0]),
        Math.min(point1[1], point2[1])
    ];

    // Find the bottom-right point (maximum x and y values)
    const bottomRight = [
        Math.max(point1[0], point2[0]),
        Math.max(point1[1], point2[1])
    ];

    return { topLeft, bottomRight };
}

function mouseReleased() {

    bd = game.beingDragged

    for (let obj of bd) {
        if (obj instanceof LogicGate) {
            LogicGate.GateSHG.update(obj);
        }
        //change later to parent class
        if (obj instanceof switchComponent) {
            switchComponent.ComponentSHG.update(obj);
        }
        //Remove object from array
        //bd.splice(bd.indexOf(obj), 1);
    }

    game.beingDragged = []

    //messy but it works
    if (selectingMultiple) {
        selectingMultiple = false;
        point2 = [mouseX, mouseY]
        rect(point1[0], point1[1], mouseX - point1[0], mouseY - point1[1]);
        //query every gate between point1 and [mouseX, mouseY], start dragging

        //find which point is closer to top left, make that topPoint

        findPoints = getCornerPoints(point1, point2)

        topPoint = findPoints.topLeft
        botPoint = findPoints.bottomRight

        for (let gate of LogicGate.GateSHG.queryRegion(topPoint[0], topPoint[1], botPoint[0] - topPoint[0], botPoint[1] - topPoint[1])) {
            gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
            game.beingDragged.push(gate)
        }
        for (let comp of switchComponent.ComponentSHG.queryRegion(topPoint[0], topPoint[1], botPoint[0] - topPoint[0], botPoint[1] - topPoint[1])) {
            comp.changeOffsets(mouseX - comp.x, mouseY - comp.y)
            game.beingDragged.push(comp)
        }

        //Query region for nodes
        //If any nodes belong to Connection class
        //set offsets based on current mouse position (mouseX, mouseY)
        //push to drag connection array
        //Every frame, loop over drag connection array and call drag(), also change the nodes x y
        //on mouse release, clear out drag connection array
        //update the connection nodes
        connections_to_drag = GateNode.NodeSHG.queryRegion(topPoint[0], topPoint[1], botPoint[0]-topPoint[0], botPoint[1]-topPoint[1]);
        for (let conn_node of connections_to_drag){
            if(conn_node.parentObject instanceof Connection){
                parentConn = conn_node.parentObject
                parentConn.setOffsets(mouseX, mouseY)
                draggingConnections.push(parentConn);
            }
        }


        point1 = null;
    }
}

function mousePressed() {

    //OLD: DRAGS EVERY OVERLAPPING GATE
    //reference DraggableObjects Grid, push them into being dragged
    // gatesThatMouseOverlaps = LogicGate.GateSHG.queryPoint(mouseX, mouseY);
    // for (let gate of gatesThatMouseOverlaps) {
    //     game.gameSounds.play('gate_pickup', volume=1)
    //     gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
    //     game.beingDragged.push(gate)
    // }

    gatesThatMouseOverlaps = LogicGate.GateSHG.queryPoint(mouseX, mouseY);
    componentsThatMouseOverlaps = switchComponent.ComponentSHG.queryPoint(mouseX, mouseY);

    if (gatesThatMouseOverlaps[gatesThatMouseOverlaps.length - 1]) {
        let gate = gatesThatMouseOverlaps[gatesThatMouseOverlaps.length - 1]
        game.gameSounds.play('gate_pickup', volume = 1)
        gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
        game.beingDragged.push(gate)
    }
    else if (componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]) {
        let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
        game.gameSounds.play('gate_pickup', volume = 1)
        comp.changeOffsets(mouseX - comp.x, mouseY - comp.y)
        game.beingDragged.push(comp)
    } else {
        selectingMultiple = true;
        point1 = [mouseX, mouseY];
    }

    // for (let gate of gatesThatMouseOverlaps) {
    //     game.gameSounds.play('gate_pickup', volume=1)
    //     gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
    //     game.beingDragged.push(gate)
    // }

}

function doubleClicked() {
    // Code to run.
    componentsThatMouseOverlaps = switchComponent.ComponentSHG.queryPoint(mouseX, mouseY);

    if (componentsThatMouseOverlaps.length === 0) {
        return
    }

    let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
    comp.changeState()

    if (comp.state) {
        game.gameSounds.play('connect_circuit', volume = 1)
    } else {
        game.gameSounds.play('reverse_circuit', volume = 1)
    }
}

connectionBuffer = [];
placeConnectionMode = false;

function mouseClicked() {

    if (placeConnectionMode) {
        connectionBuffer.push({
            x: mouseX / game.gameScale,
            y: mouseY / game.gameScale
        })
    }

}

function keyPressed() {

    if (placeConnectionMode) {
        // keyCode 32 is the spacebar
        // keyCode 16 is Shift
        if (keyCode === 16) {
            //Push connection, end mode
            game.insertConnection(connectionBuffer, game.gameScale)
            connectionBuffer = []
            placeConnectionMode = false;
            hideTipDiv();
        }
    }
}

//functions for inserting things into sandbox

function showTipDiv() {
    document.getElementById('topDiv').style.display = 'block';
}

function hideTipDiv() {
    document.getElementById('topDiv').style.display = 'none';
}

function insertSwitchComponent() {
    console.log("Inserting Component...")
    game.insertComponent(game.gameWidth / game.gameScale / 2, game.gameHeight / game.gameScale / 2, 38, 38, game.gameScale)
}

function insertGateIntoGame(logicGate) {
    console.log("Inserting Gate...")
    game.insertGate(game.gameWidth / game.gameScale / 2, game.gameHeight / game.gameScale / 2, 100, 80, logicGate, game.gameScale)
}

function insertConnectionLineIntoGame() {

    showTipDiv();
    gateInfoPanel.classList.toggle("open");

    setTimeout(() => {
        placeConnectionMode = true;
    }, 500);


    //game.insertConnection(linesPlaced, game.gameScale)
}
function outputGameAsJSON() {

    outputObject = {}

    //Query all gates
    //Query all connections
    //Query all components

    //Create a labeled json object for each of these, such that it can be copy pasted into level creator

    //components
    // console.log(switchComponent.ComponentSHG.queryRegion(0, 0, game.gameWidth, game.gameHeight))
    // console.log(game.connectionLines)
    // console.log("All Logic Gates: " + LogicGate.GateSHG.queryRegion(0, 0, game.gameWidth, game.gameHeight))

    //Handle Connection Lines
    outputObject.Connections = [];
    for (let line of game.connectionLines) {
        let newLine = [];
        for (let index in line.arrayOfLines) {
            console.log(line.arrayOfLines[index]);
            let point = { x: (line.arrayOfLines[index].x / (windowWidth / 2560)), y: (line.arrayOfLines[index].y / (windowWidth / 2560)) };
            newLine.push(point);
        }

        console.log(newLine);

        outputObject.Connections.push(newLine)
    }
    //console.log(JSON.stringify(outputObject.Connections))

    //Handle Logic Gates
    outputObject.Gates = [];
    for (let gate of LogicGate.GateSHG.queryRegion(0, 0, game.gameWidth, game.gameHeight)) {
        outputObject.Gates.push({
            "x": gate.x / (windowWidth / 2560),
            "y": gate.y / (windowWidth / 2560),
            "w": gate.width / (windowWidth / 2560),
            "h": gate.height / (windowWidth / 2560),
            "type": gate.constructor.name
        })
    }
    //console.log(JSON.stringify(outputObject.Gates))

    //Handle Components
    outputObject.Components = [];
    for (let comp of switchComponent.ComponentSHG.queryRegion(0, 0, game.gameWidth, game.gameHeight)) {
        outputObject.Components.push({
            "x": comp.x / (windowWidth / 2560),
            "y": comp.y / (windowWidth / 2560),
            "w": comp.width / (windowWidth / 2560),
            "h": comp.height / (windowWidth / 2560),
            "type": comp.constructor.name
        })
    }
    //console.log(JSON.stringify(outputObject.Components))

    console.log(JSON.stringify(outputObject))
    document.getElementById("obj-text-string").value = JSON.stringify(outputObject)
    toggleObjectPopup();

}

function changeObject(){
    const io = JSON.parse(document.getElementById("obj-text-string").value);

    //remove all objects from the game
    //insert these objects into game

    gateClassMap = {
        "LogicGate": LogicGate,
        "AndGate": AndGate,
        "NandGate": NandGate,
        "OrGate": OrGate,
        "NorGate": NorGate,
        "XorGate": XorGate,
        "XnorGate": XnorGate,
        "NotGate": NotGate
    };

    let scale = 1//window.innerWidth/2560;

    for (let con of io.Connections) {
        game.insertConnection(con, scale=scale)
    }

    for (let gate of io.Gates) {
        game.insertGate(gate.x, gate.y, gate.w, gate.h, gateClassMap[gate.type], scale=scale)
    }

    for (let comp of io.Components) {
        game.insertComponent(comp.x, comp.y, comp.w, comp.h, scale=scale)
    }

    toggleObjectPopup();
}

// grabbing the elements for the options menu buttons
const optionsBtnPlay = document.querySelector('.fa-cog');
const optionsHiddenMenu = document.getElementById('options-menu');
const optionsExitBtn = document.querySelector('.exit-button');
const optionsHome = document.getElementById('back-to-main');

// code for the options button to showcase the options menu
optionsBtnPlay.addEventListener('click', () => {
    if(optionsHiddenMenu.style.display === 'none'){
        optionsHiddenMenu.style.display = 'block';
    }
    else{
        optionsHiddenMenu.style.display = 'none';
    }
});
// code for the options exit button to get rid of the options menu
optionsExitBtn.addEventListener('click', () => {
    if(optionsHiddenMenu.style.display === 'block' ){
        optionsHiddenMenu.style.display = 'none';
        //languageHiddenMenu.style.display = 'none';
    }
    else{
        optionsHiddenMenu.style.display = 'block';
    }
});

function windowResized() {
    resizeCanvas(windowWidth, windowHeight-122);
}