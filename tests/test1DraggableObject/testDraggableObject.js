// from gkGateObjects.js
const assert = require('assert');
const gkObjects = require('../test_build.js');
const DraggableObject = gkObjects.DraggableObject;

// Define global variables used in the class (for testing)
global.mouseX = 0;
global.mouseY = 0;

// Test suite
(function runTests() {
  console.log('Running DraggableObject tests...');
  
  testConstructor();
  testPointIsWithin();
  testDragging();
  
  console.log('All tests passed!');
})();

function testConstructor() {
  console.log('Testing constructor...');
  
  const obj = new DraggableObject(10, 20, 30, 40);
  
  assert.strictEqual(obj.x, 10, 'x should be initialized correctly');
  assert.strictEqual(obj.y, 20, 'y should be initialized correctly');
  assert.strictEqual(obj.width, 30, 'width should be initialized correctly');
  assert.strictEqual(obj.height, 40, 'height should be initialized correctly');
  assert.strictEqual(obj.offsetX, 0, 'offsetX should default to 0');
  assert.strictEqual(obj.offsetY, 0, 'offsetY should default to 0');
  
  console.log('Constructor tests passed!');
}

function testPointIsWithin() {
  console.log('Testing pointIsWithin method...');
  
  const obj = new DraggableObject(100, 100, 50, 50);
  
  // Points inside
  assert.strictEqual(obj.pointIsWithin(125, 125), true, 'Point in center should be within');
  assert.strictEqual(obj.pointIsWithin(101, 101), true, 'Point near top-left should be within');
  assert.strictEqual(obj.pointIsWithin(149, 149), true, 'Point near bottom-right should be within');
  
  // Points outside
  assert.strictEqual(obj.pointIsWithin(99, 125), false, 'Point to the left should be outside');
  assert.strictEqual(obj.pointIsWithin(151, 125), false, 'Point to the right should be outside');
  assert.strictEqual(obj.pointIsWithin(125, 99), false, 'Point above should be outside');
  assert.strictEqual(obj.pointIsWithin(125, 151), false, 'Point below should be outside');
  assert.strictEqual(obj.pointIsWithin(0, 0), false, 'Distant point should be outside');
  
  // Edge cases (current implementation excludes exact boundary points)
  assert.strictEqual(obj.pointIsWithin(100, 100), false, 'Top-left corner should be outside with current logic');
  assert.strictEqual(obj.pointIsWithin(150, 150), false, 'Bottom-right corner should be outside with current logic');
  
  console.log('pointIsWithin tests passed!');
}

function testDragging() {
  console.log('Testing dragging functionality...');
  
  // Reset the static array before testing
  DraggableObject.beingDragged = [];
  
  const obj1 = new DraggableObject(10, 10, 20, 20);
  const obj2 = new DraggableObject(50, 50, 20, 20);
  
  // Test startDragging
  obj1.startDragging();
  assert.strictEqual(DraggableObject.beingDragged.length, 1, 'One object should be in beingDragged array');
  assert.strictEqual(DraggableObject.beingDragged[0], obj1, 'First object should be in the array');
  
  obj2.startDragging();
  assert.strictEqual(DraggableObject.beingDragged.length, 2, 'Two objects should be in beingDragged array');
  assert.strictEqual(DraggableObject.beingDragged[1], obj2, 'Second object should be in the array');
  
  // Test stopDragging
  obj1.stopDragging();
  assert.strictEqual(DraggableObject.beingDragged.length, 0, 'Array should be empty after stopDragging');
  
  // Test drag method
  global.mouseX = 100;
  global.mouseY = 200;
  
  obj1.offsetX = 5;
  obj1.offsetY = 10;
  obj1.drag(mouseX, mouseY);
  
  assert.strictEqual(obj1.x, 95, 'X position should be updated correctly');
  assert.strictEqual(obj1.y, 190, 'Y position should be updated correctly');
  
  console.log('Dragging tests passed!');
}