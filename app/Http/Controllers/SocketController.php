<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class SocketController extends Controller
{
    /**
     * Player authorization
     *
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function auth()
    {
        $user = \Auth::user();

        if ($user->online)
        {
            return response('', 401);
        }

        self::connect($user);

        return response('', 200);
    }

    /**
     * Connect player
     *
     * @param User $user
     */
    public static function connect(User $user)
    {
        $user->online = true;
        $user->save();
    }

    /**
     * Disconnect player
     *
     * @param User $user
     */
    public static function disconnect(User $user)
    {
        $user->online = false;
        $user->save();
    }
}
