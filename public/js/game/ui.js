const COLOR_WHITE = 0xffffff;
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const GetValue = Phaser.Utils.Objects.GetValue;

export default class PlayerLog {

    constructor(scene, title) {
        this.scene = scene
        this.background = scene.add.rectangle(595,10, 200,300, COLOR_WHITE).setOrigin(0).setDepth(5);
        this.container = scene.add.container;
        this.visible;
        this.baseYValue = this.background.y + 20;
        this.nextTextPostition = 20;
        this.texts = [];
          

    }
    Toggle(){
        // TODO after wrapped in container set disable  
        if(this.visible) visible = false;
        else visible = true;
    }


    setTitle(text){
        // adds the title
    }
    
    setText(text,indent = 10, style = null){

        const background = this.background;
        const scene = this.scene;
        
        this.texts.push(text);
        // array count
        let textsCount = this.texts.length;
        // string count 
        let textCount = this.texts[textsCount-1].length;
        console.log(textCount);
        
        console.log(this.nextTextPostition);
        
        let textObj = scene.add.text(background.x+indent, this.nextTextPostition, text,{color: 'black'})
        .setDepth(7).setWordWrapWidth(background.width - indent, true);
        
        this.nextTextPostition += textCount +20;

        return textObj;
    }
}

export const textBox = {
    writeUiText: function(uiElement, text, speed){
        uiElement.setVisible(true);
        uiElement.start(text,speed);
    },
    
    createTextBox: function(scene, x, y, config) {
        const player = scene.player;

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
        }).setOrigin(0).layout();
    
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
            return textBox;
} 
// other related UI stuff

}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
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