import { constants } from "../constants.js"

let player, keys, playerAnimation, singlePress, scene;
let speed = 128;
let npc;
let npcText;
let tickY;
let tickB;
let tickR;
let xY;
let xB;
let xR;
let dataY;
let dataR;
let dataB; 
let playerInteractionCollider;
let interactionRangeY = 30;
let interactionRangeX = 15;
let objective = {
    medY: { isApproved: '' },
    medR: { isApproved: '' },
    medB: { isApproved: '' }
}



export class ChemistLevel extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.CHEMIST,
        })
    }
    init(data) {
    }
    preload() {
    }
    create() {
        scene = this;

        // tilemap configurations

        let chemist_lvl = this.add.tilemap('scenarie1');

        // add tileset image

        let tileImages = constants.TILEIMAGES.CHEMIST_LVL;
        let images = constants.IMAGES;
        let tileObj = {};

        for (const key in tileImages) {
            let tileImageString = images[key];
            let tilesetImage = chemist_lvl.addTilesetImage(tileImageString);
            tileObj[key] = tilesetImage;
        }

        let MEDLAB_INTERIOR_1 = tileObj.MEDLAB_INTERIOR_1;
        let MEDLAB_INTERIOR_2 = tileObj.MEDLAB_INTERIOR_2;
        let MED1 = tileObj.MED1;
        let MED2 = tileObj.MED2;
        let MED3 = tileObj.MED3;
        let PORTAL = tileObj.PORTAL;

        //layers 
        let ground = chemist_lvl.createLayer('ground', [MEDLAB_INTERIOR_1], 0, 0).setDepth(-2);
        let walls = chemist_lvl.createLayer('walls', [MEDLAB_INTERIOR_1, MEDLAB_INTERIOR_2], 0, 0).setDepth(-2);
        let deco = chemist_lvl.createLayer('deco', [MEDLAB_INTERIOR_2], 0, 0);
        let deco1 = chemist_lvl.createLayer('deco1', [MEDLAB_INTERIOR_1, MEDLAB_INTERIOR_2], 0, 0);
        let deco2 = chemist_lvl.createLayer('deco2', [MEDLAB_INTERIOR_1], 0, 0);
        let interact = chemist_lvl.createLayer('interact', [MED1, MED2, MED3, PORTAL], 0, 0).setDepth(1);
        let interact2 = chemist_lvl.createLayer('interact2', [PORTAL], 0, 0).setDepth(-1);

        player = scene.physics.add.sprite(265, 250, 'player').setCollideWorldBounds(true); //.setScale(2);
        playerInteractionCollider = this.add.rectangle(player.x,player.y + interactionRangeY,player.width/2,player.height/2 ,
           // 0xff0000,0.5  // debugging purposes
            );
        let dynmaicCollider = this.physics.add.group();
        dynmaicCollider.add(playerInteractionCollider);
        npc = scene.physics.add.sprite(550, 350, 'professor-npc', 9);
        let collideables = this.physics.add.staticGroup();
        let npcCollider =this.add.rectangle(npc.x,npc.y,npc.width/2,npc.height,
            // 0xff0000,0.5 // debugging purposes
            );

        collideables.add(npcCollider);
        //npcCollider.setCollideWorldBounds(true)
        //npcCollider.setImmovable(true);
        player.setSize(25, 50).setOffset(12, 10);
        scene.cameras.main.setBounds(0, 0, 600, 600);
        scene.physics.world.setBounds(0, 0, 600, 600);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(player, true, 0.05, 0.05);
        //scene.animationSetup(this);
        playerAnimation = player.anims;

        npcText = this.add.text(110, 485, 'Vi skal have analyseret medikamenterne\nobjektivt, så resultaterne ikke er farvede');
        npcText.visible = false;

        // keyobject for movement
        keys = scene.input.keyboard.addKeys(constants.USERINPUT.WASD_MOVEMENT);
        singlePress = constants.USERINPUT.SINGLEPRESS;

        // map collisions
        let borders = [walls, ground, deco, deco1, deco2];
        scene.physics.add.collider(player, borders);

        for (let i = 0; i < borders.length; i++) {
            borders[i].setCollisionByProperty({ border: true });
        }

        // map collision interactives
        scene.physics.add.collider(player, interact);
        scene.physics.add.collider(player, interact2);
        scene.physics.add.overlap(playerInteractionCollider, npcCollider, npcInteraction, null, this);
        scene.physics.add.collider(player, npcCollider, npcInteraction2);


        // instantiering af tick og x 
        tickY = scene.add.image(370, 470, 'flueben.png').setScale(0.025);
        tickR = scene.add.image(500, 470, 'flueben.png').setScale(0.025);
        tickB = scene.add.image(435, 470, 'flueben.png').setScale(0.025);
        xY = scene.add.image(370, 470, 'xikon.png').setScale(0.015);
        xR = scene.add.image(500, 470, 'xikon.png').setScale(0.015);
        xB = scene.add.image(435, 470, 'xikon.png').setScale(0.015);

        tickY.visible = false;
        tickR.visible = false;
        tickB.visible = false;
        xY.visible = false;
        xR.visible = false;
        xB.visible = false;

        // medikament datasæt billede 
        dataY = scene.add.image(0,100, 'yellow.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataR = scene.add.image(0, 100, 'blue.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataB = scene.add.image(0, 100, 'red.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataY.visible = false;
        dataR.visible = false; 
        dataB.visible = false; 

        // gul medicin
        interact.setTileLocationCallback(22, 27, 2, 2, () => {
            if (singlePress(keys.interact)) {
                alert('Her kan du se dataene på den gule medicin');
                toggleImage(dataY, function () {
                    // --- dataset til gul medicin kode her ---
                    if (confirm('Vil du acceptere dette medikament? \nTryk [ok] for ja \nTryk på [annuller] for nej')) {
                        objective.medY.isApproved = true;
                        if (xY.visible) xY.visible = false;
                        tickY.visible = true;
                        dataY.visible = false;
                    }
                    else {
                        objective.medY.isApproved = false;
                        if (tickY.visible) tickY.visible = false;
                        xY.visible = true;
                        dataY.visible = false;
                    }
                });
            }
        });

    // rød medicin
    interact.setTileLocationCallback(30, 27, 2, 2, () => {
        if (singlePress(keys.interact)) {
            alert('Du interagerer med RØD medicin');
            toggleImage(dataR, function () {
            // --- dataset til rød medicin kode her---
            if (confirm('Vil du acceptere dette medikament? \nTryk [ok] for ja \nTryk på [annuller] for nej')) {
                objective.medR.isApproved = true;
                if (xR.visible) xR.visible = false;
                tickR.visible = true;
                dataR.visible = false;
            }
            else {
                objective.medR.isApproved = false;
                if (tickR.visible) tickR.visible = false;
                xR.visible = true;
                dataR.visible = false;
            }
            });
        };
    });

// blå medicin
interact.setTileLocationCallback(26, 27, 2, 2, () => {
    if (singlePress(keys.interact)) {

        alert('Du interagerer med BLÅ medicin');
        toggleImage(dataB, function () {
        // --- dataset til blå medicin kode her ---
        if (confirm('Vil du acceptere dette medikament? \nTryk [ok] for ja \nTryk på [annuller] for nej')) {
            objective.medB.isApproved = true;
            if (xB.visible) xB.visible = false;
            tickB.visible = true;
            dataB.visible = false;
        }
        else {
            objective.medB.isApproved = false;
            if (tickB.visible = true) tickB.visible = false;
            xB.visible = true;
            dataB.visible = false;
        }
    });
    };
});

interact2.setTileLocationCallback(15, 13, 3, 4, () => {

    if (singlePress(keys.interact)) {
        if (!confirm('Vil du gerne rejse tilbage til år 2200?')) return;

        // Save answers!
        localStorage.setItem('objectives', JSON.stringify(objective));
        console.log('Rejser tilbage');
        this.scene.start(constants.SCENES.PLAY);
        //interact.setTileLocationCallback(7,25,1,4, null);

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
        playerInteractionCollider.x = player.x;
        playerInteractionCollider.y = player.y - interactionRangeX;
    }
    if (keys.down.isDown) {
        player.setVelocityY(speed);
        playerInteractionCollider.x = player.x;
        playerInteractionCollider.y = player.y + interactionRangeY;
    }
    if (keys.left.isDown) {
        player.setVelocityX(-speed);
        playerInteractionCollider.x = player.x - interactionRangeX;
        playerInteractionCollider.y = player.y;
    }
    if (keys.right.isDown) {
        player.setVelocityX(speed);
        playerInteractionCollider.x = player.x + interactionRangeX;
        playerInteractionCollider.y = player.y;
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
    scene.anims.create({
        key: 'idle',
        frames: [{
            key: constants.SPRITES.CHEMIST_NPC,
            frame: 10
        }],
        frameRate: 10,
        repeat: -1
    });
}
}
function npcInteraction2() {
    console.log('touching');
}

function npcInteraction() {
    // console.log('touching');
    if (singlePress(keys.interact)) {
        // alert('"Vi skal have analyseret medikamenterne objektivt, så resultaterne ikke er farvede"');
        if (npcText.visible) return;
        // determine what npc will say 

        // set text to visible for a period of time
        npcText.visible = true;
        setTimeout(() => { npcText.visible = false }, 5000);
    }

}
async function toggleImage(image, callback) {
    if (image.visible) image.visible = false;
    else image.visible = true;

    setTimeout(() => {
        return callback();
    }, 50);
}
