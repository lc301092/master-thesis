import { constants } from "../constants.js"
import Player from "../game/player.js"
import PlayerLog from "../game/ui.js"
import { textBox } from "../game/ui.js"

const sceneID = constants.SCENES.CHEMIST;
let anchor;

const sceneIndex = 0;

let playerSprite, playerData, scene;
let scenarioLog = {
    level: '',
    rules: [],
    tips: []
};

let npc, npcText, newDialogue;
let hasNewDialogue = true;

let tickY, tickB, tickR;
let xY, xB, xR;
let dataY, dataR, dataB;
let objective = {
    medY: { isApproved: null },
    medR: { isApproved: null },
    medB: { isApproved: null }
}

let playerInteractionCollider;

const rule1 = 'Regl #1: Medianen af antal rapporterede bivirkninger må ikke overstige 5.';
const rule2 = 'Regl #2: 50% af menneskerne der har indtaget medicinen, skal have oplevet et temperaturfald på minimum 2 grader.';

const tip1 = 'Bog#1 Sumkurver: \n\n...Medianen er det midterste tal af alle observationer, hvilket vil sige at 50% af observationer er mindre end medianen og 50% er større. \nFor at finde medianen, finder man 50% markøren på y-aksen og følger den vandret, indtil man møder sumkurven. \nDerefter går man lodret ned, hvor tallet man støder på på x-aksen, er medianen.';
const tip2 = 'Bog#2 Boxplot: \n\n...Boxplot er en overskuelig måde sammenligne data med hinanden på. \nEt boxplot indeholder ALTID: Den mindste observation, en nedre kvartil, en median, en øvre kvartil, og den største observation.';

const sinkString = 'Jeg er glad for at de har god håndhygiejne i den her tid...';
const dropString = 'Gad vide om jeg har været koblet op til et drop, da de opererede mit ansigt...';

let uiTextBox;
let uiPlayerLog;
let content;

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
       // if (playerData.playerProgression.indexOf(sceneID) == -1) playerData.playerProgression.push(sceneID);
        //sceneIndex = playerData.playerProgression.indexOf(sceneID);
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
        anchor = this.plugins.get('rexAnchor');
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
        //let interact2 = chemist_lvl.createLayer('interact2', [PORTAL], 0, 0).setDepth(-1);

        // object colliders
        let dynmaicCollider = this.physics.add.group();
        dynmaicCollider.add(this.player.collider);

        let portal = scene.physics.add.sprite(260, 190, 'portal').setScale(0.2);
        portal.anims.play('idle');
        let portalCollider = this.add.rectangle(portal.x, portal.y, 50, 70,
           // 0xff0000, 0.5 // debugging purposes
        );
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
        collideables.add(bookshelf2);
        collideables.add(sink);
        collideables.add(drop);
        collideables.add(portalCollider);

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
        // scene.physics.add.collider(playerSprite);
        scene.physics.add.overlap(playerInteractionCollider, npcCollider, npcInteraction, null, this);
        scene.physics.add.collider(playerSprite, collideables);

        scene.physics.add.overlap(playerInteractionCollider, portalCollider,portalInteraction , null, this);
        scene.physics.add.overlap(playerInteractionCollider, bookshelf, bookshelfInteraction1, null, this);
        scene.physics.add.overlap(playerInteractionCollider, bookshelf2, bookshelfInteraction2, null, this);
        scene.physics.add.overlap(playerInteractionCollider, sink, sinkInteraction, null, this);
        scene.physics.add.overlap(playerInteractionCollider, drop, dropInteraction, null, this);

        // instantiering af tick og x 
        objective.medY.tick = scene.add.image(370, 470, 'flueben.png').setScale(0.025).setVisible(false);
        objective.medR.tick = scene.add.image(500, 470, 'flueben.png').setScale(0.025).setVisible(false);
        objective.medB.tick = scene.add.image(435, 470, 'flueben.png').setScale(0.025).setVisible(false);
        objective.medY.reject = scene.add.image(370, 470, 'xikon.png').setScale(0.015).setVisible(false);
        objective.medR.reject = scene.add.image(500, 470, 'xikon.png').setScale(0.015).setVisible(false);
        objective.medB.reject = scene.add.image(435, 470, 'xikon.png').setScale(0.015).setVisible(false);

        // medicinf datasæt billede 
        objective.medY.data = scene.add.image(0, 100, 'diagram_chemist_yellow.png').setScale(0.8).setOrigin(0).setDepth(10).setScrollFactor(0).setVisible(false);
        objective.medR.data = scene.add.image(0, 100, 'diagram_chemist_red.png').setScale(0.8).setOrigin(0).setDepth(10).setScrollFactor(0).setVisible(false);
        objective.medB.data = scene.add.image(0, 100, 'diagram_chemist_blue.png').setScale(0.8).setOrigin(0).setDepth(10).setScrollFactor(0).setVisible(false);

        const anchorConfig = {
            centerX: 'center',
            centerY: 'center-50'
        }

        anchor.add(objective.medY.data, anchorConfig);
        anchor.add(objective.medR.data, anchorConfig);
        anchor.add(objective.medB.data, anchorConfig);

        let dialogueConfig = {
            numberOfChoices: 2,
            button0: {
                text: 'Godkend',
                action: acceptMedicin
            },
            button1: {
                text: 'Afvis',
                action: acceptMedicin
            }
        };

        // gul medicin
        interact.setTileLocationCallback(22, 27, 2, 2, () => {

            if (this.player.isInteracting()) {
                checkIfDone();
                //alert('Her kan du se dataene på den gule medicin');;
                dialogueConfig.title = 'Gul medicin';
                dialogueConfig.text = 'Vil du acceptere eller afvise den gule medicin';
                objective.activeMed = 'medY';
                objective.medY.data.setVisible(true);
                textBox.createDialog(scene, dialogueConfig);
                this.player.setDisabled(true);
            };
        });

        // rød medicin
        interact.setTileLocationCallback(30, 27, 2, 2, () => {
            if (this.player.isInteracting()) {
                checkIfDone();
                dialogueConfig.title = 'Rød medicin';
                dialogueConfig.text = 'Vil du acceptere eller afvise den røde medicin';
                objective.activeMed = 'medR';
                objective.medR.data.setVisible(true);
                textBox.createDialog(scene, dialogueConfig);
                this.player.setDisabled(true);

            };
        });

        // blå medicin
        interact.setTileLocationCallback(26, 27, 2, 2, () => {
            if (this.player.isInteracting()) {
                checkIfDone();
                dialogueConfig.title = 'Blå medicin';
                dialogueConfig.text = 'Vil du acceptere eller afvise den blå medicin';
                objective.activeMed = 'medB';
                objective.medB.data.setVisible(true);
                textBox.createDialog(scene, dialogueConfig);
                this.player.setDisabled(true);
            };

        });

        /* interact2.setTileLocationCallback(15, 13, 3, 4, () => {
 
             
         });*/

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
    if (hasNewDialogue) newDialogue.setVisible(false);

    hasNewDialogue = false;
    // determins what npc will say 

    if (!objective.isComplete) {
        uiTextBox.setVisible(true);
        let ruleText = ['Hej! Du må være laboranten vi har ventet på. Jeg er glad for at møde dig…', '', 'På bordet finder du vores tre typer medicin. Vi har brug for dit input, så vi sikrer os at vores resultater ikke er farvet… ', 'Du finder information om hver medicin, ved at gå ned og undersøge dem.', 'Når du godkender eller afviser en medicin, så er beslutningen ikke endelig.', '', 'For at godkende en medicin skal to regler være opfyldt…', '', rule1, '', rule2];

        console.log(scenarioLog.rules.indexOf(rule1) == -1);
        // in this case the rules are chained so only check for rule1.
        if (scenarioLog.rules.indexOf(rule1) == -1) {
            scenarioLog.rules.push(rule1, rule2);

            textBox.startOnComplete(this, uiTextBox, ruleText, 50, function () {
                uiPlayerLog.setText(rule1);
                uiPlayerLog.setText(rule2);
                uiPlayerLog.toggle();
                console.log('done');
            });
        }
        else textBox.writeUiText(scene, uiTextBox, ruleText, 50);

    }
    else {
        if (hasNewDialogue) newDialogue.setVisible(true);
        hasNewDialogue = false;
        let text = ['Jeg kan se, at du har behandlet hver  medicin. Tusind tak for din hjælp!', '', 'Du har stadigvæk mulighed for at ændre din beslutning, hvis du er kommet i tvivl.'];
        textBox.writeUiText(scene,uiTextBox,text,50);
    }
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
    newDialogue.setVisible(true);
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

function acceptMedicin(index) {

    // index 0 = button --> true 
    // index 1 = button --> false
    let isAccepted = index == 0;

    const activeMedicin = objective[objective.activeMed];
    console.log(activeMedicin);

    let data = activeMedicin.data;
    let tick = activeMedicin.tick;
    let reject = activeMedicin.reject;

    console.log('MEDICIN ' + isAccepted);
    if (isAccepted) {

        if (reject.visible) reject.visible = false;
        tick.visible = true;
        data.visible = false;

        //save choice
        activeMedicin.isApproved = true;
    }
    else {
        if (tick.visible) tick.visible = false;
        reject.visible = true;
        data.visible = false;

        //save choice
        activeMedicin.isApproved = false;
    }
}

function portalInteraction() {
    if (!this.player.isInteracting()) return;
    //if (!confirm('Vil du gerne rejse tilbage til år 2200?')) return;
    let dialogueConfig = {
        numberOfChoices: 2,
        button0: {
            text: 'ja',
            action: function (index) {
                let isGoingBack = index == 0;
                if (!isGoingBack) return;
                let isCorrect = objective.medY.isApproved && !objective.medR.isApproved && !objective.medB.isApproved;
                objective.isCorrect = isCorrect;

                // Save answers!
                playerData.answers[sceneIndex] = objective;
                localStorage.setItem('foobar', JSON.stringify(playerData));
                console.log('Rejser tilbage');
                scene.scene.start(constants.SCENES.PLAY, playerData);
            }
        },
        button1: {
            text: 'Bliv lidt endnu'
        },
        title: 'Vil du gerne rejse tilbage til år 2200?'
    }

    textBox.createDialog(scene, dialogueConfig);

}

