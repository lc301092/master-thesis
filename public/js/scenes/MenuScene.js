import { constants } from "../constants.js"
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.MENU
        })
    }
    init(data) {
        console.log(data)
    }
    preload() {
    }
    create() {
        this.add.image(0, 0, constants.IMAGES.SKY).setOrigin(0);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Tryk på skærmen for at komme videre',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.input.on('pointerdown', (pointer) => {
            console.log('clicked');
            this.scene.start(constants.SCENES.CHEMIST, 'Start');
        });
    }
        
}