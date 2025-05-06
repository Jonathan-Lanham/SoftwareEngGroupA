
// Source: spatialHash.js
class SpatialHashGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map(); // Maps cell keys to arrays of objects
  }

  // Generate a string key for a grid cell from world coordinates
  getCellKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  // Get all cell keys that an object overlaps
  getObjectCellKeys(object) {
    // Calculate the min and max cells the object touches
    const minCellX = Math.floor(object.x / this.cellSize);
    const minCellY = Math.floor(object.y / this.cellSize);
    const maxCellX = Math.floor((object.x + object.width) / this.cellSize);
    const maxCellY = Math.floor((object.y + object.height) / this.cellSize);
    
    const keys = [];
    // Generate all cell keys this object overlaps
    for (let x = minCellX; x <= maxCellX; x++) {
      for (let y = minCellY; y <= maxCellY; y++) {
        keys.push(`${x},${y}`);
      }
    }
    return keys;
  }

  // Insert an object into the grid
  insert(object) {
    const cellKeys = this.getObjectCellKeys(object);
    
    // Add object to each cell it overlaps
    for (const key of cellKeys) {
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key).push(object);
      
      // Store the cell keys with the object for faster removal
      if (!object._cellKeys) {
        object._cellKeys = [];
      }
      object._cellKeys.push(key);
    }
  }

  // Remove an object from the grid
  remove(object) {
    if (!object._cellKeys) return;
    
    // Remove from all cells it was inserted into
    for (const key of object._cellKeys) {
      const cell = this.grid.get(key);
      if (cell) {
        const index = cell.indexOf(object);
        if (index !== -1) {
          cell.splice(index, 1);
          // Clean up empty cells
          if (cell.length === 0) {
            this.grid.delete(key);
          }
        }
      }
    }
    
    // Clear the cached cell keys
    object._cellKeys = [];
  }

  // Update an object's position in the grid
  update(object) {
    this.remove(object);
    this.insert(object);
  }

  // Find all objects that might collide with the given object
  findNearbyObjects(object) {
    const cellKeys = this.getObjectCellKeys(object);
    const nearbyObjects = new Set();
    
    // Check all cells this object overlaps
    for (const key of cellKeys) {
      const cell = this.grid.get(key);
      if (cell) {
        for (const otherObject of cell) {
          if (otherObject !== object) {
            nearbyObjects.add(otherObject);
          }
        }
      }
    }
    
    return Array.from(nearbyObjects);
  }

  // Check all potential collisions in the entire grid
  checkAllCollisions(collisionCallback) {
    const checked = new Set(); // Track already checked pairs
    
    // For each cell in the grid
    for (const [_, objects] of this.grid) {
      // Check each pair of objects in this cell
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const objA = objects[i];
          const objB = objects[j];
          
          // Create a unique key for this pair
          const pairKey = objA._shg_id < objB._shg_id ? 
            `${objA._shg_id},${objB._shg_id}` : `${objB._shg_id},${objA._shg_id}`;
          
          // Skip if this pair was already checked
          if (checked.has(pairKey)) continue;
          checked.add(pairKey);
          
          // Check if they actually collide
          if (this.checkCollision(objA, objB)) {
            collisionCallback(objA, objB);
          }
        }
      }
    }
  }

  // Simple AABB collision check
  checkCollision(objA, objB) {
    return !(
      objA.x + objA.width < objB.x ||
      objA.x > objB.x + objB.width ||
      objA.y + objA.height < objB.y ||
      objA.y > objB.y + objB.height
    );
  }

  // Clear all objects from the grid
  clear() {
    this.grid.clear();
  }

  // Get all objects in a specific region (for debugging/visualization)
  queryRegion(x, y, width, height) {
    const minCellX = Math.floor(x / this.cellSize);
    const minCellY = Math.floor(y / this.cellSize);
    const maxCellX = Math.floor((x + width) / this.cellSize);
    const maxCellY = Math.floor((y + height) / this.cellSize);
    
    const result = new Set();
    
    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const key = `${cx},${cy}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const obj of cell) {
            result.add(obj);
          }
        }
      }
    }
    
    return Array.from(result);
  }

  // Find all objects that contain the given point
  queryPoint(x, y) {
      // Get the cell key for this point
      const key = this.getCellKey(x, y);
      
      // Get all objects in this cell
      const cellObjects = this.grid.get(key) || [];
      
      // Filter to only objects that actually contain the point
      return cellObjects.filter(obj => 
      x >= obj.x && 
      x <= obj.x + obj.width && 
      y >= obj.y && 
      y <= obj.y + obj.height
      );
  }
}
// Source: NodeClass.js

class GateNode{
    constructor(x, y, width, height, parentObject){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parentObject = parentObject;
        this.state = null;
    }
    //will have to adjust manually
    static NodeSHG = new SpatialHashGrid(20)
    //goesInto.push(obj) JS by default references objects, not copies
    move(x_coord, y_coord){
        this.x = x_coord
        this.y = y_coord
    }
    transfer_state_to(node){
      node.state = this.state
    }
    collidesWithList(){
        let result = [];
        let candidates = GateNode.NodeSHG.findNearbyObjects(this);
        //console.log("CANDIDATES: " + JSON.stringify(candidates))
        for (let node of candidates){
            if (GateNode.NodeSHG.checkCollision(node, this)){
                result.push(node);
            }
        }
        //console.log("RESULT: " + JSON.stringify(result));
        return result;
    }
    display(){
        strokeWeight(2);
        stroke('black')
        //change 15/2 to make circle larger
        fill(this.state ? "green" : "red");
        if (this.state === null){
            fill('gray')
        }
        ellipse(this.x+ Game.sizeOfNodes/2, this.y+Game.sizeOfNodes/2, this.width, this.height);
        rect(this.x, this.y, this.width, this.height);
        strokeWeight(1)
    }
}

// Source: drawGates.js
//Contains all functions to draw logic gates using p5js

function drawGateNodes(obj){
    //console.log(obj)

    for (let node of obj.inputNodes){
        //console.log(node)
        node.display(obj);
        obj.outputNode.display(obj);
    }

}

function drawGenericGate(x, y, w, h, textsize){ 
    
    let textColor = 'black';
    // 
    stroke(0);
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("GATE", x + w/2 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
    x + w/2 ,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    line(x, y, x, y + h);

    //line(x, y + h/2, x + width, y + h/2);
    strokeWeight(1);
}

function drawNandGate(x, y, w, h, textsize){ 
    
    let textColor = 'black';
    // 
    stroke(0);

    let circSize = 15 * w / 80;
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("NAND", x + w/2.1 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
    x + w/2 - circSize/2,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2 - circSize/2, y);
    line(x, y + h, x + w/2 - circSize/2, y + h);
    line(x, y, x, y + h);

    fill('#4287f5')
    ellipse(x + w - circSize/4 , y + h/2, circSize, circSize)

    //line(x, y + h/2, x + width, y + h/2);
    strokeWeight(1);
}

function drawAndGate(x, y, w, h, textsize){ 
    
    let textColor = 'black';
    // 
    stroke(0);
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("AND", x + w/2 - textsize*1.25 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
    x + w/2 ,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    line(x, y, x, y + h);

    //line(x, y + h/2, x + width, y + h/2);
    strokeWeight(1);
}

function drawOrGate(x, y, w, h, textsize){

    let textColor = 'black';

    stroke(0);

    textSize(textsize);

    fill(textColor);
    strokeWeight(1);
    text("OR", x + w/1.45 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
        x + w/2 ,
        y + h/2 ,
        w ,
        h ,
      PI + HALF_PI,
      TWO_PI + HALF_PI
    );
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    strokeWeight(1);
}

function drawNorGate(x, y, w, h, textsize){

    let textColor = 'black';

    stroke(0);

    textSize(textsize);

    let circSize = 15 * w / 80;

    fill(textColor);
    strokeWeight(1);
    text("NOR", x + w/1.6 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
        x + w/2 -circSize/2,
        y + h/2 ,
        w ,
        h ,
      PI + HALF_PI,
      TWO_PI + HALF_PI
    );
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    line(x, y, x + w/2-circSize/2, y);
    line(x, y + h, x + w/2-circSize/2, y + h);

    fill('#4287f5')
    ellipse(x + w - circSize/4 , y + h/2, circSize, circSize)
    strokeWeight(1);
}

function drawXorGate(x, y, w, h, textsize){

    let textColor = 'black';

    stroke(0);

    textSize(textsize);

    fill(textColor);
    strokeWeight(1);
    text("XOR", x + w/1.45 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
        x + w/2 ,
        y + h/2 ,
        w ,
        h ,
      PI + HALF_PI,
      TWO_PI + HALF_PI
    );
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    //Second line, to the left of gate
    let xoff = w/18;
    let yoff = h/20;
    strokeWeight(2 * w / 80);
    bezier(
        x-xoff, y + yoff,                         // Start point (left corner)
        x + w * 0.25 - xoff, y + h/4,          // First control point 
        x + w * 0.25 - xoff, y + 3*h/4, // Second control point
        x-xoff , y + h - yoff      // End point (middle bottom)


      );
    strokeWeight(4 * w / 80)
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    strokeWeight(1);
}

function drawXnorGate(x, y, w, h, textsize){

    let textColor = 'black';

    textsize = textsize/1.15

    stroke(0);

    textSize(textsize);

    let circSize = 15 * w / 80;

    fill(textColor);
    strokeWeight(1);
    text("XNOR", x + w/1.8 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    arc(
        x + w/2 - circSize/2,
        y + h/2 ,
        w ,
        h ,
      PI + HALF_PI,
      TWO_PI + HALF_PI
    );
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    //Second line, to the left of gate
    let xoff = w/18;
    let yoff = h/20;
    strokeWeight(2 * w / 80);
    bezier(
        x-xoff, y + yoff,                         // Start point (left corner)
        x + w * 0.25 - xoff, y + h/4,          // First control point 
        x + w * 0.25 - xoff, y + 3*h/4, // Second control point
        x-xoff , y + h - yoff      // End point (middle bottom)


      );
    strokeWeight(4 * w / 80)
    line(x, y, x + w/2 - circSize/2, y);
    line(x, y + h, x + w/2 - circSize/2, y + h);

    fill('#4287f5')
    ellipse(x + w - circSize/4 , y + h/2, circSize, circSize)
    strokeWeight(1);
}

function drawNotGate(x, y, w, h, textsize){

    let textColor = 'black';

    let circSize = 15 * w / 80;

    let circOffset = w/20

    stroke(0);

    textSize(textsize);

    fill(textColor);
    strokeWeight(1);
    text("NOT", x + w/2.5 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4 * w / 80)
    noFill();
    triangle(
        x+w-circOffset/0.4,y+h/2,
        x,y,
        x, y + h
      );
      fill('#4287f5')
      circle(x-circOffset + w, y + h/2, circSize);
      strokeWeight(1);
  
}
// Source: GameSounds.js
class GameSounds {
    /**
     * Create a new GameSounds instance
     */
    constructor() {
      this.sounds = {};
      this.music = {};
      this.currentMusic = null;
      this.soundVolume = 1.0;
      this.musicVolume = 0.5;
      this.soundEnabled = true;
      this.musicEnabled = true;
    }
  
    /**
     * Load a sound effect
     * @param {string} name - Identifier for the sound
     * @param {string} path - File path to the sound
     * @return {Promise} - Promise that resolves when the sound is loaded
     */
    loadSound(name, path) {
      return new Promise((resolve, reject) => {
        this.sounds[name] = loadSound(
          path,
          () => resolve(this.sounds[name]),
          (err) => reject(err)
        );
      });
    }
  
    /**
     * Load multiple sounds at once
     * @param {Object} soundPaths - Object with keys as sound names and values as file paths
     * @return {Promise} - Promise that resolves when all sounds are loaded
     */
    loadSounds(soundPaths) {
      const promises = [];
      for (const [name, path] of Object.entries(soundPaths)) {
        promises.push(this.loadSound(name, path));
      }
      return Promise.all(promises);
    }
  
    /**
     * Load a music track
     * @param {string} name - Identifier for the music
     * @param {string} path - File path to the music
     * @return {Promise} - Promise that resolves when the music is loaded
     */
    loadMusic(name, path) {
      return new Promise((resolve, reject) => {
        this.music[name] = loadSound(
          path,
          () => {
            this.music[name].setLoop(true);
            resolve(this.music[name]);
          },
          (err) => reject(err)
        );
      });
    }
  
    /**
     * Play a sound effect
     * @param {string} name - Name of the sound to play
     * @param {number} [volume] - Optional volume override (0.0 to 1.0)
     * @return {p5.SoundFile} - The sound that was played or null if not found
     */
    play(name, volume = null) {
      if (!this.soundEnabled || !this.sounds[name]) return null;
      
      const sound = this.sounds[name];
      sound.setVolume(volume !== null ? volume : this.soundVolume);
      sound.play();
      return sound;
    }
  
    /**
     * Play music track
     * @param {string} name - Name of the music to play
     * @param {number} [fadeTime=1.0] - Time in seconds to fade in
     * @return {p5.SoundFile} - The music that was played or null if not found
     */
    playMusic(name, fadeTime = 1.0) {
      if (!this.musicEnabled || !this.music[name]) return null;
  
      // Stop current music if any is playing
      if (this.currentMusic) {
        this.stopMusic(fadeTime);
      }
  
      const music = this.music[name];
      this.currentMusic = name;
      
      // Start at 0 volume and fade in
      music.setVolume(0);
      music.play();
      
      // Fade in
      const startTime = millis();
      const fadeInterval = setInterval(() => {
        const elapsed = (millis() - startTime) / 1000;
        const progress = min(elapsed / fadeTime, 1.0);
        music.setVolume(progress * this.musicVolume);
        
        if (progress >= 1.0) {
          clearInterval(fadeInterval);
        }
      }, 50);
      
      return music;
    }
  
    /**
     * Stop currently playing music
     * @param {number} [fadeTime=1.0] - Time in seconds to fade out
     */
    stopMusic(fadeTime = 1.0) {
      if (!this.currentMusic) return;
      
      const music = this.music[this.currentMusic];
      const startVolume = music.getVolume();
      const startTime = millis();
      
      const fadeInterval = setInterval(() => {
        const elapsed = (millis() - startTime) / 1000;
        const progress = min(elapsed / fadeTime, 1.0);
        music.setVolume(startVolume * (1 - progress));
        
        if (progress >= 1.0) {
          music.stop();
          clearInterval(fadeInterval);
        }
      }, 50);
      
      this.currentMusic = null;
    }
  
    /**
     * Pause all sounds
     */
    pauseAll() {
      // Pause sound effects
      Object.values(this.sounds).forEach(sound => {
        if (sound.isPlaying()) {
          sound.pause();
        }
      });
      
      // Pause music
      if (this.currentMusic) {
        this.music[this.currentMusic].pause();
      }
    }
  
    /**
     * Resume all paused sounds
     */
    resumeAll() {
      if (!this.soundEnabled && !this.musicEnabled) return;
      
      // Resume sound effects if sound is enabled
      if (this.soundEnabled) {
        Object.values(this.sounds).forEach(sound => {
          if (sound.isPaused()) {
            sound.play();
          }
        });
      }
      
      // Resume music if music is enabled
      if (this.musicEnabled && this.currentMusic) {
        if (this.music[this.currentMusic].isPaused()) {
          this.music[this.currentMusic].play();
        }
      }
    }
  
    /**
     * Set global volume for all sound effects
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setSoundVolume(volume) {
      this.soundVolume = constrain(volume, 0, 1);
    }
  
    /**
     * Set global volume for all music
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setMusicVolume(volume) {
      this.musicVolume = constrain(volume, 0, 1);
      if (this.currentMusic) {
        this.music[this.currentMusic].setVolume(this.musicVolume);
      }
    }
  
    /**
     * Enable or disable sound effects
     * @param {boolean} enabled - Whether sound effects should be enabled
     */
    enableSound(enabled) {
      this.soundEnabled = enabled;
    }
  
    /**
     * Enable or disable music
     * @param {boolean} enabled - Whether music should be enabled
     */
    enableMusic(enabled) {
      this.musicEnabled = enabled;
      
      if (!enabled && this.currentMusic) {
        this.music[this.currentMusic].pause();
      } else if (enabled && this.currentMusic && this.music[this.currentMusic].isPaused()) {
        this.music[this.currentMusic].play();
      }
    }
}
// Source: GameObjects.js
//put into global scope
let game;

let gameVolume = 0;

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

        this.gameScale = null;

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
                //Loud Incorrect Buzzer

                let loseNum = int(random(1, 5));
                botImg = loadImage(`../assets/images/answers/answers${loseNum}.png`);
                game.gameSounds.play('incorrect', gameVolume)

                showLose();
                return false; // Found a mismatch
            }
        }

        // Winner winner chicken dinner
        // window.alert("You Won!");
        //Second arg is volume, 0-1



        let winNum = int(random(5, 9));
        botImg = loadImage(`../assets/images/answers/answers${winNum}.png`);
        game.gameSounds.play('win_sound', gameVolume)
        game.gameSounds.play('yippeee', gameVolume)
        setTimeout(showWin, 2000);
        this.levelCompleted = true;
        return true;
    }

    transferStateToCollidingNodes(nodeObject) {// this.transferStateToCollidingNodes(gate.outputNode)
        //console.log(nodeObject)
        //VISUALIZE HASH
        // if (nodeObject._cellKeys) {
        //     stroke('purple')
        //     noFill()
        //     for (let key of nodeObject._cellKeys) {
        //         let xAndy = key.split(',')
        //         rect(xAndy[0] * 20, xAndy[1] * 20, 20, 20);
        //     }
        // }
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

        for (let comp of switchComponent.ComponentSHG.queryRegion(0, 0, this.gameWidth, this.gameHeight)) {
            comp.gameNode.state = comp.state;
            comp.display()
        }

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

        //Process and display Connection Line Nodes
        for (let line of this.connectionLines) {

            //Don't need to pull state, everything else is pushing state
            //this.takeStateFromCollidingNodes(line.inputNode)

            line.outputNode.state = line.inputNode.state;

            this.transferStateToCollidingNodes(line.outputNode);
            line.display();

            line.outputNode.state = line.inputNode.state = null;
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
                eNode.state = null;
            }
        }

    }

}




// Source: ConnectionObjects.js
class Connection {
    constructor(arrayOfLines) {
        this.arrayOfLines = arrayOfLines
        this.inputNode = new GateNode(arrayOfLines[0].x - Game.sizeOfNodes / 2, arrayOfLines[0].y - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
        GateNode.NodeSHG.insert(this.inputNode);
        this.outputNode = new GateNode(arrayOfLines[arrayOfLines.length - 1].x - Game.sizeOfNodes / 2, arrayOfLines[arrayOfLines.length - 1].y - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
        GateNode.NodeSHG.insert(this.outputNode);

        this.lineOffsets = []

    }

    static createConnection(lineArray, scale=1) {
        for (let point of lineArray){
            point.x *= scale;
            point.y *= scale;
        }
        let newLine = new Connection(lineArray);
        game.connectionLines.push(newLine);
    }

    setOffsets(x, y){

        this.lineOffsets = []
        
        for (let line of this.arrayOfLines){
            let newOffset = {
                offsetX: x - line.x,
                offsetY: y - line.y
            }

            this.lineOffsets.push(newOffset)
        }

    }

    drag(mx, my) {
        for (let i = 0; i < this.arrayOfLines.length; ++i){
            this.arrayOfLines[i].x = mx - this.lineOffsets[i].offsetX
            this.arrayOfLines[i].y = my - this.lineOffsets[i].offsetY
        }
        //move node to first line
        this.inputNode.move(this.arrayOfLines[0].x - Game.sizeOfNodes / 2, this.arrayOfLines[0].y - Game.sizeOfNodes / 2)
        GateNode.NodeSHG.update(this.inputNode);

        this.outputNode.move(this.arrayOfLines[this.arrayOfLines.length - 1].x - Game.sizeOfNodes / 2, this.arrayOfLines[this.arrayOfLines.length - 1].y - Game.sizeOfNodes / 2)
        GateNode.NodeSHG.update(this.outputNode);
    }

    display() {
        strokeWeight(2);
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
        strokeWeight(1);
    }
}

// Source: EndPointObjects.js
class ExitPoints {
    constructor(x, y, width, height, arrayOfNodeStates) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.botImageX = 0;
        this.botImageY = 0;
        this.botImageWidth = 0;
        this.botImageHeight = 0;
        this.arrayOfNodeStates = arrayOfNodeStates;
        this.endNodes = []

        //Equally Space Nodes Across ExitPoints object range
        let i = 0;
        //How far away should Nodes be from the edge?
        let offsetYAxis = Game.sizeOfNodes*4

        let yOff;

        for (let state of arrayOfNodeStates) {
            if (arrayOfNodeStates.length > 1) {
                let equallySpaceNodes = (height - offsetYAxis) / (arrayOfNodeStates.length - 1);
                yOff = y + (offsetYAxis / 2) + i * equallySpaceNodes - Game.sizeOfNodes / 2;
            }
            else {
                //Can handle one node
                yOff = y + height / 2 - Game.sizeOfNodes / 2;
            }
            //Borrow Logic Gate Node Size; May change Later.
            //Do something with states later?
            console.log("END NODES: " + (x + this.width / 2 - Game.sizeOfNodes / 2) + "," + yOff)
            let newNode = new GateNode(x + this.width / 2 - Game.sizeOfNodes / 2, yOff, Game.sizeOfNodes, Game.sizeOfNodes, this);
            GateNode.NodeSHG.insert(newNode);
            this.endNodes.push(newNode);
            ++i;
        }
    }
    static eNodeOffsetY = 20;
    display() {
        noFill();
        stroke('#5E5C6C')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        let i = 0;
        for (let eNode of this.endNodes) {
            //Red or green line depending on state
            stroke(this.arrayOfNodeStates[i] ? "green" : "red");
            line(eNode.x, eNode.y + eNode.height/2, eNode.x + 500, eNode.y + eNode.height/2);
            eNode.display();
            ++i;
        }
    }

    displayOnlyBox() {
        fill('#5E5C6C');
        stroke('black')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        noFill();
    }

    displayOnlyChildNodes() {
        let i = 0;
        let totalY = 0;
        let count = 0;
        
        // First pass: draw lines, collect Y positions
        for (let eNode of this.endNodes) {
            // Red or green line depending on state
            stroke(this.arrayOfNodeStates[i] ? "green" : "red");
            line(eNode.x, eNode.y + eNode.height / 2, eNode.x + 500, eNode.y + eNode.height / 2);
         
            totalY += eNode.y + eNode.height / 2; // Sum center Y positions
            count++;
    
            eNode.display();
            ++i;
        }
    
        // Second pass: after all lines are drawn, place one bot image
        if (count > 0 && botImg) {
            let avgY = totalY / count;
            this.botImageX = this.endNodes[0].x + 485;
            this.botImageY = avgY - botImg.height / 2;
            this.botImageWidth = botImg.width;
            this.botImageHeight = botImg.height;
            image(botImg, this.botImageX, this.botImageY, this.botImageWidth, this.botImageHeight);
        }
    }
}

class EntrancePoints {
    constructor(x, y, width, height, arrayOfNodeStates) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.arrayOfNodeStates = arrayOfNodeStates;
        this.entNodes = []

        //Equally Space Nodes Across ExitPoints object range
        let i = 0;
        //How far away should Nodes be from the edge?
        let offsetYAxis = Game.sizeOfNodes*4
        let equallySpaceNodes = (height - offsetYAxis) / (arrayOfNodeStates.length - 1)

        for (let state of arrayOfNodeStates) {
            //Borrow Logic Gate Node Size; May change Later.
            //Do something with states later?

            let newNode = new GateNode(x + this.width / 2 - Game.sizeOfNodes / 2, y + (offsetYAxis / 2) + i * equallySpaceNodes - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
            newNode.state = state;
            GateNode.NodeSHG.insert(newNode);
            this.entNodes.push(newNode);
            ++i;
        }
    }
    static eNodeOffsetY = 20;
    display() {
        fill('#5E5C6C');
        stroke('black')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        noFill();
        // noFill();
        // stroke('#5E5C6C')
        // rect(this.x, this.y, this.width, this.height)
        // stroke('black')
        for (let eNode of this.entNodes) {
            eNode.display();
        }
    }


}
// Source: DraggableObjects.js
class DraggableObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    pointIsWithin(x_coord, y_coord) {
        return (x_coord > this.x && x_coord < this.x + this.width && y_coord > this.y && y_coord < this.y + this.height);
    }

    startDragging() {
        DraggableObject.beingDragged.push(this);
    }

    stopDragging() {
        DraggableObject.beingDragged = [];
    }
    changeOffsets(x, y) {
        this.offsetX = x;
        this.offsetY = y;
    }
    drag(mx, my) {
        this.x = mx - this.offsetX;
        this.y = my - this.offsetY;
    }
    display() { rect(this.x, this.y, this.width, this.height) }
}
// Source: LogicGateObjects.js
//Dependent on DraggableObject

class LogicGate extends DraggableObject {

    inputNodes = [];

    outputNode = null;

    static GateSHG = new SpatialHashGrid(20);

    //change node offsets and size
    static gNodeLeftOffset = Game.sizeOfNodes*2;
    static gNodeRightOffset = Game.sizeOfNodes;

    //Can override later if need be.
    static gNodeSize = Game.sizeOfNodes;


    //NOT FINISHED. MAY USE SPRITES LATER.
    display() {
        drawGenericGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }

    //Override for subclasses of Gates. eg, NOT will only have one node.
    static createObject(x, y, width, height, gateClass = LogicGate) {
        let newObj = new gateClass(x, y, width, height);
        gateClass.GateSHG.insert(newObj);
        newObj.display();
        console.log(newObj);

        //Create nodes for gate; Change 15 here for bigger values
        let newInNode = new GateNode(x - gateClass.gNodeLeftOffset, y + 3 * height / 4 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode);
        newObj.inputNodes.push(newInNode);
        newInNode = new GateNode(x - gateClass.gNodeLeftOffset, y + height / 4 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode);
        newObj.inputNodes.push(newInNode);

        //Create output Node
        let newOutNode = new GateNode(x + width + gateClass.gNodeRightOffset, y + height / 2 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newOutNode);
        newObj.outputNode = newOutNode;

    }

    calculateOutput() {
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

class AndGate extends LogicGate {
    display() {
        drawAndGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        //If both nodes not colliding
        if (this.inputNodes[0].state === null || this.inputNodes[1].state === null){
            return null;
        }
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[1].collidesWithList().length === 0){
            return null;
        }
        return (this.inputNodes[0].state && this.inputNodes[1].state);
    }
}

class NandGate extends LogicGate {
    display() {
        drawNandGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        if (this.inputNodes[0].state === null || this.inputNodes[1].state === null){
            return null;
        }
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[1].collidesWithList().length === 0){
            return null;
        }
        return !(this.inputNodes[0].state && this.inputNodes[1].state);
    }
}

class OrGate extends LogicGate {
    display() {
        drawOrGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        if (this.inputNodes[0].state === null || this.inputNodes[1].state === null){
            return null;
        }
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[1].collidesWithList().length === 0){
            return null;
        }
        return (this.inputNodes[0].state || this.inputNodes[1].state);
    }
}

class NorGate extends LogicGate {
    display() {
        drawNorGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        if (this.inputNodes[0].state === null || this.inputNodes[1].state === null){
            return null;
        }
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[1].collidesWithList().length === 0){
            return null;
        }
        return !(this.inputNodes[0].state || this.inputNodes[1].state);
    }
}

class XorGate extends LogicGate {
    display() {
        drawXorGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        //(a && !b) || (!a && b)
        if (this.inputNodes[0].state === null || this.inputNodes[1].state === null){
            return null;
        }
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[1].collidesWithList().length === 0){
            return null;
        }
        return (this.inputNodes[0].state ^ this.inputNodes[1].state);
    }
}

class XnorGate extends LogicGate {
    display() {
        drawXnorGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        if (this.inputNodes[0].state === null || this.inputNodes[1].state === null){
            return null;
        }
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[1].collidesWithList().length === 0){
            return null;
        }
        //(a && !b) || (!a && b)
        return !(this.inputNodes[0].state ^ this.inputNodes[1].state);
    }
}

class NotGate extends LogicGate {
    display() {
        drawNotGate(this.x, this.y, this.width, this.height, this.width / 4);
        drawGateNodes(this);
    }
    calculateOutput() {
        if (this.inputNodes[0].collidesWithList().length === 0 || this.inputNodes[0].state === null){
            return null;
        }
        return !(this.inputNodes[0].state);
    }
    //Only one node; Exceptional; Hide the parent static method
    static createObject(x, y, width, height, gateClass = NotGate) {
        let newObj = new gateClass(x, y, width, height);
        gateClass.GateSHG.insert(newObj);
        newObj.display();
        console.log(newObj);

        //Create nodes for gate; Change 15 here for bigger values
        let newInNode = new GateNode(x - gateClass.gNodeLeftOffset, y + height / 2 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newInNode);
        newObj.inputNodes.push(newInNode);

        //Create output Node
        let newOutNode = new GateNode(x + width + gateClass.gNodeRightOffset, y + height / 2 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        GateNode.NodeSHG.insert(newOutNode);
        newObj.outputNode = newOutNode;

    }
}
// Source: ComponentsObjects.js
//Dependant on DraggableObjects

class switchComponent extends DraggableObject {
    constructor(x, y, w, h){
        super(x, y, w, h);
        this.state = false
        this.gameNode = null;
    }

    //For now, just here. Eventually, put in a parent class
    static ComponentSHG = new SpatialHashGrid(20);

    display(){
        drawSwitch(this.state, this.x, this.y, this.width, this.height)
        //console.log(this.gameNode)
        if (this.gameNode){
            this.gameNode.display()
        }
        
    }

    changeState(){
        this.state = !this.state;
        this.gameNode.state = !this.gameNode.state
    }

    static createObject(x, y, width, height) {

        let newObj = new switchComponent(x, y, width, height);
        switchComponent.ComponentSHG.insert(newObj);
        newObj.display();

        let newInNode = new GateNode(x+width + LogicGate.gNodeSize, y+height/2 - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, newObj);
        newObj.gameNode = newInNode
        GateNode.NodeSHG.insert(newInNode);

        newInNode.display();
        

        //Create nodes for gate; Change 15 here for bigger values
        // let newInNode = new GateNode(x - gateClass.gNodeLeftOffset, y + 3 * height / 4 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        // GateNode.NodeSHG.insert(newInNode);
        // newObj.inputNodes.push(newInNode);
    }
}

//Seperate into it's own file if we want to add more components
function drawSwitch(isOn, x, y, w, h) {
    push(); // Save current drawing state
    
    // Set colors based on state
    let circleColor, textColor, borderColor;
    let stateText;
    
    if (isOn) {
      borderColor = color(0, 255, 0); // Green stroke for on state
      circleColor = color(200, 255, 200); // Light green fill
      textColor = color(0, 150, 0); // Darker green for text
      stateText = "1"; // Binary 1 for ON
    } else {
      borderColor = color(255, 0, 0); // Red stroke for off state
      circleColor = color(255, 200, 200); // Light red fill
      textColor = color(150, 0, 0); // Darker red for text
      stateText = "0"; // Binary 0 for OFF
    }
    
    // Draw the circle
    strokeWeight(3);
    stroke(borderColor);
    fill(circleColor);
    ellipse(x+w/2, y+h/2, w, h);
    
    // Draw the text
    noStroke();
    fill(textColor);
    textAlign(CENTER, CENTER);
    textSize(min(w, h) * 0.5);
    text(stateText, x+w/2, y+h/2);
    
    pop(); // Restore drawing state
  }
export { DraggableObject, SpatialHashGrid, GateNode };