
import MainMenuScene from '../scripts/scenes/menuScene.js';
import GameScene from '../scripts/scenes/gameScene.js';
import GameOverScene from '../scripts/scenes/gameOverScene.js';
import CreditsScene from '../scripts/scenes/creditScene.js';
import PowerupSelectionScene from '../scripts/scenes/PowerupSelectionScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenuScene, GameScene, GameOverScene, CreditsScene, PowerupSelectionScene]
};

const game = new Phaser.Game(config);
