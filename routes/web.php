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
 * Game
 */
Route::get('/game', 'GameController@index')->name('game');

/*
 * Admin area
 */
Route::group(['prefix' => 'admin', 'middleware' => ['admin', 'auth'], 'namespace' => 'Admin'], function() {

    /*
     * Admin panel
     */
    Route::get('/', 'PanelController')->name('admin-index');
});
