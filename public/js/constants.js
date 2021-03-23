export const constants = {
    SCENES: {
        LOAD: "LOAD",
        MENU: "MENU",
        PLAY: "PLAY",
        UI: "UI",
        TRANING: "TRANING",
        CHEMIST: "CHEMIST",
        TIMELINE: "TIMELINE",
        TIME_MACHINE: 'TIME_MACHINE',
        TRAININGSIMULATORSCENE: "TRAININGSIMULATORSCENE"
    },
    USERINPUT: {
        SINGLEPRESS: Phaser.Input.Keyboard.JustDown,
        WASD_MOVEMENT: {
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            interact: 'E',
            alt_interact: 'enter',
            sprint: 'shift'
        },

    },
    AUDIO: {},
    IMAGES: {
        BASE_MAP: 'map.png',
        BASE_MAP2: 'map2.png',
        SKY: 'sky.png',
		SCREEN: 'TimeScreen.png',
        EVENTPIC: 'eventSprite.png',
        TICK: 'flueben.png',
        X: 'xikon.png',
        DATASÆT: 'datasæt_placeholder.png',
        PORTAL: 'portal_u',
        DOORS1: '!$CC_doors_1',
        EXTERIOR_A2: 'CC_City_Exterior_A2',
        INTERIOR_B: 'CC_Autoshop_Interior_B',
        EXTERIOR_B: 'CC_City_Exterior_B',
        EXTERIOR_C: 'CC_City_Exterior_C',
        SCIFI: 'scifi_space_rpg_tiles_lpcized',
        TRAINING_COMPUTER: 'trainingComputer4-3.png',
        MEDLAB_INTERIOR_1: 'interior1', 
        MEDLAB_INTERIOR_2: 'walls1',
        MED1: 'med1_32',
        MED2: 'med2_32',
        MED3: 'med3_32',
        TRAINING_COMPUTER: 'trainingComputer.png',
        BG_TIME_MACHINE: 'bg_time_device.png', 
        BTN_TIME_MACHINE: 'time_device_btn.png',
        MED_DATA_YELLOW: 'yellow.png',
        MED_DATA_BLUE: 'blue.png',
        MED_DATA_RED: 'red.png'
    },
    SPRITES: {
        PC: 'playable_charaters.png',
        PORTAL: 'portal_u.png',
        CHEMIST_NPC: 'professor-npc.png'
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
            MED1: 'med1_32',
            MED2: 'med2_32',
            MED3: 'med3_32',
            PORTAL: 'portal_u'
        }
    },
    TILEMAPS: {
        BASE_LVL: 'baseSceneTest',
        CHEMIST_LVL: 'scenarie1' 
    },
    TEXT_STYLE: {
        NPC: {},
        COMPUTER: {}
    }

}
