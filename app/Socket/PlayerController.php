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

        foreach ($this->connections as $connection)
        {
            $data = [];

            foreach ($this->data as $datum)
            {
                $data[] = [
                    'id' => $datum->id,

                    'x' => $datum->x,
                    'y' => $datum->y,
                ];
            }
            /*
            $positions = Position::all();
            $data = [];

            foreach ($positions as $position)
            {
                $data['players'][] = [
                    'id' => $position->positionable_id,

                    'x' => $position->x,
                    'y' => $position->y,
                ];
            }*/

            $connection->send(json_encode([
                'event'   => 'message',
                'players' => $data,
            ]));

            //if ($connection !== $from)
            //{
                //$connection->send($msg);
            //}
        }
    }

    /**
     * When a new connection is opened it will be passed to this method
     *
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    public function onOpen(ConnectionInterface $conn)
    {
        parent::onOpen($conn);

        if (!$this->auth($conn))
        {
            $this->onError($conn, new \Exception('Denied'));
            return;
        }

        echo 'User: ' . $this->getUser($conn)->id . PHP_EOL;

        $pos = Position::where('positionable_id', $this->getUser($conn)->id)->get()->first();

        $conn->send(json_encode([
            'event' => 'connected',
            'player' => [
                'id' => $conn->resourceId,

                'x' => $pos->x ?? 100,
                'y' => $pos->y ?? 100,
            ]
        ]));
    }

    public function onClose(ConnectionInterface $conn)
    {
        $user = $this->getUser($conn);

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

        unset($this->data[$conn->resourceId]);


        parent::onClose($conn);
    }
}
