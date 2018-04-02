<?php

namespace App\Http\Middleware;

use Closure;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (\Auth::check() and \Auth::user()->isAdmin() == true)
        {
            return $next($request);
        }

        return response('Who is it?')->setStatusCode(403);
    }
}
