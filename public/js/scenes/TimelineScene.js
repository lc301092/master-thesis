import { constants } from "../constants.js"

let playerProgression;
let playerPosition;
let eventPic;
let currentYearPic;
let secondEventPic;
let eventText;
let welcome = true;
let isWriting;
let textPlugin;

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
        isWriting = false;
        textPlugin = this.plugins.get('rexbbcodetextplugin');
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
        //var txt = scene.add.rexBBCodeText(100, 100, '[b]h[/b]ello');

        // set text label
        scene.label = this.add.rexBBCodeText(100, 270, '', { wrap: { mode: 1, width: 600 } });
        // scene.label.setWordWrapWidth(600);

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
            this.typewriteText('ADVARSEL: \nDER ER GÅET ROD I MEDICINFREMSTILLINGEN! \nHJÆLP LABORANTEN MED AT VÆLGE DEN RETTE MEDICIN! \n\nÅRSTAL:[size=24][color=orange][b] 1930 [/b][/color][/size] \nMATEMATIK: STATISTIK');

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
            let sceneRef = this;
            let questGraphic = '/\\/\\/\\/\\';
            let questText;
            let questLabel = this.add.rexBBCodeText(eventPic.x, 225, '')
                .setInteractive()
                .on('areadown', function (key) {
                    sceneRef.typewriteText(questText);
                });
            // resolveLastMission()
            if (playerProgression.isCorrect) {
                questLabel.setText(`[b][area=correct][color=lightgreen]${questGraphic}[/color][/stroke][/area][/b]`);
                questText = 'Der ser ikke ud til at være forstyrrelser med tidslinjen i denne periode';
            }
            else {
                questLabel.setText(`[b][stroke=black][area=incorrect][color=red]${questGraphic}[/color][/stroke][/area][/b]`);
                questText = 'Der er ingen synlige ændringer';
            }

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

        // skal stå som det sidste i create metoden
        if (!welcome) return;
        welcome = false;

        this.typewriteText('VELKOMMEN HJEM REKRUT! \n\nHER KAN DU SE DIN TIDSLINJE! \nTRYK PÅ IKONERNE, FOR AT FINDE UD AF HVAD DER SKABER PROBLEMER I TIDSLINJEN OG RET OP PÅ DEM, VED AT REJSE TILBAGE I TIDEN! \n\nHELD OG LYKKE!');


    }

    typewriteText(text) {
        if(isWriting) return;
        isWriting = true;
        this.typeWriter(text);
    }
    typeWriter(text) {
        // reset tekst
        this.label.text = '';
        //this.disableInteractiveEvents();
        const length = text.length;
        let i = 0;
        //[size=24][colored][b] 1930 [/b][/color][/size]
        // if(text[i] == '[')
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i];
                ++i;
                if (length == i) isWriting = false;
            },
            repeat: length - 1,
            delay: 50
        });
    }

    typewriteTextWrapped(text) {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }
    resolveLastMission() {

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