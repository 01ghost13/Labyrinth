<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PanelController extends Controller
{
    /**
     * Show the admin panel.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke()
    {
        return view('admin.index');
    }
}
