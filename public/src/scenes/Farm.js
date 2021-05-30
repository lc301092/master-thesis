import { constants } from "../constants.js"
import Player from "../game/player.js"
import PlayerLog from "../game/ui.js"
import { textBox } from "../game/ui.js"
import { postGameData } from '../http/post.js'


let playerData;
let playerSprite;
let playerInteractionCollider;

const rule2 = 'Udregn middelværdien for jordtypernes fugtindhold og find ud af hvilke, der passer til planternes vandbehov';

const tip3 = "Bog#3: \n\n..Observationer: Hyppigheden for hver observation er det antal gange observationen forekommer.";
const tip4 = "Bog#4: \n\n..Middelværdi: Når man finder middelværdien af et datasæt, svarer det til at finde gennemsnittet at tallene.";
const tip5 = "Bog#5:\n\n..Lineær funktion: Hvis man kun har en enkel x- og y-værdi, kan man til tider bruge x1 = 0 og y1 = 0, som koordinatsæt (0,0) til at udregne en lineær regression";
let bookindex = 3;
const book = {
    tip3: tip3,
    tip4: tip4,
    tip5: tip5
}

let scene;
const sceneIndex = 1;
let anchor;

// npc
let npc;
let npcState = 0;
let q1hasRunOnce;
let q2hasRunOnce;
let dialogue;
let hasNewDialogue = true;


const objective = {
    seeds: [
        {
            name: 'nelliker',
            water: {
                max: 38,
                min: 28,
                string: 'Jordfugtighed: 28% - 38%',
            },
            image: constants.IMAGES.NELLIKER,
            scaleFactor: 0.15,
            dataSheet: '',
            harvestSize: 30,
            info: ''
        },
        {
            name: 'lægeærenpris',
            water: {
                max: 32,
                min: 25,
                string: 'Jordfugtighed: 25% - 32%',
            },
            image: constants.IMAGES.ÆRENPRIS,
            scaleFactor: 0.2,
            dataSheet: '',
            harvestSize: 55,
            info: 'Plante: Lægeærenpris \nTemperaturforhol: '
        },
        {
            name: 'kamille',
            water: {
                max: 45,
                min: 35,
                string: 'Jordfugtighed: 35% - 45%',
            },
            image: constants.IMAGES.KAMILLE,
            scaleFactor: 0.3,
            dataSheet: '',
            harvestSize: 40,
            info: ''
        },
    ],
    activeField: '',
    fields: [
        {
            type: '',
            imageArray: [],
            daysToHarvest: null,
            earth: null,
            sign: null
        },
        {
            type: '',
            imageArray: [],
            daysToHarvest: null,
            sign: null
        }, {
            type: '',
            imageArray: [],
            daysToHarvest: null,
            sign: null
        }
    ]
}

//collider arrays for moving and static game objects
let dynmaicCollider;
let collideables;

// UI
let uiTextBox;
let uiTextBoxInput;
let uiPlayerLog;
let logUpdated1 = false;
let logUpdated2 = false;
let logUpdated3 = false;

const signStyle = { fontSize: 15, color: 'black' }
let signNumber0;
let signNumber1;
let signNumber2;

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
        playerSprite = this.physics.add.sprite(200, 400, 'player', 4).setCollideWorldBounds(true).setDepth(4);
        let keys = this.input.keyboard.addKeys(constants.USERINPUT);
        playerInteractionCollider = this.add.rectangle(playerSprite.x, playerSprite.y, playerSprite.width / 2, playerSprite.height / 2,
        );
        this.player = new Player(keys, playerInteractionCollider, playerSprite);
        playerSprite.setSize(25, 50).setOffset(12, 10);
    }
    preload() {

        anchor = this.plugins.get('rexAnchor');
    }
    create() {
        scene = this;
        scene.sound.removeByKey('base');
        const backgroundMusic = scene.sound.play('farm', { volume: 0.1, loop: true });
        // add tileset image
        let tileImages = constants.TILEIMAGES.FARM_LVL;
        let images = constants.IMAGES;
        let tileObj = {};
        // 
        objective.fields[0].sign = scene.add.text(272, 527, '', signStyle).setDepth(6);
        objective.fields[1].sign = scene.add.text(512, 527, '', signStyle).setDepth(6);
        objective.fields[2].sign = scene.add.text(672, 527, '', signStyle).setDepth(6);


        const anchorConfig = {
            centerX: 'center',
            centerY: 'center-50'
        }

        objective.fields[0].earth = scene.add.image(0, 0, 'muldjord.png').setScale(0.6).setOrigin(0).setDepth(21).setScrollFactor(0).setVisible(false);
        objective.fields[1].earth = scene.add.image(0, 0, 'lerjord.png').setScale(0.6).setOrigin(0).setDepth(21).setScrollFactor(0).setVisible(false);
        objective.fields[2].earth = scene.add.image(0, 0, 'sandjord.png').setScale(0.6).setOrigin(0).setDepth(21).setScrollFactor(0).setVisible(false);


        objective.seeds[0].dataSheet = scene.add.image(255, 635, 'nelliker_data.png').setOrigin(0).setDepth(21).setScrollFactor(0).setVisible(false);
        objective.seeds[1].dataSheet = scene.add.image(255, 635, 'ærenpris_data.png').setOrigin(0).setDepth(21).setScrollFactor(0).setVisible(false);
        objective.seeds[2].dataSheet = scene.add.image(255, 635, 'kamille_data.png').setOrigin(0).setDepth(21).setScrollFactor(0).setVisible(false);

        objective.fields.forEach(element => {
            anchor.add(element.earth, anchorConfig);
        });

        objective.seeds.forEach(element => {
            anchor.add(element.dataSheet, anchorConfig);
        });

        const gameObjects = {
            bookShelf: {
                collider: scene.add.rectangle(40, 330, 50, 50,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {

                    const text = book['tip' + bookindex];
                    const interaction = 'bookshelf'+bookindex;
                    constants.addToInteractions(interaction, playerData);
                    textBox.writeUiText(scene, uiTextBox, text, 50);
                    bookindex++
                    if (bookindex > 5) bookindex = 3;
                }
            },
            field0:
            {
                collider: scene.add.rectangle(360, 400, 205, 220,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    if (objective.hasSeeds) {
                        objective.activeField = 0;
                        inspectField(0);
                    }
                    else {
                        const text = 'Du kigger på jorden. Den er mørk...';
                        textBox.writeUiText(scene, uiTextBox, text, 50);
                    }
                }
            },
            field1: {
                collider: scene.add.rectangle(560, 400, 130, 220,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    if (objective.hasSeeds) {
                        objective.activeField = 1;
                        inspectField(1);
                    } else {
                        const text = 'Denne jord er ret lys';
                        textBox.writeUiText(scene, uiTextBox, text, 50);
                    }
                }
            },
            field2: {
                collider: scene.add.rectangle(705, 400, 100, 220,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    if (objective.hasSeeds) {
                        objective.activeField = 2;
                        inspectField(2);
                    } else {
                        const text = 'Denne jord har store sten og kornene er en del større. Vand vil højst sandsynligt sive hurtigere igennem jorden her';
                        textBox.writeUiText(scene, uiTextBox, text, 50);
                    }
                }
            },
            emptyBox0: {
                collider: scene.add.rectangle(262, 638, 40, 20,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    if (!logUpdated2) {
                        uiPlayerLog.toggle();
                        uiPlayerLog.setText(rule2);
                        logUpdated2 = true;
                        logUpdated1 = true;
                    }
                    objective.seeds[0].dataSheet.setVisible(true);
                    objective.hasSeeds = true;
                },
                images: [scene.add.image(262, 638, 'nelliker.png').setScale(0.15).setDepth(5),
                scene.add.image(270, 640, 'nelliker.png').setScale(0.15).setDepth(5),
                scene.add.image(260, 638, 'nelliker.png').setScale(0.15).setDepth(5),
                scene.add.image(262, 637, 'nelliker.png').setScale(0.15).setDepth(5),
                scene.add.image(255, 635, 'nelliker.png').setScale(0.15).setDepth(5),
                ],


            },
            emptyBox1: {
                collider: scene.add.rectangle(314, 638, 40, 20,
                    //  0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    if (!logUpdated2) {
                        uiPlayerLog.toggle();
                        uiPlayerLog.setText(rule2);
                        logUpdated2 = true;
                        logUpdated1 = true;
                    } objective.hasSeeds = true;
                    objective.seeds[1].dataSheet.setVisible(true);
                }, images: [scene.add.image(262, 638, 'ærenpris.png').setScale(0.15).setDepth(5),
                scene.add.image(325, 640, 'ærenpris.png').setScale(0.18).setDepth(5),
                scene.add.image(310, 638, 'ærenpris.png').setScale(0.18).setDepth(5),
                scene.add.image(312, 637, 'ærenpris.png').setScale(0.18).setDepth(5),
                scene.add.image(300, 635, 'ærenpris.png').setScale(0.18).setDepth(5),
                ],
            }
            ,
            emptyBox2: {
                collider: scene.add.rectangle(360, 638, 40, 20,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    if (!logUpdated2) {
                        uiPlayerLog.toggle();
                        uiPlayerLog.setText(rule2);
                        logUpdated2 = true;
                        logUpdated1 = true;
                    } objective.hasSeeds = true;
                    objective.seeds[2].dataSheet.setVisible(true);
                }, images: [scene.add.image(262, 638, 'kamille.png').setScale(0.15).setDepth(5),
                scene.add.image(375, 640, 'kamille.png').setScale(0.25).setDepth(5),
                scene.add.image(360, 638, 'kamille.png').setScale(0.25).setDepth(5),
                scene.add.image(368, 637, 'kamille.png').setScale(0.25).setDepth(5),
                scene.add.image(350, 635, 'kamille.png').setScale(0.25).setDepth(5),
                ],
            },
            fullBox: {
                collider: scene.add.rectangle(120, 638, 160, 20,
                    //0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    const text = 'Det er da altid noget, at hun har haft succes med at så andre afgrøder.. heh';
                    const interaction = 'grøntsagskasse';
                    constants.addToInteractions(interaction, playerData);
                    textBox.writeUiText(scene, uiTextBox, text, 50);
                }
            },
            axe: {
                collider: scene.add.rectangle(32, 455, 20, 20,
                    // 0xff0000, 0.5
                ).setDepth(5),
                action: () => {
                    const text = 'Jeg var ikke klar over at man havde brug for en økse, for at arbejde med planter... Hun har nok brug for lidt hjælp..';
                    const interaction = 'økse';
                    constants.addToInteractions(interaction, playerData);
                    textBox.writeUiText(scene, uiTextBox, text, 50);
                }
            },
            npc: {
                collider: scene.add.rectangle(225, 495, 25, 40,
                    // 0xff0000, 0.5
                ), action: npcInteraction
            },
            portal: {
                collider: scene.add.rectangle(140, 330, 50, 70,
                    //0xff0000, 0.5 // debugging purposes
                ),
                action: portalInteraction
            },
            tree: {
                collider: scene.add.rectangle(770, 235, 30, 50,
                    // 0xff0000, 0.5 // debugging purposes
                ),
                action: () => {
                    const text = 'Det her er altså bare et lille bitte træ, her finder du ikke noget :)';
                    textBox.writeUiText(scene, uiTextBox, text, 50);
                }
            },
            woodsign0: {
                collider: scene.add.rectangle(290, 530, 20, 20,
                    // 0xff0000, 0.5 // debugging purposes
                ),
                action: () => {
                    const index = 0;
                    writeOnSign(index);
                },
                image: scene.add.image(290, 540, 'woodsign.png').setScale(0.2).setDepth(1)

            },
            woodsign1: {
                collider: scene.add.rectangle(530, 530, 20, 20,
                    // 0xff0000, 0.5 // debugging purposes
                ),
                action: () => {
                    const index = 1;
                    writeOnSign(index);
                }, image: scene.add.image(530, 540, 'woodsign.png').setScale(0.2).setDepth(1)

            },
            woodsign2: {
                collider: scene.add.rectangle(690, 530, 20, 20,
                    // 0xff0000, 0.5 // debugging purposes
                ),
                action: () => {
                    const index = 2;
                    writeOnSign(index);
                }
                , image: scene.add.image(690, 540, 'woodsign.png').setScale(0.2).setDepth(1)
            }
        }
        scene.customGameObjects = gameObjects;
        // tilemap configurations
        let farm_lvl = this.add.tilemap('farm');
        setupTilemap(scene, farm_lvl);

        for (const key in tileImages) {
            let tileImageString = images[key];
            let tilesetImage = farm_lvl.addTilesetImage(tileImageString);
            tileObj[key] = tilesetImage;
        }


        scene.physics.world.setBounds(0, 0, 800, 800);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(playerSprite, true, 0.05, 0.05);

        // object colliders
        dynmaicCollider = this.physics.add.group().add(this.player.collider);
        collideables = this.physics.add.staticGroup();

        // set colliders and overlap on objects
        for (const key in gameObjects) {
            const element = gameObjects[key];
            const collider = element.collider;
            const action = element.action;
            collideables.add(collider);
            scene.physics.add.overlap(playerInteractionCollider, collider, gameObjectInteraction, null, {
                action: action,
                this: this,
                player: this.player
            });
        }

        scene.physics.add.collider(playerSprite, collideables);

        // lvl specific characters and animations
        npc = scene.physics.add.sprite(225, 500, 'npc1', 52).setScale(0.88);
        dialogue = scene.add.image(npc.x + 5, npc.y - 40, 'exclamation.png').setScale(0.1);
        let portal = scene.physics.add.sprite(140, 330, 'portal').setScale(0.2);
        portal.anims.play('idle');

        // create textbox
        uiTextBox = textBox.createTextBox(this);
        uiTextBoxInput = textBox.createTextBox(this, false);

        uiPlayerLog = new PlayerLog(this);
    }
    update() {
        // player movement
        this.player.update();
        if (this.player.isPlayerMoving()) {
            objective.seeds.forEach(element => {
                element.dataSheet.setVisible(false);
            });
        }
    }
}

function gameObjectInteraction() {
    const action = this.action;
    const player = this.player;
    if (!player.isInteracting()) return;
    action();
}
function setupTilemap(scene, tilemap) {
    let tileImages = constants.TILEIMAGES.FARM_LVL;
    let images = constants.IMAGES;
    let tileObj = {};

    for (const key in tileImages) {
        let tileImageString = images[key];
        let tilesetImage = tilemap.addTilesetImage(tileImageString);
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
    let borders = tilemap.createLayer('InvisibleBorders', [FARM_DECO2], 0, 0).setDepth(-3);
    let ground = tilemap.createLayer('Ground', [FARM_GROUND, FARM_DECO3], 0, 0).setDepth(-2);
    let wallTop = tilemap.createLayer('BorderTop', [FARM_DECO2], 0, 0).setDepth(-1);
    let wallBot = tilemap.createLayer('BorderBot', [FARM_DECO2], 0, 0).setDepth(5);
    let exterior = tilemap.createLayer('Exterior', [FARM_BUILDING, FARM_DECO4, FARM_DECO2, FARM_DECO3], 0, 0);
    let exterior2 = tilemap.createLayer('Exterior2', [FARM_DECO], 0, 0);
    let flavor = tilemap.createLayer('GroundFlavor', [FARM_DECO3, FARM_DECO], 0, 0).setDepth(6);
    let interact = tilemap.createLayer('interactables', [FARM_BOOK, FARM_DECO2], 0, 0);

    // border collision 
    scene.physics.add.collider(playerSprite, borders);
    borders.setCollisionByProperty({ border: true });
}

const portalInteraction = () => {
    let dialogueConfig = {
        numberOfChoices: 2,
        button0: {
            text: 'ja',
            action: function (index) {
                let isGoingBack = index == 0;
                if (!isGoingBack) return;

                // TODO check wether objective is correct or not.
                const objectives = objective.fields;
                let isCorrect1 = objectives[0].type == 'nelliker' && objectives[1].type == 'kamille' && objectives[2].type == 'lægeærenpris';
                let isCorrect2 = objectives[0].daysToHarvest > 44 && objectives[0].daysToHarvest < 47 && objectives[1].daysToHarvest > 26 && objectives[1].daysToHarvest < 29 && objectives[2].daysToHarvest > 11 && objectives[2].daysToHarvest < 14;
                objective.isCorrect = isCorrect1 && isCorrect2;
                if(objective.isCorrect == null) objective.isCorrect = false;
                objective.isComplete = true;

                console.log(isCorrect1);
                console.log(isCorrect2);
                console.log(objective.isCorrect);


                // Save answers!
                playerData.answers[sceneIndex] = objective;
                playerData.shouldLookUp = true;
                playerData.timeToComplete2 = (Date.now()  - playerData.playerId)/1000/60;
                postGameData(playerData);
                localStorage.setItem('foobar', JSON.stringify(playerData));
                // console.log('Rejser tilbage');
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

const npcInteraction = () => {
    if (hasNewDialogue) dialogue.setVisible(false);
    hasNewDialogue = false;
    // determine what npc will say

    const texts = [
        ['Jeg forstår det bare ikke!', 'Uanset hvad vi gør, kan vi ikke få planterne til at gro ordenligt.', 'Der kan sagtens gro kartofler i den mørke muldjord her, men de her planter er umulige! U-m-u-l-i-g-e siger jeg dig', 'Hvis du kan fikse problemerne er du mere end velkommen til at tage for dig i de grå kasser dernede', 'Frøene du skal så er nelliker, lægeærenpris og kamille'],
        ['Jeg har tre typer jord, men det er ikke alle frø, der kan gro i de forskellige typer jord... Men! Du kan finde informationer på frøene ved de grå kasser dernede, og jeg har udført nogle jordmålinger, der ligger henne ved hver plantage'],
        ['Planter skal bruges til at producere medicin, som skal bruges hurtigst muligt, så det kan redde en masse menneskeliv'],
        ['Hey det der ser ikke helt dumt ud. ', '', '', 'Kan du gøre mig en sidste tjeneste? Ser du, ved frøene står der hvornår de normalt høstes, men vi har altså lidt travlt her, så de skal altså bare høstes, når de får en tilpas nok højde. Når du har udregnet en plantes højde, så skriv det på skiltene foran jorden, hvor du har sået den'],
        ['Så er der ikke andet end at vente og måle hver dag. Tusind tak for hjælpen! Imens du fiksede planternes optimale høsthøjde fik jeg lige færdigskrevet noget om de forskellige jordtypers porøsitet.'],
        ['...']
    ]
    textBox.startOnComplete(scene, uiTextBox, texts[npcState], 50, function () {

        switch (npcState) {
            // npc is only ever 0 the first time the player speaks to them.
            case 0:
                npcState++;
                if (logUpdated1) return;
                uiPlayerLog.toggle();
                uiPlayerLog.setText('Du skal så: nelliker, ærenpris og kamille');
                logUpdated1 = true;
                break;
            case 1:
                npcState++;
                break;
            case 2:
                //npcState++;
                break;
            case 3:
                q1hasRunOnce = true;
                if (!logUpdated3) {
                    uiPlayerLog.toggle();
                    logUpdated3 = true;
                    uiPlayerLog.setText('Udregn funktionerne for planternes vækst og notér en passende højde til når de tidligst kan høstes');
                }
                break;
            case 4:
                q2hasRunOnce = true;
                npcState++;
                break;
            case 5:
                break;
        }

        if (texts[npcState] == -1) npcState = 1;
    });

}

function inspectField(fieldIndex) {
    const player = scene.player;
    player.setDisabled(true);
    const field = objective.fields[fieldIndex];
    field.earth.setVisible(true);
    const dialogueConfig = {
        numberOfChoices: 4,
        button0: {
            text: 'Nelliker',
            action: plantSeed
        },
        button1: {
            text: 'Ærenspris',
            action: plantSeed
        },
        button2: {
            text: 'Kamille',
            action: plantSeed
        },
        button3: {
            text: 'Vent lidt',
            action: closeEarthData
        },
        title: `Her er der plantet: ${field.type} \n Hvad vil du gerne så i denne jord?`
    };
    textBox.createDialog(scene, dialogueConfig);
}

function plantSeed(plantIndex) {
    const player = scene.player;
    const gameObjects = scene.customGameObjects;
    const seed = objective.seeds[plantIndex];
    const activeField = objective.activeField;

    console.log('activeField: ' + activeField);


    const fieldCollider = gameObjects['field' + activeField].collider;
    const spaceY = 20;
    const spaceX = 20;
    const startX = fieldCollider.x - fieldCollider.width / 2;
    const endX = fieldCollider.x + fieldCollider.width / 2;
    const startY = fieldCollider.y - fieldCollider.height / 2 + spaceY;
    const endY = fieldCollider.y + fieldCollider.height / 2;

    let seedImages = [];
    let currentY = startY;
    //fade out camera
    scene.cameras.main.fadeOut(500, 0, 0, 0);
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        // check if seeds already exist 
        if (objective.fields[activeField].type && objective.fields[activeField].type.name != seed.name) {
            // destroy images if they exist
            console.log('destory previous');
            objective.fields[activeField].imageArray.forEach(element => {
                element.destroy();
            });
            objective.fields[activeField].imageArray = [];
        }
        // place seeds
        while (currentY < endY - spaceY) {
            let currentX = startX;

            while (currentX < endX - spaceX) {
                let seedImage = scene.add.image(currentX, currentY, seed.image).setDepth(10).setScale(seed.scaleFactor).setOrigin(0);
                seedImages.push(seedImage);
                currentX += seedImage.displayWidth;
            }

            currentY += 40;
        }

        objective.fields[activeField].type = seed.name;
        objective.fields[activeField].imageArray = seedImages;

        checkIfDone(1);
        closeEarthData();
        scene.cameras.main.fadeIn(500, 0, 0, 0);
    })

}
function checkIfDone(questIndex) {
    let quest = objective.fields;
    let key;
    if (questIndex == 1) key = 'type';

    else if (questIndex == 2) key = 'daysToHarvest';

    let counter = 0;

    quest.forEach(element => {
        const questObj = element[key];
        if (questObj) counter++;
    });



    if (counter == 3 && !q2hasRunOnce && questIndex == 2) {
        console.log('quest 2 complete');
        npcState = 4;
        hasNewDialogue = true;
        dialogue.setVisible(true);
        //return;
    }

    if (counter == 3 && !q1hasRunOnce && questIndex == 1) {
        console.log('quest 1 complete');
        npcState = 3;
        hasNewDialogue = true;
        dialogue.setVisible(true);
    }
}

function closeEarthData() {
    const field = objective.fields[objective.activeField];
    field.earth.setVisible(false);
}

function writeOnSign(signIndex) {
    const signsObjective = objective.fields;
    if (!signsObjective[signIndex].type) {
        const text = 'Så nogle frø først';
        textBox.writeUiText(scene, uiTextBox, text, 50);
    } else {
        const text = ['', 'Kan høstes, når den er:     cm høj'];
        textBox.createInputField(scene, function (signNumber) {
            if (signNumber.trim() == '') return;
            const field = signsObjective[signIndex];
            const canvas = document.querySelector('canvas');

            field.sign.setText(signNumber + 'cm');
            field.daysToHarvest = signNumber;

            canvas.style.position = 'relative';
            checkIfDone(2);
        });
        textBox.writeUiText(scene, uiTextBoxInput, text, 0);
    }
}