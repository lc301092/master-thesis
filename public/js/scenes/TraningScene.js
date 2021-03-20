import { constants } from "../constants.js"
let user;
let textObj;
let screenText;
let typeSpeed = 50;
let cursor = '|';
let n;
let scene;
let computerState = ''; 
let userOptions = [];
let compupterStyle = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' };

export class TraningScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TRANING
        })
    }
    init(data) {
        console.log(data)
        
    }
    preload() {
    }
    create() {
        let computer =this.add.image(400, 100, constants.IMAGES.TRAINING_COMPUTER).setOrigin(0).setScale(0);
        user = 'Miriam';
        screenText = 'Velkommen til træningsfacilitetet\nLogget ind: ' + user;
        scene = this;
        n = 0;
        // this.events.emit('transistionstart');
        // TWEENING 
        this.events.on('transitionstart', function (toScene, duration) {
            console.log('starting transistion');
            this.tweens.add({
                targets: computer,
                scaleX: 0.8,
                scaleY: 0.8,
                x: 140,
                y: 70,
                duration: duration
                
            });

        }, this);

        this.events.on('transitioncomplete', function () {
            textObj = scene.add.text(200, 100,'', compupterStyle);
            computerState = 'intro';
            //computerController();
        });



        this.events.on('transitionout', function (toScene, duration) {
            // textObj = '';
            this.tweens.add({
                targets: computer,
                scaleX: 0,
                scaleY: 0,
                x: 400,
                y: 100,
                duration: duration
            });

        }, this);

        this.input.once('pointerup', function (event) {
            textObj.text = '';
            var t2 = this.scene.transition({
                target: constants.SCENES.PLAY,
                duration: 500,
                moveBehind: true
            });

        }, this);

        // let cursorAnim = this.tweens.add({
        //     targets: blinkCursor,
        //     color: '#ffffff',
        //     repeat: -1 
        // })
    }
   
    
}
function typeWriter(callback = null) {  
    if(n<screenText.length)
    {  
        textObj.text += screenText.charAt(n); 
       // blinkCursor(n, ) 
        n++;  
        setTimeout(typeWriter,typeSpeed);  
    } else {
        alert('done');
    }


    
}
function computerController(){
    switch(computerState){
        case 'intro': 
            // intro
            typeWriter();
            // assess progress
            // find options for user
            //swithToState('options');
            break;
        case 'options': 

            break;
        default: alert('noget gik galt');
    }
}
function stateHandler(swithToState){
    this.on
}

// function clearScreen(){
//     // textObj.text = 'hello';
//     screenText = 'hello';
//     n = 0;
//     typeWriter();
// }

// function blinkCursor(i, n) { 
//     if(n % 2 == 1) {
//         $('#text_' + i).css('border-right', '0.15em solid black'); 
//     } else {        
//         $('#text_' + i).css('border-right', '0.15em solid lawngreen');
//     }
// }