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
        //
    }
}
