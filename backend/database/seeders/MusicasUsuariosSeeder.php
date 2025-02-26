<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MusicasUsuariosSeeder extends Seeder
{
    public function run(): void
    {
        // Inserir usuário
        DB::table('usuarios')->insert([
            'nome' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => '$2y$12$ouaFtTSIn4zpUKQlGbhT/.1Vy9vhi6u6LptPQWRvlIZarKOUe9Jge',
            'status' => '1',
            'created_at' => '2025-02-24 17:27:45',
            'updated_at' => '2025-02-24 17:27:45'
        ]);

        DB::table('rank_musicas')->insert([
            [
                'nome' => 'Boi Soberano',
                'link' => 'https://www.youtube.com/watch?v=lkQaLTnmNFw',
                'nota' => 6,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 11:07:54',
                'updated_at' => '2025-02-23 11:07:54'
            ],
            [
                'nome' => 'Pagode em Brasília',
                'link' => 'https://www.youtube.com/watch?v=lpGGNA6_920',
                'nota' => 5,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 18:17:55',
                'updated_at' => '2025-02-23 18:17:55'
            ],
            [
                'nome' => 'A Moda da Mula Preta',
                'link' => 'https://www.youtube.com/watch?v=rorOMoS6ugs&pp=ygUtdGlhbyBjYXJyZWlybyBlIHBhcmRpbmhvIEEgTW9kYSBkYSBNdWxhIFByZXRh',
                'nota' => 4,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 18:20:06',
                'updated_at' => '2025-02-23 18:20:06'
            ],
            [
                'nome' => 'Linha de Frente',
                'link' => 'https://www.youtube.com/watch?v=s6mSUIdj8H4&pp=ygUodGlhbyBjYXJyZWlybyBlIHBhcmRpbmhvIExpbmhhIGRlIEZyZW50ZQ%3D%3D',
                'nota' => 3,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 18:21:26',
                'updated_at' => '2025-02-23 18:21:26'
            ],
            [
                'nome' => 'Frio da Madrugada',
                'link' => 'https://www.youtube.com/watch?v=zz3vQOlJ1Vc&pp=ygUqdGlhbyBjYXJyZWlybyBlIHBhcmRpbmhvIEZyaW8gZGEgTWFkcnVnYWRh',
                'nota' => 2,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 18:22:21',
                'updated_at' => '2025-02-23 18:22:21'
            ],
            [
                'nome' => 'Rei do Gado',
                'link' => 'https://www.youtube.com/watch?v=YQHcAQaC6EU&pp=ygUkdGlhbyBjYXJyZWlybyBlIHBhcmRpbmhvIFJlaSBkbyBHYWRv',
                'nota' => 1,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 18:24:19',
                'updated_at' => '2025-02-23 18:24:19'
            ],
            [
                'nome' => 'Exemplo de humildedade',
                'link' => 'https://www.youtube.com/watch?v=pBrSVpCFIZ0',
                'nota' => 1,
                'status' => '1',
                'usuario_id' => 1,
                'created_at' => '2025-02-23 18:25:11',
                'updated_at' => '2025-02-23 18:25:11'
            ]
        ]);
    }
}