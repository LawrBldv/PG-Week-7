class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        
        this.load.image('Spellbook', './assets/images/menu/Spellbook.png');
        
        
        this.load.audio('buttonClick', './assets/Sounds/SFX/buttonClick.mp3');
        this.load.image('enemy', './assets/images/menu/posterBoy2.png');
    }

    create() {
        
        this.add.image(400, 300, 'Spellbook');
        this.enemy = this.physics.add.sprite(525, 320, 'enemy');
        this.enemy.setScale(1.5);

        
        this.add.text(525, 200, 'Witchunt', { fontFamily: 'OldEnglish3', fontSize: '48px', fill: '#000000' }).setOrigin(0.5);

        
        const playButton = this.add.text(280, 250, 'PLAY', { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
        const creditsButton = this.add.text(280, 325, 'CREDITS', { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
        const quitButton = this.add.text(280, 400, 'QUIT', { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#000000' }).setOrigin(0.5);

        
        const buttonClickSound = this.sound.add('buttonClick');

        
        playButton.setInteractive().on('pointerdown', () => {
            buttonClickSound.play(); 
            this.scene.start('GameScene');
            const gameScene = this.scene.get('GameScene');
            if (gameScene) {
                gameScene.resetState();
            }
        });

        creditsButton.setInteractive().on('pointerdown', () => {
            buttonClickSound.play(); 
            
            this.scene.launch('CreditsScene');
            this.scene.pause();
        });

        quitButton.setInteractive().on('pointerdown', () => {
            buttonClickSound.play(); 
            
            alert('Exiting the game');
        });
    }
}


export default MainMenuScene;
