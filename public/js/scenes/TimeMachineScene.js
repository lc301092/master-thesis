import { constants } from "../constants.js"
let playerPosition = { x: 150, y: 150 };
let playerProgression;
let btnX, btnXCircle, btnXValue;
let redButtonCircle;
let titleText;
let displayFunction;
let displayUnits;
let compupterStyle = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: 'black', fontSize: 24 };



export class TimeMachineScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TIME_MACHINE,
        })
    }
    init(data) {
        if (data.playerPosition) playerPosition = data.playerPosition;

        console.log(playerPosition);
        playerProgression = JSON.parse(localStorage.getItem('objectives'));
        btnXValue = 0;

    }
    preload() {
        //this.player = this.add.
        // tilemaps
    }
    create() {
        this.add.image(50, 50, 'bg_time_device.png').setOrigin(0);
        btnX = this.add.image(259, 416, constants.IMAGES.BTN_TIME_MACHINE);
        btnXCircle = this.add.circle(btnX.x - 2, btnX.y + 5, 50
           // , 0xff0000, 0.5
            ).setInteractive({ useHandCursor: true });
        btnXCircle.on('pointerdown', promptXValue, this);
        let screen = this.add.image(150, 200, 'clear_screen.png').setOrigin(0).setScale(0.3, 0.2);
        titleText = this.add.text(255, 85, 'Tidsindstilling', { fontSize: 30, color: 'black' });

        redButtonCircle = this.add.circle(458, 180, 117).setOrigin(0).setInteractive({ useHandCursor: true });
        redButtonCircle.on('pointerdown', checkTimeSettings, this);

        //  displayFunction = this.add.text(160, 300, 'f(x) = -15x + 2200', compupterStyle);
        // displayUnits = this.add.text(180,38  5,'x     y      a     b', compupterStyle);
        const backBtn = this.add.text(50, 550, 'Tilbage', { fill: '#0f0' });
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerover', () => {
            backBtn.setStyle({ fontSize: '18px' });
        });
        backBtn.on('pointerout', () => {
            backBtn.setStyle({ fontSize: '16px' });
        });

        backBtn.on('pointerdown', () => {
            this.scene.start(constants.SCENES.PLAY, { playerPosition });
        });
    }
    update() {
        //btnX.angle += 1;
    }
}
function checkTimeSettings() {
    if (playerProgression) return;
    let answer = calculateYValue(btnXValue);
    if (answer == 1930) {
        this.scene.start(constants.SCENES.CHEMIST, { playerPosition });
    }
    else {
        alert('Der sker ikke noget, der må være noget galt med tidsindstillingen');
    }
}
function promptXValue() {

    let promptVal = prompt('\nDrejeknappen står på: ' + btnXValue + '\n\nDu kan dreje og denne knap. Indtast et positivt tal for at dreje den et hak med urets retning eller et negativt tal for at dreje den et hak mod urets retning');
    if (!promptVal) return;

    if (isNaN(promptVal)) {
        alert('du kan kun skrive et tal, prøv igen');
        promptXValue();
    }
    btnXValue += parseInt(promptVal);
    rotateBtnX(btnXValue);
    // update 
    console.log(btnXValue);
}
function calculateYValue(xValue) {
    let yValue = (-15 * xValue) + 2200;
    console.log(yValue);
    return yValue;
};

function rotateBtnX(btnValue) {
    let rotationInterval = 45;
    let newRotation = (rotationInterval * btnValue);
    btnX.angle = newRotation;
}