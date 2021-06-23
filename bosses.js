class Boss {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {
        var boss_img = new Image();
        boss_img.src = 'imgs/boss.png';
        context.drawImage(boss_img, this.x, this.y, 200, 200);
    }

    move() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
}