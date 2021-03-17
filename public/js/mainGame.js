/** @type {import("../lib/phaser-3.53.1/types/phaser")} */ 

import {LoadScene} from './scenes/LoadScene.js'; 
import {MenuScene} from './scenes/MenuScene.js';
import {Base} from './scenes/Base.js';

let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, Base], 
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    }
})

 

