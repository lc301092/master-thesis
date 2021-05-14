import { constants } from "../constants.js"
import {timeMachine} from '../game/timeMachine'

let scene;

let storyProgression;
let playerData;
let btnX, btnXValue;
let redButtonCircle;
let titleText;
let displayFunction;
let compupterStyle = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: 'black', fontSize: 24 };

let textPlugin;
let backBtn;

let DragRotate;
let audio;
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
        scene = this;
        audio = this.sound;
        this.add.image(50, 50, 'bg_time_device.png').setOrigin(0);
        btnX = this.add.image(259, 416, constants.IMAGES.BTN_TIME_MACHINE);

        createButton(btnX.x, btnX.y, 70, btnX).setInteractive({ useHandCursor: true });

        this.add.image(100, 200, 'clear_screen.png').setOrigin(0).setScale(0.4, 0.2);

        titleText = this.add.text(255, 85, 'Tidsindstilling', { fontSize: 30, color: 'black' });

        redButtonCircle = this.add.circle(458, 180, 117).setOrigin(0).setInteractive({ useHandCursor: true });
        redButtonCircle.on('pointerdown', checkTimeSettings, this);

        displayFunction = this.add.rexBBCodeText(120, 235, '', compupterStyle);

        // necessary variables for the 
        previousPos = 0;
        intervalCounter = 0;
        updateScreen(0);


        backBtn = this.add.text(50, 550, 'Tilbage', { fill: '#0f0' });
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

    const answer = calculateYValue(intervalCounter);
    const availableScenarios = timeMachine[storyProgression].destinations;

    console.log(availableScenarios);

    // sometimes there is only one destination
    for (let i = 0; i < availableScenarios.length; i++) {
        const destination = availableScenarios[i];
        const possibleAnswer = destination.year;
        const sceneID = destination.sceneID;

        // console.log(destination, possibleAnswer, sceneID, answer);
        if (possibleAnswer != answer) continue;
        playerData.playerProgression.push(destination);
        playerData.activeScene = destination.sceneID;
        localStorage.setItem('foobar', JSON.stringify(playerData));
        travelTo(sceneID,playerData);
        return;
    }
    // TODO make feedback (sound, red flash w/e.. ) for wrong answer here 
    scene.cameras.main.flash();
    scene.sound.play('wrong',{volume: 0.2});
}


function calculateYValue(xValue) {
    const functionf = timeMachine[storyProgression].function;
    let yValue = (functionf.a * xValue) + functionf.b;
    console.log(yValue);
    return yValue;
};

function rotateBtnX(btnValue) {
    //let rotationInterval = 45;
    let newRotation = (rotationInterval * btnValue);
    btnX.angle = newRotation;
}
function updateScreen(displayUnit) {
    const progress = timeMachine[storyProgression];
    if(!progress) return;
    const functionComponents = progress.function;
    let charOrNum = (displayUnit == 0) ? 'x' : displayUnit;
    let xValue = '[color=#009900]' + charOrNum + '[/color]';
    let aValue = functionComponents.a;
    let bValue = functionComponents.b;
    let functionf = '[color=orange]f([/color]' + xValue + '[color=orange])[/color] = ' + aValue + '*' + xValue + ' + ' + bValue;
    displayFunction.setText(functionf);
}

function createButton(x, y, radius, imageToRotate) {
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
            audio.play('button_turn');
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

    //console.log('display position: ' + intervalCounter);
    return intervalCounter;

};

function travelTo(level, data){
    backBtn.setVisible(false);
    const activateSound = scene.sound.add('time_travel'); 
    const duration = (activateSound.totalDuration*2/3)*1000; 
    const camera = scene.cameras.main;
    camera.shake(duration,0.02);
    camera.fadeOut(duration, 0,0,70);
    console.log('playing sound');
    activateSound.play({volume:0.1});
    activateSound.once('complete',() => {
        scene.scene.start(level,data);
    })
}