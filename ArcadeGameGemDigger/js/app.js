// Global variables
var BORDER_LEFT = 0;
var BORDER_RIGHT = 707;
var BORDER_TOP = 0;
var BORDER_BOTTOM = 551;
var WATERLINE_VALUE = 53;

var ELEMENT_WIDTH = 101;
var ELEMENT_HEIGHT = 171;
var ELEMENT_DY = 83;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Initialize enemy speed, random int between 100 and 500
    this.speed = Math.floor(Math.random() * 301) + 100;

    // Initialize enemy position, randomly appeared at the left
    // side of one stone row
    var currRow = Math.floor(Math.random() * 5 )+ 1;
    this.x = BORDER_LEFT - ELEMENT_WIDTH;
    this.y = currRow * ELEMENT_DY - 20;

}

// Reset enemy
Enemy.prototype.reset = function(){
    // Enemy speed
    this.speed = Math.floor(Math.random() * 301) + 100;

    // Enemy position
    var currRow = Math.floor(Math.random() * 5 )+ 1;
    this.x = BORDER_LEFT - ELEMENT_WIDTH;
    this.y = currRow * ELEMENT_DY - 20;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, pause) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Border check
    if (!pause){
        if (this.x > BORDER_RIGHT){

            // Initialize enemy
            var currRow = Math.floor(Math.random() * 5 )+ 1;
            this.x = BORDER_LEFT - ELEMENT_WIDTH;
            this.y = currRow * ELEMENT_DY - 20;

            this.speed = Math.floor(Math.random() * 301) + 100;

        }else{
            this.x += this.speed * dt;
        }
    }


}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.start = false;
    this.gameover = false;
    this.selector = 2;
    this.life = 3;
    this.sprite = 'images/Selector.png';
    this.gemCollected = 0;

    // Initialize player's position
    this.x = ELEMENT_WIDTH * 3;
    this.y = ELEMENT_DY * 7 -30;
}

// Reset the player's position to the initial place
Player.prototype.reset = function(){
    this.x = ELEMENT_WIDTH * 3;
    this.y = ELEMENT_DY * 7 - 30; // BORDER_BOTTOM
    this.selector = 2;

}

// Change the player's sprite
Player.prototype.change = function(){
    switch (this.selector){
        case 0:
            this.sprite = 'images/char-cat-girl.png';
            break;
        case 1:
            this.sprite = 'images/char-horn-girl.png';
            break;
        case 2:
            this.sprite = 'images/char-boy.png';
            break;
        case 3:
            this.sprite = 'images/char-pink-girl.png';
            break;
        case 4:
            this.sprite = 'images/char-princess-girl.png';
            break;
        default:
            break;
    }
}

// Update the player's position, required method for game
Player.prototype.update = function(key){

    if (this.start == false){
        // Select player character
        switch (key){
            case 'enter':
                this.start = true;
                this.change();
                this.reset();
                break;
            case 'left':
                this.x -= ELEMENT_WIDTH;
                this.selector--;
                if (this.x < ELEMENT_WIDTH){
                    this.x = ELEMENT_WIDTH;
                }
                break;
            case 'right':
                this.x += ELEMENT_WIDTH;
                this.selector++;
                if (this.x > 5 * ELEMENT_WIDTH){
                    this.x = 5 * ELEMENT_WIDTH;
                }
                break;
            default:
                break;
        }
    }else{
        var step = 5;
        switch (key){
            case 'space':
                // Restart game
                if (this.gameover){
                    this.start = false;
                    this.gameover = false;
                    this.sprite = 'images/Selector.png';
                    this.life = 3;
                    this.gemCollected = 0;
                    this.reset();
                }
                break;
            case 'left':
                // Move player to left
                if (!this.gameover){
                    this.x = this.x - step;
                    if (this.x < BORDER_LEFT) {
                        this.x = BORDER_LEFT;
                    }
                }
                break;
            case 'right':
                // Move player to right
                if (!this.gameover){
                    this.x = this.x + step;
                    if (this.x > BORDER_RIGHT - ELEMENT_WIDTH){
                        this.x = BORDER_RIGHT - ELEMENT_WIDTH;
                    }
                }
                break;
            case 'up':
                // Move player up
                if (!this.gameover){
                    this.y = this.y - step;
                }

                break;
            case 'down':
                // Move player down
                if (!this.gameover){
                    this.y = this.y + step;
                }
                break;
            default:
                break;
        }
    }

    // Selector validness check
    if (this.selector < 0){
        this.selector = 0;
    }

    if (this.selector > 4){
        this.selector = 4;
    }

    // Player out of screen check, y direction
    if (this.y < WATERLINE_VALUE){
        this.y = WATERLINE_VALUE;
    }
    if (this.y > BORDER_BOTTOM){
        this.y = BORDER_BOTTOM;
    }

}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Determine the key user pressed
Player.prototype.handleInput = function(key){
    this.update(key);
}

// Gem class
var Gem = function(){
    // Assign gem sprite
    var spriteNum = Math.floor(Math.random() * 3);

    switch (spriteNum){
        case 0:
            this.sprite = 'images/Gem Blue.png';
            break;
        case 1:
            this.sprite = 'images/Gem Green.png';
            break;
        case 2:
            this.sprite = 'images/Gem Orange.png';
            break;
        default:
            this.sprite = 'images/Gem Blue.png';
            break;
    }

    // Gem position
    var currRow = Math.floor(Math.random() * 5 ) + 1;
    var currCol = Math.floor(Math.random() * 7);
    this.x = currCol * ELEMENT_WIDTH;
    this.y = currRow * ELEMENT_DY - 20;
}

Gem.prototype.update = function(){

    var spriteNum = Math.floor(Math.random() * 3);

    switch (spriteNum){
        case 0:
            this.sprite = 'images/Gem Blue.png';
            break;
        case 1:
            this.sprite = 'images/Gem Green.png';
            break;
        case 2:
            this.sprite = 'images/Gem Orange.png';
            break;
        default:
            this.sprite = 'images/Gem Blue.png';
            break;
    }

    // Gem position
    var currRow = Math.floor(Math.random() * 5 ) + 1;
    var currCol = Math.floor(Math.random() * 7);
    this.x = currCol * ELEMENT_WIDTH;
    this.y = currRow * ELEMENT_DY - 20;
}

Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 30, 60, 102);
}

// Heart class to recover player's life
var Heart = function(){
    this.sprite = 'images/Heart.png';
    this.visible = false; // Parameter to determine whether to show heart on screen
    this.active = false;  // Parameter to determine whether to check heart's location

    var hRow = Math.floor(Math.random() * 7 ) + 1;
    var hCol = Math.floor(Math.random() * 7);
    this.x = hCol * ELEMENT_WIDTH;
    this.y = hRow * ELEMENT_DY - 20;
}

Heart.prototype.update = function(){
    // Update heart location
    var hRow = Math.floor(Math.random() * 7 ) + 1;
    var hCol = Math.floor(Math.random() * 7);
    this.x = hCol * ELEMENT_WIDTH;
    this.y = hRow * ELEMENT_DY - 20;
}

Heart.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 30, 60, 102);
}

Heart.prototype.sleep = function(){
    this.visible = false;
    this.active = false;
}

// Star class for invincible status
var Star = function(){
    this.sprite = 'images/Star.png';
    this.active = false;

    this.x = 0;
    this.y = 0;
}

Star.prototype.update = function(slocx, slocy){
    this.x = slocx;
    this.y = slocy;
}

Star.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Star.prototype.sleep = function(){
    this.active = false;
}

// Key class
var Key = function(){
    this.sprite = 'images/Key.png';
    this.active = false;    // Parameter to determine whether to show key on screen
    this.visible = false;   // Parameter to determine whether to check key's location

    var kRow = Math.floor(Math.random() * 7 ) + 1;
    var kCol = Math.floor(Math.random() * 7);
    this.x = kCol * ELEMENT_WIDTH;
    this.y = kRow * ELEMENT_DY - 20;
}

Key.prototype.update = function(){
    // Randomly update key's location
    var kRow = Math.floor(Math.random() * 7 ) + 1;
    var kCol = Math.floor(Math.random() * 7);
    this.x = kCol * ELEMENT_WIDTH;
    this.y = kRow * ELEMENT_DY - 20;
}

Key.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 30, 60, 102);
}

Key.prototype.sleep = function(){
    this.active = false;
    this.visible = false;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyNum = 4;   // Total number of enemies
var i = 0;
while(i < enemyNum){
    var enemy = new Enemy();
    allEnemies.push(enemy);
    i++;
}

var allGems = [];
var gemNum = 5;
for (i = 0; i < gemNum; i++){
    var newGem = new Gem();
    var updateGem = true;
    var addedGem = false;

    if (allGems.length === 0){
        allGems.push(newGem);
    }else{

        // Make sure no overlay gems on the screen
        do {
            for (var j = 0; j < allGems.length; j++){
                if (newGem.x != allGems[j].x && newGem.y != allGems[j].y){
                    allGems.push(newGem);
                    addedGem = true;
                    updateGem = false;
                    break;
                }
            }

            if (updateGem){
                newGem.update();
            }

        }while(!addedGem);

    }
}

var player = new Player();
var star = new Star();
var heart = new Heart();
var key = new Key();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (e.keyCode == 38 || e.keyCode == 32 ||e.keyCode == 40){
        e.preventDefault();
    }

    player.handleInput(allowedKeys[e.keyCode]);
});
