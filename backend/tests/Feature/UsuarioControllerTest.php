<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UsuarioControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_login()
    {
        $user = Usuario::factory()->create([
            'nome' => 'teste',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $data = [
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $data);

        $response->assertStatus(200);

        $response->assertJsonStructure(['token']);
    }

    public function test_create()
    {
        $data = [
            'nome' => 'Novo Usuário',
            'email' => 'novo@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/usuario', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('usuarios', [
            'nome' => 'Novo Usuário',
            'email' => 'novo@example.com',
        ]);
    }
}