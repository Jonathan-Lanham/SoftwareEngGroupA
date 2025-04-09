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