<?php

namespace Database\Factories;

use App\Models\Rank_musica;
use Illuminate\Database\Eloquent\Factories\Factory;

class RankMusicaFactory extends Factory
{
    protected $model = Rank_musica::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->sentence,
            'link' => $this->faker->url,
            'usuario_id' => \App\Models\Usuario::factory(),
            'nota' => $this->faker->numberBetween(5, 10),
            'status' => $this->faker->boolean,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}