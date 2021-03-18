export const constants = {
    SCENES: {
        LOAD: "LOAD",
        MENU: "MENU",
        PLAY: "PLAY",
        UI: "UI",
        TRANING: "TRANING"
    },
    USERINPUT: {
        SINGLEPRESS: Phaser.Input.Keyboard.JustDown,
        WASD_MOVEMENT: {
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            interact: 'E',
            sprint: 'shift'
        },

    },
    AUDIO: {},
    IMAGES: {
        BASE_MAP: 'map.png',
        BASE_MAP2: 'map2.png',
        SKY: 'sky.png',
        PORTAL: 'portal_u.png',
        DOORS1: '!$CC_doors_1',
        EXTERIOR_A2: 'CC_City_Exterior_A2',
        INTERIOR_B: 'CC_Autoshop_Interior_B',
        EXTERIOR_B: 'CC_City_Exterior_B',
        EXTERIOR_C: 'CC_City_Exterior_C',
        SCIFI: 'scifi_space_rpg_tiles_lpcized',
        MEDLAB_INTERIOR_1: 'interior1', 
        MEDLAB_INTERIOR_2: 'walls1',
        MED1: 'med1',
        MED2: 'med2',
        MED3: 'med3',
        TRAINING_COMPUTER: 'trainingComputer.png'
    },
    SPRITES: {
        PC: 'playable_charaters.png',
        PORTAL: 'portal_u.png'
    },
    TILEIMAGES: {
        BASE_LVL: {
            DOORS1: '!$CC_doors_1',
            EXTERIOR_A2: 'CC_City_Exterior_A2',
            INTERIOR_B: 'CC_Autoshop_Interior_B',
            EXTERIOR_B: 'CC_City_Exterior_B',
            EXTERIOR_C: 'CC_City_Exterior_C',
            SCIFI: 'scifi_space_rpg_tiles_lpcized'
        },
        CHEMIST_LVL: {
            MEDLAB_INTERIOR_1: 'interior1', 
            MEDLAB_INTERIOR_2: 'walls1',
            MED1: 'med1',
            MED2: 'med2',
            MED3: 'med3',
            PORTAL: 'portal_u.png'
        }
    },
    TILEMAPS: {
        BASE_LVL: 'baseSceneTest',
        CHEMIST_LVL: 'scenarie1' 
    }

}