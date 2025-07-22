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

    const { nickname } = await request.json();

    if (!nickname) {
      return NextResponse.json(
        { error: 'Nickname é obrigatório' },
        { status: 400 }
      );
    }

    // Simular criação de solicitação de entrada na equipe
    // (substitua pela lógica real do seu backend)
    
    return NextResponse.json({
      success: true,
      message: 'Solicitação enviada com sucesso'
    });

  } catch (error) {
    console.error('Join team error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
