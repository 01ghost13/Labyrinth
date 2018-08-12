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
 * Ajax-only area
 */
Route::group(['middleware' => ['ajax']], function() {

    Route::post('/map/get', 'MapController@get')->name('getMap');
    Route::post('/map/set', 'MapController@set')->name('setMap');

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
