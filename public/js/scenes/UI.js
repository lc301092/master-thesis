import { constants } from "../constants.js"

let uiType;
export class UI extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.PLAY,
        })
    }
    init(uiData) {
        // type of ui requested
    /* {
        placement: 'string',
        type: 'string'
    */
        console.log(uiData)
        uiType = uiData;
    }
    preload() {
        //this.player = this.add.
        // tilemaps
    }
    create() {
      
    }
    update() {
        // player movement
    }
}