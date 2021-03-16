import { constants } from "../constants.js"

let player, keys, playerAnimation, singlePress, scene,map;
let speed = 100;


export class Base extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.PLAY,
        })
    }
    init(data) {
        // tell progress from 
        console.log(data)
    }
    preload() {
       let map =  this.add.image(0, 0, constants.IMAGES.BASE_MAP).setOrigin(0).setScale(2);


        //this.player = this.add.
        // tilemaps
    }
    create() {
        scene = this;
        player = this.physics.add.sprite(100, 100, 'player').setCollideWorldBounds(true).setScale(2);
        scene.cameras.main.setBounds(0, 0, 1600, 1200);
        scene.physics.world.setBounds(0, 0, 1600, 1200);
        let mainCamera = this.cameras.main
        mainCamera.startFollow(player,true,0.05,0.05);
        // tilemap configurations

        // animations
        this.animationSetup(this);
        playerAnimation = player.anims;
        // keyobject for movement
        keys = this.input.keyboard.addKeys(constants.KEYS.WASD_MOVEMENT);
        singlePress = constants.KEYS.SINGLEPRESS;
    }
    update() {
        // player movement
        this.playerControl();
    }
    // only 4 directional for now 
    playerControl() {

        if (keys.up.isDown) {
            player.setVelocityY(-speed);
            playerAnimation.play('up', true);
        }
        if (keys.down.isDown) {
            player.setVelocityY(speed);
            playerAnimation.play('down', true);
        }
        if (keys.up.isUp && keys.down.isUp || keys.up.isDown && keys.down.isDown) {
            player.setVelocityY(0);
            //playerAnimation.play('turn', true);
        }
        // detach here for 8 directional movement, but it screw up animations because there is no sprite reset
        if (keys.left.isDown) {
            player.setVelocityX(-speed);
            playerAnimation.playReverse('left', true);

        }
        if (keys.right.isDown) {
            player.setVelocityX(speed);
            playerAnimation.play('right', true);
        }
        if (keys.right.isUp && keys.left.isUp || keys.right.isDown && keys.left.isDown) {
            player.setVelocityX(0);
            //playerAnimation.play('turn', true);
        }


        if (singlePress(keys.interact)) {
            console.log(player);
            //console.log(keys.interact);
            //checkColliders()
        }
        //if(player.velocity == 0) 
    }
    animationSetup(scene) {
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('portal', {
                start: 0,
                end: 3
            }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 15,
                end: 17
            }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 27,
                end: 29
            }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 3,
                end: 5
            }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 39,
                end: 41
            }),
            frameRate: 4,
            repeat: -1
        });
        scene.anims.create({
            key: 'turn',
            frames: [{
                key: 'player',
                frame: 4
            }],
            frameRate: 10,
            repeat: -1
        });
    }
}