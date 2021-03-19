import { constants } from "../constants.js"

let player, keys, playerAnimation, singlePress, scene, map;
let speed = 128;


export class ChemistLevel extends Phaser.Scene {
    constructor() {
        super({
            key: constants.SCENES.CHEMIST,
        })
    }
    init(data) {
        // tell progress from 
        console.log(data)
    }
    preload() {

        
        console.log(this.load);

        this.load.spritesheet('player', 'assets/sprite/playable_charaters.png', {
            frameWidth: 48,
            frameHeight: 64
        });

        this.load.spritesheet('portal', 'assets/sprite/portal.png', {
            frameWidth: 250,
            frameHeight: 592
        });
    }
    create() {
        scene = this;
        
        // tilemap configurations
       
        let chemist_lvl = this.add.tilemap('scenarie1');
        
        // add tileset image

        let tileImages = constants.TILEIMAGES.CHEMIST_LVL;
        let images = constants.IMAGES;
        let tileObj = {};
        for (const key in tileImages) {
            let tileImageString = images[key];
            let tilesetImage = chemist_lvl.addTilesetImage(tileImageString);
            tileObj[key] = tilesetImage; 
        }
        console.log(tileObj);

        let MEDLAB_INTERIOR_1 = tileObj.MEDLAB_INTERIOR_1;
        let MEDLAB_INTERIOR_2 = tileObj.MEDLAB_INTERIOR_2;
        let MED1 = tileObj.MED1;
        let MED2 = tileObj.MED2;
        let MED3 = tileObj.MED3;
        let PORTAL = tileObj.PORTAL;
    
        //layers 
        let ground = chemist_lvl.createLayer('ground', [MEDLAB_INTERIOR_1], 0, 0).setDepth(-2);
        let walls = chemist_lvl.createLayer('walls', [MEDLAB_INTERIOR_1, MEDLAB_INTERIOR_2], 0, 0).setDepth(-2);
        let deco = chemist_lvl.createLayer('deco', [MEDLAB_INTERIOR_2], 0, 0);
        let deco1 = chemist_lvl.createLayer('deco1', [MEDLAB_INTERIOR_1, MEDLAB_INTERIOR_2], 0, 0);
        let deco2 = chemist_lvl.createLayer('deco2', [MEDLAB_INTERIOR_1], 0, 0);
        let interact = chemist_lvl.createLayer('interact', [MED1, MED2, MED3, PORTAL], 0, 0).setDepth(1);
        let interact2 = chemist_lvl.createLayer('interact2', [PORTAL],0,0).setDepth(-1);

        player = scene.physics.add.sprite(150, 450, 'player').setCollideWorldBounds(true); //.setScale(2);
        let npc = scene.physics.add.sprite(550,350,'chemist-npc').setCollideWorldBounds(true).setImmovable(true).setScale(2);
        player.setSize(25, 50).setOffset(12, 10);
        scene.cameras.main.setBounds(0, 0, 1600, 1200);
        scene.physics.world.setBounds(0, 0, 1600, 1200);
        let mainCamera = scene.cameras.main;
        mainCamera.startFollow(player, true, 0.05, 0.05);
       
        scene.animationSetup(this);
        playerAnimation = player.anims;
        // keyobject for movement
        keys = scene.input.keyboard.addKeys(constants.USERINPUT.WASD_MOVEMENT);
        singlePress = constants.USERINPUT.SINGLEPRESS;
        
        // map collisions
			let borders = [walls, ground, deco, deco1, deco2];
			scene.physics.add.collider(player, borders);

			for (let i=0; i<borders.length; i++){
				borders[i].setCollisionByProperty({ border: true});
			}
			
		// map collision interactives
			scene.physics.add.collider(player, interact);
            scene.physics.add.collider(player, interact2);
 
			// gul medicin
			interact.setTileLocationCallback(22, 27, 2, 2, () => {
				if (singlePress(keys.interact)){
					console.log('Du interagerer med GUL medicin');
					// --- dataset til gul medicin kode her ---
				};
			});

			// rød medicin
			interact.setTileLocationCallback(30, 27, 2, 2, () => {
				if (singlePress(keys.interact)){
					console.log('Du interagerer med RØD medicin');
					// --- dataset til rød medicin kode her---
				};
			});

			// blå medicin
			interact.setTileLocationCallback(26, 27, 2, 2, () => {
				if (singlePress(keys.interact)){
					console.log('Du interagerer med BLÅ medicin');
					// --- dataset til blå medicin kode her ---
				};
			});  

            interact2.setTileLocationCallback(15,13,3,4, ()=> {
                
                if (singlePress(keys.interact)){
                    if (confirm('Vil du gerne rejse tilbage til år 2200?')) {
                        // Save it!
                        console.log('Rejser tilbage');
                        //interact.setTileLocationCallback(7,25,1,4, null);
                      } else {
                        // Do nothing!
                        console.log('Bliv i år 1930');
                        //interact.setTileLocationCallback(7,25,1,4, null);
                      }
				};
            });
     
    }
    update() {
        // player movement
        this.playerControl();
    }
    // 8 directional  
    playerControl() {

        if (singlePress(keys.sprint))
            speed = 192;
        else if (keys.sprint.isUp) speed = 128;

        if (keys.up.isDown) {
            player.setVelocityY(-speed);
        }
        if (keys.down.isDown) {
            player.setVelocityY(speed);
        }
        if (keys.left.isDown) {
            player.setVelocityX(-speed);
        }
        if (keys.right.isDown) {
            player.setVelocityX(speed);
        }
        if (keys.up.isUp && keys.down.isUp) {
            player.setVelocityY(0);
            //playerAnimation.play('turn', true);
        }
        if (keys.right.isUp && keys.left.isUp) {
            player.setVelocityX(0);
            //playerAnimation.play('turn', true);
        }
        // other inputs than movement 
        if (singlePress(keys.interact)) {
            console.log(player);
            //console.log(keys.interact);
            //checkColliders()
        }
        if (player.body.velocity.x > 0) playerAnimation.play('right', true);
        else if (player.body.velocity.x < 0) playerAnimation.playReverse('left', true);
        else if (player.body.velocity.y > 0) playerAnimation.play('down', true);
        else if (player.body.velocity.y < 0) playerAnimation.play('up', true);
        else {
            playerAnimation.stop();
        }
    }
    animationSetup(scene) {
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('portal', {
                start: 0,
                end: 3
            }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 15,
                end: 17
            }),
            frameRate: 6,
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 27,
                end: 29
            }),
            frameRate: 6,
        });
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 3,
                end: 5
            }),
            frameRate: 6,
        });
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 39,
                end: 41
            }),
            frameRate: 4,
        });
        scene.anims.create({
            key: 'turn',
            frames: [{
                key: 'player',
                frame: 4
            }],
            frameRate: 10,
            repeat: -1
        });
    }
}