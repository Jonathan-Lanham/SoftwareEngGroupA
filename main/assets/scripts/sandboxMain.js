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
    let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
    comp.changeState()

    if (comp.state){
        game.gameSounds.play('connect_circuit', volume=1)
    } else{
        game.gameSounds.play('reverse_circuit', volume=1)
    }
}

//functions for inserting things into sandbox

function insertSwitchComponent(){
    console.log("Inserting Component...")
    game.insertComponent(400, 300, 38, 38, game.gameScale)
}

function insertGateIntoGame(logicGate){
    console.log("Inserting Gate...")
    game.insertGate(500, 500, 100, 80, logicGate, game.gameScale)
}
