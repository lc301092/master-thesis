import { constants } from "../constants.js"
export class TraningScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.TRANING
        })
    }
    init(data) {
        console.log(data)
    }
    preload() {
    }
    create() {
        this.add.image(0, 0, constants.IMAGES.TRAINING_COMPUTER).setOrigin(0);
    }
        
}