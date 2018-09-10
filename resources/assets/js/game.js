import Map    from "./Map";
import Player from "./Player"
import Phaser from "phaser-ce";
// import Socket from "./Socket"; //TODO: extract socket logic to class
// import Cookies from "js-cookie"

window.onload = function() {

    let game = null;
    let me = null; //host player
    let walls = null;
    let floor = null;
    let conn = new WebSocket('ws://' + window.location.hostname + ':8090');
    let players = []; //connected players
    let receivedData = null;
    let time = performance.now();

    conn.onopen = () => {
        game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });
    };

    function preload () {

        game.load.spritesheet("player", "img/player.png", 87, 86);
        game.load.image("wall", "img/wall.bmp");
        game.load.image("grass", "img/grass_sized.png");
        game.stage.disableVisibilityChange = true; //To not pause when losing focus
        //conn = new WebSocket('ws://' + window.location.hostname + ':8090');

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        Map.testMap()
            .then((d) => { drawMap(d); return d; })
            .then((d) => { drawPlayer(); return d; })
            .then((d) => {
                drawPlayers();
            });

        conn.onmessage = (d) => {
            receivedData = JSON.parse(d.data);
        };

    }

    function update() {

        if (!me) return; // wtf?

        //if (performance.now() - time < 1000) return;

        // time = performance.now();

        game.physics.arcade.collide(me, walls);
        game.physics.arcade.collide(players, walls);
        game.physics.arcade.collide(me, players);

        let cursors = game.input.keyboard.createCursorKeys();
        let new_position = me.handleMoving(cursors);
        drawPlayers();

        //State to send
        let data = {
            ...new_position,
        };
        //Send my new state to server
        conn.send(JSON.stringify(data));

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

        me = new Player(game, 100.0, 100.0, $('body').data('userId'));

    }

    function drawPlayers() {
        if(!receivedData) {
            return;
        }
        let newPlayersInfo = receivedData.players;

        for (let elem of newPlayersInfo) {
            if(elem.id !== me.id) {
                let existPlayer = _.findIndex(players, (pp) => pp.id === elem.id);
                if (existPlayer === -1) {
                    //Adding new player to the scene
                    players.push(new Player(game, elem.x, elem.y, elem.id));
                } else {
                    //Moving existing one
                    players[existPlayer].moveWithAnimation(game, elem.x, elem.y);
                    // players[existPlayer].x = parseFloat(elem.x);
                    // players[existPlayer].y = parseFloat(elem.y);
                }
            }
        }
    }
};

