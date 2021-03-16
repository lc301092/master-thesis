import { constants } from "../constants.js"
export class Base extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.PLAY,
        })
    }
    init(data) {
        // tell progress from 
        console.log(data)
    }
    preload() {
        this.add.image(0, 0, constants.IMAGES.BASE_MAP).setOrigin(0);

        // tilemaps
    }
    create() {
        
        // tilemap configurations

        // animations

        // keyobject for movement
    }
    update(){
        // player movement
    }
        
}