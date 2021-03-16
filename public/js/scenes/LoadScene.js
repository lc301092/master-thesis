import { constants } from "../constants.js"
export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.LOAD
        })
    }
    init() {

    }
    loadResources(type, resources_config = null) {

        let pathString = './assets/' + type
        console.log(pathString);
        this.load.setPath(pathString);

        switch (type) {
            case 'image':
                for (const key in constants.IMAGES) {
                    this.load.image(constants.IMAGES[key], constants.IMAGES[key])
                }
                break;
            case 'audio':
                for (const key in constants.AUDIO) {
                    this.load.image(constants.AUDIO[key], constants.AUDIO[key])
                }
            case 'sprite':
                // remember to use configs
                // for (const key in constants.IMAGES) {
                //     this.load.image(constants.IMAGES[key], constants.IMAGES[key])
                // } 
        };
    }
    
    preload() {

        this.loadResources('image');
        this.loadResources('audio');
        // this.loadResources('sprite');

    
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loader',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        });

        this.load.on('progress', (percent) => {
            loadingBar.fillRect(200, this.game.renderer.height / 2, this.game.renderer.width * percent / 2, 20);
        })
    }
    create() {
        this.scene.start(constants.SCENES.MENU, 'From load scene');
    }
}