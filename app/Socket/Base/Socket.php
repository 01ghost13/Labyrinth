<?php

namespace App\Socket\Base;


use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

abstract class Socket implements MessageComponentInterface
{
    /**
     * @var array - connection list
     */
    protected $connections = [];

    /**
     * When a new connection is opened it will be passed to this method
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    function onOpen(ConnectionInterface $conn)
    {
        $this->connections[$conn->resourceId] = $conn;

        echo 'New connection: ' . $conn->resourceId . PHP_EOL;
    }

    /**
     * This is called before or after a socket is closed (depends on how it's closed).  SendMessage to $conn will not result in an error if it has already been closed.
     * @param  ConnectionInterface $conn The socket/connection that is closing/closed
     * @throws \Exception
     */
    function onClose(ConnectionInterface $conn)
    {
        unset($this->connections[$conn->resourceId]);

        echo 'Connection ' . $conn->resourceId . ' has disconnected' . PHP_EOL;
    }

    /**
     * If there is an error with one of the sockets, or somewhere in the application where an Exception is thrown,
     * the Exception is sent back down the stack, handled by the Server and bubbled back up the application through this method
     * @param  ConnectionInterface $conn
     * @param  \Exception $e
     * @throws \Exception
     */
    function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo 'An error has occurred: ' . $e->getMessage() . PHP_EOL;

        unset($this->connections[$conn->resourceId]);

        $conn->close();
    }

    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $from The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    function onMessage(ConnectionInterface $from, $msg)
    {
        //echo 'Connection ' . $from->resourceId . ' sending message "' . $msg . '" to ' . (\count($this->connections) - 1) . ' other connections' . PHP_EOL;
    }
}
