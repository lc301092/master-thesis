import { constants } from "../constants.js"

let player, keys, playerAnimation, singlePress, scene,map;
let speed = 128;


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
        player.setSize(25,50).setOffset(12,10);
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
    // 8 directional  
    playerControl() {

        if(singlePress(keys.sprint)) 
        speed = 192;
        else if (keys.sprint.isUp) speed = 128;

        if (keys.up.isDown) {
            player.setVelocityY(-speed);
        }
        if (keys.down.isDown) {
            player.setVelocityY(speed);
        }
        if (keys.left.isDown) {
            player.setVelocityX(-speed);
        }
        if (keys.right.isDown) {
            player.setVelocityX(speed);
        }
        if (keys.up.isUp && keys.down.isUp) {
            player.setVelocityY(0);
            //playerAnimation.play('turn', true);
        }
        if (keys.right.isUp && keys.left.isUp) {
            player.setVelocityX(0);
            //playerAnimation.play('turn', true);
        }
        // other inputs than movement 
        if (singlePress(keys.interact)) {
            console.log(player);
            //console.log(keys.interact);
            //checkColliders()
        }
        if(player.body.velocity.x > 0) playerAnimation.play('right', true);
        else if(player.body.velocity.x < 0) playerAnimation.playReverse('left', true);
        else if(player.body.velocity.y > 0) playerAnimation.play('down', true);
        else if(player.body.velocity.y < 0) playerAnimation.play('up', true);
        else{
            playerAnimation.stop();
        }
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
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 27,
                end: 29
            }),
            frameRate: 6,
        });
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 3,
                end: 5
            }),
            frameRate: 6,
        });
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 39,
                end: 41
            }),
            frameRate: 4,
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