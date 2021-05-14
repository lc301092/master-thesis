import { constants } from "../constants.js"
import Player from "../game/player.js"
import { textBox } from "../game/ui.js";


let playerSprite, playerData, scene;
let playerInteractionCollider;

let uiTextBox;
const correctItems = [{
    name: constants.IMAGES.MED3,
    x: 100,
    y: 350,
    message: () => {
        const player = scene.player;
        if (!player.isInteracting()) return;
        textBox.writeUiText(scene, uiTextBox, 'Nu har jeg medicin, hvis nogen skulle blive syge', 50);
    },
    scale: 1

}, {
    name: constants.IMAGES.PLANT,
    x: 60,
    y: 250,
    message: () => {
        const player = scene.player;
        if (!player.isInteracting()) return;
        textBox.writeUiText(scene, uiTextBox, 'Kamilleurten er igang med at spirre', 50);
    },
    scale: 0.12
}
    // ny reward
    //,{}
];

let isTutorialComplete
let tutorialKey;
let tutorialAltKey;
let tutorialText2;
let tutorialContainer;

let audio;

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
        isTutorialComplete = playerData.isTutorialComplete;

        let keys = this.input.keyboard.addKeys(constants.USERINPUT);
        playerInteractionCollider = this.add.rectangle(playerSprite.x, playerSprite.y, playerSprite.width / 2, playerSprite.height / 2,
            //0xff0000, 0.5
        );
        animationSetup(this);
        this.player = new Player(keys, playerInteractionCollider, playerSprite);

    }
    preload() {
        //audio = this.load.audio('wrong', ['/assets/audio/wrong.mp3']);

    }

    create() {
        scene = this;
        scene.sound.removeByKey('kemi');
        scene.sound.removeByKey('farm');
        const backgroundMusic = scene.sound.add('base',{volume: 0.1, loop: true}).play();
        
        let dynmaicCollider = this.physics.add.group();
        let collideables = this.physics.add.staticGroup();
        dynmaicCollider.add(this.player.collider);

        let playerAnswers = playerData.answers;
        let currentProgression = playerData.playerProgression.length - 1;
        
        let tilemap; 


        tilemap = this.add.tilemap('baseSceneTest');
        if (playerAnswers.length > 0) {

            console.log('answer is ' + playerAnswers[currentProgression].isCorrect);

            for (let i = 0; i < playerAnswers.length; i++) {
                console.log(i);
                if (!playerAnswers[i].isCorrect) {
                    tilemap = this.add.tilemap('baseSceneTest_destroyed');
                    continue;
                }
                let x = correctItems[i].x;
                let y = correctItems[i].y;
                let name = correctItems[i].name;
                let scale = correctItems[i].scale;
                const action = correctItems[i].message;
                let correctItem = scene.add.image(x, y, name).setScale(scale).setDepth(1);
                let itemCollider = this.add.rectangle(x, y, correctItem.displayWidth / 2, correctItem.displayHeight,
                    //   0xff0000, 0.5 // debugging purposes
                );
                correctItems[i].collider = itemCollider;
                collideables.add(itemCollider);
                scene.physics.add.overlap(playerInteractionCollider, itemCollider, action, null, this);
                tilemap = this.add.tilemap('baseSceneTest_fixed');
            }

        }
        setupTilemap(scene, tilemap);

        playerSprite.setSize(25, 50).setOffset(12, 10);

        // scene.cameras.main.setZoom(1.5);
        scene.cameras.main.setBounds(-200, -200);
        scene.physics.world.setBounds(0, 0, 1600, 1200);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(playerSprite, true, 0.05, 0.05);

        let bookSheldImg = scene.add.image(400,90,'bookshelf.png');
        let bookShelf = scene.add.rectangle(bookSheldImg.x,bookSheldImg.y-15,bookSheldImg.width*2/3,bookSheldImg.height/3,
           // 0xff0000,0.5
            );

        collideables.add(bookShelf);
        scene.physics.add.collider(playerSprite, collideables);
        scene.physics.add.overlap(playerInteractionCollider, bookShelf, bookShelfInteraction, null, this);

        uiTextBox = textBox.createTextBox(this);

        //        scene.physics.add.overlap(playerInteractionCollider, itemCollider, , null, this);
        if (!isTutorialComplete) startTutorial();

    }
    update() {
        this.player.update();

        if (this.player.isMoving && !isTutorialComplete) {
            tutorialKey.setTexture(constants.IMAGES.TUTORIAL_E);
            tutorialAltKey.setTexture(constants.IMAGES.TUTORIAL_SPACE).setScale(0.2);
            tutorialText2.setText('For at interagere \n med objekter');
            tutorialText2.y = 45;
        }

        if(this.player.isInteracting()){
           // this.sound.play('button_turn');
        }
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
function setupTilemap(scene, baseSceneTest) {
    let tileImages = constants.TILEIMAGES.BASE_LVL;
    let images = constants.IMAGES;
    let tileObj = {};
    for (const key in tileImages) {
        let tileImageString = images[key];
        let tilesetImage = baseSceneTest.addTilesetImage(tileImageString);
        tileObj[key] = tilesetImage;
    }

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
        if (scene.player.isInteracting()) {
            console.log('Observér tidslinjen');
            playerData.playerPosition.x = playerSprite.x;
            playerData.playerPosition.y = playerSprite.y;
            playerData.isTutorialComplete = true;
            scene.sound.play('computer_on',{volume: 0.1});
            scene.scene.start(constants.SCENES.TIMELINE, playerData);
            // --- indstil tidsmaskine "scene" kode her ---
        };
    });

    // Tidsmaskinen
    interact.setTileLocationCallback(22, 18, 1, 1, () => {
        if (scene.player.isInteracting()) {
            console.log('Tidsmaskine aktiveret');
            playerData.playerPosition.x = playerSprite.x;
            playerData.playerPosition.y = playerSprite.y;
            playerData.isTutorialComplete = true;
            scene.scene.start(constants.SCENES.TIME_MACHINE, playerData);
            // --- skift scene til laboratorie kode her ---
        };
    });
}
function startTutorial() {
    const tutorialX = playerSprite.x;
    const tutorialY = playerSprite.y;
    console.log(tutorialX);
    console.log(tutorialY);

    let tutorialBG = scene.add.rectangle(0, 0, 150, 160, 0x000000).setStrokeStyle(5, 0xff00a2, 0.5).setFillStyle(0xff00ff, 0.5);

    tutorialKey = scene.add.image(0, -40, constants.IMAGES.TUTORIAL_ARROWS).setScale(0.3);
    tutorialAltKey = scene.add.image(0, 30, constants.IMAGES.TUTORIAL_WASD).setScale(0.3);
    let tutorialText = scene.add.text(-15, -12, 'ELLER', {
        fontSize: 10
    });
    tutorialText2 = scene.add.text(-60, 60, 'For at bevæge dig', {
        fontSize: 12
    });

    tutorialContainer = scene.add.container(tutorialX, tutorialY, [tutorialBG, tutorialKey, tutorialText, tutorialAltKey, tutorialText2]).setDepth(20).setScrollFactor(0).setVisible(false);
    setTimeout(() => {
        tutorialContainer.setVisible(true);
    }, 6000);
}

function bookShelfInteraction(){
    if(scene.player.isInteracting())
    textBox.writeUiText(scene,uiTextBox,'Bog#0 "Tidsrejser". \nDer står måske noget nyttigt her \n\n"Nedskrevet viden (runer, dokumenter, bøger, computere etc.) er den bedste måde at finde viden, om den tid man er i"', 50);
}