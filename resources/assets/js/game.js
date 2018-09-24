import Map    from "./Map";
import Player from "./Player"
import Phaser from "phaser-ce";
import io     from "socket.io-client";
// import Socket from "./Socket"; //TODO: extract socket logic to class
// import Cookies from "js-cookie"

window.onload = function() {

    let
        me              = null, //host player
        game            = null,
        walls           = null,
        floor           = null,
        players         = {}, //connected players
        old_position    = {};

    let socket = io.connect('http://127.0.0.1:8091', {
        query: {
            token: $('meta[name="csrf-token"]').attr('content')
        }
    });

    socket.on('connect', (data) => {
        game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });
    });

    socket.on('players.new', (data) => {
        players[data.id] = new Player(game, data.x, data.y, data.id);
    });

    socket.on('players.all', (data) => {

        for (let player of _.values(data)) {

            if (!me && socket.id === player.id) {
                me = new Player(game, player.x, player.y, player.id);
            }
            else {
                players[player.id] = new Player(game, player.x, player.y, player.id);
            }

        }

    });

    socket.on('players.data', (data) => {

        if (!data || !me) return;

        for (let player of _.values(data)) {

            if (player.id === socket.id) continue;

            players[player.id].moveTo(game, player.x, player.y);

        }

    });

    socket.on('players.disconnect', (id) => {
        players[id].kill();
        delete players[id];
    });

    function preload () {

        game.load.spritesheet("player", "img/player.png", 87, 86);
        game.load.image("wall", "img/wall.bmp");
        game.load.image("grass", "img/grass_sized.png");
        game.stage.disableVisibilityChange = true; //To not pause when losing focus

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        Map
            .testMap()
            .then((d) => { drawMap(d); return d; });

        socket.emit('players.get.all');

    }

    function update() {

        if (!me) return; // wtf?

        let cursors = game.input.keyboard.createCursorKeys();
        let new_position = me.handleMoving(cursors);

        game.physics.arcade.collide(me, walls);
        game.physics.arcade.collide(_.values(players), walls);
        game.physics.arcade.collide(me, _.values(players));

        if (new_position.x !== old_position.x || new_position.y !== old_position.y) {

            //Send my new state to server
            socket.emit('players.position', {
                x: new_position.x,
                y: new_position.y
            });

        }

        old_position = new_position;

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
                    case 3:
                        //TODO: button
                        break;
                    default:
                        floor.create(i*80, j*80, "grass");
                }
            }
        }

    }
};

