<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Rank_musica;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RankMusicaControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $usuario;

    protected function setUp(): void
    {
        parent::setUp();

        $this->usuario = Usuario::factory()->create([
            'id' => 1,
        ]);
    }

    public function test_create()
    {
        $data = [
            'nome' => 'Nova Música',
            'link' => 'https://example.com',
            'usuario_id' => $this->usuario->id,
        ];

        $response = $this->postJson('/api/musica', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('rank_musicas', $data);
    }

    public function test_viewTop5()
    {
        Rank_musica::factory()->count(10)->create([
            'usuario_id' => $this->usuario->id,
            'nota' => 5,
            'status' => 1,
        ]);

        $response = $this->getJson('/api/musicaTop5');

        $response->assertStatus(200);

        $this->assertGreaterThanOrEqual(5, count($response->json()));
    }
}