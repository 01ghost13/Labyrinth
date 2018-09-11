<?php

namespace App\Socket\Base;


use App\User;
use Illuminate\Session\SessionManager;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

abstract class Socket implements MessageComponentInterface
{
    /**
     * @var array - connection list
     */
    protected $connections = [];

    /**
     * @var array - users list
     */
    protected $users = [];

    /**
     * When a new connection is opened it will be passed to this method
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->connections[$conn->resourceId] = $conn;

        echo 'New connection: ' . $conn->resourceId . PHP_EOL;
    }

    /**
     * This is called before or after a socket is closed (depends on how it's closed).  SendMessage to $conn will not result in an error if it has already been closed.
     * @param  ConnectionInterface $conn The socket/connection that is closing/closed
     * @throws \Exception
     */
    public function onClose(ConnectionInterface $conn)
    {
        if (isset($this->users[$conn->resourceId]))
        {
            unset($this->users[$conn->resourceId]);
        }

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
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo 'An error has occurred: ' . $e->getMessage() . PHP_EOL;

        if (isset($this->users[$conn->resourceId]))
        {
            unset($this->users[$conn->resourceId]);
        }

        unset($this->connections[$conn->resourceId]);

        $conn->close();
    }

    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $from The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        //echo 'Connection ' . $from->resourceId . ' sending message "' . $msg . '" to ' . (\count($this->connections) - 1) . ' other connections' . PHP_EOL;
    }

    /**
     * User authorization
     *
     * @param ConnectionInterface $conn
     * @return bool
     */
    protected function auth(ConnectionInterface $conn): bool
    {
        $cookies       = self::parseCookie($conn);
        $conn->session = (new SessionManager(\App::getInstance()))->driver();

        $conn->session->setId(
            \Crypt::decrypt($cookies[\Config::get('session.cookie')])
        );

        $conn->session->start();

        $this->users[$conn->resourceId] = User::find(
            $conn->session->get(\Auth::getName())
        );

        return (bool)$this->users[$conn->resourceId];
    }

    /**
     * Get the user from the list
     *
     * @param ConnectionInterface $conn
     * @return User|null
     */
    protected function getUser(ConnectionInterface $conn): ?User
    {
        return $this->users[$conn->resourceId] ?? null;
    }

    /**
     * Parsing data with cookies
     *
     * @param ConnectionInterface $conn
     * @return array
     */
    protected static function parseCookie(ConnectionInterface $conn): array
    {
        $cookies = $conn->httpRequest->getHeader('Cookie')[0]; // always 0?

        $cookies = array_map(function ($elem) {
            return urldecode(trim($elem));
        }, explode(';', $cookies));

        $result = [];

        foreach ($cookies as $cookie)
        {
            list($key, $val) = explode('=', $cookie);

            $result[$key] = $val;
        }

        return $result;
    }
}
