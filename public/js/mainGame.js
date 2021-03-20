/** @type {import("../lib/phaser-3.53.1/types/phaser")} */ 

import {LoadScene} from './scenes/LoadScene.js'; 
import {MenuScene} from './scenes/MenuScene.js';
import {Base} from './scenes/BaseScene.js';
import {TraningScene} from './scenes/TraningScene.js';

let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, Base, TraningScene], 
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
})

 

