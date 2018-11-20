// Enemies our player must avoid
var Enemy = function() {

    // create x and y coordinate object parameters
    this.x = 0;
    this.y = 0;

    // set initial speed
    this.speed = function() {
        return Math.floor(Math.random()*(500-50+1)+20);
    }();

    // method to change speed
    this.changeSpeed = function() {
        this.speed = Math.floor(Math.random()*(500-50+1)+20);
    };


    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.


    // move enemy object by initial speed
    this.x = ( this.x + (this.speed * dt) );

    // capture collisions with player
    if (this.x + 101 > player.x && this.x < player.x + 101 && this.y + 83 > player.y && this.y < player.y + 83) {
        game.resetScore();
        player.x = 202;
        player.y = 300;
    }
    
    // if object moves off screen, move it back to start and change speed
    if(this.x > 505 ) {
        this.x = - 100;
        this.changeSpeed();
    }



};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 300;

};

Player.prototype.update = function(direction) {
    switch (direction) {
        case 'left':
        this.x = this.x - 101;
        break;
        case 'right':
        this.x = this.x + 101;
        break;
        case 'up':
        this.y = this.y - 83;
        break;
        case 'down':
        this.y = this.y + 83;
        break;
    };

    if (this.y <= -32 ) {
        this.y = 300;

        // update score and display it when reaching the water
        game.increaseScore();
        game.displayScore();
    };
    

};

Player.prototype.handleInput = function(direction) {
    //capture arrow click and send direction to update() method
        switch (direction) {
            case 'left':
            if(this.x == 0) {
            } else {
                player.update('left');
            }
            break;
            case 'up':
            if(this.y == -32) {
            } else {
                player.update('up') 
            }
            break;
            case 'right':
            if(this.x == 404) {
            } else {
                player.update('right')
            }
             break;
             case 'down':
             if(this.y == 383) {
             } else {
                player.update('down')
             }
            break;
        }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// add collectables object class
var Collectable = function() {
    const typeArr = ['images/Heart.png','images/Key.png','images/Rock.png','images/Star.png','images/Gem Blue.png','images/Gem Green.png','images/Gem Orange.png'];
    this.sprite = typeArr[Math.floor(Math.random()*(5-0+1)+0)];
    this.x = Math.floor(Math.random()*(4-1+1)+1) * 101;
    this.y = (Math.floor(Math.random()*(3-1+1)+1) * 83) - 13;
    this.bonus = Math.floor(Math.random()*(10-1+1)+1);
};

Collectable.prototype.update = function() {

    // capture collections from the player
    if (this.x + 101 > player.x && this.x < player.x + 101 && this.y -19 + 83 > player.y && this.y < player.y -19 + 83) {
        game.manageCollection.call(this);
        game.displayScore();
    };

};

Collectable.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Create a game class constructor in IIFE to hold all the game instance variables and methods
const Game = (function() {

    // Closure variables
    let allCollectables = [];       // holds all Collectable objects on screen
    let score = 0;                  // main score vairable
    let collectedCollectables = []; // array of collectables collected by player

    let scoreScreen = document.createElement('div');    // score div
    scoreScreen.textContent = '0';
    scoreScreen.classList.add('scoreScreen');
    scoreScreen.style.fontSize = '0';
    scoreScreen.style.color = `rgba(255,0,0,1)`;
    scoreScreen.style.visibility = `hidden`;

    let body = document.getElementsByTagName('body')[0];
    body.appendChild(scoreScreen);
    let gameOver = false;

    let timerId;        //track running timeers

    // constructor function
    return function Game() {
        
        // return methods
        this.someVariable = function() {
            return someVariable;
        };

        this.allCollectables = function() {
            return allCollectables;
        };

        this.score = function() {
            return score;
        };

        this.collectedCollectables = function() {
            return collectedCollectables;
        };

        this.over = function() {
            return gameOver;
        };


        // functional methods

        // add a new collectable to the game
        this.popCollectable = function() {

            if (allCollectables.length >= 3) {
                allCollectables.splice(0,1);
            } 

            let collectable = new Collectable();
            allCollectables.push(collectable);
    
        };

        // handle player collecting collectable items
        this.manageCollection = function() {

            // check if this has been called from a Collectable
            if (this instanceof Collectable) {

                // get the index of this particular collectable
                let index = allCollectables.indexOf(this);
                // add it to the collected array
                collectedCollectables.push(allCollectables[index]);
                // remove it from the board
                allCollectables.splice(index,1);
                // add collectable bonus to score
                score += this.bonus;

            } else {
                console.log(`this method must be called using 'call' method from a Collectable item
                It does not do anything on a Game object`);
            }
        };


        this.increaseScore = function() {

            score ++;

        }

        this.resetScore = function() {

            score = 0;

        }

        // handle displaying of the score on screen
        this.displayScore  = function() {
            
            // if a new displayScore() runs before previous timer completes, end it and reset styles
            if(timerId) {
                // debugger;
                clearInterval(timerId)
                scoreScreen.style.visibility = `hidden`;
                scoreScreen.style.fontSize = '0';
                scoreScreen.style.color = `rgba(255,0,0,1)`;
            }

            scoreScreen.textContent = game.score();
            scoreScreen.style.fontSize = '0';
            scoreScreen.style.color = `rgba(255,0,0,1)`;
            scoreScreen.style.visibility = `visible`;

            // updated to use js to adjust inline styles instead of CSS classes and transitions which seemed to cause lag when running
            let start = Date.now(); // remember start time

            let timer = setInterval(function() {
                timerId = timer;

                // how much time passed from the start?
                let timePassed = Date.now() - start;

                if (timePassed >= 2000) {
                    clearInterval(timer); // finish the animation after 2 seconds
                    timerId = null;
                    scoreScreen.style.visibility = `hidden`;
                    return;
                }

                // draw the animation at the moment timePassed
                draw(timePassed);

            }, 20);

            // change font size and color as a function of time passed
            function draw(timePassed) {
                scoreScreen.style.fontSize = `${timePassed / 5}px`;
                scoreScreen.style.color = `rgba(255,0,0,${(1/2000)*(2000-timePassed)})`;
            }
        };

        this.gameOver = function() {
            gameOver = true;

            let gameOverScreen = document.createElement('div');
            gameOverScreen.classList.add('overlay');

            let textContainer = document.createElement('div');
            textContainer.classList.add('text-container');
            textContainer.innerText = `GAME OVER..
            you scored ${score} points and collected ${collectedCollectables.length} collectables`;
            

            let images = collectedCollectables.map(function(item) {
                const width = `${100/collectedCollectables.length}%`
                const str = item.sprite;
                const alt = str.substring(str.lastIndexOf('/')+1);
                const img = `<img src="${item.sprite}" alt="${alt}" width="${width}" height="100%">`;
                return img;
            });
            html = images.join('');
            let imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainer.innerHTML = html;

            gameOverScreen.appendChild(textContainer);
            gameOverScreen.appendChild(imageContainer);
            body.appendChild(gameOverScreen);
            
        }
        

    };

})();




Game.prototype.update = function() {

    if (this.score() >= 20) {
        if(!this.over()) {
            this.gameOver();
        }
    }
}


let game = new Game();


setInterval(function () {

    game.popCollectable();

}, 10000);



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let enemy1 = new Enemy();
enemy1.x = 0;
enemy1.y = 217;

let enemy2 = new Enemy();
enemy2.x = 0;
enemy2.y = 134;

let enemy3 = new Enemy();
enemy3.x = 0;
enemy3.y = 51;


let allEnemies = [enemy1, enemy2, enemy3];

let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

