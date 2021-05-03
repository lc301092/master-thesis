const WALK_SPEED = 128;
const RUN_SPEED = 192;
const ADJUST_RANGE_Y = 30;
const ADJUST_RANGE_X = 15;

const singlePress = Phaser.Input.Keyboard.JustDown;

const isDown = function (/**arguments: array*/) {
    const keys = Array.from(arguments);
    for (const key of keys) {
        if (key.isDown) return true;
    }
    return false;
};

export default class Player {

    constructor(keys, collider, object) {
        this.input = new InputManager(keys);
        this.collider = collider;
        collider.setFillStyle(0xff0000, 0.5).setDepth(50); // for debugging
        this.object = object;
        this.animation = object.anims;
        this.disabled = false;
        this.speed = WALK_SPEED;
        this.isMoving;
    }
    update() {
        if (this.isDisabled()) return;

        this.adjustSpeed();

        this.move();

        this.stop();

        this.animate();
    }

    isDisabled() {
        return this.disabled;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
    }

    isInteracting() {
        return !this.isDisabled() && this.input.interact();
    }

    /** 
     * sprint or walk
     */
    adjustSpeed() {
        if (this.input.sprint()) this.speed = RUN_SPEED;
        else this.speed = WALK_SPEED;
    }
    isPlayerMoving() {
        return this.isMoving;
    }
    
    move() {
        const collider = this.collider;
        const object = this.object;
        const input = this.input;
        const speed = this.speed;

        if (input.up()) {
            object.setVelocityY(-speed);
            collider.x = object.x;
            collider.y = object.y - ADJUST_RANGE_X;
        }
        if (input.down()) {
            object.setVelocityY(speed);
            collider.x = object.x;
            collider.y = object.y + ADJUST_RANGE_Y;
        }
        if (input.left()) {
            object.setVelocityX(-speed);
            collider.x = object.x - ADJUST_RANGE_X;
            collider.y = object.y;
        }
        if (input.right()) {
            object.setVelocityX(speed);
            collider.x = object.x + ADJUST_RANGE_X;
            collider.y = object.y;
        }
    }

    stop() {
        const object = this.object;
        const input = this.input;

        if (!(input.up() || input.down())) {
            object.setVelocityY(0);
        }
        if (!(input.right() || input.left())) {
            object.setVelocityX(0);
        }
    }

    animate() {
        const velocity = this.object.body.velocity;
        const animation = this.animation;
        if (velocity.x > 0) {
            animation.play('right', true);
            this.isMoving = true;
        }
        else if (velocity.x < 0) {
            animation.playReverse('left', true);
            this.isMoving = true;
        }
        else if (velocity.y > 0) { 
            animation.play('down', true);
            this.isMoving = true; 
        }
        else if (velocity.y < 0) {
            animation.play('up', true);
            this.isMoving = true;
        }
        else {
            animation.stop();
            this.isMoving = false;
        }
    }
}

class InputManager {

    constructor(keys) {
        this.keys = keys;
    }

    up() {
        return isDown(this.keys.up, this.keys.alt_up);
    }

    down() {
        return isDown(this.keys.down, this.keys.alt_down);
    }

    left() {
        return isDown(this.keys.left, this.keys.alt_left);
    }

    right() {
        return isDown(this.keys.right, this.keys.alt_right);
    }

    sprint() {
        return isDown(this.keys.sprint);
    }

    interact() {
        return singlePress(this.keys.interact) || singlePress(this.keys.alt_interact);
    }
}

