class Player {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    draw(z) {
        context.fillStyle = '#f20000';
        context.fillRect(this.x + 75 / 2 + 3, this.y + 75 / 2, 10, 10);
    }
}