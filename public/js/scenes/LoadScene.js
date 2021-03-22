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

        let pathString = '/assets/' + type
        console.log(pathString);
        this.load.setPath(pathString);

        switch (type) {
            case 'image':
                for (const key in constants.IMAGES) {
                    let imageString = constants.IMAGES[key];
                    console.log(imageString);
                    // check if normal image or tileImage
                    if (imageString.split('.png').length > 1) {
                        // normal image
                        this.load.image(imageString, imageString);
                    }
                        // tileImage add .png at second param
                    else {
                        this.load.image(imageString, imageString + '.png')
                    }
                }
                break;
            case 'audio':
                for (const key in constants.AUDIO) {
                    this.load.image(constants.AUDIO[key], constants.AUDIO[key])
                }
                break;
            case 'sprite':
                // remember to use configs
                // for (const key in constants.IMAGES) {
                //     this.load.image(constants.IMAGES[key], constants.IMAGES[key])
                // } 
                break;
                case 'tilemap':
                    for (const key in constants.TILEMAPS) {
                        let tileMapString = constants.TILEMAPS[key];
                        this.load.tilemapTiledJSON(tileMapString, tileMapString+'.json');
                    }
        };
        this.load.setPath();
    }

    preload() {
        this.load.spritesheet('player', '/assets/sprite/playable_charaters.png', {
            frameWidth: 48,
            frameHeight: 62
        });
        this.load.spritesheet('professor-npc', '/assets/sprite/professor-npc.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('portal', 'assets/sprite/portal.png', {
            frameWidth: 250,
            frameHeight: 592
        });

        this.loadResources('image');
        this.loadResources('tilemap');

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
        console.log(this);
        this.load.on('progress', (percent) => {
            loadingBar.fillRect(200, this.game.renderer.height / 2, this.game.renderer.width * percent / 2, 20);
        })
    }
    create() {
        this.scene.start(constants.SCENES.MENU, 'From load scene');
    }
}