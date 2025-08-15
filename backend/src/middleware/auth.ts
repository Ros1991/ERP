import { Request, Response, NextFunction } from 'express';
import { JwtUtils, JwtPayload } from '@/utils/jwt';
import { AppError } from '@/utils/AppError';
import { ResponseBuilder } from '@/utils/ResponseBuilder';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json(ResponseBuilder.unauthorized('Token de acesso não fornecido'));
      return;
    }

    const payload = JwtUtils.verifyAccessToken(token);
    req.user = payload;
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.message.includes('expirado')) {
      res.status(401).json(ResponseBuilder.unauthorized('Token expirado'));
    } else if (error.message.includes('inválido')) {
      res.status(401).json(ResponseBuilder.unauthorized('Token inválido'));
    } else {
      res.status(401).json(ResponseBuilder.unauthorized('Falha na autenticação'));
    }
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const payload = JwtUtils.verifyAccessToken(token);
      req.user = payload;
    }
    
    next();
  } catch (error) {
    // Em caso de erro, apenas continue sem definir o usuário
    next();
  }
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;
      
      if (!user) {
        res.status(401).json(ResponseBuilder.unauthorized('Usuário não autenticado'));
        return;
      }

      // Verificar se o usuário tem a permissão em alguma de suas empresas
      const hasPermission = user.companies.some(company => 
        company.permissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json(ResponseBuilder.forbidden(`Permissão necessária: ${permission}`));
        return;
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de permissão:', error);
      res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
    }
  };
};

export const requireCompanyAccess = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;
    const companyId = req.params.companyId;

    if (!user) {
      res.status(401).json(ResponseBuilder.unauthorized('Usuário não autenticado'));
      return;
    }

    if (!companyId) {
      res.status(400).json(ResponseBuilder.error('ID da empresa não fornecido'));
      return;
    }

    // Verificar se o usuário tem acesso à empresa
    const hasAccess = user.companies.some(company => company.company_id === companyId);

    if (!hasAccess) {
      res.status(403).json(ResponseBuilder.forbidden('Acesso negado à empresa'));
      return;
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de acesso à empresa:', error);
    res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
  }
};

export const requireCompanyPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;
      const companyId = req.params.companyId;

      if (!user) {
        res.status(401).json(ResponseBuilder.unauthorized('Usuário não autenticado'));
        return;
      }

      if (!companyId) {
        res.status(400).json(ResponseBuilder.error('ID da empresa não fornecido'));
        return;
      }

      // Verificar se o usuário tem a permissão específica na empresa
      const company = user.companies.find(c => c.company_id === companyId);
      
      if (!company) {
        res.status(403).json(ResponseBuilder.forbidden('Acesso negado à empresa'));
        return;
      }

      if (!company.permissions.includes(permission)) {
        res.status(403).json(ResponseBuilder.forbidden(`Permissão necessária: ${permission}`));
        return;
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de permissão da empresa:', error);
      res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
    }
  };
};

export const requireOwnership = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;
    const companyId = req.params.companyId;

    if (!user) {
      res.status(401).json(ResponseBuilder.unauthorized('Usuário não autenticado'));
      return;
    }

    if (!companyId) {
      res.status(400).json(ResponseBuilder.error('ID da empresa não fornecido'));
      return;
    }

    // Verificar se o usuário é dono da empresa (role "Dono")
    const company = user.companies.find(c => c.company_id === companyId);
    
    if (!company || company.role_name !== 'Dono') {
      res.status(403).json(ResponseBuilder.forbidden('Apenas o dono da empresa pode realizar esta ação'));
      return;
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de propriedade:', error);
    res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
  }
};

export const getCurrentCompany = (req: Request): { company_id: string; role_name: string; permissions: string[] } | null => {
  const user = req.user;
  const companyId = req.params.companyId;

  if (!user || !companyId) {
    return null;
  }

  return user.companies.find(c => c.company_id === companyId) || null;
};

export const hasPermissionInCompany = (req: Request, permission: string, companyId?: string): boolean => {
  const user = req.user;
  const targetCompanyId = companyId || req.params.companyId;

  if (!user || !targetCompanyId) {
    return false;
  }

  const company = user.companies.find(c => c.company_id === targetCompanyId);
  return company ? company.permissions.includes(permission) : false;
};

