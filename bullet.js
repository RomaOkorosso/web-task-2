class Bullet {
    constructor(x, y, dx) {
        this.x = x;
        this.y = y;
        this.dx = dx;
    }

    draw() {
        var bullet_img = new Image();
        bullet_img.src = 'imgs/bullet.png';
        context.drawImage(bullet_img, this.x, this.y, 13, 13);
    }

    move() {
        this.x += this.dx;
    }

    outOfRange() {
        return this.x > 900
    }

    wasHitItem(item) {
        return (this.x + 13 >= item.x && this.x <= item.x + 75) && (this.y + 13 >= item.y && this.y <= item.y + 75);
    }

    wasHitEnemy(enemy) {
        return this.wasHitItem(enemy);
    }

    wasCollided() {
        var self = this;
        var collided = false;
        enemies.forEach(function (enemy, i) {
            if (self.wasHitEnemy(enemy)) {
                delete enemies[i];
                ecount--;
                ekills++;
                collided = true;
                current_score += 25;
            }
        });
        enemies = enemies.filter(item => item !== undefined);
    }
}