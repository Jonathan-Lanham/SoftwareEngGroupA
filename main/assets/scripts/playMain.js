//Dependent on other objects
let botImg;

function preload() {
    // Load the sprite image before setup runs
    //img = loadImage('AND.png');
    botImg = loadImage('../assets/images/flatluna1.png');
}

function setup() {

    //Read From JSON File
    //Used to load classes from the JSON file
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

    //Reference local storage for gates.
    const storedObjects = localStorage.getItem('initialize_objects');
    console.log(storedObjects);

    let io = null;
    if (storedObjects) {
        io = JSON.parse(storedObjects);
        console.log(io);
        console.log(io.Name);
        console.log(io.Description);
        console.log(io.Hints);
        document.getElementById("Level-Name").innerHTML = io.Name;
        //document.getElementById("Description").innerHTML = io.Description;
    }

    //Base scale off of viewport size.
    let scale = window.innerWidth/2560;
    console.log(window.innerWidth)

    //Until then, sample a level here
    //Directly tied to game instance
    game = new Game(io.CanvasSize.w * scale, window.innerHeight-122, '#4287f5', sizeOfNodes=15 * scale);
    game.entrancePoints = new EntrancePoints(io.EntrancePoints.x * scale, io.EntrancePoints.y * scale, io.EntrancePoints.w * scale, io.EntrancePoints.h * scale, io.EntrancePoints.states);
    game.exitPoints = new ExitPoints(io.ExitPoints.x * scale, io.ExitPoints.y * scale, io.ExitPoints.w * scale, io.ExitPoints.h * scale, io.ExitPoints.states);

    for (let con of io.Connections) {
        game.insertConnection(con, scale=scale)
    }

    for (let gate of io.Gates) {
        game.insertGate(gate.x, gate.y, gate.w, gate.h, gateClassMap[gate.type], scale=scale)
    }

    for (let comp of io.Components) {
        game.insertComponent(comp.x, comp.y, comp.w, comp.h, scale=scale)
    }

    // game.insertComponent(300, 300, 30, 30, scale=scale)
    // game.insertComponent(300, 300, 30, 30, scale=scale)
    // game.insertComponent(300, 300, 30, 30, scale=scale)
    // game.insertComponent(300, 300, 30, 30, scale=scale)
    // game.insertComponent(300, 300, 30, 30, scale=scale)

    console.log("GAME" + JSON.stringify(game.gameSounds));
    game.gameSounds.loadSounds({
        gate_pickup: '../assets/sounds/pickup_gate.wav',
        //Difficult to implement since collision is checked every frame, will come back to it later
        reverse_circuit: '../assets/sounds/reverse_circuit.wav',
        connect_circuit: '../assets/sounds/connect_circuit.wav',
        win_sound: '../assets/sounds/win_sound.mp3',
        incorrect: '../assets/sounds/extremely-loud-incorrect-buzzer_0cDaG20.mp3',
        yippeee: '../assets/sounds/yippeeeeeeeeeeeeee.mp3',
    });

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
        game.gameSounds.play('gate_pickup', volume=gameVolume)
        gate.changeOffsets(mouseX - gate.x, mouseY - gate.y)
        game.beingDragged.push(gate)
    } 
    else if (componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]){
        let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
        game.gameSounds.play('gate_pickup', volume=gameVolume)
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

    if (componentsThatMouseOverlaps.length === 0){ return }

    let comp = componentsThatMouseOverlaps[componentsThatMouseOverlaps.length - 1]
    comp.changeState()

    if (comp.state){
        game.gameSounds.play('connect_circuit', volume=gameVolume)
    } else{
        game.gameSounds.play('reverse_circuit', volume=gameVolume)
    }
}

function showWin() {
    let popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "flex";
    }
}

function closePopupWin(){
    let popup = document.getElementById("popup");
    popup.style.display = 'none'
}

function showLose() 
{
    let popup = document.getElementById("losePop");
    if (popup) {
        popup.style.display = "flex";
    }
}

function closePopupLose(){
    let popup = document.getElementById("losePop");
    popup.style.display = 'none'
}

async function loadNextLevel() {
    console.log("next level button clicked");
    //window.location.href = "level_select.html";
    try {
        const response = await fetch('../assets/data/levels.json');
        if (!response.ok) {
            throw new Error('Failed to load data/levels.json');
        }
        const levels = await response.json();
        const storedObjects = localStorage.getItem('initialize_objects');
        console.log(storedObjects);

        let io = null;
        if (storedObjects) {
            io = JSON.parse(storedObjects);
        }
        let current = false;

        levels.forEach(level => {
            if (level.lvlNum == io.lvlNum+1) {
                // play the btn sound effect when any listItem is clicked
                //btnSound2.play();
                //store gates from selected level in local storage. Will allow users to start from the level they ended on.
                localStorage.setItem('initialize_objects', JSON.stringify(level));
                // delay the page change by 1 second (1000 ms)
                setTimeout(() => {
                    window.location.href = 'play.html';  // Redirect to the play page after the delay
                }, 1000);

                console.log(`Selected level: ${level.lvlNum}`);
                console.log('Object:', JSON.stringify(level));
                current = true;
            
            }

        });
        if(!current){
            window.location.href = "level_select.html";
        }
    } catch (error) {
        console.error('Error loading levels:', error);
    }
}

// Run button functionality: 
const runBtn = document.getElementById("run-btn");
runBtn.onclick = function()
{
    game.running = true;
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