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

    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Mensagem não pode estar vazia' },
        { status: 400 }
      );
    }

    // Simular envio de mensagem (substitua pela lógica real do seu backend)
    // Aqui você salvaria a mensagem no banco de dados
    
    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso'
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
