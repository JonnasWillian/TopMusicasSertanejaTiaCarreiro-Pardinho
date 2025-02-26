<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Database\Factories\RankMusicaFactory;

class Rank_musica extends Model
{
    use HasFactory, Notifiable;

    // Registre a factory manualmente
    protected static function newFactory()
    {
        return RankMusicaFactory::new();
    }

    protected $table = 'rank_musicas';

    protected $fillable = [
        'nome',
        'link',
        'nota',
        'status',
        'usuario_id',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
