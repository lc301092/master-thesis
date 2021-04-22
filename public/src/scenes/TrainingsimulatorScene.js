import { constants } from "../constants.js"

let playerProgression;
let playerPosition;
let eventPic;
let secondEventPic;

export class TrainingsimulatorScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TRAININGSIMULATORSCENE
        })
    }

    init(data) {
        console.log(data)
        if (data.playerPosition) playerPosition = data.playerPosition;
        this.add.image(0, 0, constants.IMAGES.SCREEN).setOrigin(0);
    }
    preload() {
    }

    create() {
        let scene = this;
        
        const header = scene.add.text(300, 50, 'Træningssimulator', { fill: '#31FDF0', fontSize: '25px' });
        scene.label = this.add.text(100, 100, '');
        scene.label.setWordWrapWidth(600);

        this.typewriteText('Velkommen til træningssimulatoren! \nI denne prototype vil du ikke have mulighed for at træne din matematik. \nTing der er gode at vide til din rejse tilbage i tiden: \n\n\n\n\n\n\n\n1. Medianen i en sumkurve læses ud fra 50% markøren på Y aksen. \n\n2. Noget om boksplot. ');

    
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
            delay: 50
        })
    }

    typewriteTextWrapped(text) {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

}