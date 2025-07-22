import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Simular verificação de credenciais (substitua pela lógica real do seu backend)
    // Para teste, aceita qualquer email/senha
    const mockUser = {
      id: `user_${Date.now()}`,
      name: 'Usuário Teste',
      email
    };

    // Simular token JWT (substitua pela lógica real do seu backend)
    const mockToken = `mock_token_${Date.now()}`;

    return NextResponse.json({
      token: mockToken,
      user: mockUser
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
