//Dependant on DraggableObjects

class switchComponent extends DraggableObject {
    constructor(x, y, w, h){
        super(x, y, w, h);
        this.state = false
        this.gameNode = null;
    }

    //For now, just here. Eventually, put in a parent class
    static ComponentSHG = new SpatialHashGrid(20);

    display(){
        drawSwitch(this.state, this.x, this.y, this.width, this.height)
        //console.log(this.gameNode)
        if (this.gameNode){
            this.gameNode.display()
        }
        
    }

    changeState(){
        this.state = !this.state;
        this.gameNode.state = !this.gameNode.state
    }

    static createObject(x, y, width, height) {

        let newObj = new switchComponent(x, y, width, height);
        switchComponent.ComponentSHG.insert(newObj);
        newObj.display();

        let newInNode = new GateNode(x+width + LogicGate.gNodeSize, y+height/2 - LogicGate.gNodeSize/2, LogicGate.gNodeSize, LogicGate.gNodeSize, newObj);
        newObj.gameNode = newInNode
        GateNode.NodeSHG.insert(newInNode);

        newInNode.display();
        

        //Create nodes for gate; Change 15 here for bigger values
        // let newInNode = new GateNode(x - gateClass.gNodeLeftOffset, y + 3 * height / 4 - gateClass.gNodeSize / 2, gateClass.gNodeSize, gateClass.gNodeSize, newObj);
        // GateNode.NodeSHG.insert(newInNode);
        // newObj.inputNodes.push(newInNode);
    }
}

//Seperate into it's own file if we want to add more components
function drawSwitch(isOn, x, y, w, h) {
    push(); // Save current drawing state
    
    // Set colors based on state
    let circleColor, textColor, borderColor;
    let stateText;
    
    if (isOn) {
      borderColor = color(0, 255, 0); // Green stroke for on state
      circleColor = color(200, 255, 200); // Light green fill
      textColor = color(0, 150, 0); // Darker green for text
      stateText = "1"; // Binary 1 for ON
    } else {
      borderColor = color(255, 0, 0); // Red stroke for off state
      circleColor = color(255, 200, 200); // Light red fill
      textColor = color(150, 0, 0); // Darker red for text
      stateText = "0"; // Binary 0 for OFF
    }
    
    // Draw the circle
    strokeWeight(3);
    stroke(borderColor);
    fill(circleColor);
    ellipse(x+w/2, y+h/2, w, h);
    
    // Draw the text
    noStroke();
    fill(textColor);
    textAlign(CENTER, CENTER);
    textSize(min(w, h) * 0.5);
    text(stateText, x+w/2, y+h/2);
    
    pop(); // Restore drawing state
  }