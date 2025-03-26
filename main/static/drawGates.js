//Contains all functions to draw logic gates using p5js

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

    let circSize = 15;
    
    // 
    //let s = scalar;
    // 
    textSize(textsize);
    // 

    fill(textColor);
    strokeWeight(1);
    text("NAND", x + w/2.1 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    arc(
    x + w/2 - circSize/2,
    y + h/2 ,
    w ,
    h ,
    PI + HALF_PI,
    TWO_PI + HALF_PI
    );
    line(x, y, x + w/2 - circSize/2, y);
    line(x, y + h, x + w/2 - circSize/2, y + h);
    line(x, y, x, y + h);

    fill('#4287f5')
    ellipse(x + w - circSize/4 , y + h/2, circSize, circSize)

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
    text("AND", x + w/2 - textsize*1.25 , y + h/2 + textsize/3);
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

function drawOrGate(x, y, w, h, textsize){

    let textColor = 'black';

    stroke(0);

    textSize(textsize);

    fill(textColor);
    strokeWeight(1);
    text("OR", x + w/1.45 - textsize*1.5 , y + h/2 + textsize/3);
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
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
}

function drawNorGate(x, y, w, h, textsize){

    let textColor = 'black';

    stroke(0);

    textSize(textsize);

    let circSize = 15;

    fill(textColor);
    strokeWeight(1);
    text("NOR", x + w/1.6 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    arc(
        x + w/2 -circSize/2,
        y + h/2 ,
        w ,
        h ,
      PI + HALF_PI,
      TWO_PI + HALF_PI
    );
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    line(x, y, x + w/2-circSize/2, y);
    line(x, y + h, x + w/2-circSize/2, y + h);

    fill('#4287f5')
    ellipse(x + w - circSize/4 , y + h/2, circSize, circSize)
}

function drawXorGate(x, y, w, h, textsize){

    let textColor = 'black';

    stroke(0);

    textSize(textsize);

    fill(textColor);
    strokeWeight(1);
    text("XOR", x + w/1.45 - textsize*1.5 , y + h/2 + textsize/3);
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
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    //Second line, to the left of gate
    let xoff = w/18;
    let yoff = h/20;
    bezier(
        x-xoff, y + yoff,                         // Start point (left corner)
        x + w * 0.25 - xoff, y + h/4,          // First control point 
        x + w * 0.25 - xoff, y + 3*h/4, // Second control point
        x-xoff , y + h - yoff      // End point (middle bottom)


      );
    line(x, y, x + w/2, y);
    line(x, y + h, x + w/2, y + h);
}

function drawXnorGate(x, y, w, h, textsize){

    let textColor = 'black';

    textsize = textsize/1.15

    stroke(0);

    textSize(textsize);

    let circSize = 15;

    fill(textColor);
    strokeWeight(1);
    text("XNOR", x + w/1.8 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    arc(
        x + w/2 - circSize/2,
        y + h/2 ,
        w ,
        h ,
      PI + HALF_PI,
      TWO_PI + HALF_PI
    );
    bezier(
        x, y,                         // Start point (left corner)
        x + w * 0.25, y + h/4,          // First control point 
        x + w * 0.25, y + 3*h/4, // Second control point
        x, y + h        // End point (middle bottom)
    );
    //Second line, to the left of gate
    let xoff = w/18;
    let yoff = h/20;
    bezier(
        x-xoff, y + yoff,                         // Start point (left corner)
        x + w * 0.25 - xoff, y + h/4,          // First control point 
        x + w * 0.25 - xoff, y + 3*h/4, // Second control point
        x-xoff , y + h - yoff      // End point (middle bottom)


      );
    line(x, y, x + w/2 - circSize/2, y);
    line(x, y + h, x + w/2 - circSize/2, y + h);

    fill('#4287f5')
    ellipse(x + w - circSize/4 , y + h/2, circSize, circSize)
}

function drawNotGate(x, y, w, h, textsize){

    let textColor = 'black';

    let circSize = 15;

    stroke(0);

    textSize(textsize);

    fill(textColor);
    strokeWeight(1);
    text("NOT", x + w/2.5 - textsize*1.5 , y + h/2 + textsize/3);
    strokeWeight(4)
    noFill();
    triangle(
        x+w-20,y+h/2,
        x,y,
        x, y + h
      );
      circle(x + w-10, y + h/2, circSize);
  
}