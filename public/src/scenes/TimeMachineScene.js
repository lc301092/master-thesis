import { constants } from "../constants.js"
let playerPosition = { x: 150, y: 150 };
let storyProgression;
let playerData;
let btnX, btnXCircle, btnXValue;
let redButtonCircle;
let titleText;
let displayFunction;
let displayUnits;
let compupterStyle = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: 'black', fontSize: 24 };

let textPlugin;

let DragRotate;
// const rotationIntervals = [0,45,90,135,180,225,270,315,360];
const rotationInterval = 45;
const rotationIntervals = [0, 45, 90, 135, 180, -45, -90, -135, -180];
let previousPos;
let intervalCounter;

const ColorGray = 0x8e8e8e;
const ColorDarkBlue = 0x0000A0;
const ColorRed = 0x5eb8ff;


export class TimeMachineScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TIME_MACHINE,
        })
    }
    init(data) {
        playerData = data;
        storyProgression = playerData.playerProgression.length;
        btnXValue = 0;
    }
    preload() {
        textPlugin = this.plugins.get('rexbbcodetextplugin');
        DragRotate = this.plugins.get('rexDragRotate');
    }
    create() {
        this.add.image(50, 50, 'bg_time_device.png').setOrigin(0);
        btnX = this.add.image(259, 416, constants.IMAGES.BTN_TIME_MACHINE);

        createButton(this, btnX.x, btnX.y, 70, btnX).setInteractive({ useHandCursor: true });

        this.add.image(100, 200, 'clear_screen.png').setOrigin(0).setScale(0.4, 0.2);
        
        titleText = this.add.text(255, 85, 'Tidsindstilling', { fontSize: 30, color: 'black' });

        redButtonCircle = this.add.circle(458, 180, 117).setOrigin(0).setInteractive({ useHandCursor: true });
        redButtonCircle.on('pointerdown', checkTimeSettings, this);

        displayFunction = this.add.rexBBCodeText(120, 235, '', compupterStyle);

        // necessary variables for the 
        previousPos = 0;
        intervalCounter = 0;
        updateScreen(0);


        const backBtn = this.add.text(50, 550, 'Tilbage', { fill: '#0f0' });
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerover', () => {
            backBtn.setStyle({ fontSize: '18px' });
        });
        backBtn.on('pointerout', () => {
            backBtn.setStyle({ fontSize: '16px' });
        });

        backBtn.on('pointerdown', () => {
            this.scene.start(constants.SCENES.PLAY, playerData);
        });
    }
    update() {
        //btnX.angle += 1;
    }
}
function checkTimeSettings() {
    switch (storyProgression) {
        case 0:
           
            if (calculateYValue(intervalCounter) == 1930) {
                this.scene.start(constants.SCENES.CHEMIST, playerData);
            }
            return;
        case 1:

            // TODO hvis der er flere options at rejse til skal de være her 
            if (calculateYValue(intervalCounter) == 1990) {
                this.scene.start(constants.SCENES.FARM, playerData);
            }
            return;

        default:
            alert('Du har nu spillet demoen færdig. Tusind tak!');
    }
    alert('Der sker ikke noget, der må være noget galt med tidsindstillingen');
}
function promptXValue() {

    let promptVal = prompt('\nDrejeknappen står på: ' + btnXValue + '\n\nDu kan dreje på denne knap. Indtast et positivt tal for at dreje den et hak med urets retning eller et negativt tal for at dreje den et hak mod urets retning');
    if (!promptVal) return;

    if (isNaN(promptVal)) {
        alert('du kan kun skrive et tal, prøv igen');
        promptXValue();
        return;
    }
    btnXValue += parseInt(promptVal);
    if (btnXValue > 9999) btnXValue = 9999;

    rotateBtnX(btnXValue);
    // update 
    updateScreen();
}
function calculateYValue(xValue) {
    let yValue = (-15 * xValue) + 2200;
    console.log(yValue);
    return yValue;
};

function rotateBtnX(btnValue) {
    //let rotationInterval = 45;
    let newRotation = (rotationInterval * btnValue);
    btnX.angle = newRotation;
}
function updateScreen(displayUnit) {
    let charOrNum = (displayUnit == 0) ? 'x' : displayUnit;
    let xValue = '[color=#009900]' + charOrNum + '[/color]';
    let aValue = -15;
    let bValue = 2200;
    let functionf = '[color=orange]f([/color]' + xValue + '[color=orange])[/color] = ' + aValue + '*' + xValue + ' + ' + bValue;
    displayFunction.setText(functionf);
}


function createButton(scene, x, y, radius, imageToRotate) {
    let config = {
        x: x,
        y: y,
        maxRadius: radius,
        minRadius: 0
    };

    let lineWidth = 3;
    let btnX = config.maxRadius + lineWidth,
        Btny = btnX,
        width = btnX * 2,
        height = width;

    let buttonGraphics = scene.add.graphics()
        .lineStyle(lineWidth, 0xffffff, 1)
        .strokeCircle(btnX, Btny, config.minRadius + lineWidth)
        .strokeCircle(btnX, Btny, config.maxRadius)
    //.lineBetween(btnX + config.minRadius, Btny, btnX + config.maxRadius, Btny);

    let button = scene.add.renderTexture(config.x, config.y, width, height)
        .draw(buttonGraphics)
        .setOrigin(0.5)
        .setTint(ColorGray);
    buttonGraphics.destroy();

    DragRotate.add(scene, config)
        .on('drag', function (dragRotate) {
            let dragValueDelta = dragRotate.deltaRotation;
            imageToRotate.rotation += dragValueDelta;

            btnXValue = Math.round(imageToRotate.angle / rotationInterval);
            let displayX = getBtnxValue(btnXValue, dragRotate.cw);
            button.rotation += dragValueDelta;
            updateScreen(displayX);
            //console.log(dragRotate.deltaRotation);
            let color = (dragRotate.cw) ? ColorDarkBlue : ColorRed;
            button.setTint(color);
        })
        .on('dragend', function (dragRotate) {
            button.setTint(ColorGray);
            let angle = imageToRotate.angle;
            // let angle = Math.abs(imageToRotate.angle);
            console.log('current angle: ' + angle);
            // let snapToAngle = closest(angle, rotationIntervals);
            let snapToAngle = getClosest(angle, rotationIntervals);
            console.log('snap to angle: ' + snapToAngle);
            imageToRotate.angle = snapToAngle;

            btnXValue = Math.floor(snapToAngle / rotationInterval);
            let displayX = getBtnxValue(btnXValue, dragRotate.cw);
            updateScreen(displayX);
        })
    button.angle = -90;
    return button;
}
const getClosest = (index, array) => {
    let closest = 0;
    for (const i of array)
        if (Math.abs(index - i) < Math.abs(index - closest))
            closest = i;
    return closest;

};



const getBtnxValue = (currentPos, isMovingWithClock) => {
    if (currentPos === previousPos) return intervalCounter;

    if (currentPos === -4 && previousPos === 4) {
        // previousPos = currentPos;
        return intervalCounter;
    }
    if (currentPos === 4 && previousPos === -4) {
        //previousPos = currentPos;
        return intervalCounter;
    }


    if (isMovingWithClock) intervalCounter++;
    else intervalCounter--;

    previousPos = currentPos;

    console.log('display position: ' + intervalCounter);
    return intervalCounter;

};