
class Node{
    constructor(x, y, width, height, parentObject){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parentObject = parentObject;
        this.state = false
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
        let candidates = Node.NodeSHG.findNearbyObjects(this);
        //console.log("CANDIDATES: " + JSON.stringify(candidates))
        for (let node of candidates){
            if (Node.NodeSHG.checkCollision(node, this)){
                result.push(node);
            }
        }
        //console.log("RESULT: " + JSON.stringify(result));
        return result;
    }
}