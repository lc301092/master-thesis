import { constants } from "../constants.js"
import Player from "../game/player.js"

// 
let playerSprite, playerData, scene;
let playerProgression;
const ADJUST_RANGE_Y = 30;
const ADJUST_RANGE_X = 15


export class Base extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.PLAY,
        })
        this.player = null;
    }

    init(data) {
        // tell progress from 
        playerSprite = this.physics.add.sprite(150, 150, 'player', 4).setCollideWorldBounds(true).setDepth(1); //.setScale(2);
        console.log('Base Scene', data);
        playerData = data;
        playerSprite.x = data.playerPosition.x;
        playerSprite.y = data.playerPosition.y;

        let keys = this.input.keyboard.addKeys(constants.USERINPUT);
        let collider = this.add.rectangle(playerSprite.x, playerSprite.y, playerSprite.width / 2, playerSprite.height / 2,
            0xff0000, 0.5
        );
        animationSetup(this);
        this.player = new Player(keys, collider, playerSprite);

    }
    preload() {
        playerProgression = JSON.parse(localStorage.getItem("objectives"));
        console.log("JSON parser: ", playerProgression);
    }

    create() {
        scene = this;
        // tilemap configurations

        let baseSceneTest = this.add.tilemap('baseSceneTest');
        //baseSceneTest.set

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
        let ground = baseSceneTest.createLayer('Ground', [SCIFI, DOORS1], 0, 0);
        let walls = baseSceneTest.createLayer('Wall', [SCIFI], 0, 0);
        let decoration = baseSceneTest.createLayer('Decoration', [EXTERIOR_A2, EXTERIOR_B, EXTERIOR_C, INTERIOR_B, SCIFI], 0, 0);
        let decoration2 = baseSceneTest.createLayer('Decoration2', [EXTERIOR_A2, EXTERIOR_B, EXTERIOR_C, INTERIOR_B], 0, 0);
        let interact = baseSceneTest.createLayer('Interact', [EXTERIOR_A2, EXTERIOR_B, EXTERIOR_C, INTERIOR_B], 0, 0);
        let layers = baseSceneTest.createLayer('Layercontrol', EXTERIOR_C, 0, 0).setDepth(1);


        playerSprite.setSize(25, 50).setOffset(12, 10);

        // scene.cameras.main.setZoom(1.5);
        scene.cameras.main.setBounds(-200, -200);
        scene.physics.world.setBounds(0, 0, 1600, 1200);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(playerSprite, true, 0.05, 0.05);

        console.log('Everything is running ok');
        // map collisions
        let borders = [ground, walls, decoration, decoration2, interact];
        scene.physics.add.collider(playerSprite, borders);

        for (let i = 0; i < borders.length; i++) {
            borders[i].setCollisionByProperty({ border: true });
        }

        // map collision interactives
        scene.physics.add.collider(playerSprite, interact);
        interact.setCollision([678, 679, 680, 681, 682, 683, 2214, 2215, 2216, 1665, 1666, 1713, 1714]);

        // indstil tidsmaskine
        interact.setTileLocationCallback(10, 5, 6, 1, () => {
            if (this.player.isInteracting()) {
                console.log('Observér tidslinjen');
                playerData.playerPosition.x = playerSprite.x;
                playerData.playerPosition.y = playerSprite.y;
                this.scene.start(constants.SCENES.TIMELINE, playerData);
                // --- indstil tidsmaskine "scene" kode her ---
            };
        });

        // Tidsmaskinen
        interact.setTileLocationCallback(22, 18, 1, 1, () => {
            if (this.player.isInteracting()) {
                console.log('Tidsmaskine aktiveret');
                playerData.playerPosition.x = playerSprite.x;
                playerData.playerPosition.y = playerSprite.y;
                this.scene.start(constants.SCENES.TIME_MACHINE, playerData);
                // --- skift scene til laboratorie kode her ---
            };
        });

    }
    update() {
        this.player.update();
    }

}

function animationSetup(scene) {
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