class Connection {
    constructor(arrayOfLines) {
        this.arrayOfLines = arrayOfLines
        this.inputNode = new GateNode(arrayOfLines[0].x - Game.sizeOfNodes / 2, arrayOfLines[0].y - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
        GateNode.NodeSHG.insert(this.inputNode);
        this.outputNode = new GateNode(arrayOfLines[arrayOfLines.length - 1].x - Game.sizeOfNodes / 2, arrayOfLines[arrayOfLines.length - 1].y - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
        GateNode.NodeSHG.insert(this.outputNode);

        this.lineOffsets = []

    }

    static createConnection(lineArray, scaleSize=1) {
        for (let point of lineArray){
            point.x *= scaleSize;
            point.y *= scaleSize;
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
