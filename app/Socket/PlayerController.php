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

        //usleep(100000);

        /*event(
            new DataFromUser($from, $msg)
        );*/
        $data = json_decode($msg);

        $this->data[$data->id] = $data;

        foreach ($this->connections as $connection)
        {
            $data = [];

            foreach ($this->data as $datum)
            {
                $data['players'][] = [
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

            $connection->send(json_encode($data));

            //if ($connection !== $from)
            //{
                //$connection->send($msg);
            //}
        }
    }
}
