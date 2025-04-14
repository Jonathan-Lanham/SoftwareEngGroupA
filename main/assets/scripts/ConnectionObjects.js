class Connection {
    constructor(arrayOfLines) {
        this.arrayOfLines = arrayOfLines
        this.inputNode = new GateNode(arrayOfLines[0].x - Game.sizeOfNodes / 2, arrayOfLines[0].y - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
        GateNode.NodeSHG.insert(this.inputNode);
        this.outputNode = new GateNode(arrayOfLines[arrayOfLines.length - 1].x - Game.sizeOfNodes / 2, arrayOfLines[arrayOfLines.length - 1].y - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
        GateNode.NodeSHG.insert(this.outputNode);
    }

    static createConnection(lineArray, scale=1) {
        for (let point of lineArray){
            point.x *= scale;
            point.y *= scale;
        }
        let newLine = new Connection(lineArray);
        game.connectionLines.push(newLine);
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
