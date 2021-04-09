import { constants } from "../constants.js"
const sceneID = constants.SCENES.CHEMIST;

let player, playerData, playerAnimation, scene, playerPosition;
let keys, singlePress, isInteracting, isPlayerDisabled = false;
let speed = 128;

let npc;
let npcText;
let npcState;
let newDialogue;

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
    medY: { isApproved: null },
    medR: { isApproved: null },
    medB: { isApproved: null }
}

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

let uiTextBox;
let content;


export class ChemistLevel extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.CHEMIST,
        })
    }
    init(data) {
        playerData = data;
        if (playerData.playerProgression.indexOf(sceneID) == -1) playerData.playerProgression.push(sceneID);
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

        player = scene.physics.add.sprite(265, 250, 'player', 4).setCollideWorldBounds(true); //.setScale(2);
        playerInteractionCollider = this.add.rectangle(player.x, player.y + interactionRangeY, player.width / 2, player.height / 2,
            0xff0000, 0.5  // debugging purposes
        );
        let dynmaicCollider = this.physics.add.group();
        dynmaicCollider.add(playerInteractionCollider);
        npc = scene.physics.add.sprite(550, 350, 'professor-npc', 9);
        newDialogue = scene.add.image(npc.x + 5, npc.y - 40, 'exclamation.png').setScale(0.1);
        let collideables = this.physics.add.staticGroup();
        let npcCollider = this.add.rectangle(npc.x, npc.y, npc.width / 2, npc.height,
            // 0xff0000,0.5 // debugging purposes
        );
        let bookshelf = scene.add.rectangle(480, 90, 50, 50,
            0xff0000, 0.5
        );
        let sink;
        let drop;

        collideables.add(npcCollider);
        collideables.add(bookshelf);
        //npcCollider.setCollideWorldBounds(true)
        //npcCollider.setImmovable(true);
        player.setSize(25, 50).setOffset(12, 10);

        //scene.cameras.main.setZoom(1.5);
        scene.cameras.main.setBounds(0, 0, 600, 600);
        scene.physics.world.setBounds(0, 0, 600, 600);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(player, true, 0.05, 0.05);
        scene.animationSetup(this);
        playerAnimation = player.anims;

        npcText = this.add.text(110, 485, '', { color: 'black' });
        npcText.visible = false;
        npcState = 0;

        // keyobject for movement
        keys = scene.input.keyboard.addKeys(constants.USERINPUT);
        singlePress = constants.USERINPUT.SINGLEPRESS;

        isInteracting = () => {
            if (!isPlayerDisabled)
                return singlePress(keys.interact) || singlePress(keys.alt_interact);
        }
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
        scene.physics.add.collider(playerInteractionCollider, bookshelf, bookshelfInteraction, null, this);
        scene.physics.add.collider(player, npcCollider);



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
        dataY = scene.add.image(0, 100, 'yellow.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataR = scene.add.image(0, 100, 'red.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataB = scene.add.image(0, 100, 'blue.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataY.visible = false;
        dataR.visible = false;
        dataB.visible = false;

        // gul medicin
        interact.setTileLocationCallback(22, 27, 2, 2, () => {

            if (isInteracting()) {
                checkIfDone();
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
            if (isInteracting()) {
                checkIfDone();
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
            if (isInteracting()) {
                checkIfDone();

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

            if (isInteracting()) {
                if (!confirm('Vil du gerne rejse tilbage til år 2200?')) return;
                // Save answers!
                playerData.answers[playerData.playerProgression.indexOf(sceneID)] = objective;
                localStorage.setItem('foobar', JSON.stringify(playerData));
                console.log('Rejser tilbage');
                this.scene.start(constants.SCENES.PLAY, playerData);
                //interact.setTileLocationCallback(7,25,1,4, null);

            };
        });

        // createTextBox(this, 100, 100, {
        //     wrapWidth: 500,
        // })
        //     .start(content, 50);

        uiTextBox = createTextBox(this, 65, 480, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
        }).setVisible(false);

    }
    update() {
        // player movement
        this.playerControl();
    }
    // 8 directional  

    playerControl() {

        if (isPlayerDisabled) return;

        if (singlePress(keys.sprint))
            speed = 192;
        else if (keys.sprint.isUp) speed = 128;

        if (keys.up.isDown || keys.alt_up.isDown) {
            player.setVelocityY(-speed);
            playerInteractionCollider.x = player.x;
            playerInteractionCollider.y = player.y - interactionRangeX;
        }
        if (keys.down.isDown || keys.alt_down.isDown) {
            player.setVelocityY(speed);
            playerInteractionCollider.x = player.x;
            playerInteractionCollider.y = player.y + interactionRangeY;
        }
        if (keys.left.isDown || keys.alt_left.isDown) {
            player.setVelocityX(-speed);
            playerInteractionCollider.x = player.x - interactionRangeX;
            playerInteractionCollider.y = player.y;
        }
        if (keys.right.isDown || keys.alt_right.isDown) {
            player.setVelocityX(speed);
            playerInteractionCollider.x = player.x + interactionRangeX;
            playerInteractionCollider.y = player.y;
        }
        if (keys.up.isUp && keys.down.isUp) {
            if (keys.alt_up.isUp && keys.alt_down.isUp)
                player.setVelocityY(0);
            //playerAnimation.play('turn', true);
        }
        if (keys.right.isUp && keys.left.isUp) {
            if (keys.alt_right.isUp && keys.alt_left.isUp)
                player.setVelocityX(0);
            //playerAnimation.play('turn', true);
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

// needs to be rewrtitten once text is chained together  
function npcInteraction() {
    if (!isInteracting()) return;
    // disable exclamation mark after first time talking
    if (npcState == 0) toggleImage(newDialogue);
    // determins what npc will say 
    isPlayerDisabled = true;

    if (!objective.isComplete) {
        uiTextBox.setVisible(true);
        content = ['Det må være dig, der skal analysere vores medicin objektivt.', '', 'Hvis en medicin skal kunne godkendes, skal det overholde følgende to regler:', '', 'Regel #1: For bivirkninger gælder det, at medianen IKKE må overskride mere end 5 bivirkninger, dvs. 50% af de rapportede bivirkninger skal være under 5.', '', 'Regel #2: Den midterste halvdel af spredning for medikamentets evne til febernedsættelse, skal være større end det ydre. Sig endelig til hvis du vil høre det igen'];
        uiTextBox.start(content, 50);
        if (npcState == 0) npcState++;
    }
    else {
        if (npcState == 1) toggleImage(newDialogue);
        uiTextBox.setVisible(true);
        content = 'Jeg kan se, at du har behandlet de tre mediciner. Det er kun de endelige resultater vi kommer til at bruge, så du kan stadigvæk nå at acceptere eller kassere endnu. Tak for hjælpen!'
        uiTextBox.start(content, 50);
        if (npcState == 1) npcState++;
    }
}
async function toggleImage(image, callback = null) {
    if (image.visible) image.visible = false;
    else image.visible = true;

    if (!callback) return;

    setTimeout(() => {
        return callback();
    }, 50);
}

let bookshelfInteraction = () => {
    if (isInteracting())
        alert('Du kigger i en bog. Du lægger mærke til følgende:\n "...Medianen i en sumkurve læses ud fra 50% markøren på Y aksen."');
};

function checkIfDone() {
    let medicines = 0;

    for (const key in objective) {
        if (objective[key].isApproved != undefined) medicines++;
    }
    console.log(medicines);
    if (medicines != 2) return;
    objective.isComplete = true;
    toggleImage(newDialogue);
}

const GetValue = Phaser.Utils.Objects.GetValue;

function createTextBox(scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'flueben.png').setScale(0.2).setTint(COLOR_LIGHT).setVisible(false),

        space: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            icon: 10,
            text: 10,
        }
    })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isLastPage && !this.isTyping) {
                this.setVisible(false);
                isPlayerDisabled = false;
            };
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }
            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}
