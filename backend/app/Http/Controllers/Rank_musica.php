<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Rank_musica AS Musica;

class Rank_musica extends Controller
{
    public function viewTop5()
    {
        $musicas = Musica::where('nota', '!=', '1')
            ->where('status', 1)
            ->orderBy('nota', 'desc')
            ->get();
        
        return response()->json($musicas);
    }


    public function viewEspera()
    {
        $musicas = Musica::where('status', 0)
            ->orderBy('created_at', 'asc')
            ->get();
        
        return response()->json($musicas);
    }


    public function view()
    {
        $musicas = Musica::where('nota', '=', '1')
            ->where('status', 1)
            ->orderBy('created_at', 'asc')
            ->get();
        
        return response()->json($musicas);
    }


    public function create(Request $request)
    {
        try {
            $validateRequest = $request->validate([
                'nome' => 'required|string',
                'link' => 'required|string',
                'usuario_id' => 'required',
            ]);

            Musica::create($validateRequest);

            return response()->json(['message' => 'Música cadastrada com sucesso'], 201);
        } catch (\Illuminate\Validation\ValidationException $error) {
            return response()->json([
                'erros' => $error->errors()
            ], 422);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $musica = Musica::findOrFail($id);
            
            $validateRequest = $request->validate([
                'nome' => 'required',
                'link' => 'required|string',
            ]);

            $musica->update($validateRequest);

            return response()->json(['message' => 'Música atualizada com sucesso'], 201);
        } catch (\Illuminate\Validation\ValidationException $error) {
            return response()->json([
                'erros' => $error->errors()
            ], 422);
        } catch (\Exception $error) {
            return response()->json(['error' => 'Usuário não encontrado'], 201);
        }
    }


    public function destroy(Request $request, $id)
    {
        try {
            $musica = Musica::findOrFail($id);
            $atualizacao = ['status' => 0];
            $musica->update($atualizacao);

            return response()->json(['message' => 'Música deletada com sucesso'], 201);
        } catch (\Illuminate\Validation\ValidationException $error) {
            return response()->json([
                'erros' => $error->errors()
            ], 422);
        } catch (\Exception $error) {
            return response()->json(['error' => 'Usuário não encontrado'], 201);
        }
    }


    public function aprovacao(Request $request, $id)
    {
        try {
            $musica = Musica::findOrFail($id);
            $atualizacao = ['status' => 1];
            $musica->update($atualizacao);

            return response()->json(['message' => 'Música deletada com sucesso'], 201);
        } catch (\Illuminate\Validation\ValidationException $error) {
            return response()->json([
                'erros' => $error->errors()
            ], 422);
        } catch (\Exception $error) {
            return response()->json(['error' => 'Usuário não encontrado'], 201);
        }
    }
}
