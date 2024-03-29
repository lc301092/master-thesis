import { constants } from "../constants.js"

let playerData;


export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.MENU
        })
    }
    init(data) {
       playerData = data;
    }
    preload() {
    }
    create() {
        const music = this.sound.add('menu').play({volume: 0.05, loop: true});
        let canvas = document.querySelector('canvas');

        console.log(canvas);

        canvas.style.position = 'relative';

        let bg = this.add.image(0, 0, constants.IMAGES.SKY).setOrigin(0).setInteractive();
        
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let title = this.add.image(400,250,'menu_title.png'); //.setScale(0.5).setOrigin(0).setDepth(1);
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 + 100,
            text: 'Tryk på skærmen for at komme videre',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.input.on('pointerdown', (pointer) => {
            console.log('clicked');
            this.scene.start(constants.SCENES.INTRO, playerData);
        });
    }
        
}