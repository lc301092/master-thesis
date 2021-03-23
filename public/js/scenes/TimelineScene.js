import { constants } from "../constants.js"

let playerProgression;
let playerPosition;
let eventPic;
let secondEventPic;

export class Timeline extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TIMELINE
        })
    }

    init(data) {
        console.log(data)
        if(data.playerPosition) playerPosition = data.playerPosition;    
        this.add.image(0, 0, constants.IMAGES.SCREEN).setOrigin(0);
            }
    preload() {
        // get progression from localstorage
        playerProgression = JSON.parse(localStorage.getItem("objectives"));
        console.log("JSON parser: ", playerProgression);
    }

    create() {
        let scene = this;
        const header = scene.add.text(330, 50, 'Tidslinje', { fill: '#31FDF0', fontSize: '25px' });
        //const year = scene.add.text(150, 100, 'År: 1930', { fill: '#31FDF0'});

        // event billede til første scenarie
        eventPic = this.add.image(150,120, constants.IMAGES.EVENTPIC).setOrigin(0);
        eventPic.setInteractive({ useHandCursor: true });
        eventPic.on('pointerover', () => {
            eventPic.setScale(1.01);
        });
        eventPic.on('pointerout', () => {
            eventPic.setScale(1);
        });
        eventPic.on('pointerdown', () => {
             // Dynamisk tekst
        scene.label = this.add.text(100, 270, '');
        scene.label.setWordWrapWidth(600);
        
        eventPic.disableInteractive();
        this.typewriteText('ADVARSEL: \nDER ER GÅET ROD I MEDICINFREMSTILLINGEN! \nHJÆLP KEMIKERNE MED AT VÆLGE DEN RETTE MEDICIN! \n\nÅRSTAL: 1930 \nMATEMATIK: SANDSYNLIGHED 1');
        });

        // event billede til andet scenarie
        if (playerProgression != null){
            eventPic.visible = false;

            secondEventPic = this.add.image(400,120, constants.IMAGES.EVENTPIC).setOrigin(0);
            secondEventPic.setInteractive({ useHandCursor: true });
            secondEventPic.on('pointerover', () => {
                secondEventPic.setScale(1.01);
            });
            secondEventPic.on('pointerout', () => {
                secondEventPic.setScale(1);
            });
            secondEventPic.on('pointerdown', () => {
                 // Dynamisk tekst
            scene.label = this.add.text(100, 270, '');
            scene.label.setWordWrapWidth(600);
            
            secondEventPic.disableInteractive();
            this.typewriteText('ADVARSEL: \nDER ER SKET ET SPILD AF MEDIKAMENTER, SOM HAR FØRT TIL FORURENING AF GRUNDVANDET. \nHJÆLP BIOLOGERNE MED AT RENSE GRUNDVANDET. \n\nÅRSTAL: 2000 \nMATEMATIK: STATISTIK');
            });
    
        }
    
        // tilbage knap 
        const btn = scene.add.text(70, 400, 'Tilbage', { fill: '#0f0' });    
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => {
            btn.setStyle({ fontSize: '18px' });
        });
        btn.on('pointerout', () => {
            btn.setStyle({ fontSize: '16px' });
        });

        btn.on('pointerdown', () => {
            scene.scene.start(constants.SCENES.PLAY, {playerPosition});
        });
    }

    typewriteText(text) {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 100
        })
    }

    typewriteTextWrapped(text) {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

}