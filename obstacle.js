class Obstacle {
    constructor(x, y, dx) {
        this.x = x;
        this.y = y;
        this.dx = dx;
    }

    draw() {
        var oimg = new Image();
        oimg.src = 'imgs/bullet.png';
        context.drawImage(oimg, this.x, this.y, 20, 13);
    }

    move() {
        this.x -= this.dx;
    }

    outOfRange() {
        return this.x < 0;
    }
}