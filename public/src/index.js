import Phaser from 'phaser';

import AnchorPlugin from '../node_modules/phaser3-rex-plugins/plugins/anchor-plugin.js';
import RexUIPlugin from '../node_modules/phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DragRotatePlugin from '../node_modules/phaser3-rex-plugins/plugins/dragrotate-plugin.js';
import BBCodeTextPlugin from '../node_modules/phaser3-rex-plugins/plugins/bbcodetext-plugin.js';



import { LoadScene } from './scenes/LoadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { Base } from './scenes/BaseScene.js';
import { ChemistLevel } from './scenes/chemistLvl.js';
import { Timeline } from './scenes/TimelineScene.js';
import { TimeMachineScene } from './scenes/TimeMachineScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { Farm } from './scenes/Farm.js';


const config = {
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, Base, ChemistLevel, Timeline, TimeMachineScene, IntroScene, Farm],
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
        }
    }, scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    plugins: {
        global: [{
            key: 'rexAnchor',
            plugin: AnchorPlugin,
            start: true
        },
        {
            key: 'rexDragRotate',
            plugin: DragRotatePlugin,
            start: true
        },
        {
            key: 'rexBBCodeTextPlugin',
            plugin: BBCodeTextPlugin,
            start: true
        }],
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI',
        },
            // ...
        ]
    }
};

let game = new Phaser.Game(config);

