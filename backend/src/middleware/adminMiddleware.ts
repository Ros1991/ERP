import { Request, Response, NextFunction } from 'express';
import { ResponseBuilder } from '@/utils/ResponseBuilder';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json(ResponseBuilder.unauthorized('Usuário não autenticado'));
      return;
    }

    // Verificar se o usuário tem role de Admin ou Dono em alguma empresa
    const isAdmin = user.companies.some(company => 
      company.role_name === 'Admin' || company.role_name === 'Dono'
    );

    if (!isAdmin) {
      res.status(403).json(ResponseBuilder.forbidden('Acesso restrito a administradores'));
      return;
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
  }
};

export const superAdminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json(ResponseBuilder.unauthorized('Usuário não autenticado'));
      return;
    }

    // Verificar se o usuário é dono de pelo menos uma empresa
    const isSuperAdmin = user.companies.some(company => company.role_name === 'Dono');

    if (!isSuperAdmin) {
      res.status(403).json(ResponseBuilder.forbidden('Acesso restrito a proprietários'));
      return;
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de super admin:', error);
    res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
  }
};

export const companyAdminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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

    // Verificar se o usuário é Admin ou Dono da empresa específica
    const company = user.companies.find(c => c.company_id === companyId);
    
    if (!company || (company.role_name !== 'Admin' && company.role_name !== 'Dono')) {
      res.status(403).json(ResponseBuilder.forbidden('Acesso restrito a administradores da empresa'));
      return;
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de admin da empresa:', error);
    res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
  }
};

