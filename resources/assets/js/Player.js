import Phaser from "phaser-ce";

export default class Player extends Phaser.Sprite {

    constructor(game, x, y, id) {

        super(game, parseFloat(x), parseFloat(y), "player");

        this.lookDirection = 'right';
        this.movingSpeed = 150;
        this.id = parseInt(id);

        game.stage.addChild(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.animations.add("left", _.range(8), 10, true);
        this.animations.add("right", _.range(11, 19), 10, true);

    }

    handleMoving(cursors) {

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

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

            this.animations.stop();
            this.frame = this.lookDirection === 'right' ? 9 : 8;

        } else {

            this.animations.play(this.lookDirection);

        }

        return {x: this.body.x, y: this.body.y};

    }

}