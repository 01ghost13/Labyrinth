<?php

namespace App\Socket;


use App\Events\DataFromUser;
use App\Position;
use App\Socket\Base\Socket;
use Ratchet\ConnectionInterface;

class PlayerController extends Socket
{
    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $from The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        parent::onMessage($from, $msg);

        event(
            new DataFromUser($from, $msg)
        );

        foreach ($this->connections as $connection)
        {
            $positions = Position::all();
            $data = [];

            foreach ($positions as $position)
            {
                $data['players'][] = [
                    'id' => $position->positionable_id,

                    'x' => $position->x,
                    'y' => $position->y,
                ];
            }

            $connection->send(json_encode($data));

            //if ($connection !== $from)
            //{
                //$connection->send($msg);
            //}
        }
    }
}
