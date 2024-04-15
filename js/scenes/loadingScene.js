// create a new scene
let loadingScene = new Phaser.Scene('LoadingScene');

// load asset files for our game
loadingScene.preload = function () {

    this.load.atlasXML('sprites', 'assets/images/spritesheet_default.png', 'assets/images/spritesheet_default.xml');
    this.load.image('bg', 'assets/images/backgroundEmpty.png');
    this.load.image('bg2', 'assets/images/backgroundColorForest.png');
    this.load.image('bgMid', 'assets/images/backgroundColorForestMid.png');
    this.load.image('block', 'assets/images/Block.png');
    this.load.image('obstacle1', 'assets/images/rock1.png');
    this.load.image('obstacle2', 'assets/images/tallRock.png');
    //this.load.image('obstacle2', 'assets/images/rock2.png');

    // load sprite sheets
    this.load.spritesheet('player', 'assets/images/spritesheetPlayer.png', {
        frameWidth: 256,
        frameHeight: 256,
        margin: 0,
        spacing: 2
    });
};

loadingScene.create = function () {

     //player run anim
     if (!this.anims.get('run')) {
        const frameNames = [];
        for (let i = 1; i < 9; i++) {
            frameNames.push({ key: 'player', frame: i });
        }

        this.anims.create({
            key: 'run',
            frames: frameNames,
            frameRate: 12,
            repeat: -1
        });
    }

    //player jump anim
    if (!this.anims.get('jump')) {
        const frameNames = [];
        for (let i = 9; i < 18; i++) {
            frameNames.push({ key: 'player', frame: i });
        }

        this.jumpAnim = this.anims.create({
            key: 'jump',
            frames: frameNames,
            frameRate: 12
        });
    }

    //player stumble anim
    if (!this.anims.get('stumble')) {
        const frameNames = [];
        for (let i = 23; i < 48; i++) {
            frameNames.push({ key: 'player', frame: i });
        }

        this.stumbleAnim = this.anims.create({
            key: 'stumble',
            frames: frameNames,
            frameRate: 20
        });
    }


    console.log('Loaded');
    this.scene.start('MainGame');
  
};