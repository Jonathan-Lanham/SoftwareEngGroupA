class DraggableObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    pointIsWithin(x_coord, y_coord) {
        return (x_coord > this.x && x_coord < this.x + this.width && y_coord > this.y && y_coord < this.y + this.height);
    }

    startDragging() {
        DraggableObject.beingDragged.push(this);
    }

    stopDragging() {
        DraggableObject.beingDragged = [];
    }
    changeOffsets(x, y) {
        this.offsetX = x;
        this.offsetY = y;
    }
    drag(mx, my) {
        this.x = mx - this.offsetX;
        this.y = my - this.offsetY;
    }
    display() { rect(this.x, this.y, this.width, this.height) }
}