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