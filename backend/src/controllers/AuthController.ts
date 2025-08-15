import { Request, Response } from 'express';
import { AuthService } from '@/services/AuthService';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '@/dtos/AuthDto';
import { AppError } from '@/core/errors/AppError';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerDto: RegisterDto = req.body;
      const result = await this.authService.register(registerDto);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;
      const result = await this.authService.login(loginDto);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Logout user
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token não fornecido',
        });
        return;
      }

      await this.authService.logout(token);

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Forgot password
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const forgotPasswordDto: ForgotPasswordDto = req.body;
      const result = await this.authService.forgotPassword(forgotPasswordDto);

      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Reset password
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const resetPasswordDto: ResetPasswordDto = req.body;
      const result = await this.authService.resetPassword(resetPasswordDto);

      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Change password (for authenticated users)
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get user ID from request (set by auth middleware)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const changePasswordDto: ChangePasswordDto = req.body;
      const result = await this.authService.changePassword(userId, changePasswordDto);

      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Get current user profile
   */
  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      // User is already available from auth middleware
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Perfil obtido com sucesso',
        data: {
          userId: user.userId,
          email: user.email,
          nome: user.nome,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Verify token endpoint
   */
  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token não fornecido',
        });
        return;
      }

      const user = await this.authService.verifyToken(token);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Token inválido',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Token válido',
        data: {
          userId: user.userId,
          email: user.email,
          nome: user.nome
        },
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  protected handleError(res: Response, error: any): void {
    console.error('Auth Controller Error:', error);

    if (error.message?.includes('not found') || error.message?.includes('não encontrado')) {
      res.status(404).json({
        success: false,
        message: error.message || 'Recurso não encontrado',
      });
    } else if (error.message?.includes('already exists') || error.message?.includes('já existe')) {
      res.status(409).json({
        success: false,
        message: error.message || 'Recurso já existe',
      });
    } else if (error.message?.includes('validation') || error.message?.includes('validação')) {
      res.status(400).json({
        success: false,
        message: error.message || 'Dados inválidos',
      });
    } else if (error.message?.includes('Email ou senha incorretos')) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    } else if (
      error.message?.includes('Senha atual incorreta') ||
      error.message?.includes('Token inválido') ||
      error.message?.includes('Token expirado')
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (error.message?.includes('Usuário não autenticado')) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}
