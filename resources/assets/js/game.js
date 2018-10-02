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

    let cursors = {};
    let players_group = [];

    let socket = io.connect('http://127.0.0.1:8091', {
        query: {
            token: $('meta[name="csrf-token"]').attr('content')
        }
    });

    socket.on('connect', (data) => {
        game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload,
                                                            create:  create,
                                                            update:  update,
                                                            render:  render });
    });

    socket.on('players.new', (data) => {

        let new_player = new Player(game, data.x, data.y, data.id);
        players[data.id] = new_player;
        players_group.add(new_player);

    });

    socket.on('players.all', (data) => {

        players_group = game.add.physicsGroup();

        for (let player of _.values(data)) {

            if (!me && socket.id === player.id) {

                me = new Player(game, player.x, player.y, player.id);
                players_group.add(me);

            } else {

                let new_player = new Player(game, player.x, player.y, player.id);
                players[player.id] = new_player;
                players_group.add(new_player);

            }

        }

    });

    socket.on('players.data', (data) => {

        if (!data || !me) return;

        for (let player of _.values(data)) {

            if (player.id === socket.id) continue;
            players[player.id].moveTo(game, player.x, player.y, player.state);

        }

    });

    socket.on('players.disconnect', (id) => {

        if (!players[id]) {
            return;
        }

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

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {

        if (!me) return; // wtf?

        game.physics.arcade.collide(players_group, players_group);
        game.physics.arcade.collide(players_group, walls);

        let new_position = me.handleMoving(cursors);

        if (old_position.state !== 'idle') {
            //Send my new state to server
            socket.emit('players.position', {
                x: new_position.x,
                y: new_position.y,
                state: new_position.state
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

    function render() {

        if (_.values(players)[0])
        {
            game.debug.bodyInfo(_.values(players)[0], 32, 32);
            game.debug.body(_.values(players)[0]);

            game.debug.bodyInfo(me, 32, 150);
            game.debug.body(me);
        }

    }

    function movePlayers() {
        _.each(players, (v) => {
            v.nextMove(game);
        });
    }
};

