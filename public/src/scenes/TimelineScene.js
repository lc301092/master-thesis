import { constants } from "../constants.js"
import { timeMachine } from '../game/timeMachine'

const YEAR_MAX = 2200;
const YEAR_MIN = 1800;
const AVAILABLE_YEARS = YEAR_MAX - YEAR_MIN;
const yearToScreenScale = 1.5;

let storyProgression;
let playerData;
let currentYearPic;
let secondEventPic;
let eventText;
let welcome = true;
let isWriting;
let textPlugin;

let computerWriteSound;




export class Timeline extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TIMELINE
        })
    }

    init(data) {
        playerData = data;
        storyProgression = playerData.playerProgression.length;
        this.add.image(0, 0, constants.IMAGES.SCREEN).setOrigin(0);
        isWriting = false;
        textPlugin = this.plugins.get('rexbbcodetextplugin');
    }
    preload() {
        // get progression from localstorage

    }

    create() {
        let scene = this;
        computerWriteSound = scene.sound.add('computer_write2', { volume: 0.1 });
        const header = scene.add.text(330, 50, 'Tidslinje', {
            fill: '#31FDF0',
            fontSize: '25px'
        });
        //const year = scene.add.text(150, 100, 'År: 1930', { fill: '#31FDF0'});

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
            scene.scene.start(constants.SCENES.PLAY, playerData);
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
        const availableScenarios = timeMachine[storyProgression];
        if (!availableScenarios) {
            const endMessage = 'TIDSLINJEN ER BLEVET GENOPRETTET, KØRER STATUS...             ...                                10%...                                           60%...                                       99%...                      ...'
            this.typeWriter(endMessage);
            alert('Demoen er nu slut. Mange tak fordi du ville spille med! Du kan lukke vinduet nu eller blive hængende og kigge rundt');
            return;
        }
        const destinations = availableScenarios.destinations;
        // sometimes there is only one destination
        for (let i = 0; i < destinations.length; i++) {
            let eventPic;
            const destination = destinations[i];
            const year = destination.year;
            //const sceneID = destination.sceneID;
            const scenarioText = destination.text;

            // TODO based on year 
            // set new x value
            const x = (year - YEAR_MIN) * yearToScreenScale;
            eventPic = this.add.image(x, 120, constants.IMAGES.EVENTPIC).setOrigin(0);

            eventPic.setInteractive({ useHandCursor: true });
            eventPic.on('pointerover', () => {
                eventPic.setScale(1.01);
            });
            eventPic.on('pointerout', () => {
                eventPic.setScale(1);
            });
            eventPic.on('pointerdown', () => {
                // Dynamisk tekst
                this.typewriteText(scenarioText);
            });

            // TODO add feedback if storyprogession is more than 0
        }
        if (storyProgression > 0) {
            const progressIndex = storyProgression - 1;
            const questGraphic = '/\\/\\/\\/\\';
            const isCorrect = playerData.answers[progressIndex].isCorrect;
            const lastDestYear = playerData.playerProgression[progressIndex].year;
            const lastDestx = (lastDestYear - YEAR_MIN) * yearToScreenScale;
            console.log('ANSWER IS: ' + isCorrect);
            let questText;

            let questLabel = this.add.rexBBCodeText(lastDestx, 225, '')
                .setInteractive({ useHandCursor: true })
                .on('areadown', function (key) {
                    scene.typewriteText(questText);
                });
            if (isCorrect) {
                questLabel.setText(`[b][area=correct][color=lightgreen]${questGraphic}[/color][/stroke][/area][/b]`);
                questText = 'Der er ikke forstyrrelser med tidslinjen i denne periode';
            }
            else {
                questLabel.setText(`[b][stroke=black][area=incorrect][color=red]${questGraphic}[/color][/stroke][/area][/b]`);
                questText = 'Der er stadig problemer i denne periode';
            }
        }

        if (!welcome) return;
        welcome = false;
        const welcomeMessage = 'VELKOMMEN HJEM REKRUT! \n\nHER KAN DU SE DIN TIDSLINJE! \nTRYK PÅ IKONERNE, FOR AT FINDE UD AF HVAD DER SKABER PROBLEMER I TIDSLINJEN OG RET OP PÅ DEM, VED AT REJSE TILBAGE I TIDEN! \n\nHELD OG LYKKE!';
        this.typewriteText(welcomeMessage);
    }
    update() {
        if (!isWriting) return;
        const shouldPlay = (1 == (Math.floor(Math.random() * 5 )));
        if (shouldPlay && isWriting && !computerWriteSound.isPlaying) computerWriteSound.play();
    }

    typewriteText(text) {
        if (isWriting) return;
        isWriting = true;
        this.typeWriter(text);
    }
    typeWriter(text = 'Ingen beskrivelse') {
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


}
