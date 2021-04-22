import { constants } from "../constants.js"
import Player from "../game/player.js"
import PlayerLog from "../game/ui.js"
import { textBox } from "../game/ui.js"

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
let newDialogue;
let hasNewDialogue = true;

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


const rule1 = 'Regl #1: Medianen af antal rapporterede bivirkninger må ikke overstige 5.';
const rule2 = 'Regl #2: 50% af menneskerne der har indtaget medicinen, skal have oplevet et temperaturfald på minimum 2 grader celcius eller over.';
let uiTextBox;
let uiPlayerLog;
let content;
let isLogUpdated;

const tip1 = 'Bog#1 Sumkurver: \n\n...Medianen er det midterste tal af alle observationer, hvilket vil sige at 50% af observationer er mindre end medianen og 50% er større. \nFor at finde medianen, finder man 50% markøren på y-aksen og følger den vandret, indtil man møder sumkurven. \nDerefter går man lodret ned, hvor tallet man støder på på x-aksen, er medianen.';
const tip2 = 'Bog#2 Boxplot: \n\n...Boxplot er en overskuelig måde sammenligne data med hinanden på. \nEt boxplot indeholder ALTID: Den mindste observation, en nedre kvartil, en median, en øvre kvartil, og den største observation.';

const sinkString = 'Jeg er glad for at de har god håndhygiejne i den her tid...';
const dropString = 'Gad vide om jeg har været koblet op til et drop, da de opererede mit ansigt...';

//let rexUI;

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
            // 0xff0000, 0.5
        );
        this.player = new Player(keys, playerInteractionCollider, playerSprite);
    }
    preload() {
        //rexUI = this.plugins.get('rexUI');
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
        let bookshelf = scene.add.rectangle(465, 90, 25, 50,
            // 0xff0000, 0.5
        );
        let bookshelf2 = scene.add.rectangle(495, 90, 25, 50,
            //0xff00ff, 0.5
        );
        // TODO make them say stuff 
        let drop = scene.add.rectangle(550, 150, 35, 75,
            //0xff00ff, 0.5
        );;
        let sink = scene.add.rectangle(130, 340, 25, 100,
            //0xff00ff, 0.5
        );;

        collideables.add(npcCollider);
        collideables.add(bookshelf);
        collideables.add(bookshelf2)
        collideables.add(sink)
        collideables.add(drop)
        //npcCollider.setCollideWorldBounds(true)
        //npcCollider.setImmovable(true);
        playerSprite.setSize(25, 50).setOffset(12, 10);

        // scene.cameras.main.setZoom(1.5);
       // scene.cameras.main.setBounds(-200,-200);
        scene.physics.world.setBounds(0, 0, 600, 600);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(playerSprite, true, 0.05, 0.05);

        npcText = this.add.text(110, 485, '', { color: 'black' });
        npcText.visible = false;

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
        scene.physics.add.collider(playerSprite, npcCollider);

        scene.physics.add.overlap(playerInteractionCollider, bookshelf, bookshelfInteraction1, null, this);
        scene.physics.add.overlap(playerInteractionCollider, bookshelf2, bookshelfInteraction2, null, this);
        scene.physics.add.overlap(playerInteractionCollider, sink, sinkInteraction, null, this);
        scene.physics.add.overlap(playerInteractionCollider, drop, dropInteraction, null, this);




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

        // medicinf datasæt billede 
        dataY = scene.add.image(0, 100, 'diagram_chemist_yellow.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataR = scene.add.image(0, 100, 'diagram_chemist_red.png').setScale(0.8).setOrigin(0).setDepth(10);
        dataB = scene.add.image(0, 100, 'diagram_chemist_blue.png').setScale(0.8).setOrigin(0).setDepth(10);
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
                    if (confirm('Vil du acceptere denne medicin? \nTryk [ok] for ja \nTryk på [annuller] for nej')) {
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
                    if (confirm('Vil du acceptere denne medicin? \nTryk [ok] for ja \nTryk på [annuller] for nej')) {
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
                    if (confirm('Vil du acceptere denne medicin? \nTryk [ok] for ja \nTryk på [annuller] for nej')) {
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
                let isCorrect = objective.medY.isApproved && !objective.medR.isApproved && !objective.medB.isApproved;
                objective.isCorrect = isCorrect;

                // Save answers!
                playerData.answers[sceneIndex] = objective;
                localStorage.setItem('foobar', JSON.stringify(playerData));
                console.log('Rejser tilbage');
                this.scene.start(constants.SCENES.PLAY, playerData);

            };
        });

        uiTextBox = textBox.createTextBox(this); 

        uiPlayerLog = new PlayerLog(this);
        // uiPlayerLog.setText(sceneID);


    }
    update() {
        // player movement
        this.player.update();
    }
}

// needs to be rewrtitten once text is chained together  
function npcInteraction() {
    const player = this.player;
    if (!player.isInteracting()) return;
    // disable exclamation mark after first time talking
    if (hasNewDialogue) toggleImage(newDialogue);

    hasNewDialogue = false;
    // determins what npc will say 

    if (!objective.isComplete) {
        uiTextBox.setVisible(true);
        content = ['Hej! Du må være laboranten vi har ventet på. Jeg er glad for at møde dig…', '', 'På bordet finder du vores tre mediciner. Vi har brug for dit input, så vi sikrer os at vores resultater ikke er farvet… ', 'Du finder information om medicinerne, ved at gå ned og undersøge dem.', '', 'Når du godkender eller afviser en medicin, så er beslutningen ikke endelig.', '', 'For at godkende en medicin skal to regler være opfyldt…', '', rule1, '', rule2];

        // in this case the rules are chained so only check for rule1.
        if (scenarioLog.rules.indexOf(rule1) == -1) {
            scenarioLog.rules.push(rule1, rule2);

            //isLogUpdated = true;
        };

        uiTextBox.once('complete', function () {
            uiPlayerLog.setText(rule1);
            uiPlayerLog.setText(rule2);
            console.log('done');
        }).start(content, 50);

    }
    else {
        if (hasNewDialogue) toggleImage(newDialogue);
        hasNewDialogue = false;
        uiTextBox.setVisible(true);
        content = ['Jeg kan se, at du har behandlet de tre mediciner. Tusind tak for din hjælp!', '', 'Du har stadigvæk mulighed for at ændre din beslutning, hvis du er kommet i tvivl.'];
        uiTextBox.start(content, 50);
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


function checkIfDone() {
    let medicines = 0;
    
    for (const key in objective) {
        if (objective[key].isApproved != undefined) medicines++;
    }
    console.log(medicines);
    // not done
    if (medicines != 2) return;
    
    // is done
    objective.isComplete = true;
    if (hasNewDialogue) return;
    toggleImage(newDialogue);
    hasNewDialogue = true;
}


function sinkInteraction() {
    const player = this.player;
    if (!player.isInteracting()) return;
    //uiTextBox.setVisible(true);
    textBox.writeUiText(scene, uiTextBox, sinkString, 50);//alert(sinkString);
}

function dropInteraction() {
    const player = this.player;
    if (!player.isInteracting()) return;
    textBox.writeUiText(scene, uiTextBox, dropString, 50);//alert(sinkString);
    
}
// display books in bookshelf 
function bookshelfInteraction1() {
    const player = this.player;
    if (!player.isInteracting()) return;

    textBox.writeUiText(scene, uiTextBox, tip1, 50);//alert(sinkString);

    // const tip = 'Medianen i en sumkurve læses ud fra 50% markøren på Y aksen.';
   /* alert(`Du kigger i en bog. Du lægger mærke til følgende:\n "...${tip1}"`);
    if (scenarioLog.tips.indexOf(tip1) == -1) {
        scenarioLog.tips.push(tip1);

        // remove when scenario log is implemented
        //  uiPlayerLog.setText('Tip: ' + tip1);
    }*/
};

function bookshelfInteraction2() {
    const player = this.player;
    if (!player.isInteracting()) return;
    // const tip = 'Medianen i en sumkurve læses ud fra 50% markøren på Y aksen.';
    textBox.writeUiText(scene, uiTextBox, tip2, 50);//alert(sinkString);
    /*
    alert(`Du kigger i en bog. Du lægger mærke til følgende:\n "...${tip2}"`);
    if (scenarioLog.tips.indexOf(tip2) == -1) {
        scenarioLog.tips.push(tip2);
        
        // remove when scenario log is implemented
        // uiPlayerLog.setText('Tip: ' + tip2);
    }
    */
};


