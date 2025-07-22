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

    const { userId } = await request.json();

    // Simular verificação de membro (substitua pela lógica real do seu backend)
    // Para demonstração, simula um membro aprovado para testar o dashboard
    const mockMember = {
      id: 'member_123',
      nickname: 'TesteColombia',
      is_approved: true,
      role: 'admin', // Mude para 'member' se quiser testar como membro normal
      user_name: 'Usuário Teste',
      user_email: 'teste@colombia.com',
      joined_at: '2024-01-01T00:00:00Z',
      approved_at: '2024-01-01T00:00:00Z',
      approved_by_name: 'Admin Sistema'
    };
    
    return NextResponse.json({
      member: mockMember
    });

  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
