<?php

namespace App\Socket;


use App\Events\DataFromUser;
use App\Position;
use App\Socket\Base\Socket;
use Ratchet\ConnectionInterface;

class PlayerController extends Socket
{
    /**
     * @var array
     */
    protected $data;

    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $from The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        parent::onMessage($from, $msg);


        /*event(
            new DataFromUser($from, $msg)
        );*/

        $data     = json_decode($msg);
        $data->id = $from->resourceId;

        $this->data[$data->id] = $data;

        $data = $this->getConnectionsData();

        foreach ($this->connections as $connection)
        {
            $connection->send(json_encode([
                'event'   => 'message',
                'players' => $data,
            ]));
        }
    }

    protected function getConnectionsData(): array
    {
        $data = [];

        if (!$this->data)
        {
            return [];
        }

        foreach ($this->data as $datum)
        {
            $data[$datum->id] = [
                'id' => $datum->id,

                'cursor' => [
                    'up'    => [ 'isDown' => $datum->cursor->up->isDown    ],
                    'right' => [ 'isDown' => $datum->cursor->right->isDown ],
                    'down'  => [ 'isDown' => $datum->cursor->down->isDown  ],
                    'left'  => [ 'isDown' => $datum->cursor->left->isDown  ],
                ],

                'x' => $datum->x,
                'y' => $datum->y,
            ];
        }

        return $data;
    }

    /**
     * When a new connection is opened it will be passed to this method
     *
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    public function onOpen(ConnectionInterface $conn)
    {
        if (!$this->auth($conn))
        {
            $this->onError($conn, new \Exception('Denied'));
            return;
        }

        parent::onOpen($conn);

        $this->connectUser($conn);
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->disconnectUser($conn);

        unset($this->data[$conn->resourceId]);

        parent::onClose($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $this->disconnectUser($conn);

        parent::onError($conn, $e);
    }

    public function connectUser(ConnectionInterface $conn)
    {
        $user = $this->getUser($conn);

        if (!$user)
        {
            $this->onError($conn, new \Exception('User connection error'));
            return;
        }

        $user->online = true;
        $user->save();

        $pos = Position::where('positionable_id', $user->id)->get()->first();

        $player = [
            'id' => $conn->resourceId,

            'cursor' => [
                'up'    => [ 'isDown' => false ],
                'right' => [ 'isDown' => false ],
                'down'  => [ 'isDown' => false ],
                'left'  => [ 'isDown' => false ],
            ],

            'x' => $pos->x ?? 100,
            'y' => $pos->y ?? 100,
        ];

        $temp = json_encode($player);

        $this->data[$conn->resourceId] = json_decode($temp);

        $conn->send(json_encode([
            'event' => 'connected',
            'player' => $player,
            'players' => $this->getConnectionsData()
        ]));

        $this->onMessage($conn, $temp);

        echo 'User connected: ' . $user->id . PHP_EOL;
    }

    public function disconnectUser(ConnectionInterface $conn)
    {
        $user = $this->getUser($conn);

        if (!$user)
        {
            return;
        }

        $user->online = false;
        $user->save();

        if (Position::where('positionable_id', $user->id)->count())
        {
            $user->positions()->update([
                'x' => $this->data[$conn->resourceId]->x,
                'y' => $this->data[$conn->resourceId]->y,
            ]);
        }
        else
        {
            $position = new Position([
                'id' => $user->id,

                'x' => $this->data[$conn->resourceId]->x,
                'y' => $this->data[$conn->resourceId]->y,
            ]);

            $user->positions()->save($position);
        }
    }
}
