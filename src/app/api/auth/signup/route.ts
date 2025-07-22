import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Simular criação de usuário (substitua pela lógica real do seu backend)
    const mockUser = {
      id: `user_${Date.now()}`,
      name,
      email
    };

    // Simular token JWT (substitua pela lógica real do seu backend)
    const mockToken = `mock_token_${Date.now()}`;

    return NextResponse.json({
      token: mockToken,
      user: mockUser
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
