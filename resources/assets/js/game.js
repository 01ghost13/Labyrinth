import Map    from "./Map";
import Player from "./Player"
import Phaser from "phaser-ce";
// import Socket from "./Socket"; //TODO: extract socket logic to class
// import Cookies from "js-cookie"

window.onload = function() {

    let game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });
    let player = null;
    let walls = null;
    let floor = null;
    let conn = null;
    let players = null;

    function preload () {

        game.load.spritesheet("player", "img/player.png", 87, 86);
        game.load.image("wall", "img/wall.bmp");
        game.load.image("grass", "img/grass_sized.png");
        conn = new WebSocket('ws://' + window.location.hostname + ':8090');

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        Map.testMap()
            .then((d) => drawMap(d))
            .then(() => drawPlayer())
            .then((d) => drawPlayers(d['players']));
        conn.onmessage = (d) => players = d['players'];

    }

    function update() {

        game.physics.arcade.collide(player, walls);
        game.physics.arcade.collide(players, walls);
        game.physics.arcade.collide(player, players);

        let cursors = game.input.keyboard.createCursorKeys();
        let new_position = player.handleMoving(cursors);
        let data = {
            id: player.id,
            ...new_position,
        };
        drawPlayers(players);
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
                    case 2:
                        //TODO: button
                        break;
                    default:
                        floor.create(i*80, j*80, "grass");
                }
            }
        }

    }

    function drawPlayer() {

        player = new Player(game, 100, 100, $('body').data('userId'));

    }

    //TODO: Init draw players
    async function drawPlayers(playersData) {
        await ((ar) => {
            for (p of ar) {
                let existPlayer = _.findIndex(players, (pp) => pp.id === p['id']);
                if (existPlayer !== -1) {
                    new Player(game, p['x'], p['y']);
                } else {
                    players[existPlayer].body.x = p['x'];
                    players[existPlayer].body.y = p['y'];
                }
            }
        })(playersData);
    }
};

