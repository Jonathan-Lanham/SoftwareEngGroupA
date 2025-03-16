function drawGateNodes(obj){
    //console.log(obj)

    for (let node of obj.inputNodes){
        //console.log(node)
        node.display();
        obj.outputNode.display();
    }

}

function drawGenericGate(x, y, w, h, textsize){ 
    
    let textColor = 'black';
    // 
    stroke(0);
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("GATE", x + w/2 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    arc(
    x + w/2 ,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    line(x, y, x, y + h);

    //line(x, y + h/2, x + width, y + h/2);
}

function drawNandGate(x, y, w, h, textsize){ 
    
    let textColor = 'black';
    // 
    stroke(0);
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("NAND", x + w/2 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    arc(
    x + w/2 ,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    line(x, y, x, y + h);

    ellipse(x + w, y + h/2, 15, 15)

    //line(x, y + h/2, x + width, y + h/2);
}

function drawAndGate(x, y, w, h, textsize){ 
    
    let textColor = 'black';
    // 
    stroke(0);
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("AND", x + w/2 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    arc(
    x + w/2 ,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
    line(x, y, x, y + h);

    //line(x, y + h/2, x + width, y + h/2);
}