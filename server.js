const
    port     = 8091,
    tickRate = 64;

let
    app    = require('express')(),
    server = require('http').Server(app),
    io     = require('socket.io')(server),
    axios  = require('axios'),
    
    players = {};




axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};


server.listen(port);
setInterval(worldUpdate, 1000.0 / tickRate);

console.info('Start WebSocket server on ' + port);




io
    .use(async (socket, next) => {

        console.info('New connection...');

        try {
            await auth(socket);

            console.log('Access is allowed!');
            next();
        }
        catch (error) {
            console.warn('Access is denied: ' + error.response.status + '!');
            next(new Error('Not authorized'));
        }

    })
    .on('connect', async (socket) => {

        console.info('Connected: id = ' + socket.id);

        let player = {};

        try {
            player = await getPlayerData(socket);
        }
        catch (error) {
            console.warn('Failed to get the player data: ' + error.response.status + '!');
            socket.destroy();
        }

        players[socket.id] = {
            id: socket.id,
            x:  player.x,
            y:  player.y,
            state: 'idle'
        };

        socket.broadcast.emit('players.new', players[socket.id]);

        attachHandlers(socket);

    });




function worldUpdate() {

    if (!players) return;

    io.emit('players.data', players);

}

function attachHandlers(socket) {

    socket
        .on('players.get.all', () => {
            socket.emit('players.all', players);
        })
        .on('players.position', (player_data) => {
            players[socket.id].x = player_data.x;
            players[socket.id].y = player_data.y;
            players[socket.id].state = player_data.state;
        })
        .on('disconnect', async () => {

            await setPlayerData(players[socket.id], socket);

            io.emit('players.disconnect', players[socket.id].id);
            delete players[socket.id];

            console.info('Disconnected: id = ' + socket.id);

        });

}

async function auth(socket) {

    return await axios({
        url:     'http://127.0.0.1:8000/ws/auth',
        method:  'post',
        headers: {
            'Cookie':       socket.request.headers.cookie,
            'X-CSRF-TOKEN': socket.handshake.query['token']
        }
    });

}

async function getPlayerData(socket) {

    let result = await axios({
        url:     'http://127.0.0.1:8000/ws/player/get',
        method:  'post',
        headers: {
            'Cookie':       socket.request.headers.cookie,
            'X-CSRF-TOKEN': socket.handshake.query['token']
        }
    });

    return result.data;

}

async function setPlayerData(player, socket) {

    let data = JSON.stringify({
        x: player.x,
        y: player.y
    });

    try {
        await axios.post('http://127.0.0.1:8000/ws/player/set', data, {
            headers: {
                'Cookie':       socket.request.headers.cookie,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': socket.handshake.query['token']
            }
        });
    }
    catch (error) {
        console.warn('Failed to set the player data: ' + error.response.status + '!');
    }

}
