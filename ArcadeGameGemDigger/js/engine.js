/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    canvas.height = 772;
    //doc.body.appendChild(canvas);  // origin
    var gameList = doc.getElementById('game-container');
    var instructTxt = doc.getElementsByClassName('instruction');
    gameList.insertBefore(canvas, gameList.childNodes[0]);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set timeout if invincible mode is active*/
        if (star.active){
            setTimeout(function(){star.active = false;}, 5000);
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);

    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        if (player.start){
            // Check invincible mode is on/off
            if (!star.active){
                checkCollisions();
            }

            // Check gem collection
            checkGemCollection();
            if (heart.visible){
                checkHeartPosition();
                if (heart.active){
                    checkHeartCollection();
                }
            }

            // Check key collection
            if (key.visible){
                checkKeyLocation();
                if (key.active){
                    checkKeyCollection();
                }
            }

            // Check whether to active invincible mode
            if (star.active){
                star.update(player.x, player.y);
            }


        }

    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt, player.gameover);
        });
        player.update();
    }

    /*This function is called to check collisions between player and
     *enemies.
     */
    function checkCollisions(){

        var playerCenterX = player.x + 50;
        var playerCenterY = player.y + 120;

        allEnemies.forEach(function(enemy){
            var enemyCenterX = enemy.x + 50;
            var enemyCenterY = enemy.y + 110;
            var dx = Math.abs(enemyCenterX - playerCenterX);
            var dy = Math.abs(enemyCenterY - playerCenterY);

            if (dx < 70 && dy < 55){
                if (player.life == 1){
                    player.gameover = true;
                }else{
                    player.life--;
                    player.reset();

                    if (player.life == 2){
                        heart.visible = true;
                    }

                }
            }
        });

    }

    function checkGemCollection(){

        var playerCenterX = player.x + 50;
        var playerCenterY = player.y + 120;

        for (var i = 0; i < allGems.length; i++){
            var gemCenterX = allGems[i].x + 50;
            var gemCenterY = allGems[i].y + 100;
            var dx = Math.abs(gemCenterX - playerCenterX);
            var dy = Math.abs(gemCenterY - playerCenterY);

            // Player hit gem
            if (dx < 50 && dy < 50){
                player.gemCollected++;

                // Check whether to activate key
                if (player.gemCollected % 7 == 0 && player.gemCollected > 0){
                    key.visible = true;
                }

                // Make sure no overlay on the existing objects
                var updateGemi = true;
                do {
                    allGems[i].update();
                    var ix = allGems[i].x;
                    var iy = allGems[i].y;
                    updateGemi = false;
                    for(var j = 0; j < allGems.length; j++){
                        if (j != i){
                            if (ix == allGems[j].x && iy == allGems[j].y){
                                updateGemi = true;
                            }
                        }
                    }

                    if (heart.active){
                        if (ix == heart.x && iy == heart.y){
                           updateGemi = true;
                        }
                    }

                    if (key.active){
                        if (ix == key.x && iy == key.y){
                           updateGemi = true;
                        }
                    }

                }while(updateGemi);
            }
        }

    }

    function checkHeartPosition(){

        if (!heart.active){
            var updateHeart = true;

            // Update heart position if it is collided with gem
            do {
                heart.update();
                var hx = heart.x;
                var hy = heart.y;
                updateHeart = false;
                for (var i = 0; i < allGems.length; i++){
                    if (hx == allGems[i].x && hy == allGems[i].y){
                        updateHeart = true;
                    }
                }

                if (key.active){
                    if (hx == key.x && hy == key.y){
                        updateHeart = true;
                    }
                }

            }while(updateHeart);

            // Heart position ok
            heart.active = true;
        }

    }

    function checkHeartCollection(){

        var heartX = heart.x + 50;
        var heartY = heart.y + 100;
        var playerCenterX = player.x + 50;
        var playerCenterY = player.y + 120;
        var dx = Math.abs(heartX - playerCenterX);
        var dy = Math.abs(heartY - playerCenterY);

        // Player hit heart
        if (dx < 50 && dy < 50){
            player.life++;
            heart.sleep();
        }

    }

    function checkKeyLocation(){

        if (!key.active){
            var updateKey = true;

            // Update key position if it covers gem
            do {
                key.update();
                var kx = key.x;
                var ky = key.y;
                updateKey = false;
                for (var i = 0; i < allGems.length; i++){
                    if (kx == allGems[i].x && ky == allGems[i].y){
                        updateKey = true;
                    }
                }

                if (heart.active){
                    if (kx == heart.x && ky == heart.y){
                        updateKey = true;
                    }
                }

            }while(updateKey);

            // Key position ok
            key.active = true;
        }
    }

    function checkKeyCollection(){
        var keyX = key.x + 50;
        var keyY = key.y + 100;
        var playerCenterX = player.x + 50;
        var playerCenterY = player.y + 120;
        var dx = Math.abs(keyX - playerCenterX);
        var dy = Math.abs(keyY - playerCenterY);

        // Player collides with key
        if (dx < 50 && dy < 50){
            star.active = true;
            key.sleep();
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 5 of stone
                'images/stone-block.png',   // Row 2 of 5 of stone
                'images/stone-block.png',   // Row 3 of 5 of stone
                'images/stone-block.png',   // Row 4 of 5 of stone
                'images/stone-block.png',   // Row 5 of 5 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png',   // Row 2 of 2 of grass
                'images/char-cat-girl.png',       // No.1 of 5 characters
                'images/char-horn-girl.png',      // No.2 of 5 characters
                'images/char-boy.png',            // No.3 of 5 characters
                'images/char-pink-girl.png',      // No.4 of 5 characters
                'images/char-princess-girl.png',  // No.5 of 5 characters
                'images/Heart.png'                // Heart
            ],
            numRows = 8,
            numCols = 7,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        if (!player.start){
            for (col = 1; col < numCols - 1; col++){
                /* Place 5 characters in one line for the user to select.
                 */
                ctx.drawImage(Resources.get(rowImages[col + 7]), col * 101, player.y);
            }

            // Instruction
            ctx.fillStyle = 'white';
            ctx.fillText('Ready?', canvas.width/2, ELEMENT_DY * 3);
            ctx.fillText('Press ENTER to Start', canvas.width/2, ELEMENT_DY * 5);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText('Ready?', canvas.width/2, ELEMENT_DY * 3);
            ctx.strokeText('Press ENTER to Start', canvas.width/2, ELEMENT_DY * 5);

        }

        renderEntities();

        // Create player's life label
        ctx.drawImage(Resources.get(rowImages[13]), 15, 40, 60, 102);
        ctx.font = '36pt Sigmar One';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('X', 120, 110);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('X', 120, 110);

        // Render player's life
        ctx.fillStyle = 'white';
        ctx.fillText(player.life, 180, 107);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(player.life, 180, 107);

        // Create gem collection label
        ctx.drawImage(Resources.get('images/Gem Orange.png'), 450, 40, 50, 85);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('X', 550, 110);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('X', 550, 110);

        ctx.fillStyle = 'white';
        ctx.fillText(player.gemCollected, 610, 107);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(player.gemCollected, 610, 107);



        if (player.gameover){
            ctx.fillStyle = 'white';
            ctx.fillText('Oops!!', canvas.width/2, ELEMENT_DY * 3 - 20);
            ctx.fillText('High Score:', canvas.width/2 - 40, ELEMENT_DY * 4 );
            ctx.fillText(player.gemCollected, canvas.width/2 + 200, ELEMENT_DY * 4);
            ctx.fillText('Press SPACE to Restart', canvas.width/2, ELEMENT_DY * 5 + 20);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText('Oops!!', canvas.width/2, ELEMENT_DY * 3 - 20);
            ctx.strokeText('High Score:', canvas.width/2 - 40, ELEMENT_DY * 4 );
            ctx.strokeText(player.gemCollected, canvas.width/2 + 200, ELEMENT_DY * 4);
            ctx.strokeText('Press SPACE to Restart', canvas.width/2, ELEMENT_DY * 5 + 20);

            ctx.fillStyle = 'white';
            ctx.fillText('0', 180, 107);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText('0', 180, 107);

            heart.sleep();
            star.sleep();
            key.sleep();
        }





    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        if (player.start){
            allGems.forEach(function(gem){
                gem.render();
            });

            if (heart.active && heart.visible){
                heart.render();
            }

            if (key.active){
                key.render();
            }

            allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            if (star.active){
                star.render();
            }
        }

        player.render();

    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Heart.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Star.png',
        'images/Key.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
