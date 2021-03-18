import { constants } from "../constants.js"

let player, keys, playerAnimation, singlePress, scene, map;
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


        console.log(this.load);

        this.load.spritesheet('player', 'assets/sprite/playable_charaters.png', {
            frameWidth: 48,
            frameHeight: 64
        });

        this.load.spritesheet('portal', 'assets/sprite/portal.png', {
            frameWidth: 250,
            frameHeight: 592
        });
    }
    create() {
        scene = this;

        // tilemap configurations

        let baseSceneTest = this.add.tilemap('baseSceneTest');

        // add tileset image

        let tileImages = constants.TILEIMAGES.BASE_LVL;
        let images = constants.IMAGES;
        let tileObj = {};
        for (const key in tileImages) {
            let tileImageString = images[key];
            let tilesetImage = baseSceneTest.addTilesetImage(tileImageString);
            tileObj[key] = tilesetImage;
        }
        console.log(tileObj);

        let DOORS1 = tileObj.DOORS1;
        let EXTERIOR_A2 = tileObj.EXTERIOR_A2;
        let INTERIOR_B = tileObj.INTERIOR_B;
        let EXTERIOR_B = tileObj.EXTERIOR_B;
        let EXTERIOR_C = tileObj.EXTERIOR_C;
        let SCIFI = tileObj.SCIFI;

        //layers 
        let ground = baseSceneTest.createLayer('Ground', [SCIFI, DOORS1], 0, 0).setDepth(-1);
        let walls = baseSceneTest.createLayer('Wall', [SCIFI], 0, 0);
        let decoration = baseSceneTest.createLayer('Decoration', [EXTERIOR_A2, EXTERIOR_B, EXTERIOR_C, INTERIOR_B, SCIFI], 0, 0);
        let decoration2 = baseSceneTest.createLayer('Decoration2', [EXTERIOR_A2, EXTERIOR_B, EXTERIOR_C, INTERIOR_B], 0, 0);
        let interact = baseSceneTest.createLayer('Interact', [EXTERIOR_A2, EXTERIOR_B, EXTERIOR_C, INTERIOR_B], 0, 0);
        let layers = baseSceneTest.createLayer('Layercontrol', EXTERIOR_C, 0, 0).setDepth(1);

        player = scene.physics.add.sprite(150, 150, 'player').setCollideWorldBounds(true); //.setScale(2);
        player.setSize(25, 50).setOffset(12, 10);
        scene.cameras.main.setBounds(0, 0, 1600, 1200);
        scene.physics.world.setBounds(0, 0, 1600, 1200);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(player, true, 0.05, 0.05);

        scene.animationSetup(this);
        playerAnimation = player.anims;
        // keyobject for movement
        keys = scene.input.keyboard.addKeys(constants.USERINPUT.WASD_MOVEMENT);
        singlePress = constants.USERINPUT.SINGLEPRESS;

        // map collisions
        let borders = [walls, decoration, decoration2, interact];
        scene.physics.add.collider(player, borders);

        for (let i = 0; i < borders.length; i++) {
            borders[i].setCollisionByProperty({ border: true });
        }

        // map collision interactives
        scene.physics.add.collider(player, interact);
        interact.setCollision([678, 679, 680, 681, 682, 683, 2214, 2215, 2216, 1665, 1666, 1713, 1714]);

        // indstil tidsmaskine
        interact.setTileLocationCallback(10, 5, 6, 1, () => {
            if (singlePress(keys.interact)) {
                console.log('indstil din tidsmaskine her');
                // --- indstil tidsmaskine "scene" kode her ---
            };
        });

        // træningssimulator
        interact.setTileLocationCallback(23, 6, 3, 2, () => {
            if (singlePress(keys.interact)) {
                console.log('Start træningssimulator');
                this.scene.start(constants.SCENES.TRANING, 'from base scene');

                // --- Åbn træningssimulator kode her ---
            };
        });

        // Tidsmaskinen
        interact.setTileLocationCallback(22, 18, 1, 1, () => {
            if (singlePress(keys.interact)) {
                console.log('Tidsmaskine aktiveret');

                // --- skift scene til laboratorie kode her ---
            };
        });

    }
    update() {
        // player movement
        this.playerControl();
    }
    // 8 directional  
    playerControl() {

        if (singlePress(keys.sprint))
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
        if (player.body.velocity.x > 0) playerAnimation.play('right', true);
        else if (player.body.velocity.x < 0) playerAnimation.playReverse('left', true);
        else if (player.body.velocity.y > 0) playerAnimation.play('down', true);
        else if (player.body.velocity.y < 0) playerAnimation.play('up', true);
        else {
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