export default class PowerupSelectionScene extends Phaser.Scene {
    constructor() {
        super('PowerupSelectionScene');
    }

    preload() {
        this.load.image('damageBoost', './assets/images/icons/damage.png');
        this.load.image('attackSpeedBoost', './assets/images/icons/attackSpeed.png');
        this.load.image('knockbackBoost', './assets/images/icons/knockback.png');
        this.load.image('healthBoost', './assets/images/sprites/Potion.png');
        this.load.image('movementBoost', './assets/images/icons/Movement.png');
        

        this.load.image('spellbook', './assets/images/menu/Spellbook.png');
    }

    create() {
        

        this.add.image(400, 300, 'spellbook');

        this.add.text(285, 200, 'Click on a Powerup!', { fontFamily: 'OldEnglish3', fontSize: '25px', fill: '#000000' }).setOrigin(0.5);

        this.add.image(220, 250, 'damageBoost').setInteractive().on('pointerdown', () => {
            this.selectPowerup('Damage Boost');
        });

        this.add.text(170, 300, 'Add +4 Damage to Attacks', { fontSize: '36', fill: '#000000' });
        
        this.add.image(340, 250, 'attackSpeedBoost').setInteractive().on('pointerdown', () => {
            this.selectPowerup('Attack Speed Boost');
        });

        this.add.text(300, 300, 'Add 30% to fire rate ', { fontSize: '36', fill: '#000000' });

        this.add.image(475, 250, 'knockbackBoost').setInteractive().on('pointerdown', () => {
            this.selectPowerup('Knockback Boost');
        });

        this.add.text(425, 300, '+12% Bullet Speed', { fontSize: '36', fill: '#000000' });

        this.add.image(575, 250, 'healthBoost').setInteractive().on('pointerdown', () => {
            this.selectPowerup('Health Boost');
        });

        this.add.text(550, 300, '+10 to Health', { fontSize: '36', fill: '#000000' });

        this.add.image(230, 350, 'movementBoost').setInteractive().on('pointerdown', () => {
            this.selectPowerup('Movement Speed Boost');
        });
        
        this.add.text(175, 400, '+50% Movement Speed', { fontSize: '36', fill: '#000000' });
        
    }

    selectPowerup(effect) {
        this.scene.get('GameScene').events.emit('powerupSelected', effect);
        this.scene.stop(); 
    }
}
