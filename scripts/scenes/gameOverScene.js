export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('spellbook', './assets/images/menu/Spellbook.png');
        
    }

    create(data) {
        this.add.image(400, 300, 'spellbook');
        
        this.add.text(280, 220, 'Game Over', { fontFamily: 'OldEnglish3', fontSize: '50px', fill: '#000000' }).setOrigin(0.5);
    
        
        this.add.text(280, 310, `Score: ${data.score}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
        this.add.text(280, 370, `${data.timeSurvived}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);

    
        
        const retryButton = this.add.text(520, 250, 'Retry', { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
        const mainMenuButton = this.add.text(520, 350, 'Main Menu', { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
    
        
        retryButton.setInteractive();
        mainMenuButton.setInteractive();
    
        
        retryButton.on('pointerdown', () => {
            
            this.scene.stop('GameOverScene');
            this.scene.start('GameScene');
            const gameScene = this.scene.get('GameScene');
            if (gameScene) {
                gameScene.resetState();
            }
        });
    
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    
        
        this.children.bringToTop(retryButton);
        this.children.bringToTop(mainMenuButton);
    }
    
    
}


export default GameOverScene;
