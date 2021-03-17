		let cursors;
		let scene;
		let player;
		let playerBody;
		let speed = 1;

		let keys;
		let singlePress = Phaser.Input.Keyboard.JustDown;
		let zeroVector = Phaser.Math.Vector2.ZERO;
		let up = new Phaser.Math.Vector2(0, -1);
		let down = new Phaser.Math.Vector2(0, 1);
		let right = new Phaser.Math.Vector2(1, 0);
		let left = new Phaser.Math.Vector2(-1, 0);
		let interact;


		let playerAnimation;


		function preload() {
			this.load.image('!$CC_doors_1', 'assets/image/!$CC_doors_1.png');
			this.load.image('CC_City_Exterior_A2', 'assets/image/CC_City_Exterior_A2.png');
			this.load.image('CC_Autoshop_Interior_B', 'assets/image/CC_Autoshop_Interior_B.png');
			this.load.image('CC_City_Exterior_B', 'assets/image/CC_City_Exterior_B.png');
			this.load.image('CC_City_Exterior_C', 'assets/image/CC_City_Exterior_C.png');
			this.load.image('scifi_space_rpg_tiles_lpcized', 'assets/image/scifi_space_rpg_tiles_lpcized.png');


			this.load.tilemapTiledJSON('baseSceneTest', 'assets/baseSceneTest.json');

			this.load.spritesheet('player', 'assets/sprite/playable_charaters.png', {
				frameWidth: 48,
				frameHeight: 64
			});

			this.load.spritesheet('portal', 'assets/sprite/portal.png', {
				frameWidth: 250,
				frameHeight: 592
			});
		}

		function create() {
			scene = this;
			let baseSceneTest = this.add.tilemap('baseSceneTest');

			//console.log(baseSceneTest);

			let door = baseSceneTest.addTilesetImage('!$CC_doors_1');
			let exteriorA = baseSceneTest.addTilesetImage('CC_City_Exterior_A2');
			let exteriorB = baseSceneTest.addTilesetImage('CC_City_Exterior_B');
			let exteriorC = baseSceneTest.addTilesetImage('CC_City_Exterior_C');
			let interiorA = baseSceneTest.addTilesetImage('scifi_space_rpg_tiles_lpcized');
			let interiorB = baseSceneTest.addTilesetImage('CC_Autoshop_Interior_B');

			//layers 
			let ground = baseSceneTest.createLayer('Ground', [interiorA, door], 0, 0).setDepth(-1);
			let walls = baseSceneTest.createLayer('Wall', [interiorA], 0, 0);
			let decoration = baseSceneTest.createLayer('Decoration', [exteriorA, exteriorB, exteriorC, interiorB, interiorA], 0, 0);
			let decoration2 = baseSceneTest.createLayer('Decoration2', [exteriorA, exteriorB, exteriorC, interiorB], 0, 0);
			let interact = baseSceneTest.createLayer('Interact', [exteriorA, exteriorB, exteriorC, interiorB], 0, 0);
			
			//scene = this;
			scene.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
			scene.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);

			//let playerspawn = <ObjectEntity>scene.baseSceneTest.object['PlayerSpawn'][0];

			scene.player = scene.physics.add.sprite(400, 300, 'player');
			player = scene.player;
			playerAnimation = scene.player.anims;

			scene.player.setCollideWorldBounds(true);
			scene.cameras.main.startFollow(scene.player, true, 0.05, 0.05);
			animationSetup(scene);

			keys = scene.input.keyboard.addKeys({
				up: 'W',
				down: 'S',
				left: 'A',
				right: 'D',
				interact: 'E'
			});

			// map collisions
			let borders = [walls, decoration, decoration2, interact];
			scene.physics.add.collider(scene.player, borders);

			for (i=0; i<borders.length; i++){
				borders[i].setCollisionByProperty({ border: true});
			}

			
		// map collision interactives
			scene.physics.add.collider(scene.player, interact);
			interact.setCollision([678, 679, 680, 681, 682, 683, 2214, 2215, 2216, 1760, 1761]);

			// indstil tidsmaskine
			interact.setTileLocationCallback(10, 5, 6, 1, () => {
				if (singlePress(keys.interact)){
					console.log('indstil din tidsmaskine her');
					// --- indstil tidsmaskine "scene" kode her ---
				};
			});

			// Tidsmaskinen
			interact.setTileLocationCallback(23, 6, 3, 2, () => {
				if (singlePress(keys.interact)){
					console.log('Start træningssimulator');
					// --- Åbn træningssimulator kode her ---
				};
			});

			// træningssimulator
			interact.setTileLocationCallback(22, 18, 2, 2, () => {
				if (singlePress(keys.interact)){
					console.log('Tidsmaskine aktiveret');
					// --- skift scene til laboratorie kode her ---
				};
			});
		}

		function playerControl() {

			// this will be the velocity when no keys are pressed
			player.setVelocity(0, 0);



			if (keys.up.isDown) {
				player.setVelocityY(-150);
				playerAnimation.play('up', true);
			} else if (keys.down.isDown) {
				player.setVelocityY(150);
				playerAnimation.play('down', true);
			}

			else if (keys.left.isDown) {
				player.setVelocityX(-150);
				playerAnimation.play('left', true);

			}
			else if (keys.right.isDown) {

				player.setVelocityX(150);
				//console.log(player);
				playerAnimation.play('right', true);
			}
			else {
				playerAnimation.play('turn', true);
			}

			if (singlePress(keys.interact)) {
				console.log(player);
				//console.log(keys.interact);
				//checkColliders()
			}
			//if(player.velocity == 0) 
		}



		//#region animation
		function animationSetup(scene) {
			scene.anims.create({
				key: 'idle',
				frames: scene.anims.generateFrameNumbers('portal', {
					start: 0,
					end: 3
				}),
				frameRate: 8,
				repeat: -1
			});

			scene.anims.create({
				key: 'left',
				frames: scene.anims.generateFrameNumbers('player', {
					start: 15,
					end: 17
				}),
				frameRate: 10,
				repeat: -1
			});

			scene.anims.create({
				key: 'right',
				frames: scene.anims.generateFrameNumbers('player', {
					start: 27,
					end: 29
				}),
				frameRate: 10,
				repeat: -1
			});
			scene.anims.create({
				key: 'down',
				frames: scene.anims.generateFrameNumbers('player', {
					start: 3,
					end: 5
				}),
				frameRate: 10,
				repeat: -1
			});
			scene.anims.create({
				key: 'up',
				frames: scene.anims.generateFrameNumbers('player', {
					start: 39,
					end: 41
				}),
				frameRate: 10,
				repeat: -1
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

		function update() {
			playerControl();
		}

		// Setup and config -----------------------------------------------------------------------------
		const config = {
			type: Phaser.AUTO,
			width: 1600,
			height: 1200,
			physics: {
				default: 'arcade',
				arcade: {
					debug: true
				}
			},
			scene: {
				preload: preload,
				create: create,
				update: update
			}
		};

		const game = new Phaser.Game(config);

