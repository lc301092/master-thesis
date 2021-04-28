import Container from "phaser3-rex-plugins/templates/ui/container/Factory";

const COLOR_WHITE = 0xffffff;
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const GetValue = Phaser.Utils.Objects.GetValue;
const uiLayer = 20;
const uiLayerOnTop = 21;





export default class PlayerLog {

    // container config should contain x,y,width,height 
    constructor(scene) {
        this.scene = scene
        this.background = scene.add.rectangle(0, 0, 200, 350, COLOR_WHITE).setOrigin(0);
        this.visible;
        this.baseYValue = this.background.y + 20;
        this.nextTextPostition = 20;
        this.texts = [];
        this.container = scene.add.container(0, 0, [this.background]).setDepth(uiLayerOnTop).setScrollFactor(0).setVisible(false);
        this.anchor = scene.plugins.get('rexAnchor');
        this.anchor.add(this.container, {
            top: 'top+10',
            right: 'right-210'
        })
        this.uiButton = scene.add.image(0, 0, 'Log_icon.png').setScale(0.15).setOrigin(0).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(uiLayerOnTop);
        this.uiButton.on('pointerdown', () => {
            this.toggle.bind(this);
            this.toggle();
        });
        this.anchor.add(this.uiButton, {
            bottom: 'bottom-20',
            left: 'left+10'
        });
    }


    toggle() {
        const uiButton = this.uiButton;
        const container = this.container;

        // TODO container is undefined when Toggle is called from line 30

        console.log(this);
        console.log(container);

        if (container.visible) {
            container.setVisible(false);
            uiButton.setTexture('Log_icon.png');
        }
        else {
            container.setVisible(true)
            uiButton.setTexture('Log_icon_open.png');
        }
    }

    setText(text, indent = 10, style = null) {

        const background = this.background;
        const scene = this.scene;

        this.texts.push(text);
        // array count
        let textsCount = this.texts.length;
        // string count 
        let textCount = this.texts[textsCount - 1].length;
        console.log(textCount);

        console.log(this.nextTextPostition);

        let textObj = scene.add.text(indent, this.nextTextPostition, text, { color: 'black' })
            .setDepth(7).setWordWrapWidth(background.width - indent, true);

        this.nextTextPostition += textCount + 20;

        this.container.add(textObj);
        this.uiButton.setTexture('Log_icon_new.png');
        //return textObj;
    }


}

export const textBox = {
    startOnComplete: function (scene, uiElement, text, speed, callback) {
        scene.player.setDisabled(true);
        uiElement.setVisible(true);
        uiElement.once('complete', () => { return callback() }).start(text, speed);

    },
    writeUiText: function (scene, uiElement, text, speed) {
        scene.player.setDisabled(true);
        uiElement.setVisible(true);
        uiElement.start(text, speed);
    },

    createTextBox: function (scene) {
        const player = scene.player;
        const anchor = scene.plugins.get('rexAnchor');
        const x = 65;
        const y = 480;
        const config = {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
        };


        var wrapWidth = GetValue(config, 'wrapWidth', 0);
        var fixedWidth = GetValue(config, 'fixedWidth', 0);
        var fixedHeight = GetValue(config, 'fixedHeight', 0);
        var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,
            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),
            action: scene.add.image(0, 0, 'flueben.png').setScale(0.2).setTint(COLOR_LIGHT).setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        }).setOrigin(0).layout().setDepth(20).setVisible(false);

        textBox.setInteractive({ useHandCursor: true })
            .on('pointerdown', function () {
                var icon = this.getElement('action').setVisible(false);
                this.resetChildVisibleState(icon);
                if (this.isLastPage && !this.isTyping) {
                    this.setVisible(false);
                    player.setDisabled(false);
                    this.emit('complete');
                };
                if (this.isTyping) {
                    this.stop(true);
                } else {
                    this.typeNextPage();
                }
            }, textBox)
            .on('pageend', function () {
                if (this.isLastPage) {
                    return;
                }
                var icon = this.getElement('action').setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30', // '+=100'
                    ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false
                });
            }, textBox);

        // TODO2 FIX POSITION WITH ANCHOR
        const anchorConfig = {
            centerX: 'center',
            bottom: '99%'
        }

        anchor.add(textBox, anchorConfig);
        textBox.setScrollFactor(0);
        return textBox;
    },


    // other related UI stuff
    // eksempel fra chemist lvl
    /* dialogueConfig = {
            button0: {
                text: 'Godkend',
                action: acceptMedicin
            },
            button1:{
                text: 'Afvis'
            }
        };
    } */
    createDialog: function (scene, dialogueConfig) {
        const anchor = scene.plugins.get('rexAnchor');
        const player = scene.player;

        let dialog = scene.rexUI.add.dialog({
            x: 400,
            y: 300,
            width: 100,
            height: 100,

            background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_PRIMARY),

            title: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_DARK),
                text: scene.add.text(0, 0, dialogueConfig.title, {
                    fontSize: '16px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),

            content: scene.add.text(0, 0, dialogueConfig.text, {
                fontSize: '16px'
            }),

            actions: [
                createLabel(scene, dialogueConfig.button0.text),
                createLabel(scene, dialogueConfig.button1.text)
            ],

            space: {
                title: 5,
                content: 10,
                action: 5,

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },

            align: {
                actions: 'right', // 'center'|'left'|'right'
            },

            expand: {
                title: true,
                content: true,
                description: true,
                choices: true,
                actions: false,
            }
        })
            .layout()
            .popUp(1000)
            .setDepth(uiLayer)
            .setOrigin(0)
            .setScrollFactor(0);
        //.drawBounds(scene.add.graphics(), 0xff0000)
        anchor.add(dialog, {
            centerX: 'center',
            centerY: 'center+230'
        });

        dialog
            .on('button.click', function (button, groupName, index) {
                dialogueConfig.button0.action(index);
                dialog.setVisible(false);
                player.setDisabled(false);

            }, scene)
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        return dialog;
    }

}

const getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}

const createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),

        text: scene.add.text(0, 0, text, {
            fontSize: '16px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}
