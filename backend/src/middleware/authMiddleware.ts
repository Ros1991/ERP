import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/AuthService';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        nome: string;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Middleware to authenticate JWT token
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token de acesso não fornecido',
        });
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      const user = await this.authService.verifyToken(token);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Token inválido ou expirado',
        });
        return;
      }

      // Attach user to request object
      req.user = {
        userId: user.userId,
        email: user.email,
        nome: user.nome
      };

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({
        success: false,
        message: 'Falha na autenticação',
      });
    }
  };

  /**
   * Optional authentication middleware - continues even if no token
   */
  optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const user = await this.authService.verifyToken(token);

        if (user) {
          req.user = {
            userId: user.userId,
            email: user.email,
            nome: user.nome
          };
        }
      }

      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  };
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

// Export middleware functions
export const authenticate = authMiddleware.authenticate;
export const optionalAuthenticate = authMiddleware.optionalAuthenticate;
