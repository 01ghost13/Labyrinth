import Phaser from "phaser-ce";

export default class Player extends Phaser.Sprite {

    constructor(game, x, y, id) {

        super(game, parseFloat(x), parseFloat(y), "player");

        this.lookDirection = 'right';
        this.movingSpeed = 150;
        this.id = parseInt(id);
        this.moveStack = [];
        this.state = 'idle';

        game.stage.addChild(this);
        game.physics.arcade.enable(this);

        this.body.collideWorldBounds = true;
        this.body.bounce.setTo(0.0, 0.0);

        this.animations.add("left", _.range(8), 10, true);
        this.animations.add("right", _.range(11, 19), 10, true);

    }

    handleMoving(cursors) {

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.state = 'run';

        if (cursors.left.isDown) {

            this.body.velocity.x = -this.movingSpeed;
            this.lookDirection = 'left'

        } else if(cursors.right.isDown) {

            this.body.velocity.x = this.movingSpeed;
            this.lookDirection = 'right'

        }
        if(cursors.up.isDown) {

            this.body.velocity.y = -this.movingSpeed;

        } else if(cursors.down.isDown) {

            this.body.velocity.y = this.movingSpeed;

        }

        if (!(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown)) {

            this.state = 'idle';
            this.animations.stop();
            this.frame = this.lookDirection === 'right' ? 9 : 8;

        } else {

            this.animations.play(this.lookDirection);

        }

        return {x: this.body.x, y: this.body.y, state: this.state};

    }

    moveTo(game, x, y, state) {

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        let _x = this.x;
        let _y = this.y;

        console.log(state);
        if (state === 'idle') {

            this.animations.stop();
            this.frame = this.lookDirection === 'right' ? 9 : 8;
            this.body.x = x;
            this.body.y = y;

        } else {

            let angle = Math.atan2(x - _x,  y - _y) * (180 / Math.PI);

            if (angle <= 135 && angle >= 45) {

                this.lookDirection = "right"

            } else if (angle <= -45 && angle >= -135) {

                this.lookDirection = "left"

            }

            this.animations.play(this.lookDirection);
            game.physics.arcade.moveToXY(this, x, y, this.movingSpeed);

        }

        this.state = state;

    }

    pushPosition(x, y) {
        console.log(x, this.x, y, this.y);
        if(x !== this.x || y !== this.y) {

            this.moveStack.push({x: x, y: y});

        }
    }

    nextMove(game) {
        if (this.moveStack.length === 0) {

            this.animations.stop();
            this.frame = this.lookDirection === 'right' ? 9 : 8;

        } else {

            let point = this.moveStack.pop();
            let x = point.x, y = point.y;

            let angle = Math.atan2(x - this.x,  y - this.y) * (180 / Math.PI);

            if (angle <= 135 && angle >= 45) {

                this.lookDirection = "right"

            } else if (angle <= -45 && angle >= -135) {

                this.lookDirection = "left"

            }
            this.animations.play(this.lookDirection);
            // game.physics.arcade.moveToXY(this, x, y, this.movingSpeed);
            this.x = x;
            this.y = y;
        }
    }
}