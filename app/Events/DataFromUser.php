<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Ratchet\ConnectionInterface;

class DataFromUser
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var ConnectionInterface
     */
    public $from;

    /**
     * @var object
     */
    public $data;

    /**
     * Create a new event instance.
     *
     * @param ConnectionInterface $from
     * @param string $msg
     */
    public function __construct(ConnectionInterface $from, string $msg)
    {
        $this->data = json_decode($msg);
        $this->from = $from;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
