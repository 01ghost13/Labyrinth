import Phaser from "phaser-ce";

export default class Player extends Phaser.Sprite {

    constructor(game, x, y, id) {

        super(game, parseFloat(x), parseFloat(y), "player");
        this.movingSpeed = 70;
        this.id = parseInt(id);

        game.stage.addChild(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.animations.add("left", _.range(8), 10, true);
        this.animations.add("right", _.range(9, 18), 10, true);

    }

    handleMoving(cursors) {

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if (cursors.left.isDown) {

            this.body.velocity.x = -this.movingSpeed;
            this.animations.play("left");

        } else if(cursors.right.isDown) {

            this.body.velocity.x = this.movingSpeed;
            this.animations.play("right");

        }
        if(cursors.up.isDown) {

            this.body.velocity.y = -this.movingSpeed;
            if(!(cursors.left.isDown || cursors.right.isDown)) {
                this.animations.play("right");
            }

        } else if(cursors.down.isDown) {

            this.body.velocity.y = this.movingSpeed;
            if(!(cursors.left.isDown || cursors.right.isDown)) {
                this.animations.play("right");
            }

        }
        if (!(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown)) {
            this.animations.stop();
            this.frame = 8;
        }

        return {x: this.body.x, y: this.body.y};

    }

    moveTo(x, y) {

        this.x = parseFloat(x);
        this.y = parseFloat(y);

    }

    moveWithAnimation(game, x, y) {
        if (Math.round(x * 100) / 100 === Math.round(this.x * 100) / 100 && Math.round(y * 100) / 100 === Math.round(y * 100) / 100) {
            this.animations.stop();
            this.frame = 8;
        }
        this.animations.play("right");
        let duration = game.physics.arcade.distanceToXY(this, x, y) / this.movingSpeed;
        let tween = game.add.tween(this).to({ x: x, y: y }, duration, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function () {
            // this.animations.stop();
            // this.frame = 8;
        }, this);

    }

}