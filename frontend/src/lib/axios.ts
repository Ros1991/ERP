import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../stores/auth.store';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Não fazer logout automático em rotas de auth
          const isAuthRoute = error.config?.url?.includes('/auth/');
          if (!isAuthRoute) {
            // Token expirado ou inválido
            useAuthStore.getState().logout();
            toast.error('Sessão expirada. Por favor, faça login novamente.');
            window.location.href = '/login';
          } else {
            // Erro de autenticação (login/register)
            toast.error(data.message || 'Credenciais inválidas.');
          }
          break;
        case 403:
          toast.error('Você não tem permissão para realizar esta ação.');
          break;
        case 404:
          toast.error('Recurso não encontrado.');
          break;
        case 422:
          // Erros de validação
          if (data.errors) {
            Object.values(data.errors).forEach((error: any) => {
              toast.error(error);
            });
          } else {
            toast.error(data.message || 'Erro de validação.');
          }
          break;
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.');
          break;
        default:
          toast.error(data.message || 'Ocorreu um erro inesperado.');
      }
    } else if (error.request) {
      toast.error('Sem resposta do servidor. Verifique sua conexão.');
    } else {
      toast.error('Erro ao processar requisição.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
