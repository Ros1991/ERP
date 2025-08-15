import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  permissions: string[];
  companies?: any[];
  current_company_id?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, companyName?: string) => Promise<void>;
  loginWithFaceId: () => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext - Inicializando...');
    // Verificar se há token salvo no localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    console.log('🔄 Token encontrado:', !!token);
    console.log('🔄 Usuário salvo encontrado:', !!savedUser);
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('🔄 Restaurando usuário:', userData.email);
        setUser(userData);
      } catch (error) {
        console.error('🔄 Erro ao restaurar usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    console.log('🔄 AuthContext inicializado');
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    console.log('🔐 Tentando fazer login...');
    setIsLoading(true);
    
    try {
      console.log('🔐 Enviando requisição para API...');
      const response = await apiService.post('/auth/login', { email, password });
      console.log('🔐 Resposta da API:', response.data);
      console.log('🔐 Estrutura completa:', JSON.stringify(response.data, null, 2));
      
      // A API parece retornar { success: true, data: { token, user } }
      const apiData = response.data.data || response.data;
      console.log('🔐 API Data extraída:', apiData);
      
      const { token, user: userData } = apiData;
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('🔐 Usuário salvo, atualizando estado...');
      console.log('🔐 Dados do usuário:', userData);
      setUser(userData);
      console.log('🔐 Estado do usuário atualizado');
      toast.success('Login realizado com sucesso!');
      console.log('🔐 Login bem-sucedido!');
      
      // Forçar re-render verificando se usuário foi definido
      setTimeout(() => {
        console.log('🔐 Verificando estado após timeout:', {
          user: !!userData,
          isAuthenticated: !!userData
        });
      }, 100);
    } catch (error: any) {
      console.error('🔐 Erro no login:', error);
      const message = error.response?.data?.message || 'Erro ao fazer login';
      console.error('🔐 Mensagem de erro:', message);
      toast.error(message);
      throw new Error(message);
    } finally {
      console.log('🔐 Finalizando processo de login...');
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, companyName?: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.post('/auth/register', {
        name,
        email,
        password,
        company_name: companyName || `Empresa de ${name}`
      });
      
      const { token, user: userData } = response.data;
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.success('Conta criada com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast.error(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFaceId = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Reconhecimento facial não suportado neste navegador');
      }

      // Capturar imagem da câmera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Criar elemento de vídeo para capturar frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Aguardar vídeo estar pronto
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });
      
      // Capturar frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      // Converter para base64
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Parar stream
      stream.getTracks().forEach(track => track.stop());
      
      // Enviar para API
      const response = await apiService.post('/auth/face-login', {
        face_data: imageData
      });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login facial realizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha no reconhecimento facial';
      toast.error(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logout realizado com sucesso');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithFaceId,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

