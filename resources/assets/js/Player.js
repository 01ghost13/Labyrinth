import Phaser from "phaser-ce";

export default class Player extends Phaser.Sprite {

    constructor(game, x, y) {

        super(game, x, y, "player");
        this.movingSpeed = 70;

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

    }
}