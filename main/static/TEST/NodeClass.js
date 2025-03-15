
class GateNode{
    constructor(x, y, width, height, parentObject){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parentObject = parentObject;
        this.state = false;
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
        //change 15/2 to make circle larger
        fill(this.state ? "green" : "red");
        ellipse(this.x+ LogicGate.gNodeSize/2, this.y+LogicGate.gNodeSize/2, this.width, this.height);
        rect(this.x, this.y, this.width, this.height);
    }
}

class EntrancePoint extends Node{
    constructor(x, y, width, height, state){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.state = state;
    }

    static createEntranceNode(x, y, state){
        let newInNode = new EntranceNode(x, y, LogicGate.gNodeSize, LogicGate.gNodeSize, state);
        GateNode.NodeSHG.insert(newInNode)
    }
  
    // display() {
    //   stroke(0);
    //   strokeWeight(3);
    //   let s = this.scalar
  
    //   fill(this.state ? "green" : "red");
    //   strokeWeight(1);
    //   ellipse(this.x * s, this.y * s, 15 * s, 15 * s);
    // }
  }