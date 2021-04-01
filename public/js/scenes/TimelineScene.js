import { constants } from "../constants.js"

let playerProgression;
let playerPosition;
let eventPic;
let currentYearPic;
let secondEventPic;
let eventText;
let welcome = true; 

export class Timeline extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TIMELINE
        })
    }

    init(data) {
        console.log(data)
        if (data.playerPosition) playerPosition = data.playerPosition;
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

        // set text label
        scene.label = this.add.text(100, 270, '');
        scene.label.setWordWrapWidth(600);
      
        // --------------- hjælp mig lige her luca ------------
        // hvor skal nedestående kode placeres henne? Den gør alle knapper interaktive, og skal først sættes interaktiv, når teksten er færdig med at blive displayed. 
        //this.setInteractive();

        // event billede til første scenarie
        eventPic = this.add.image(150, 120, constants.IMAGES.EVENTPIC).setOrigin(0);
        eventPic.setInteractive({ useHandCursor: true });
        eventPic.on('pointerover', () => {
            eventPic.setScale(1.01);
        });
        eventPic.on('pointerout', () => {
            eventPic.setScale(1);
        });
        eventPic.on('pointerdown', () => {
            // Dynamisk tekst
            this.typewriteText('ADVARSEL: \nDER ER GÅET ROD I MEDICINFREMSTILLINGEN! \nHJÆLP LABORANTEN MED AT VÆLGE DEN RETTE MEDICIN! \n\nÅRSTAL: <span style="color: #ff0000">1930</span> \nMATEMATIK: STATISTIK');
        });


        // Ikon der viser dit nuværende år
        currentYearPic = this.add.image(700, 230, constants.IMAGES.CURRENTYEAR).setScale(0.35);
        currentYearPic.setInteractive({ useHandCursor: true });
        currentYearPic.on('pointerover', () => {
            currentYearPic.setScale(0.36);
        });
        currentYearPic.on('pointerout', () => {
            currentYearPic.setScale(0.35);
        });
        currentYearPic.on('pointerdown', () => {
            // Dynamisk tekst
            this.typewriteText('DIN NUVÆRENDE LOKATION: BASE FOR TIDSREJSER. \n\nÅRSTAL: 2200.');
        });


        // event billede til andet scenarie
        if (playerProgression != null) {
            eventPic.visible = false;

            secondEventPic = this.add.image(400, 120, constants.IMAGES.EVENTPIC).setOrigin(0);
            secondEventPic.setInteractive({ useHandCursor: true });
            secondEventPic.on('pointerover', () => {
                secondEventPic.setScale(1.01);
            });
            secondEventPic.on('pointerout', () => {
                secondEventPic.setScale(1);
            });
            secondEventPic.on('pointerdown', () => {
                // Dynamisk tekst
                this.typewriteText('ADVARSEL: \nDER ER SKET ET SPILD AF MEDIKAMENTER, SOM HAR FØRT TIL FORURENING AF GRUNDVANDET. \nHJÆLP BIOLOGERNE MED AT RENSE GRUNDVANDET. \n\nÅRSTAL: 2000 \nMATEMATIK: STATISTIK');
            });
        }

        if (welcome){
            this.typewriteText('VELKOMMEN HJEM REKRUT! \n\nHER KAN DU SE DIN TIDSLINJE! \nTRYK PÅ IKONERNE, FOR AT FINDE UD AF HVAD DER SKABER PROBLEMER I TIDSLINJEN OG RET OP PÅ DEM, VED AT REJSE TILBAGE I TIDEN! \n\nHELD OG LYKKE!');
            welcome = false;
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
            scene.scene.start(constants.SCENES.PLAY, { playerPosition });
        });
    }

    typewriteText(text) {
        // reset tekst
        this.label.text = '';
        //this.disableInteractiveEvents();
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 70
        })
    }

    typewriteTextWrapped(text) {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

    /* setInteractiveEvents() {
        currentYearPic.setInteractive();
        eventPic.setInteractive();
        secondEventPic.setInteractive();
    }

    disableInteractiveEvents() {
        currentYearPic.disableInteractive();
        eventPic.disableInteractive();
        secondEventPic.disableInteractive();
    }
 */
}