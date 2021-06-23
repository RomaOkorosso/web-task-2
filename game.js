function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

include("player.js");
include("enemy.js");
include("bullet.js");
include("obstacle.js");
include("bosses.js");

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyUnpressed);
canvas.addEventListener("mousemove", checkPos);
var fadeId = 0;

context.font = "30px Arial";

var state = 0; //0-main menu 1-game 2-death-screen
var Img = [];
var z = 0;
var current_score = 0;
var best_score = 0;
var enemies = [];
var ecount = 0, ekills = 0, boss_hp = -1;

var bullets = [];
var obstacles = [];
var boss;

var gameOver = new Image();
gameOver.src = "img/gameover.png";

for (var enemy = 0; enemy < 1; enemy++) {
    Img[enemy] = new Image();
    Img[enemy].src = "pimg/" + enemy + ".gif";
}

function makeEnemy() {
    let ex = 900;
    ey = Math.random() * 525;
    edx = Math.random(-45) * -20;
    edy = Math.random(-10) * 10;
    enemy = new Enemy(ex, ey, edx, edy);
    enemies.push(enemy);
}

function makeBoss() {
    boss_hp = 60;
    let boss_x = 900;
    let boss_y = 450;
    let boss_dx = -10;
    let boss_dy = -10;
    boss = new Boss(boss_x, boss_y, boss_dx, boss_dy);
}

function makeBullet() {
    var bx = player.x + 75;
    var by = player.y + 75 / 2 - 5 / 2;
    var bdx = 15;
    var bullet = new Bullet(bx, by, bdx);

    bullets.push(bullet);
}

var kd = 0;

var pl = {x: 100, y: 300, dx: 10, dy: 10}; //player param
var player = new Player(pl.x, pl.y, pl.dx, pl.dy);
var player_hp = 3;

var timer = 0;
var btimer = 0;
var godtimer = 0;

var enemy_img = new Image();
enemy_img.src = 'imgs/enemy.png';

var buttonX = [250, 250, 250];
var buttonY = [200, 320, 390];
var buttonW = [549, 577, 403];
var buttonH = [90, 63, 63];


var leftKeyPressed = false;
var rightKeyPressed = false;
var upKeyPressed = false;
var downKeyPressed = false;
var spaceKeyPressed = false;

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
const SPACE_KEY = 32;

function keyPressed(event) {
    if (event.keyCode == LEFT_KEY) {
        leftKeyPressed = true;
    }
    if (event.keyCode == RIGHT_KEY) {
        rightKeyPressed = true;
    }
    if (event.keyCode == UP_KEY) {
        upKeyPressed = true;
    }
    if (event.keyCode == DOWN_KEY) {
        downKeyPressed = true;
    }
    if (event.keyCode == SPACE_KEY) {
        if (kd <= 0) {
            makeBullet();
            kd = 20;
        }
    }

}

function keyUnpressed(event) {
    if (event.keyCode == LEFT_KEY) {
        leftKeyPressed = false;
    }
    if (event.keyCode == RIGHT_KEY) {
        rightKeyPressed = false;
    }
    if (event.keyCode == UP_KEY) {
        upKeyPressed = false;
    }
    if (event.keyCode == DOWN_KEY) {
        downKeyPressed = false;
    }
    if (event.keyCode == SPACE_KEY) {
        spaceKeyPressed = false;
    }
}

function shoot() {
    if (kd <= 0) {
        makeBullet();
        kd = 20;
    }
}

function movePlayer() {
    if (leftKeyPressed && player.x - player.dx >= 0) {
        player.x -= player.dx;
    }
    if (rightKeyPressed && player.x + player.dx <= 825) {
        player.x += player.dx;
    }
    if (upKeyPressed && player.y - player.dy >= 0) {
        player.y -= player.dy;
    }
    if (downKeyPressed && player.y + player.dy <= 525) {
        player.y += player.dy;
    }
}

function makeObst(enemy_x, enemy_y) {
    var ox = enemy_x;
    var oy = enemy_y + 75 / 2;
    var odx = 10;

    var obstacle = new Obstacle(ox, oy, odx);

    obstacles.push(obstacle);
}

function moveEnemy() {
    if (godtimer > 0) {
        godtimer--;
    }
    timer++;
    if (timer % 20 == 0 && ecount < 30 && ekills <= 60 && godtimer == 0) {
        makeEnemy();
        ecount++;
    }


    for (enemy in enemies) {
        if (timer % 30 == 0) {
            makeObst(enemies[enemy].x, enemies[enemy].y);
        }
        enemies[enemy].move();
        //border
        if (enemies[enemy].x <= 0) {
            enemies[enemy].x = 900;
            enemies[enemy].y = Math.random() * 525;
        }
        if (enemies[enemy].y >= 525 || enemies[enemy].y < 0) enemies[enemy].dy = -enemies[enemy].dy;
        //collusion
        if (enemies[enemy].y + 75 > player.y + 75 / 2 && enemies[enemy].y < player.y + 75 - 75 / 2 && enemies[enemy].x + 75 > player.x + 75 / 2 + 3 && enemies[enemy].x < player.x + 75 - (75 / 2 + 3)) {
            godtimer = 180;
            player_hp--;
            current_score -= 50;
            enemies.forEach(function (enemy, i) {
                delete enemies[i];
                ecount--;
            });
            obstacles.forEach(function (obstacle, i) {
                delete obstacles[i];
            });
            enemies = enemies.filter(item => item !== undefined);
            obstacles = obstacles.filter(item => item !== undefined);

            player.x = 100;
            player.y = 300;

            console.log('hit');
        }
    }
}

function moveBoss() {
    if (timer % 25 == 0 && godtimer == 0) {
        makeObst(boss.x, boss.y);
        makeObst(boss.x + 50, boss.y + 50);
        makeObst(boss.x - 50, boss.y - 50);
        makeObst(boss.x + 100, boss.y + 100);
        makeObst(boss.x - 100, boss.y - 100);
    }
    boss.move();
    if (boss.x <= 500 || boss.x > 900)
        boss.dx = -boss.dx
    if (boss.y >= 525 || boss.y < 0)
        boss.dy = -boss.dy;
    if (boss.y + 200 > player.y + 75 / 2 && boss.y < player.y + 75 - 75 / 2 && boss.x + 200 > player.x + 75 / 2 + 3 && boss.x < player.x + 75 - (75 / 2 + 3)) {
        godtimer = 180;
        player_hp--;
        current_score -= 50;
        obstacles.forEach(function (obstacle, i) {
            delete obstacles[i];
        });
        obstacles = obstacles.filter(item => item !== undefined);

        player.x = 100;
        player.y = 300;

        console.log('hit');
    }
}

function moveObstacles() {
    for (item in obstacles) {
        obstacles[item].move();
        if (obstacles[item].outOfRange()) {
            delete obstacles[item]
            curscore++;
        } else if (obstacles[item].y + 13 > player.y + 75 / 2 && obstacles[item].y < player.y + 75 - 75 / 2 && obstacles[item].x + 20 > player.x + 75 / 2 + 3 && obstacles[item].x < player.x + 75 - (75 / 2 + 3)) {
            godtimer = 180;
            player_hp--;
            current_score -= 50;
            obstacles.forEach(function (obstacle, i) {
                delete obstacles[i];
            });
            enemies.forEach(function (enemy, i) {
                delete enemies[i];
            });
        }

    }
    enemies = enemies.filter(item => item !== undefined);
    obstacles = obstacles.filter(item => item !== undefined);
}

function moveBullet() {
    if (kd > 0) {
        kd--;
    }
    for (let bullet in bullets) {
        bullets[bullet].move();
        if (bullets[bullet].outOfRange()) {
            delete bullets[bullet];
        } else if (bullets[bullet].hasCollided()) {
            delete bullets[bullet];
        } else if (bosshp > -1 && bullets[bullet].x + 13 >= boss.x && bullets[bullet].x <= boss.x + 200 && bullets[bullet].y + 13 >= boss.y && bullets[bullet].y <= boss.y + 75) {
            delete bullets[bullet];
            current_score += 10;
            boss_hp--;
        }
    }
    bullets = bullets.filter(item => item !== undefined);
}

function game() {
    update();
    render();
    requestAnimFrame(game);
}

function update() {

    if (state == 0) {
        current_score = 0;
    }
    if (state == 1) {

        if (ekills > 60 && bosshp == -1) {
            makeBoss();
            enemies.forEach(function (enemy, i) {
                delete enemies[i];
            });
            enemies = enemies.filter(item => item !== undefined);
        }
        if (boss_hp > -1) {
            moveBoss();
        }
        movePlayer();
        moveEnemy();
        moveBullet();
        moveObstacles();
    }
    if (player_hp == 0 || boss_hp == 0) {

        state = 2;
        document.getElementById('game').style.cursor = "default";
    }
    if (state == 2) {
        if (current_score > best_score) {
            best_score = current_score;
        }
        player_hp = 3;
        ekills = 0;
        boss_hp = -1;
    }
}

function render() {

    if (state == 0) {
        context.fillText("Best score :" + best_score, 50, 50);
    }
    if (state == 1) {
        for (i in enemies) enemies[i].draw();
        for (i in bullets) bullets[i].draw();
        for (i in obstacles) obstacles[i].draw();

        z++
        if (z >= 75) {
            z = 0;
        }
        player.draw(Math.floor(z / 5));
        context.fillText("score :" + current_score, 50, 50);
        if (boss_hp > -1) {
            boss.draw();
        }
    }
    if (state == 2) {
        context.drawImage(gameOver, 300, 200);
        context.fillText("Your score :" + current_score, 300, 350);
        context.fillText("Best score :" + best_score, 300, 400);
        context.drawImage(menu, 300, 420);
    }

}

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimatoinFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimatoinFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();