import { constants } from "../constants.js"



let text;
let textContent = ['År: 2200 \n\nJorden ligger i ruiner og er dækket af kæmpe støvskyer. \nDet er ikke sikkert at begive sig rundt ude på overfladen. \nI en ødelagt metro, befinder menneskehedens sidste håb sig...', 'Navn: R.I.E. \n\nHun husker intet. \nHun ser sig omkring efter andre, men hun er helt og aldeles alene. \nI sin søgen efter andre mennesker, støder hun på sit spejlbillede… \n“Hvad er der sket?”... \n“Hvorfor er halvdelen af mit ansigt en robot?”... \nHun husker intet.', 'Objekt: Tidslinje \n\nHun finder en skærm på væggen, der blinker. \n“Er det her mon vigtigt?” \nHun genkender svagt tidslinjen på computerens skærm og... \nNoget om fortidige begivenheder, der kunne ændre historiens gang...', 'Objekt: Tidsindstilling \n\nHun drejer på knappen - handlingen virker bekendt. \n“Hvem er statuen?“ \nDa hun trykker på den røde knap, husker hun pludselig noget vigtigt. \nDog når hun ikke at handle mere før et blåt lys omslutter hendes krop og…', '“Nu kan jeg huske det!” \nHun er på rejse tilbage i tiden. \nHun husker hendes mission: \n\nHun må og skal redde jorden ved at genoprette tidslinjen!'];
let state;
let scene;

let playerData;
export class IntroScene extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.INTRO
        })
    }

    init(data) {
        playerData = data;
    }
    preload() {

    }
    create() {
        scene = this;
        let intro1 = this.add.image(0, 0, constants.IMAGES.INTRO1).setScale(0.45).setOrigin(0).setInteractive();
        let intro2 = this.add.image(0, 0, constants.IMAGES.INTRO2).setScale(0.35).setOrigin(0).setVisible(false).setInteractive();
        let intro3 = this.add.image(0, 0, constants.IMAGES.INTRO3).setScale(0.45).setOrigin(0).setVisible(false).setInteractive();
        let intro4 = this.add.image(0, 0, constants.IMAGES.INTRO4).setScale(0.45).setOrigin(0).setVisible(false).setInteractive();
        let intro5 = this.add.image(0, 0, constants.IMAGES.INTRO5).setScale(0.45).setOrigin(0).setVisible(false).setInteractive();
        let introImages = [intro1, intro2, intro3, intro4, intro5];

        text = this.add.text(0, 0, textContent[0], {
            font: '18px Courier',
            fill: '#ff0000',
            stroke: '#8B0000',
            strokeThickness: 1,
            backgroundColor: 'black',
            padding: 10
        });
        state = 0;

    introImages.forEach(element => {

            element.on('pointerdown',  (pointer) => {
                if (state === 0) {
                    text.setText(textContent[1]);

                    intro1.setVisible(false);
                    intro2.setVisible(true);

                    state = 1;
                }
                else if (state === 1) {
                    text.setText(textContent[2]);

                    intro2.setVisible(false);
                    intro3.setVisible(true);

                    state = 2;
                }
                else if (state === 2) {
                    text.setText(textContent[3]);

                    intro3.setVisible(false);
                    intro4.setVisible(true);
                    state = 3;
                }
                else if (state === 3) {

                    text.setText(textContent[4]);

                    intro4.setVisible(false);
                    intro5.setVisible(true);

                    state = 4;
                }
                else if (state === 4) {
                    this.sound.removeByKey('menu');
                    this.scene.start(constants.SCENES.PLAY, playerData);
                }

            });
       });
    }

}