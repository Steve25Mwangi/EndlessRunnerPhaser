
// our game's configuration
let config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 512,
    scene:  [loadingScene, gameScene,],
    title: 'Endless Runner Test',
    pixelArt: false,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 1000
        },
        debug: false
      }
    }
  };
  
  // create the game, and pass it the configuration
  let game = new Phaser.Game(config);