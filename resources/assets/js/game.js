import Map    from "./Map";
import Player from "./Player"
import Phaser from "phaser-ce";
// import Socket from "./Socket"; //TODO: extract socket logic to class
// import Cookies from "js-cookie"

window.onload = function() {

    let
        me              = null, //host player
        game            = null,
        walls           = null,
        floor           = null,
        players         = {}, //connected players
        receivedData    = {},
        me_old_cursor   = {
            up:    { isDown: false    },
            right: { isDown: false },
            down:  { isDown: false  },
            left:  { isDown: false  }
        };

    let conn = new WebSocket('ws://' + window.location.hostname + ':8090');

    conn.onmessage = (d) => {
        let data = JSON.parse(d.data);

        switch (data.event) {
            case 'connected':

                game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });

                receivedData.player  = data.player;
                receivedData.players = data.players;

                break;
            case 'message':

                receivedData.players = data.players;

                break;
        }
    };

    function preload () {

        game.load.spritesheet("player", "img/player.png", 87, 86);
        game.load.image("wall", "img/wall.bmp");
        game.load.image("grass", "img/grass_sized.png");
        game.stage.disableVisibilityChange = true; //To not pause when losing focus

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        Map.testMap()
            .then((d) => { drawMap(d); return d; })
            .then((d) => { drawPlayer(); return d; });

    }

    function update() {

        if (!me) return; // wtf?

        let cursors = game.input.keyboard.createCursorKeys();
        let new_position = me.handleMoving(cursors);

        cleaningPlayers();
        drawPlayers();

        game.physics.arcade.collide(me, walls);
        game.physics.arcade.collide(_.values(players), walls);
        game.physics.arcade.collide(me, _.values(players));


        if (me_old_cursor.up.isDown != cursors.up.isDown || me_old_cursor.right.isDown != cursors.right.isDown || me_old_cursor.down.isDown != cursors.down.isDown || me_old_cursor.left.isDown != cursors.left.isDown) { // ¯\_(ツ)_/¯

            //State to send
            let data = {
                cursor: {
                    up:    { isDown: cursors.up.isDown    },
                    right: { isDown: cursors.right.isDown },
                    down:  { isDown: cursors.down.isDown  },
                    left:  { isDown: cursors.left.isDown  }
                },

                x: new_position.x,
                y: new_position.y
            };

            //Send my new state to server
            conn.send(JSON.stringify(data));

        }


        me_old_cursor = {
            up:    { isDown: cursors.up.isDown    },
            right: { isDown: cursors.right.isDown },
            down:  { isDown: cursors.down.isDown  },
            left:  { isDown: cursors.left.isDown  }
        };
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

    function drawPlayer() {

        if (!receivedData.player) {
            throw new Error('Wrong player data!');
        }

        me = new Player(game, receivedData.player.x, receivedData.player.y, receivedData.player.id);

    }

    function drawPlayers() {

        if (!receivedData.players) {
            return;
        }

        let newPlayersInfo = receivedData.players;

        for (let elem of _.values(newPlayersInfo)) {

            if (elem.id === me.id) {
                continue;
            }

            let existPlayer = players[elem.id];

            if (existPlayer) {
                //Moving existing one
                existPlayer.handleMoving(elem.cursor);
            } else {
                //Adding new player to the scene
                players[elem.id] = new Player(game, elem.x, elem.y, elem.id);
            }

        }
    }

    function cleaningPlayers() {

        if (!receivedData.players) {
            return;
        }

        let newPlayersInfo = receivedData.players;

        let ids = _.keys(players);

        _.each(ids, (id) => {

            if (id === me.id) return;

            if (!newPlayersInfo[id]) {
                players[id].kill();
                delete players[id];
            }

        });

    }
};

