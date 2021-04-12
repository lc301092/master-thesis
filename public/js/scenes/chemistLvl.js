import { constants } from "../constants.js"
import Player from "../game/player.js"

const sceneID = constants.SCENES.CHEMIST;
let sceneIndex;

let playerSprite, playerData, scene;
let scenarioLog = {
    level: '',
    rules: [],
    tips: []
};

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
let objective = {
    medY: { isApproved: null },
    medR: { isApproved: null },
    medB: { isApproved: null }
}

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const rule1 = 'Regl #1: Medianen af antal rapporterede bivirkninger må ikke overstige 5.';
const rule2 = 'Regl #2: 50% af menneskerne der har indtaget medicinen, skal have oplevet et temperaturfald på minimum 2 grader celcius eller over.';
let uiTextBox;
let content;

const tip1 = 'Bog#1 Sumkurver: \n\n...Medianen er det midterste tal af alle observationer, hvilket vil sige at 50% af observationer er mindre end medianen og 50% er større. \nFor at finde medianen, finder man 50% markøren på y-aksen og følger den vandret, indtil man møder sumkurven. \nDerefter går man lodret ned, hvor tallet man støder på på x-aksen, er medianen.';
const tip2 = 'Bog#2 Boxplot: \n\n...Boxplot er en overskuelig måde sammenligne data med hinanden på. \nEt boxplot indeholder ALTID: Den mindste observation, en nedre kvartil, en median, en øvre kvartil, og den største observation.';

const vask = 'Jeg er glad for at de har god håndhygiejne i den her tid...';
const drop = 'Gad vide om jeg har været koblet op til et drop, da de opererede mit ansigt...';

export class ChemistLevel extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.CHEMIST,
        })
        this.player = null;
    }
    init(data) {
        playerData = data;
        if (playerData.playerProgression.indexOf(sceneID) == -1) playerData.playerProgression.push(sceneID);

        sceneIndex = playerData.playerProgression.indexOf(sceneID);
        scenarioLog.level = sceneID;
        //TODO
        // updatePlayerlog()
        // playerData.playerLog.push({level: ""})

        playerSprite = this.physics.add.sprite(265, 250, 'player', 4).setCollideWorldBounds(true).setDepth(1); //.setScale(2);
        let keys = this.input.keyboard.addKeys(constants.USERINPUT);
        playerInteractionCollider = this.add.rectangle(playerSprite.x, playerSprite.y, playerSprite.width / 2, playerSprite.height / 2,
            0xff0000, 0.5
        );
        // animationSetup(this);
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

        // object colliders
        let dynmaicCollider = this.physics.add.group();
        dynmaicCollider.add(this.player.collider);
        npc = scene.physics.add.sprite(550, 350, 'professor-npc', 9);
        newDialogue = scene.add.image(npc.x + 5, npc.y - 40, 'exclamation.png').setScale(0.1);
        let collideables = this.physics.add.staticGroup();
        let npcCollider = this.add.rectangle(npc.x, npc.y, npc.width / 2, npc.height,
            // 0xff0000,0.5 // debugging purposes
        );
        let bookshelf = scene.add.rectangle(480, 90, 50, 50,
            0xff0000, 0.5
        );
        // TODO make them say stuff 
        let sink;
        let drop;

        collideables.add(npcCollider);
        collideables.add(bookshelf);
        //npcCollider.setCollideWorldBounds(true)
        //npcCollider.setImmovable(true);
        playerSprite.setSize(25, 50).setOffset(12, 10);

        //scene.cameras.main.setZoom(1.5);
        scene.cameras.main.setBounds(0, 0, 600, 600);
        scene.physics.world.setBounds(0, 0, 600, 600);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(playerSprite, true, 0.05, 0.05);
        scene.animationSetup(this);

        npcText = this.add.text(110, 485, '', { color: 'black' });
        npcText.visible = false;
        npcState = 0;

        // map collisions
        let borders = [walls, ground, deco, deco1, deco2];
        scene.physics.add.collider(playerSprite, borders);

        for (let i = 0; i < borders.length; i++) {
            borders[i].setCollisionByProperty({ border: true });
        }

        // map collision interactives
        scene.physics.add.collider(playerSprite, interact);
        scene.physics.add.collider(playerSprite, interact2);
        scene.physics.add.overlap(playerInteractionCollider, npcCollider, npcInteraction, null, this);
        scene.physics.add.collider(playerInteractionCollider, bookshelf, bookshelfInteraction, null, this);
        scene.physics.add.collider(playerSprite, npcCollider);



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

            if (this.player.isInteracting()) {
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
            if (this.player.isInteracting()) {
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
            if (this.player.isInteracting()) {
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

            if (this.player.isInteracting()) {
                if (!confirm('Vil du gerne rejse tilbage til år 2200?')) return;
                // Save answers!
                playerData.answers[sceneIndex] = objective;
                localStorage.setItem('foobar', JSON.stringify(playerData));
                console.log('Rejser tilbage');
                this.scene.start(constants.SCENES.PLAY, playerData);

            };
        });

        uiTextBox = createTextBox(this, 65, 480, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
        }).setVisible(false);

    }
    update() {
        // player movement
        this.player.update();
    }
    // 8 directional  

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
    const player = this.player;
    if (!player.isInteracting()) return;
    // disable exclamation mark after first time talking
    console.log('@!#$!#%%#%$@%@$%@$%@$', player);
    if (npcState == 0) toggleImage(newDialogue);
    // determins what npc will say 
    player.setDisabled(true);

    if (!objective.isComplete) {
        uiTextBox.setVisible(true);
        content = ['Hej! Du må være laboranten vi har ventet på. Jeg er glad for at møde dig…', '', 'På bordet finder du vores tre mediciner. Vi har brug for dit input, så vi sikrer os at vores resultater ikke er farvet… ', 'Du finder information om medicinerne, ved at gå ned og undersøge dem.', '', 'Når du godkender eller afviser en medicin, så er beslutningen ikke endelig.', '', 'For at godkende en medicin skal to regler være opfyldt…', '', rule1, '', rule2];
        
        // in this case the rules are chained so only check for rule1.
        if(scenarioLog.rules.indexOf(rule1) == -1){
            scenarioLog.rules.push(rule1,rule2);
        };
        
        uiTextBox.start(content, 50);
        if (npcState == 0) npcState++;

    }
    else {
        if (npcState == 1) toggleImage(newDialogue);
        uiTextBox.setVisible(true);
        content = ['Jeg kan se, at du har behandlet de tre mediciner. Tusind tak for din hjælp!', '', 'Du har stadigvæk mulighed for at ændre din beslutning, hvis du er kommet i tvivl.'];
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

// display books in bookshelf 
function bookshelfInteraction() {
    const player = this.player;
    if (!player.isInteracting()) return;

    alert(`${tip2}`);
    if(scenarioLog.tips.indexOf(tip2) == -1 ) scenarioLog.tips.push(tip2);
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
    const player = scene.player;

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
                player.setDisabled(false);
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
