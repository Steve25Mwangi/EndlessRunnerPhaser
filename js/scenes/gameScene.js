// create a new scene
let gameScene = new Phaser.Scene('MainGame');

// some parameters for our scene
gameScene.init = function () {
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;
    this.jumpSpeed = -500;
    this.speed = -200;
    this.ifEndGame = false;
    this.isStartGame = false;
    this.distanceCovered = 0;
    this.jumpCount = 0;
};

gameScene.create = function () {

    this.bgNames = [
        {
            index: 0,
            name: 'bg',
        },
        {
            index: 1,
            name: 'bg2'
        }
    ]
    this.bgs = this.physics.add.group({
        allowGravity: false
    });

    //bg = this.add.sprite(this.gameWidth *, 0, 'bg').setOrigin(0, 0).setScale(0.5);
    let xOffset = 0;
    for (let i = 0; i < 3; i++) {
        if (i > 0) {
            xOffset += 0.5;
        }
        bg = this.bgs.get(this.gameWidth * xOffset, -50, 'bg').setOrigin(0, 0).setScale(0.5);
        //bg.setVelocityX(this.speed);

    };

    this.midBgs2 = this.physics.add.group({
        allowGravity: false
    });

    let mid2Offset = 0;

    for (let i = 0; i < 3; i++) {
        if (i > 0) {
            mid2Offset += 0.5;
        }
        midBg2 = this.midBgs2.get(this.gameWidth * mid2Offset, -25, 'bgMid').setOrigin(0, 0).setScale(0.5);

    }

    this.midBgs = this.physics.add.group({
        allowGravity: false
    });

    let midXOffset = 0;

    for (let i = 0; i < 3; i++) {
        if (i > 0) {
            midXOffset += 0.5;
        }
        midBg = this.midBgs.get(this.gameWidth * midXOffset, 0, 'bg2').setOrigin(0, 0).setScale(0.5);

    }

    // Create a sprite using a frame from the atlas
    //let tree1 = this.add.sprite(100, 200, 'sprites', 'treeLong.png').setOrigin(0, 0).setScale(1);        
    let block = this.add.sprite(400, 455, 'block');
    block.scaleY = 0.5
    block.scaleX = 5;
    this.physics.add.existing(block, true);

    // Set initial state of jump completion flag
    this.jumpComplete = true;

    this.player = this.physics.add.sprite((this.gameWidth / 2) - 400, (this.gameHeight / 2), 'player', 15).setInteractive();
    this.player.scale = 0.5;
    this.player.body.setSize(this.player.width - 140, this.player.height);
    this.physics.add.collider(this.player, block);

    // Add animation complete event listener
    this.player.on('animationcomplete', function (animation) {
        if (animation.key === 'jump') {
            //stick to this frame while falling
            this.player.setFrame(18);
        }
    }, this);

    this.player.setFrame(0);

    //----text--------
    //welcome text
    this.startText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, 'Tap to play', {
        font: '30px Arial',
        fill: '#ffffff',
        align: 'center'
    });
    this.startText.setOrigin(0.5);
    this.startText.depth = 1;
    //textBackground
    this.textBg = this.add.graphics();
    this.textBg.fillStyle(0x000000, 0.8);
    this.textBg.fillRect(this.gameWidth / 2 - this.startText.width / 2 - 10, this.gameHeight / 2 - this.startText.height / 2 - 10, this.startText.width + 20, this.startText.height + 20);

    this.input.on('pointerdown', function () {
        if (!this.isStartGame) {
            this.startGameLogic();
            return;
        }

        if (this.ifEndGame) {
            this.restartGame();
            return;
        }

        if (this.isGrounded || this.jumpCount < 1) {
            //console.log('we jump!');            
            this.handleJump();
        }

    }, this);
};

gameScene.update = function () {

    if (!this.isStartGame) {
        return;
    }
    if (this.ifEndGame) {
        return;
    }

    // Store the current state of falling
    let isFalling = !this.isGrounded /*&& this.player.body.velocity.y > 0*/;
    // Determine if the player was falling in the previous frame
    let wasFalling = this.wasFalling;

    // Update the previous state of falling
    this.wasFalling = isFalling;

    // Check if the player has transitioned from falling to not falling
    let justLanded = wasFalling && !isFalling;

    if (justLanded && this.jumpComplete) {
        //console.log("landing logic");
        this.jumpCount = 0;
        //play this animation on landing
        this.player.anims.play('run');

        this.jumpComplete = true;
    }
    //console.log('Landed? == ' + justLanded);
    //check grounded
    this.isGrounded = this.player.body.blocked.down || this.player.body.touching.down;

    this.bgs.getChildren().forEach(function (bg, index) {

        //console.log(this.gameWidth);
        if (bg.x <= -512) {

            bg.x += (512 * 3);
            //console.log('reset: ' + (-this.gameWidth * 2));
        }
    }, this);

    this.midBgs2.getChildren().forEach(function (bg, index) {

        //console.log(this.gameWidth);
        if (bg.x <= -512) {

            bg.x += (512 * 3);
            //console.log('reset: ' + (-this.gameWidth * 2));
        }
    }, this);

    this.midBgs.getChildren().forEach(function (bg, index) {

        //console.log(this.gameWidth);
        if (bg.x <= -512) {

            bg.x += (512 * 3);
            //console.log('reset: ' + (-this.gameWidth * 2));
        }
    }, this);

    this.obstacles.getChildren().forEach(function (obstacle, index) {
        //console.log("Obstacle X: " + obstacle.x);
        if (obstacle.x <= -100) {
            //instead of destroy do this to pool
            obstacle.x = this.gameWidth;
            this.obstacles.killAndHide(obstacle);
            obstacle.body.enable = false;
            //console.log('reset: Obstacle');
        }
    }, this);
}

gameScene.startGameLogic = function () {
    this.isStartGame = true;

    this.player.anims.play('run');

    this.createHud();

    this.startText.setActive(false);
    this.startText.setVisible(false);
    this.textBg.setActive(false);
    this.textBg.setVisible(false);

    this.spawnObstacles();

    this.setInitialSpeed();

    this.getDistance();

    this.handleSpeedIncrease();

    this.physics.add.overlap(this.player, this.obstacles, this.handleCollision, null, this);
}

gameScene.handleJump = function () {
    if ((this.isGrounded || this.jumpCount < 2) && this.jumpComplete) {
        // Increment jump count only if the player is not grounded        
        if (!this.isGrounded) {
            this.jumpCount++;
        }

        // give player Y velocity
        this.player.body.setVelocityY(this.jumpSpeed);
        this.player.anims.stop('run');
        this.player.anims.play('jump');

    }
};

gameScene.spawnObstacles = function () {

    this.obstacleNames = [
        {
            index: 0,
            name: 'obstacle1',
        },
        {
            index: 1,
            name: 'obstacle2'
        }
    ]
    //---create obstacle group----
    this.obstacles = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });//group for dynamic sprites

    let randomDelay = Math.floor(Math.random() * (4000 - 2500 + 1)) + 1000;

    //spawn obstacles
    let spawnEvent = this.time.addEvent({
        delay: randomDelay,
        callback: this.spawnObstacle,
        callbackScope: this,
        loop: true,
        callback: function () {
            if (this.ifEndGame) {
                spawnEvent.remove();
                return;
            }
            let randomIndex = Math.floor(Math.random() * this.obstacleNames.length);
            let randomObstacleName = this.obstacleNames[randomIndex].name;
            //create obstacle
            let obstacle = this.obstacles.get(this.gameWidth + 100, 358, randomObstacleName);
            
            if (obstacle.texture.key === 'obstacle1') {
                obstacle.x = this.gameWidth + 100;
                obstacle.y = 358;
                obstacle.setScale(0.4);
                //obstacle collider size
                obstacle.body.setSize(obstacle.width - 100, obstacle.height - 40);
            }
            else {
                obstacle.x = this.gameWidth + 100;
                obstacle.y = 300;
                obstacle.setScale(0.7);
                //obstacle collider size
                obstacle.body.setSize(obstacle.width - 180, obstacle.height);
            }

            //reactivate
            obstacle.setActive(true);
            obstacle.setVisible(true);
            obstacle.body.enable = true;

            //check pooling numbers
            console.log(this.obstacles.getChildren().length);

            //set properties
            // obstacle.setVelocityX(this.speed);

            //lifespan
            this.time.addEvent({
                delay: 5000,
                repeat: 0,
                callbackScope: this,
                callback: function () {
                    if (this.ifEndGame) {
                        return;
                    }
                    //obstacle.destroy();

                }
            }, this);

        }
    });
};

gameScene.setInitialSpeed = function () {
    this.bgs.getChildren().forEach(function (bg, index) {
        bg.setVelocityX(this.speed + 100);
    }, this);

    this.midBgs2.getChildren().forEach(function (bg, index) {
        bg.setVelocityX(this.speed + 50);
    }, this);

    this.midBgs.getChildren().forEach(function (bg, index) {
        bg.setVelocityX(this.speed);
    }, this);

    this.obstacles.getChildren().forEach(function (obstacle, index) {
        obstacle.setVelocityX(this.speed - 100);
    }, this);
}

gameScene.handleSpeedIncrease = function () {
    //speed increase
    let increaseSpeedEvent = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callbackScope: this,
        callback: function () {
            if (this.ifEndGame) {
                increaseSpeedEvent.remove();
                return;
            }
            this.speed -= 10;
            if (this.speed < -1700) {
                increaseSpeedEvent.remove();
                this.speed = -1700;
                return;
            }
            //console.log("Speed: " + this.speed);
            this.bgs.getChildren().forEach(function (bg, index) {
                bg.setVelocityX(this.speed + 100);
            }, this);

            this.midBgs2.getChildren().forEach(function (bg, index) {
                bg.setVelocityX(this.speed + 50);
            }, this);

            this.midBgs.getChildren().forEach(function (bg, index) {
                bg.setVelocityX(this.speed);
            }, this);

            this.obstacles.getChildren().forEach(function (obstacle, index) {
                obstacle.setVelocityX(this.speed - 100);
            }, this);
        }
    })

}

gameScene.handleCollision = function () {

    if (!this.ifEndGame) {
        this.ifEndGame = true;
        // console.log('Collided!!');
        this.player.anims.play('stumble');

        this.bgs.getChildren().forEach(function (bg, index) {
            bg.setVelocityX(0);
        }, this);

        this.midBgs2.getChildren().forEach(function (bg, index) {
            bg.setVelocityX(0);
        }, this);

        this.midBgs.getChildren().forEach(function (bg, index) {
            bg.setVelocityX(0);
        }, this);

        this.obstacles.getChildren().forEach(function (obstacle, index) {
            obstacle.setVelocityX(0);
        }, this);

        this.gameOver();
    }

};

gameScene.getDistance = function () {
    let increaseDistanceEvent = this.time.addEvent({
        delay: 500,
        repeat: -1,
        callbackScope: this,
        callback: function () {
            if (this.ifEndGame) {
                increaseDistanceEvent.remove();
                return;
            }

            this.distanceCovered += 1;
            this.refreshHud();
        }
    })
}

gameScene.createHud = function () {
    //distance stat
    this.distanceText = this.add.text(20, 20, 'Distance: ' + this.distanceCovered, {
        font: '24px Arial',
        fill: '#000000'
    });
};

// show current distance value
gameScene.refreshHud = function () {
    //console.log('Refresh: ' + this.distanceCovered);
    this.distanceText.setText('Distance: ' + this.distanceCovered);
};

gameScene.gameOver = function () {

    this.startText.setText('Game Over!' + '\n' + 'Score: ' + this.distanceCovered + '\n' + 'Tap to restart');
    this.startText.setActive(true);
    this.startText.setVisible(true);
    this.textBg.fillRect(this.gameWidth / 2 - this.startText.width / 2 - 10, this.gameHeight / 2 - this.startText.height / 2 - 10, this.startText.width + 20, this.startText.height + 20);
    this.textBg.setActive(true);
    this.textBg.setVisible(true);

    //this.cameras.main.fade(500);
};

gameScene.restartGame = function () {
    //fade out
    this.cameras.main.fade(500);

    //restart scene
    this.cameras.main.on('camerafadeoutcomplete', function () {
        this.scene.restart();
    }, this);
}