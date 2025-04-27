class ExitPoints {
    constructor(x, y, width, height, arrayOfNodeStates) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.botImageX = 0;
        this.botImageY = 0;
        this.botImageWidth = 0;
        this.botImageHeight = 0;
        this.arrayOfNodeStates = arrayOfNodeStates;
        this.endNodes = []

        //Equally Space Nodes Across ExitPoints object range
        let i = 0;
        //How far away should Nodes be from the edge?
        let offsetYAxis = Game.sizeOfNodes*4

        let yOff;

        for (let state of arrayOfNodeStates) {
            if (arrayOfNodeStates.length > 1) {
                let equallySpaceNodes = (height - offsetYAxis) / (arrayOfNodeStates.length - 1);
                yOff = y + (offsetYAxis / 2) + i * equallySpaceNodes - Game.sizeOfNodes / 2;
            }
            else {
                //Can handle one node
                yOff = y + height / 2 - Game.sizeOfNodes / 2;
            }
            //Borrow Logic Gate Node Size; May change Later.
            //Do something with states later?
            console.log("END NODES: " + (x + this.width / 2 - Game.sizeOfNodes / 2) + "," + yOff)
            let newNode = new GateNode(x + this.width / 2 - Game.sizeOfNodes / 2, yOff, Game.sizeOfNodes, Game.sizeOfNodes, this);
            GateNode.NodeSHG.insert(newNode);
            this.endNodes.push(newNode);
            ++i;
        }
    }
    static eNodeOffsetY = 20;
    display() {
        noFill();
        stroke('#5E5C6C')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        let i = 0;
        for (let eNode of this.endNodes) {
            //Red or green line depending on state
            stroke(this.arrayOfNodeStates[i] ? "green" : "red");
            line(eNode.x, eNode.y + eNode.height/2, eNode.x + 500, eNode.y + eNode.height/2);
            eNode.display();
            ++i;
        }
    }

    displayOnlyBox() {
        fill('#5E5C6C');
        stroke('black')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        noFill();
    }

    displayOnlyChildNodes() {
        let i = 0;
        let totalY = 0;
        let count = 0;
        
        // First pass: draw lines, collect Y positions
        for (let eNode of this.endNodes) {
            // Red or green line depending on state
            stroke(this.arrayOfNodeStates[i] ? "green" : "red");
            line(eNode.x, eNode.y + eNode.height / 2, eNode.x + 500, eNode.y + eNode.height / 2);
         
            totalY += eNode.y + eNode.height / 2; // Sum center Y positions
            count++;
    
            eNode.display();
            ++i;
        }
    
        // Second pass: after all lines are drawn, place one bot image
        if (count > 0 && botImg) {
            let avgY = totalY / count;
            this.botImageX = this.endNodes[0].x + 485;
            this.botImageY = avgY - botImg.height / 2;
            image(botImg, this.botImageX, this.botImageY);
        }
    }
}

class EntrancePoints {
    constructor(x, y, width, height, arrayOfNodeStates) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.arrayOfNodeStates = arrayOfNodeStates;
        this.entNodes = []

        //Equally Space Nodes Across ExitPoints object range
        let i = 0;
        //How far away should Nodes be from the edge?
        let offsetYAxis = Game.sizeOfNodes*4
        let equallySpaceNodes = (height - offsetYAxis) / (arrayOfNodeStates.length - 1)

        for (let state of arrayOfNodeStates) {
            //Borrow Logic Gate Node Size; May change Later.
            //Do something with states later?

            let newNode = new GateNode(x + this.width / 2 - Game.sizeOfNodes / 2, y + (offsetYAxis / 2) + i * equallySpaceNodes - Game.sizeOfNodes / 2, Game.sizeOfNodes, Game.sizeOfNodes, this);
            newNode.state = state;
            GateNode.NodeSHG.insert(newNode);
            this.entNodes.push(newNode);
            ++i;
        }
    }
    static eNodeOffsetY = 20;
    display() {
        fill('#5E5C6C');
        stroke('black')
        rect(this.x, this.y, this.width, this.height)
        stroke('black')
        noFill();
        // noFill();
        // stroke('#5E5C6C')
        // rect(this.x, this.y, this.width, this.height)
        // stroke('black')
        for (let eNode of this.entNodes) {
            eNode.display();
        }
    }


}