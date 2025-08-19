import api from '../../lib/axios';
import { API_CONFIG } from '../../config/api.config';
import type { LoginDTO, RegisterDTO, ForgotPasswordDTO, ResetPasswordDTO, UpdateUserDTO, AuthResponse } from '../../models/auth';

class AuthService {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await api.post<{success: boolean, message: string, data: AuthResponse}>(
      API_CONFIG.endpoints.auth.login, 
      credentials
    );
    return response.data.data;
  }

  async register(credentials: {nome: string; email: string; password: string}): Promise<AuthResponse> {
    const response = await api.post<{success: boolean, message: string, data: AuthResponse}>(
      API_CONFIG.endpoints.auth.register, 
      credentials
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await api.post(API_CONFIG.endpoints.auth.logout);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      API_CONFIG.endpoints.auth.forgotPassword, 
      { email }
    );
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      API_CONFIG.endpoints.auth.resetPassword, 
      { token, password }
    );
    return response.data;
  }

  async getProfile(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>(
      API_CONFIG.endpoints.auth.profile
    );
    return response.data;
  }

  async updateProfile(data: UpdateUserCredentials): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>(
      API_CONFIG.endpoints.auth.profile, 
      data
    );
    return response.data;
  }

  async validateToken(): Promise<boolean> {
    try {
      await api.get(API_CONFIG.endpoints.auth.validate);
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();

// User service for CRUD operations
class UserService {
  async getAll(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<any>> {
    const params: any = { page, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    
    const response = await api.get('/users', { params });
    return {
      data: response.data.data.items,
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      limit: response.data.data.pagination.limit,
    };
  }

  async getById(userId: number): Promise<any> {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  }

  async create(user: any): Promise<any> {
    const response = await api.post('/users', user);
    return response.data.data;
  }

  async update(userId: number, user: any): Promise<any> {
    const response = await api.put(`/users/${userId}`, user);
    return response.data.data;
  }

  async delete(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  }
}

// Role service for CRUD operations
class RoleService {
  async getAll(empresaId: number, page = 1, limit = 10, search?: string): Promise<PaginatedResponse<any>> {
    const params: any = { page, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    
    const response = await api.get(`/empresas/${empresaId}/roles`, { params });
    return {
      data: response.data.data.items,
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      limit: response.data.data.pagination.limit,
    };
  }

  async getById(empresaId: number, roleId: number): Promise<any> {
    const response = await api.get(`/empresas/${empresaId}/roles/${roleId}`);
    return response.data.data;
  }

  async create(empresaId: number, role: any): Promise<any> {
    const response = await api.post(`/empresas/${empresaId}/roles`, role);
    return response.data.data;
  }

  async update(empresaId: number, roleId: number, role: any): Promise<any> {
    const response = await api.put(`/empresas/${empresaId}/roles/${roleId}`, role);
    return response.data.data;
  }

  async delete(empresaId: number, roleId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/roles/${roleId}`);
  }
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const userService = new UserService();
export const roleService = new RoleService();
