import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceIdLoading, setIsFaceIdLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loginWithFaceId, isAuthenticated } = useAuth();
  const location = useLocation();

  // Carregar credenciais salvas ao montar o componente
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
      console.log('📧 Email lembrado carregado:', savedEmail);
    }
    
    if (savedPassword) {
      setPassword(savedPassword);
      console.log('🔑 Senha lembrada carregada');
    }
  }, []);

  // Debug: Log component lifecycle
  console.log('🔍 Login component renderizou', {
    email: email.length > 0,
    error: !!error,
    isLoading,
    isAuthenticated,
    rememberMe
  });

  // Detectar reload/remount do componente
  React.useEffect(() => {
    console.log('🏁 Login component MONTADO');
    return () => {
      console.log('💀 Login component DESMONTADO - possível causa do reload!');
    };
  }, []);

  // Detectar mudanças no estado de autenticação
  React.useEffect(() => {
    console.log('🔄 Estado de autenticação mudou:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ Usuário está autenticado - deve navegar!');
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('✅ URL de destino:', from);
    }
  }, [isAuthenticated, location.state]);

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    console.log('🚀 RENDERIZANDO NAVIGATE - Usuário autenticado');
    const from = location.state?.from?.pathname || '/dashboard';
    console.log('🚀 NAVIGATE to:', from);
    console.log('🚀 Location state:', location.state);
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔍 handleSubmit chamado');
    e.preventDefault();
    console.log('🔍 preventDefault executado');
    
    setError('');
    setIsLoading(true);
    console.log('🔍 Estado atualizado: loading=true, error=cleared');

    try {
      console.log('🔍 Chamando função login...');
      await login(email, password);
      console.log('🔍 Login executado com sucesso');
      console.log('🔍 Estado atual - isAuthenticated:', isAuthenticated);
      
      // Salvar credenciais se "Lembrar de mim" estiver marcado
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
        console.log('💾 Credenciais salvas para lembrar');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        console.log('🗑️ Credenciais removidas da memória');
      }
      
      console.log('🔍 Aguardando atualização do estado de autenticação...');
      // Se chegou aqui, login foi bem-sucedido - não precisa fazer nada
      // pois o AuthContext já vai redirecionar
    } catch (err) {
      console.log('🔍 Capturou erro no login:', err);
      // Garantir que o erro seja capturado e exibido
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      console.log('🔍 Definindo mensagem de erro:', errorMessage);
      setError(errorMessage);
      console.error('🔍 Erro de login:', err);
      
      // Manter o foco no formulário para evitar qualquer navegação
      setTimeout(() => {
        console.log('🔍 Restaurando foco no formulário');
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.focus();
      }, 100);
    } finally {
      console.log('🔍 Finalizando handleSubmit, setLoading(false)');
      setIsLoading(false);
    }
  };

  const handleFaceIdLogin = async () => {
    setError('');
    setIsFaceIdLoading(true);

    try {
      await loginWithFaceId();
      
      // Salvar credenciais se "Lembrar de mim" estiver marcado e temos credenciais
      if (rememberMe && email) {
        localStorage.setItem('rememberedEmail', email);
        if (password) {
          localStorage.setItem('rememberedPassword', password);
        }
        console.log('💾 Credenciais salvas após login facial');
      }
      
      // Se chegou aqui, login foi bem-sucedido
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no reconhecimento facial';
      setError(errorMessage);
      console.error('Erro de login facial:', err);
    } finally {
      setIsFaceIdLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 animate-fade-in">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Sistema ERP</h1>
            <p className="text-gray-400">Faça login para continuar</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-slide-up">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <span className="text-red-400 text-sm block">{error}</span>
                  <button
                    onClick={() => setError('')}
                    className="text-red-300 hover:text-red-200 text-xs mt-1 underline"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="seu@email.com"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Lembrar Credenciais */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar de mim
                </label>
              </div>
              
              <Link 
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-sm text-gray-400">ou</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Face ID */}
          <button
            onClick={handleFaceIdLogin}
            disabled={isFaceIdLoading}
            className="btn btn-secondary w-full"
          >
            {isFaceIdLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                Reconhecendo...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Entrar com Reconhecimento Facial
              </>
            )}
          </button>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-400">Não tem uma conta?</span>
              <Link 
                to="/register" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Sistema ERP. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

