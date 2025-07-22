"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";

interface Member {
  id: string;
  nickname: string;
  is_approved: boolean;
  role: string;
  user_name?: string;
  user_email?: string;
  joined_at?: string;
  approved_at?: string;
  approved_by_name?: string;
}

interface Message {
  id: string;
  message: string;
  author_nickname: string;
  author_role: string;
  created_at: string;
}

interface Clip {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  author_nickname: string;
  likes_count: number;
  created_at: string;
}

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const { isReady, isAuthenticated } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberChecked, setMemberChecked] = useState(false);

  // Verificar se o usuário é membro da equipe
  useEffect(() => {
    const checkMembership = async () => {
      if (!user || memberChecked) return;

      setMemberLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch("/api/get-member", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            console.error("Error checking membership:", data.error);
            setMember(null);
          } else {
            setMember(data.member);
          }
        } else {
          console.error("Failed to check membership");
          setMember(null);
        }
      } catch (error) {
        console.error("Error checking membership:", error);
        setMember(null);
      } finally {
        setMemberLoading(false);
        setMemberChecked(true);
      }
    };

    if (isReady && isAuthenticated && user && !memberChecked) {
      checkMembership();
    } else if (isReady && !isAuthenticated) {
      setMemberLoading(false);
      setMemberChecked(true);
    }
  }, [user, isReady, isAuthenticated, memberChecked]);

  // Loading state
  if (!isReady || userLoading || (isAuthenticated && memberLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  // Not authenticated - Show welcome screen with signup focus
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
              COLOMBIA
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Equipe de GTA RP - Entre para a Família
            </p>
            <div className="space-y-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User authenticated but not a member
  if (!member) {
    return <JoinTeamForm onSuccess={() => setMemberChecked(false)} />;
  }

  // Member not approved yet
  if (!member.is_approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-yellow-500">
              Aguardando Aprovação
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Olá {member.nickname}! Sua solicitação para entrar na equipe
              Colombia está pendente de aprovação.
            </p>
            <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
              <p className="text-gray-400">
                Você será notificado quando um administrador aprovar sua entrada
                na equipe.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  // Approved member - show main dashboard
  return <Dashboard member={member} />;
}

// Componente para botões de autenticação
function AuthButtons() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />;
  }

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />;
  }

  return (
    <>
      <button
        onClick={() => setShowSignup(true)}
        className="inline-block bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
      >
        🎮 CADASTRAR AGORA
      </button>
      <div className="text-gray-400">
        Já tem conta?{" "}
        <button
          onClick={() => setShowLogin(true)}
          className="text-yellow-500 hover:text-yellow-400 underline"
        >
          Entrar aqui
        </button>
      </div>
    </>
  );
}

// Componente de Login
function LoginForm({ onBack, onSwitchToSignup }: { onBack: () => void; onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Email ou senha incorretos");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Senha"
            required
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-600 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div className="text-center space-y-2">
        <button
          onClick={onSwitchToSignup}
          className="text-yellow-500 hover:text-yellow-400 underline"
        >
          Não tem conta? Cadastre-se
        </button>
        <br />
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

// Componente de Cadastro
function SignupForm({ onBack, onSwitchToLogin }: { onBack: () => void; onSwitchToLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await signup(name, email, password);
    if (!success) {
      setError("Erro ao criar conta. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Nome completo"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Senha"
            required
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-600 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <div className="text-center space-y-2">
        <button
          onClick={onSwitchToLogin}
          className="text-yellow-500 hover:text-yellow-400 underline"
        >
          Já tem conta? Entre aqui
        </button>
        <br />
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

// Componente de Logout
function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button
      onClick={logout}
      className="inline-block mt-8 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
    >
      Sair
    </button>
  );
}

// Componente para formulário de entrada na equipe
function JoinTeamForm({ onSuccess }: { onSuccess: () => void }) {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch("/api/join-team", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      }
    } catch (error) {
      setError("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-500">
            Bem-vindo à Colombia! 🎉
          </h1>
          <p className="text-xl text-gray-300">
            Sua solicitação foi enviada e está aguardando aprovação.
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-sm text-gray-400 mt-2">Atualizando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
              COLOMBIA
            </h1>
            <p className="text-xl text-gray-300">Complete seu Cadastro</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seu Nickname no GTA RP
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                placeholder="Digite seu nickname"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-600 rounded-lg text-white">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Enviando..." : "🚀 Entrar na Equipe"}
            </button>
          </form>

          <div className="text-center mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard principal para membros aprovados
function Dashboard({ member }: { member: Member }) {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                COLOMBIA
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-yellow-500 font-semibold">
                {member.nickname}
              </span>
              {member.role === "admin" && (
                <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "chat"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-comments mr-2"></i>
              Chat ao Vivo
            </button>
            <button
              onClick={() => setActiveTab("clips")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "clips"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-video mr-2"></i>
              Clips
            </button>
            <button
              onClick={() => setActiveTab("momentos")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "momentos"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-star mr-2"></i>
              Melhores Momentos
            </button>
            <button
              onClick={() => setActiveTab("guerra")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "guerra"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-fire mr-2"></i>
              Guerra
            </button>
            {member.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "admin"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <i className="fas fa-users-cog mr-2"></i>
                Admin
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "chat" && <ChatSection member={member} />}
        {activeTab === "clips" && <ClipsSection member={member} />}
        {activeTab === "momentos" && <MelhoresMomentosSection member={member} />}
        {activeTab === "guerra" && <GuerraSection member={member} />}
        {activeTab === "admin" && member.role === "admin" && <AdminSection />}
      </main>
    </div>
  );
}

// Seção de Chat ao Vivo
function ChatSection({ member }: { member: Member }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
    // Auto-refresh messages every 3 seconds for live chat
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch("/api/get-messages", { 
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessages(data.messages || []);
      }
    } catch (error) {
      setError("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setNewMessage("");
        loadMessages(); // Reload messages
      }
    } catch (error) {
      setError("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <div className="text-white text-xl">Conectando ao chat...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">💬 Chat ao Vivo</h2>
        <div className="flex items-center space-x-2 text-green-500">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <i className="fas fa-comments text-4xl mb-4"></i>
            <p>Chat vazio. Seja o primeiro a falar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {message.author_nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-yellow-500">
                      {message.author_nickname}
                    </span>
                    {message.author_role === "admin" && (
                      <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
                        ADMIN
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Message Form */}
      <form onSubmit={handleSendMessage} className="bg-gray-800 rounded-lg p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-600 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Digite sua mensagem..."
            maxLength={1000}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {sending ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Placeholder para outras seções
function ClipsSection({ member }: { member: Member }) {
  return (
    <div className="text-center py-16">
      <i className="fas fa-video text-6xl text-gray-600 mb-4"></i>
      <h3 className="text-xl font-bold mb-4">Seção de Clips</h3>
      <p className="text-gray-400">Esta seção será implementada com seu backend real.</p>
    </div>
  );
}

function MelhoresMomentosSection({ member }: { member: Member }) {
  return (
    <div className="text-center py-16">
      <i className="fas fa-star text-6xl text-gray-600 mb-4"></i>
      <h3 className="text-xl font-bold mb-4">Melhores Momentos</h3>
      <p className="text-gray-400">Esta seção será implementada com seu backend real.</p>
    </div>
  );
}

function GuerraSection({ member }: { member: Member }) {
  return (
    <div className="text-center py-16">
      <i className="fas fa-fire text-6xl text-gray-600 mb-4"></i>
      <h3 className="text-xl font-bold mb-4">Guerra</h3>
      <p className="text-gray-400">Esta seção será implementada com seu backend real.</p>
    </div>
  );
}

function AdminSection() {
  return (
    <div className="text-center py-16">
      <i className="fas fa-users-cog text-6xl text-gray-600 mb-4"></i>
      <h3 className="text-xl font-bold mb-4">Painel de Administração</h3>
      <p className="text-gray-400">Esta seção será implementada com seu backend real.</p>
    </div>
  );
}

export default MainComponent;
