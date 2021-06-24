class Player {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {

        var player_img = new Image();
        player_img.src = 'imgs/spaceship.png';
        context.drawImage(player_img, this.x, this.y);
    }
}