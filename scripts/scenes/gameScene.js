export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player;
        this.cursors;
        this.bullets;
        this.lastFired = 0; 
        this.fireRate = 200; 
        this.enemies;
        this.playerHealth = 100; 
        this.enemyHealth = 10; 
        this.bulletDamage = 6; 
        this.enemyCollisionDamage = 25; 
        this.score = 0; 
        this.scoreText; 
        this.healthText;
        this.knockbackVelocity = 0; 
        this.elapsedSeconds = 0; 
        this.powerupsSelected = []; 
        this.enemyBulletVelocity = 300; 
        this.enemyVelocity = 300; 
    }

    preload() {
        
        this.load.image('background', './assets/images/background/Background.png');

        this.load.spritesheet('Player', './assets/images/sprites/Player.png', { frameWidth: 51, frameHeight: 111 });

        this.load.image('bullet', './assets/images/sprites/Bullets.png');
        this.load.image('enemy', './assets/images/bomb.png');
        this.load.image('damageBoost', './assets/images/damage.png');
        this.load.image('enemyBullet', './assets/images/sprites/enemyBullet.png');
        this.load.image('Potion', './assets/images/sprites/Potion.png');

        this.load.spritesheet('pope', './assets/images/sprites/popeSpritesheet.png', { frameWidth: 124, frameHeight: 88 });
        
        
        this.load.audio('backgroundMusic', './assets/Sounds/Music/Theme.mp3');
        this.load.audio('shoot', './assets/Sounds/SFX/whoosh.mp3');
        this.load.audio('hit', './assets/Sounds/SFX/Stab.mp3');
        this.load.audio('enemyShoot', './assets/Sounds/SFX/Shoot.wav'); 
    }
    

    create() {
        
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');
        
        const graphics = this.add.graphics();

    
        const barWidth = this.game.config.width; 
        const barHeight = 50; 
        const barColor = 0x000000; 
        const barAlpha = 0.7; 

        
        graphics.fillStyle(barColor, barAlpha);
        graphics.fillRect(0, 0, barWidth, barHeight);

        
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
        this.backgroundMusic.play();
    
        
        this.player = this.physics.add.sprite(400, 580, 'Player'); 
        this.player.setScale(1.15);
        this.player.setCollideWorldBounds(true);
    
        
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 20,
            runChildUpdate: true
        });
    
        
        this.enemyBullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 20,
            runChildUpdate: true
        });
    
        
        this.enemies = this.physics.add.group();
    
        
        this.powerupOrbs = this.physics.add.group();
    
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.powerupOrbs, this.collectPowerupOrb, null, this);
        this.physics.add.collider(this.player, this.enemyBullets, this.playerHitByEnemyBullet, null, this);

        
    this.physics.add.collider(this.enemies, this.enemies, this.handleEnemyCollision, null, this);

    
        
        this.healthText = this.add.text(16, 16, 'Health: ' + this.playerHealth, {fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#dbb700'});
    
        
        this.scoreText = this.add.text(600, 16, 'Score: ' + this.score, {fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#dbb700'});
    
        
        this.timerText = this.add.text(400, 16, 'Time: 00:00', {fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#dbb700'});
        this.timerText.setOrigin(0.5, 0); 
    
        
        const helpText = this.add.text(400, 300, 'The orbs can help you. Collect them.', {fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#dbb700'});
        helpText.setOrigin(0.5);
    
        
        this.time.delayedCall(3000, () => {
            helpText.destroy();
        });
    
        
        this.scoreTimerEvent = this.time.addEvent({
            delay: 5000,
            callback: this.incrementScore,
            callbackScope: this,
            loop: true
        });
    
        
        this.enemySpawnTimer = this.time.addEvent({
            delay: 2500, 
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    
        
        this.time.addEvent({
            delay: 10000, 
            callback: this.spawnPowerupOrb,
            callbackScope: this,
            loop: true
        });
    
        
        this.time.addEvent({
            delay: 15000, 
            callback: this.increaseEnemyHealth,
            callbackScope: this,
            loop: true
        });
    
        this.events.on('powerupSelected', this.applyPowerup, this);
    
        
        this.gameTimer = this.time.addEvent({
            delay: 1000, 
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    
        this.anims.create({
            key: 'pope',
            frames: this.anims.generateFrameNumbers('pope', { start: 0, end: 1 }), 
            frameRate: 4,
            repeat: -1
        });
    
        this.anims.create({
            key: 'Player', 
            frames: this.anims.generateFrameNumbers('Player', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
    
        this.player.play('Player'); 
    
        
        this.shootSound = this.sound.add('shoot');
        this.hitSound = this.sound.add('hit');
    }
    
    

    update(time, delta) {
        
        this.background.tilePositionY -= 2;

        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
        }

        
        if (this.spaceBar.isDown && time > this.lastFired) {
            this.fireBullet();
            this.lastFired = time + this.fireRate; 
        }

        
        if (this.playerHealth <= 0) {
            this.endGame();
        }
    }

    updateTimer() {
        
        this.elapsedSeconds += 1;

        
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const seconds = this.elapsedSeconds % 60;

        
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        
        this.timerText.setText('Time: ' + formattedTime);
    }

    endGame() {
        
        this.gameTimer.remove(false);

        
        this.backgroundMusic.stop();

        
        this.scene.start('GameOverScene', { score: this.score, timeSurvived: this.timerText.text, powerupsSelected: this.powerupsSelected });

        this.scene.start('GameOverScene', { 
            score: this.score, 
            timeSurvived: this.timerText.text, 
            powerupsSelected: this.powerupsSelected 
        });

        
        this.scene.pause();

        
        this.scene.start('GameOverScene', { score: this.score, timeSurvived: this.timerText.text });
    }

    fireBullet() {
        let bullet = this.bullets.get(this.player.x, this.player.y - 50, 'bullet'); 

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.enable = true;
            bullet.setVelocityY(-800);
            bullet.setGravityY(0); 

            
            bullet.setVelocityY(bullet.body.velocity.y - this.knockbackVelocity);

            
            this.shootSound.play();

            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    bullet.disableBody(true, true);
                }
            });
        }
    }

    spawnEnemy() {
        
        const numRegularEnemies = Phaser.Math.Between(1, 3); 
        for (let i = 0; i < numRegularEnemies; i++) {
            const x = Phaser.Math.Between(50, 750);
            const enemy = this.enemies.create(x, 0, 'enemy');
            enemy.setScale(1); 
            enemy.setVelocityY(this.enemyVelocity);
            enemy.health = this.enemyHealth; 
            enemy.setImmovable(true); 
        }
    
        
        const rangedEnemyChance = 0.3; 
        if (Math.random() < rangedEnemyChance) {
            const x = Phaser.Math.Between(50, 750);
            const rangedEnemy = this.enemies.create(x, 100, 'pope'); 
            rangedEnemy.setScale(1); 
            rangedEnemy.health = this.enemyHealth; 
            rangedEnemy.setImmovable(true); 
            rangedEnemy.setVelocity(0, 0); 
            rangedEnemy.body.setAllowGravity(false); 
            rangedEnemy.play('pope');
    
            
            rangedEnemy.shootEvent = this.rangedEnemyShoot(rangedEnemy); 
        }
    }
    

    rangedEnemyShoot(enemy) {
        
        return this.time.addEvent({
            delay: 1500, 
            callback: () => {
                if (enemy.active) { 
                    const enemyBullet = this.enemyBullets.get(enemy.x, enemy.y, 'enemyBullet'); 
                    if (enemyBullet) {
                        this.sound.play('enemyShoot'); 
                        enemyBullet.setActive(true);
                        enemyBullet.setVisible(true);
                        enemyBullet.body.enable = true;
                        enemyBullet.setVelocityY(this.enemyBulletVelocity);
                        enemyBullet.setGravityY(0); 
    
                        
                        this.time.addEvent({
                            delay: 2000, 
                            callback: () => {
                                enemyBullet.disableBody(true, true);
                            }
                        });
                    }
                }
            },
            callbackScope: this,
            loop: true 
        });
    }
    

hitEnemy(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.health -= this.bulletDamage; 

    
    this.hitSound.play();

    if (enemy.health <= 0) {
        if (enemy.shootEvent) {
            enemy.shootEvent.remove(false); 
        }
        enemy.destroy(); 
        this.score += 10; 
        this.scoreText.setText('Score: ' + this.score);
    }
}


    hitPlayer(player, enemy) {
        enemy.disableBody(true, true);

        
        if (enemy.texture.key === 'enemy') {
            this.playerHealth -= this.enemyCollisionDamage;
        } else if (enemy.texture.key === 'pope') { 
            this.playerHealth -= 5; 
        }

        this.healthText.setText('Health: ' + this.playerHealth);

        
        if (this.playerHealth <= 0) {
            this.endGame(); 
        }
    }

    playerHitByEnemyBullet(player, enemyBullet) {
        
        enemyBullet.disableBody(true, true);

        
        this.playerHealth -= 5; 
        this.healthText.setText('Health: ' + this.playerHealth);

        
        if (this.playerHealth <= 0) {
            this.endGame(); 
        }
    }

    incrementScore() {
        this.score += 10; 
        this.scoreText.setText('Score: ' + this.score);
    }

    spawnPowerupOrb() {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(0, 100);
        const orbKey = 'Potion'; 
        const orb = this.powerupOrbs.create(x, y, orbKey);
        orb.setVelocityY(200); 
    }

    collectPowerupOrb(player, powerupOrb) {
        powerupOrb.disableBody(true, true); 
    
        
        this.scene.pause();
    
        
        this.scene.launch('PowerupSelectionScene');
    
        console.log('Powerup collected!'); 
        console.log('Powerups selected:', this.powerupsSelected); 
    }
    
    

    applyPowerup(effect) {
        
        switch (effect) {
            case 'Damage Boost':
                this.bulletDamage += 4; 
                this.powerupsSelected.push(effect);
                break;
            case 'Attack Speed Boost':
                this.fireRate -= 30; 
                this.powerupsSelected.push(effect);
                break;
            case 'Knockback Boost':
                this.knockbackVelocity += 100; 
                this.powerupsSelected.push(effect);
                break;
            case 'Health Boost':
                this.playerHealth += 10; 
                this.healthText.setText('Health: ' + this.playerHealth); 
                this.powerupsSelected.push(effect);
                break;

            case 'Movement Speed Boost':
                this.player.setVelocityX(this.player.body.velocity.x * 1.5); 
                this.powerupsSelected.push(effect);
                break;
        }
        
        this.scene.resume();
    }

    increaseEnemyHealth() {
        this.enemyHealth += 7; 
        this.enemyBulletVelocity +=100;
        this.enemyVelocity+=100;
    }

    resetState() {
        
        this.playerHealth = 100;
        this.score = 0;
        this.elapsedSeconds = 0; 
    
        
        this.enemyHealth = 10;
        this.enemyBulletVelocity = 300;
        this.enemyVelocity = 300;
    
        
        this.bulletDamage = 6;
        this.fireRate = 200;
        this.knockbackVelocity = 0;
    
        
        this.powerupsSelected = [];
    
        
        if (this.healthText) {
            this.healthText.setText('Health: ' + this.playerHealth);
        }
    
        
        
    }
    
    
}
