import Map    from "./Map";
import Player from "./Player"
import Phaser from "phaser-ce";


window.onload = function() {

    let game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });
    let player = null;
    let walls = null;
    let floor = null;

    function preload () {

        game.load.spritesheet("player", "img/player.png", 87, 86);
        game.load.image("wall", "img/wall.bmp");
        game.load.image("grass", "img/grass_sized.png");

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        Map.testMap()
            .then((d) => drawMap(d))
            .then(() => drawPlayer());
    }

    function update() {

        game.physics.arcade.collide(player, walls);

        let cursors = game.input.keyboard.createCursorKeys();
        player.handleMoving(cursors);

    }

    function drawMap(mapData) {

        floor = game.add.group();
        walls = game.add.group();
        walls.enableBody = true;

        for(let i = 0; i < mapData.height; ++i) {
            for(let j = 0; j < mapData.width; ++j) {
                let el = mapData.data[i * mapData.height + j];

                switch (el) {
                    case 1:
                        let tile = walls.create(i*80, j*80, "wall");
                        tile.body.immovable = true;
                        break;
                    default:
                        floor.create(i*80, j*80, "grass");
                }
            }
        }

    }

    function drawPlayer() {

        player = new Player(game, 100, 100);

    }
};

