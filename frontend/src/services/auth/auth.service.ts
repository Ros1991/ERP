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

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_CONFIG.endpoints.auth.register, 
      credentials
    );
    return response.data;
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
