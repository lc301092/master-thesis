import { constants } from "../constants.js"
import Player from "../game/player.js"
import PlayerLog from "../game/ui.js"

let playerData;
let scene;

export class Farm extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.FARM,
        })
        this.player = null;
    }

    init(data) {
       playerData = data;
    }
    preload() {
        
    }
    create() {
        scene = this;

        // tilemap configurations
        let farm_lvl = this.add.tilemap('farm');

        // add tileset image
        let tileImages = constants.TILEIMAGES.FARM_LVL;
        let images = constants.IMAGES;
        let tileObj = {};

        for (const key in tileImages) {
            let tileImageString = images[key];
            let tilesetImage = farm_lvl.addTilesetImage(tileImageString);
            tileObj[key] = tilesetImage;
        }

        let FARM_BOOK = tileObj.FARM_BOOK;
        let FARM_BUILDING = tileObj.FARM_BUILDING;
        let FARM_DECO = tileObj.FARM_DECO;
        let FARM_GROUND = tileObj.FARM_GROUND;
        let FARM_DECO2 = tileObj.FARM_DECO2;
        let FARM_DECO3 = tileObj.FARM_DECO3;
        let FARM_DECO4 = tileObj.FARM_DECO4;

        //layers 
        let ground = farm_lvl.createLayer('Ground', [FARM_GROUND, FARM_DECO3], 0, 0).setDepth(-2);
        let wall = farm_lvl.createLayer('Border', [FARM_DECO2], 0, 0);
        let exterior = farm_lvl.createLayer('Exterior', [FARM_BUILDING, FARM_DECO4, FARM_DECO2, FARM_DECO3], 0, 0);
        let exterior2 = farm_lvl.createLayer('Exterior2', [FARM_DECO], 0, 0);
        let flavor = farm_lvl.createLayer('GroundFlavor', [FARM_DECO3], 0, 0);
        let interact = farm_lvl.createLayer('interactables', [FARM_BOOK, FARM_DECO2], 0, 0).setDepth(1); 
    }

    update(){

    }
}