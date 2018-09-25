<?php

/*
 * Authentication
 */
Auth::routes();

/*
 * Index
 */
Route::get('/', function () {
    return view('index');
})->name('index');


/*
 * WebSocket area
 */
Route::group(['prefix' => 'ws', 'middleware' => ['auth']], function() {

    Route::post('/auth', 'SocketController@auth');

    Route::post('/player/get', 'PlayerController@get');
    Route::post('/player/set', 'PlayerController@set');
});


/*
 * User area
 */
Route::group(['middleware' => ['auth']], function() {

    /*
     * Game
     */
    Route::get('/game', 'GameController@index')->name('game');
});


/*
 * Admin area
 */
Route::group(['prefix' => 'admin', 'middleware' => ['admin', 'auth'], 'namespace' => 'Admin'], function() {

    /*
     * Admin panel
     */
    Route::get('/', 'PanelController')->name('admin-index');
});
