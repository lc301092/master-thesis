import { constants } from "../constants.js"
let playerPosition = {x: 150,y: 150};
let playerProgression;
let btnXCircle;
let btnXValue;
let redButtonCircle;
let titleText;
let displayFunction;
let displayUnits;
let compupterStyle = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: 'black', fontSize: 24};



export class TimeMachineScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TIME_MACHINE,
        })
    }
    init(data) {
        if(data.playerPosition) playerPosition = data.playerPosition;    

        console.log(playerPosition);
        playerProgression = JSON.parse(localStorage.getItem('objectives'));
        btnXValue = 0;
        
    }
    preload() {
        //this.player = this.add.
        // tilemaps
    }
    create() {
     this.add.image(50,50,constants.IMAGES.BG_TIME_MACHINE).setOrigin(0); 
     titleText = this.add.text(255,85,'Tidsindstilling',{fontSize:30,color: 'black'});
     
     redButtonCircle = this.add.circle(458,180,117).setOrigin(0).setInteractive({useHandCursor: true});
     redButtonCircle.on('pointerdown', checkTimeSettings,this);

     displayFunction = this.add.text(160, 300, 'f(x) = -15x + 2200', compupterStyle);
     displayUnits = this.add.text(180,385,'x     y      a     b', compupterStyle);

     btnXCircle = this.add.circle(125,140,50).setOrigin(0).setInteractive({useHandCursor: true});
     btnXCircle.on('pointerdown',promptXValue,this);
     const backBtn = this.add.text(50, 550, 'Tilbage', { fill: '#0f0' });    
     backBtn.setInteractive({ useHandCursor: true });
     backBtn.on('pointerover', () => {
        backBtn.setStyle({ fontSize: '18px' });
        });
        backBtn.on('pointerout', () => {
            backBtn.setStyle({ fontSize: '16px' });
        });

        backBtn.on('pointerdown', () => {
            this.scene.start(constants.SCENES.PLAY, {playerPosition});
        });
    }
    update() {

    }
}
function checkTimeSettings(){
    if(playerProgression) return;
    let answer = calculateYValue(btnXValue);
    if(answer == 1930){
        this.scene.start(constants.SCENES.CHEMIST, {playerPosition});
    }
    else{
        alert('Der sker ikke noget, der må være noget galt med tidsindstillingen');
    }
}
function promptXValue(){
    
    let promptVal = parseInt(prompt('Du kan dreje og denne knap. Indtast et positivt tal for at dreje den et hak med urets retning eller et negativt tal for at dreje den et hak mod urets retning'));
    if(isNaN(promptVal)) {
        alert('du kan kun skrive et tal, prøv igen');
        promptXValue();
    }
    btnXValue += promptVal;
    // update 
    console.log(btnXValue);
}
function calculateYValue(xValue){
    let yValue = (-15*xValue)+2200;
    console.log(yValue);
    return yValue;
};