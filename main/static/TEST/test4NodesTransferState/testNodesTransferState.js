// from skGateObjects.js
const assert = require('assert');
const skObjects = require('../skGateObjects.js');
const Node = skObjects.Node;
const SpatialHashGrid = skObjects.SpatialHashGrid

function testConstructor() {
  const parent = {};
  const node = new Node(10, 20, 30, 40, parent);
  
  assert.strictEqual(node.x, 10, "x should be initialized to 10");
  assert.strictEqual(node.y, 20, "y should be initialized to 20");
  assert.strictEqual(node.width, 30, "width should be initialized to 30");
  assert.strictEqual(node.height, 40, "height should be initialized to 40");
  assert.strictEqual(node.parentObject, parent, "parentObject should be initialized correctly");
  assert.strictEqual(node.state, false, "state should be initialized to false");
  
  console.log("✓ Constructor test passed");
}

// Test 2: Move method
function testMove() {
  const node = new Node(0, 0, 10, 10, null);
  
  // Test initial position
  assert.strictEqual(node.x, 0, "Initial x should be 0");
  assert.strictEqual(node.y, 0, "Initial y should be 0");
  
  // Test moving to positive coordinates
  node.move(15, 25);
  assert.strictEqual(node.x, 15, "x should be updated to 15");
  assert.strictEqual(node.y, 25, "y should be updated to 25");
  
  // Test moving to negative coordinates
  node.move(-10, -20);
  assert.strictEqual(node.x, -10, "x should be updated to -10");
  assert.strictEqual(node.y, -20, "y should be updated to -20");
  
  console.log("✓ Move method test passed");
}

// Test 3: collidesWithList with no collisions
function testNoCollisions() {
  
  // Create nodes with no overlap
  const node1 = new Node(0, 0, 10, 10, null);
  const node2 = new Node(20, 20, 10, 10, null);
  
  // Add nodes to the spatial hash grid
  Node.NodeSHG.insert(node1);
  Node.NodeSHG.insert(node2);
  
  // Call collidesWithList on node1
  test = node1.collidesWithList();
  
  // Verify no collisions were found
  assert(JSON.stringify(test) == JSON.stringify([]), "Should log empty array when no collisions exist");
  
  // Cleanup
  Node.NodeSHG.clear()
  console.log("SHG After Clear: " + JSON.stringify(Node.NodeSHG.queryRegion(0,0,100,100)))
  
  console.log("✓ No collisions test passed");
}

// Test 4: collidesWithList with collisions
function testForCollisions1() {
  
  // Create nodes with overlap
  const node1 = new Node(0, 0, 30, 30, null);
  const node2 = new Node(0, 0, 10, 10, null);
  
  // Add nodes to the spatial hash grid
  Node.NodeSHG.insert(node1);
  Node.NodeSHG.insert(node2);

  console.log(JSON.stringify(Node.NodeSHG))
  
  // Call collidesWithList on node1
  test = node1.collidesWithList();
  
  // Verify no collisions were found
  assert(test[0] == node2, "Should log array when collisions exist");
  
  // Cleanup
  Node.NodeSHG.clear()
  console.log("SHG After Clear: " + JSON.stringify(Node.NodeSHG.queryRegion(0,0,100,100)))
  
  console.log("✓ Collisions test passed");
}

// Test 5: collidesWithList with collisions, candidate exists ? but doesn't collide
function testForCollisions2() {
  
  // Create nodes with overlap
  const node1 = new Node(10, 10, 30, 30, null);
  const node2 = new Node(0, 0, 9, 9, null);
  const node3 = new Node(5, 5, 5, 5, null);
  
  // Add nodes to the spatial hash grid
  Node.NodeSHG.insert(node1);
  Node.NodeSHG.insert(node2);
  Node.NodeSHG.insert(node3);

  console.log(JSON.stringify(Node.NodeSHG))
  
  // Call collidesWithList on node1
  test = node1.collidesWithList();
  
  // Verify no collisions were found
  assert(test[0] == node3, "Should log array when collisions exist");
  
  // Cleanup
  Node.NodeSHG.clear()
  console.log("SHG After Clear: " + JSON.stringify(Node.NodeSHG.queryRegion(0,0,100,100)))
  
  console.log("✓ Collisions test passed");
}

// Test 5: collidesWithList with collisions, candidate exists ? but doesn't collide
function testStress() {
  console.log("STRESS TESTING COLLISION WITH MANY OBJECTS. PASS MANUALLY.")
  
  // Create nodes randomly
  // Create 6 random sized rectangles
  const node1 = new Node(10, 10, 40, 40, null);
  Node.NodeSHG.insert(node1)
  const minq = 0;
  const maxq = 1000;
  let min = Math.ceil(minq);
  let max = Math.floor(maxq);
  for (let i = 0; i < 10000; i++) {
    const width = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    const height = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    const y = Math.floor(Math.random() * (max - min + 1)) + min;
    Node.NodeSHG.insert(new Node(x, y, width, height, null));
  }

  console.log("SHG AFTER INSERT: " + [...Node.NodeSHG.grid.entries()])
  
  // Call collidesWithList on node1
  collidesWithNode1 = node1.collidesWithList();

  for (let res_node of collidesWithNode1){
    assert(Node.NodeSHG.checkCollision(node1, res_node), "Nodes actually collide")
  }

  console.log("\nOBJECTS THAT OVERLAP NODE1: " + JSON.stringify(collidesWithNode1))

  console.log("✓ Overlap Stress test passed");
  
  // Cleanup
  Node.NodeSHG.clear()
  console.log("SHG After Clear: " + JSON.stringify(Node.NodeSHG.queryRegion(0,0,100,100)))
  
  console.log("✓ Collisions test passed");
}
  
// Run all tests
function runTests() {
  try {
    testConstructor();
    testMove();
    testNoCollisions();
    testForCollisions1();
    testForCollisions2();
    testStress();
    console.log("All tests passed!");
  } catch (error) {
    console.error("Tests failed:", error.message);
    console.error("Error name:", error.name);
    console.error("Error stack:", error.stack);
  }
}
  
// Execute tests
runTests();