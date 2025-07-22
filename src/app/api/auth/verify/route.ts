import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Token de acesso requerido' },
        { status: 401 }
      );
    }

    // Simular verificação de token (substitua pela lógica real do seu backend)
    if (token.startsWith('mock_token_')) {
      const mockUser = {
        id: 'user_123',
        name: 'Usuário Teste',
        email: 'teste@colombia.com'
      };

      return NextResponse.json({ user: mockUser });
    }

    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 403 }
    );

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
