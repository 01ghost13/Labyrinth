<?php

namespace App\Console\Commands;


use Illuminate\Console\Command;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer extends Command
{
    /**
     * @var array - server list
     */
    const SERVERS = [
        'player-controller' => \App\Socket\PlayerController::class,
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'websocket:serve {server} {port=8090}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initializing WebSocket server';


    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $port         = (int)$this->argument('port');
        $server_name  = $this->argument('server');
        $server_class = self::SERVERS[$this->argument('server')] ?? null;


        if (!$server_class)
        {
            $this->error('Server "' . $server_name . '" does\'t exist!');

            return;
        }

        if ($port <= 0 || $port >= 65535)
        {
            $this->error('Wrong port!');

            return;
        }


        $this->info('Start WebSocket server: ' . $server_name . ' on ' . $port);

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new $server_class()
                )
            ),
            $port
        );

        $server->run();
    }
}
