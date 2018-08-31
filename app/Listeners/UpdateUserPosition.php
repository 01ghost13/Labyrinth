<?php

namespace App\Listeners;

use App\Events\DataFromUser;
use App\Position;
use App\User;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateUserPosition
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  DataFromUser  $event
     * @return void
     */
    public function handle(DataFromUser $event)
    {
        // TODO: wtf is this?
        if (Position::where('positionable_id', $event->data->id)->count())
        {
            User::find($event->data->id)->positions()->update([
                'x' => $event->data->x,
                'y' => $event->data->y
            ]);
        }
        else
        {
            $position = new Position([
                'id' => $event->data->id,

                'x' => $event->data->x,
                'y' => $event->data->y,
            ]);

            User::find($event->data->id)->positions()->save($position);
        }
    }
}
