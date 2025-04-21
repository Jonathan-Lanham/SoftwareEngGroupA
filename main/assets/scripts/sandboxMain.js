function setup() {

    //Base scale off of viewport size.
    let scale = window.innerWidth/2560;

    console.log(window.innerWidth)

    //Until then, sample a level here
    //Directly tied to game instance
    game = new Game(2560 * scale, window.innerHeight-122, '#4287f5', sizeOfNodes=15 * scale);

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

function draw() {


    game.update()
    //For visualization/debugging
    visualizeGridCells();

}

function mouseReleased() {

    bd = game.beingDragged

    for (let obj of bd) {
        if (obj instanceof LogicGate){
            LogicGate.GateSHG.update(obj);
        }
        //change later to parent class
        if (obj instanceof switchComponent){
            switchComponent.ComponentSHG.update(obj);
        }
        //Remove object from array
        //bd.splice(bd.indexOf(obj), 1);
    }

    game.beingDragged = []
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

    if(gatesThatMouseOverlaps[gatesThatMouseOverlaps.length - 1]){
        let gate = gatesThatMouseOverlaps[gatesThatMouseOverlaps.length - 1]
        game.gameSounds.play('gate_pickup', volume=1)
        gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
        game.beingDragged.push(gate)
    } 
    else if (componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]){
        let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
        game.gameSounds.play('gate_pickup', volume=1)
        comp.changeOffsets(mouseX - comp.x, mouseY - comp.y)
        game.beingDragged.push(comp)
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

    if (componentsThatMouseOverlaps.length === 0){
        return
    }

    let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
    comp.changeState()

    if (comp.state){
        game.gameSounds.play('connect_circuit', volume=1)
    } else{
        game.gameSounds.play('reverse_circuit', volume=1)
    }
}

connectionBuffer = [];
placeConnectionMode = false;

function mouseClicked(){

    if (placeConnectionMode){
        connectionBuffer.push({
            x: mouseX/game.gameScale,
            y: mouseY/game.gameScale
        })
    }

}

function keyPressed() {

    if (placeConnectionMode){
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

function insertSwitchComponent(){
    console.log("Inserting Component...")
    game.insertComponent(game.gameWidth/game.gameScale/2, game.gameHeight/game.gameScale/2, 38, 38, game.gameScale)
}

function insertGateIntoGame(logicGate){
    console.log("Inserting Gate...")
    game.insertGate(game.gameWidth/game.gameScale/2, game.gameHeight/game.gameScale/2, 100, 80, logicGate, game.gameScale)
}

function insertConnectionLineIntoGame(){

    showTipDiv();
    gateInfoPanel.classList.toggle("open");

    setTimeout(() => {
        placeConnectionMode = true;
      }, 500);
    

    //game.insertConnection(linesPlaced, game.gameScale)
}

function outputGameAsJSON(){

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
        outputObject.Connections.push(line.arrayOfLines)
    }
    //console.log(JSON.stringify(outputObject.Connections))

    //Handle Logic Gates
    outputObject.Gates = [];
    for (let gate of LogicGate.GateSHG.queryRegion(0, 0, game.gameWidth, game.gameHeight)) {
        outputObject.Gates.push({
            "x": gate.x,
            "y": gate.y,
            "w": gate.width,
            "h": gate.height,
            "type": gate.constructor.name
        })
    }
    //console.log(JSON.stringify(outputObject.Gates))

    //Handle Components
    outputObject.Components = [];
    for (let comp of switchComponent.ComponentSHG.queryRegion(0, 0, game.gameWidth, game.gameHeight)) {
        outputObject.Components.push({
            "x": comp.x,
            "y": comp.y,
            "w": comp.width,
            "h": comp.height,
            "type": comp.constructor.name
        })
    }
    //console.log(JSON.stringify(outputObject.Components))

    console.log(JSON.stringify(outputObject))
}