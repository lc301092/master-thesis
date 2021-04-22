import { constants } from "../constants.js"
import Player from "../game/player.js"
import PlayerLog from "../game/ui.js"
import {textBox} from "../game/ui.js"

let playerData;
let playerSprite;
let playerInteractionCollider;

let scene;

// npc
let npc;
let npcText;
let dialogue;
let hasNewDialogue = true;

//object colliders 
let dynmaicCollider;
let collideables;
let npcCollider;
let portal; 

// UI
let uiTextBox;
let uiPlayerLog;

let content;

export class Farm extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.FARM,
        })
        this.player = null;
    }

    init(data) {
       playerData = data;

       // set player
        playerSprite = this.physics.add.sprite(200, 400, 'player', 4).setCollideWorldBounds(true).setDepth(1);
        let keys = this.input.keyboard.addKeys(constants.USERINPUT);
        playerInteractionCollider = this.add.rectangle(playerSprite.x, playerSprite.y, playerSprite.width / 2, playerSprite.height / 2,
        );
        this.player = new Player(keys, playerInteractionCollider, playerSprite);
    }
    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }
    create() {
        scene = this;

        // tilemap configurations
        let farm_lvl = this.add.tilemap('farm');

        // add tileset image
        let tileImages = constants.TILEIMAGES.FARM_LVL;
        let images = constants.IMAGES;
        let tileObj = {};

        for (const key in tileImages) {
            let tileImageString = images[key];
            let tilesetImage = farm_lvl.addTilesetImage(tileImageString);
            tileObj[key] = tilesetImage;
        }

        let FARM_BOOK = tileObj.FARM_BOOK;
        let FARM_BUILDING = tileObj.FARM_BUILDING;
        let FARM_DECO = tileObj.FARM_DECO;
        let FARM_GROUND = tileObj.FARM_GROUND;
        let FARM_DECO2 = tileObj.FARM_DECO2;
        let FARM_DECO3 = tileObj.FARM_DECO3;
        let FARM_DECO4 = tileObj.FARM_DECO4;

        //layers 
        let borders = farm_lvl.createLayer('InvisibleBorders', [FARM_DECO2],0,0).setDepth(-3);
        let ground = farm_lvl.createLayer('Ground', [FARM_GROUND, FARM_DECO3], 0, 0).setDepth(-2);
        let wallTop = farm_lvl.createLayer('BorderTop', [FARM_DECO2], 0, 0).setDepth(-1);
        let wallBot = farm_lvl.createLayer('BorderBot', [FARM_DECO2], 0, 0).setDepth(1);
        let exterior = farm_lvl.createLayer('Exterior', [FARM_BUILDING, FARM_DECO4, FARM_DECO2, FARM_DECO3], 0, 0);
        let exterior2 = farm_lvl.createLayer('Exterior2', [FARM_DECO], 0, 0);
        let flavor = farm_lvl.createLayer('GroundFlavor', [FARM_DECO3], 0, 0).setDepth(1);
        let interact = farm_lvl.createLayer('interactables', [FARM_BOOK, FARM_DECO2], 0, 0); 
        
        // resize player
        playerSprite.setSize(25, 50).setOffset(12, 10);

        // camera setup
        //scene.cameras.main.setZoom(1.2);
        //scene.cameras.main.setBounds(0, 0, 800, 800);
        scene.physics.world.setBounds(0, 0, 800, 800);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(playerSprite, true, 0.05, 0.05);

        // border collision 
        scene.physics.add.collider(playerSprite, borders);
        borders.setCollisionByProperty({border:true});

         // object colliders
         dynmaicCollider = this.physics.add.group();
         dynmaicCollider.add(this.player.collider);
         collideables = this.physics.add.staticGroup();

        // object instantiation
            // npc
        npc = scene.physics.add.sprite(550, 550, 'npc1',52).setScale(0.88);
            // dialog
        dialogue = scene.add.image(npc.x + 5, npc.y - 40, 'exclamation.png').setScale(0.1);
            // portal 
       // portal = scene.a
        
        // object colliders
            // npc collider
        npcCollider = this.add.rectangle(npc.x, npc.y, npc.width / 2, npc.height);
            //

        collideables.add(npcCollider);

        // set colliders and overlap on objects
        scene.physics.add.collider(playerSprite, npcCollider);
        scene.physics.add.overlap(playerInteractionCollider, npcCollider, npcInteraction, null, this);
    
        // create textbox
        uiTextBox = textBox.createTextBox(this, 65, 480, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
        });//.setVisible(false);

        uiPlayerLog = new PlayerLog(this);
    }
    update(){
        // player movement
        this.player.update();
    }
}

function npcInteraction() {
    const player = this.player;
    if (!player.isInteracting()) return;
        
     // disable exclamation mark after first time talking
    if (hasNewDialogue) toggleImage(dialogue);

    hasNewDialogue = false;
    // determins what npc will say 
    player.setDisabled(true);

    uiTextBox.setVisible(true);
    content = ['Hej!', '', 'Du må være jordbrugsteknologen!'];
    
    uiTextBox.once('complete', function () {
        console.log('done');
    }).start(content, 50); 

}

async function toggleImage(image, callback = null) {
    if (image.visible) image.visible = false;
    else image.visible = true;

    if (!callback) return;

    setTimeout(() => {
        return callback();
    }, 50);
}