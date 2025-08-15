import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - mas só redirecionar se NÃO estivermos já na página de login
      const currentPath = window.location.pathname;
      
      if (currentPath !== '/login' && currentPath !== '/register') {
        console.log('🔐 Token inválido, redirecionando para login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Usar history.pushState ao invés de window.location.href para evitar reload
        window.history.pushState({}, '', '/login');
        
        // Disparar evento de mudança de rota para o React Router
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      } else {
        console.log('🔐 Erro 401 na página de login - não redirecionando');
      }
    }
    return Promise.reject(error);
  }
);

// Generic request methods
export const apiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config),
};

export default api;
