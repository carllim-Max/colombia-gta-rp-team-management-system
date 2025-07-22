# API Documentation - Colombia GTA RP Team System

Este documento descreve todas as APIs que precisam ser implementadas no backend para que o sistema funcione completamente.

## Autenticação

### POST /api/auth/login
Autentica um usuário existente.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/signup
Registra um novo usuário.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### GET /api/auth/verify
Verifica se o token JWT é válido.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (Success):**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Gerenciamento de Membros

### POST /api/get-member
Verifica se o usuário é membro da equipe.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "userId": "user_id"
}
```

**Response (Success):**
```json
{
  "member": {
    "id": "member_id",
    "nickname": "PlayerNickname",
    "is_approved": true,
    "role": "member", // ou "admin"
    "user_name": "User Name",
    "user_email": "user@example.com",
    "joined_at": "2024-01-01T00:00:00Z",
    "approved_at": "2024-01-01T00:00:00Z",
    "approved_by_name": "Admin Name"
  }
}
```

**Response (Not a member):**
```json
{
  "member": null
}
```

### POST /api/join-team
Solicita entrada na equipe.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "nickname": "PlayerNickname"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Solicitação enviada com sucesso"
}
```

### POST /api/get-team-members
Lista todos os membros da equipe (apenas para admins).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (Success):**
```json
{
  "members": [
    {
      "id": "member_id",
      "nickname": "PlayerNickname",
      "is_approved": true,
      "role": "member",
      "user_name": "User Name",
      "user_email": "user@example.com",
      "joined_at": "2024-01-01T00:00:00Z",
      "approved_at": "2024-01-01T00:00:00Z",
      "approved_by_name": "Admin Name"
    }
  ]
}
```

### POST /api/approve-member
Aprova um membro pendente (apenas para admins).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "member_id": "member_id"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Membro aprovado com sucesso"
}
```

## Chat

### POST /api/get-messages
Obtém mensagens do chat.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (Success):**
```json
{
  "messages": [
    {
      "id": "message_id",
      "message": "Mensagem do chat",
      "author_nickname": "PlayerNickname",
      "author_role": "member", // ou "admin"
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/send-message
Envia uma mensagem no chat.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "message": "Mensagem do chat"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}
```

## Clips

### POST /api/get-clips
Obtém lista de clips.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (Success):**
```json
{
  "clips": [
    {
      "id": "clip_id",
      "title": "Título do Clip",
      "description": "Descrição do clip",
      "video_url": "https://youtube.com/watch?v=...",
      "thumbnail_url": "https://img.youtube.com/vi/.../maxresdefault.jpg",
      "author_nickname": "PlayerNickname",
      "likes_count": 15,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/post-clip
Posta um novo clip.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "Título do Clip",
  "description": "Descrição do clip",
  "video_url": "https://youtube.com/watch?v=...",
  "thumbnail_url": "https://img.youtube.com/vi/.../maxresdefault.jpg"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Clip postado com sucesso"
}
```

## Estrutura do Banco de Dados

### Tabela: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: team_members
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  nickname VARCHAR(100) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'member', -- 'member' ou 'admin'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id)
);
```

### Tabela: chat_messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: clips
```sql
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Middleware de Autenticação

Todas as rotas protegidas devem verificar:
1. Presença do token JWT no header Authorization
2. Validade do token
3. Existência do usuário no banco de dados
4. Para rotas de admin: verificar se o usuário tem role 'admin'

## Exemplo de Implementação (Node.js/Express)

```javascript
// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const requireAdmin = async (req, res, next) => {
  try {
    const member = await getMemberByUserId(req.user.id);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Admin requerido.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
```

## Notas Importantes

1. **Segurança**: Sempre validar e sanitizar dados de entrada
2. **Rate Limiting**: Implementar rate limiting nas APIs de chat e posts
3. **Validação**: Validar URLs de vídeos e thumbnails
4. **Logs**: Implementar logs para auditoria de ações administrativas
5. **Backup**: Configurar backup automático do banco de dados
6. **CORS**: Configurar CORS adequadamente para o frontend
7. **HTTPS**: Usar HTTPS em produção
8. **Variáveis de Ambiente**: Nunca commitar secrets no código

## Tecnologias Recomendadas

- **Backend**: Node.js com Express ou Python com FastAPI
- **Banco de Dados**: PostgreSQL ou MySQL
- **Autenticação**: JWT
- **ORM**: Prisma (Node.js) ou SQLAlchemy (Python)
- **Validação**: Joi (Node.js) ou Pydantic (Python)
- **Deploy**: Docker + Docker Compose
