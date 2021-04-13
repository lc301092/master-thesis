const COLOR_PRIMARY = 0xffffff;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class PlayerLog {

    constructor(scene, title) {
        this.scene = scene
        this.background = scene.add.rectangle(595,10, 200,300, COLOR_PRIMARY).setOrigin(0).setDepth(5);
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
// this.add.text(110, 485, '', { color: 'black' });

// other related UI stuff