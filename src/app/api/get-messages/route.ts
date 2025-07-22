import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Token de acesso requerido' },
        { status: 401 }
      );
    }

    // Simular mensagens do chat (substitua pela lógica real do seu backend)
    const mockMessages = [
      {
        id: '1',
        message: 'Bem-vindos ao chat da Colombia! 🎮',
        author_nickname: 'AdminColombia',
        author_role: 'admin',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        message: 'Operação hoje às 21h, todos confirmem presença!',
        author_nickname: 'LiderOperacoes',
        author_role: 'member',
        created_at: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '3',
        message: 'Confirmado! Vamos dominar a cidade 🔥',
        author_nickname: 'SoldadoColombia',
        author_role: 'member',
        created_at: new Date(Date.now() - 900000).toISOString()
      }
    ];

    return NextResponse.json({
      messages: mockMessages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
