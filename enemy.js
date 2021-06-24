class Enemy {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {
        var enemy_img = new Image();
        enemy_img.src = 'imgs/enemy.png';
        context.drawImage(enemy_img, this.x, this.y, 75, 75);
    }

    move() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
}