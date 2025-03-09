import { Game } from './skGateObjects.js';

console.log("testing the Game Object")

// Basic assertion function
function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
}

function testGameObj(){
    test = new Game(1)
    assert(test.gameScale === 1)
}