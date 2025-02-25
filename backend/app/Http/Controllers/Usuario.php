<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario AS User;
use Illuminate\Validation\ValidationException;

class Usuario extends Controller
{
    public function view()
    {
        $usuairos = User::all();
        
        return response()->json($usuairos);
    }

    public function create(Request $request)
    {
        try {
            $validateRequest = $request->validate([
                'nome' => 'required|string|min:5',
                'email' => 'required|email|unique:usuarios,email',
                'password' => 'required|string|min:7',
                'status' => 'nullable|string',
            ]);

            User::create($validateRequest);

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
            $usuairo = User::findOrFail($id);
            
            $validateRequest = $request->validate([
                'nome' => 'required|string|min:5',
                'email' => 'required|email|unique:usuarios,email',
                'password' => 'required|string|min:7',
                'status' => 'nullable|string',
            ]);

            $usuairo->update($validateRequest);

            return response()->json(['message' => 'Usuário atualizado com sucesso'], 201);
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
            $usuairo = User::findOrFail($id);
            $usuairo->delete();

            return response()->json(['message' => 'Usuário deletado com sucesso'], 201);
        } catch (\Illuminate\Validation\ValidationException $error) {
            return response()->json([
                'erros' => $error->errors()
            ], 422);
        } catch (\Exception $error) {
            return response()->json(['error' => 'Usuário não encontrado'], 201);
        }
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            
            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Credenciais inválidas.'],
                ]);
            }

            $user->tokens()->delete();
            
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login realizado com sucesso',
                'user' => $user,
                'token' => $token
            ]);
            
        } catch (ValidationException $error) {
            return response()->json([
                'errors' => $error->errors()
            ], 422);
        } catch (\Exception $error) {
            return response()->json([
                'error' => 'Erro ao realizar login: ' . $error->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Logout realizado com sucesso'
            ]);
        } catch (\Exception $error) {
            return response()->json([
                'error' => 'Erro ao realizar logout: ' . $error->getMessage()
            ], 500);
        }
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
