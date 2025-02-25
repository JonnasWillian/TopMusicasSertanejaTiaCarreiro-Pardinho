<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Rank_musica;
use App\Http\Controllers\Usuario;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Usuário
Route::get('/usuario', [Usuario::class, 'view']);
Route::post('/usuario', [Usuario::class, 'create']);
Route::put('/usuario/{id}', [Usuario::class, 'update']);
Route::delete('/usuario/{id}', [Usuario::class, 'destroy']);
Route::post('/login', [Usuario::class, 'login']);
Route::post('/logout', [Usuario::class, 'logout']);
Route::get('/me', [Usuario::class, 'me']);

// Rank das músicas
Route::get('/musicaTop5', [Rank_musica::class, 'viewTop5']);
Route::get('/musicaEspera', [Rank_musica::class, 'viewEspera']);
Route::get('/musica', [Rank_musica::class, 'view']);
Route::post('/musica', [Rank_musica::class, 'create']);
Route::put('/musica/{id}', [Rank_musica::class, 'update']);
Route::put('/musicaDelete/{id}', [Rank_musica::class, 'destroy']);
Route::put('/musicaAprovacao/{id}', [Rank_musica::class, 'aprovacao']);