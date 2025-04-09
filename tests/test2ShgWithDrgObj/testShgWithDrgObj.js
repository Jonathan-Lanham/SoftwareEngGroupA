// from skGateObjects.js
const assert = require('assert');
const skObjects = require('../skGateObjects.js');
const DraggableObject = skObjects.DraggableObject;
const spatialHash = require('../scripts/spatialHash.js');
const SpatialHashGrid = spatialHash.SpatialHashGrid;


// Test integration between the two classes
function testDraggableObjectWithSHG() {
    console.log("Testing DraggableObject mapped by a Spatial Hash Grid...");
    
    const grid = new SpatialHashGrid(5);
    const objA = new DraggableObject(10, 10, 15, 15);
    const objB = new DraggableObject(50, 50, 15, 15);
    
    objA._shg_id = 1;
    objB._shg_id = 2;
    
    grid.insert(objA);
    grid.insert(objB);

    // Objects should NOT be in collision range
    let collided = false;
    grid.checkAllCollisions((a, b) => {
      collided = true;
    });

    console.log(`(${objA.x}, ${objA.y}) TO (${objA.x + objA.width}, ${objA.y + objA.y + objA.height}) 
        SHOULD NOT COLLIDE WITH \n(${objB.x}, ${objB.y}) TO (${objB.x + objB.width}, ${objB.y + objB.height})\n--------`
    )

    assert(!collided, "Objects should NOT collide");
    
    // Test dragging and updating in grid
    objA.startDragging();
    objA.drag(40, 40);
    grid.update(objA);
    
    // Now objects should be in collision range
    collided = false;
    grid.checkAllCollisions((a, b) => {
      collided = true;
    });

    console.log(`(${objA.x}, ${objA.y}) TO (${objA.x + objA.width}, ${objA.y + objA.y + objA.height}) 
        SHOULD COLLIDE WITH \n(${objB.x}, ${objB.y}) TO (${objB.x + objB.width}, ${objB.y + objB.height})\n--------`
    )
    
    assert(collided, "Objects should collide after dragging");

    objA.drag(0, 0);
    grid.update(objA);
    
    // Now objects should be in collision range
    collided = false;
    grid.checkAllCollisions((a, b) => {
      collided = true;
    });

    console.log(`(${objA.x}, ${objA.y}) TO (${objA.x + objA.width}, ${objA.y + objA.height}) 
        SHOULD NOT COLLIDE WITH \n(${objB.x}, ${objB.y}) TO (${objB.x + objB.width}, ${objB.y + objB.height})\n--------`
    )
    
    assert(!collided, "Objects should NOT collide after dragging");

    objA.drag(35,35)
    objB.drag(56,56)
    grid.update(objA);
    grid.update(objB);
    
    // Test query region after dragging
    const regionObjects = grid.queryRegion(35, 35, 20, 20);
    console.log(regionObjects)
    assert(regionObjects.length === 2, "Query should return both objects after dragging");
    
    console.log("Integration tests passed!");
  }
  
  // Run all tests
  function runTests() {
    try {
      //testSpatialHashGrid();
      //testDraggableObject();
      testDraggableObjectWithSHG();
      console.log("All tests passed!");
    } catch (error) {
      console.error("Tests failed:", error.message);
    }
  }
  
  // Execute tests
  runTests();