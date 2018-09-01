import Map    from "./Map";
import Player from "./Player"
import Phaser from "phaser-ce";
// import Socket from "./Socket"; //TODO: extract socket logic to class
// import Cookies from "js-cookie"

window.onload = function() {

    let game = null;
    let player = null;
    let walls = null;
    let floor = null;
    let conn = new WebSocket('ws://' + window.location.hostname + ':8090');
    let players = null;
    let time = performance.now();

    conn.onopen = () => {
        game = new Phaser.Game(800, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });
    };

    function preload () {

        game.load.spritesheet("player", "img/player.png", 87, 86);
        game.load.image("wall", "img/wall.bmp");
        game.load.image("grass", "img/grass_sized.png");
        //conn = new WebSocket('ws://' + window.location.hostname + ':8090');

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        Map.testMap()
            .then((d) => { drawMap(d); return d; })
            .then((d) => { drawPlayer(); return d; })
            .then((d) => {
                drawPlayers(players)
            });

        conn.onmessage = (d) => {
            let data = JSON.parse(d.data);
            players = data.players;
        };

    }

    function update() {

        //if (performance.now() - time < 1000) return;

        time = performance.now();

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

        if (!playersData) return;

        playersData.forEach(elem => {

            let existPlayer = _.findIndex(players, (pp) => pp.id === elem.id);

            if (existPlayer === -1) {
                players.push(new Player(game, parseFloat(elem.x), parseFloat(elem.y)));
            } else {
                players[existPlayer].x = parseFloat(elem.x);console.log(existPlayer);
                players[existPlayer].y = parseFloat(elem.y);
            }

        });

        /*await ((ar) => {

            if (!ar) return;

            ar.forEach(elem => {

                let existPlayer = _.findIndex(players, (pp) => pp.id === elem.id);

                if (existPlayer === -1) {
                    players.push(new Player(game, parseFloat(elem.x), parseFloat(elem.y)));
                } else {
                    players[existPlayer].x = parseFloat(elem.x);
                    players[existPlayer].y = parseFloat(elem.y);
                }

            });
        })(playersData);*/
    }
};

