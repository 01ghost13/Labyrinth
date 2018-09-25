<?php

namespace App\Http\Controllers;

use App\Position;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    /**
     * Set player data
     *
     * @param Request $request
     *
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function set(Request $request)
    {
        $user = \Auth::user();

        if (Position::where('positionable_id', $user->id)->count())
        {
            $user->positions()->update([
                'x' => $request->input('x'),
                'y' => $request->input('y'),
            ]);
        }
        else
        {
            $position = new Position([
                'id' => $user->id,

                'x' => $request->input('x'),
                'y' => $request->input('y'),
            ]);

            $user->positions()->save($position);
        }

        SocketController::disconnect($user);

        return response('', 200);
    }

    /**
     * Get player data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function get()
    {
        $pos = Position::where('positionable_id', \Auth::user()->id)->get()->first();

        return response()->json([
            'x' => $pos->x ?? 100,
            'y' => $pos->y ?? 100,
        ]);
    }
}
