import { Request, Response, NextFunction } from 'express';
import { UsuarioEmpresaService } from '@/services/UsuarioEmpresaService';

/**
 * Middleware para verificar se o usuário logado tem permissão para acessar a empresa
 * Verifica:
 * - Se existe um registro UsuarioEmpresa ativo para o usuário e empresa
 * - Se a empresa não está deletada (isDeleted = false)
 */
export const checkEmpresaPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const empresaId = parseInt(req.params.empresaId);
    const userId = req.user?.userId; // Vem do middleware de autenticação JWT

    // Validar se empresaId é um número válido
    if (!empresaId || isNaN(empresaId)) {
      res.status(400).json({
        success: false,
        message: 'ID da empresa inválido'
      });
      return;
    }

    // Validar se userId existe
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    // Usar service para verificar permissão (seguindo arquitetura em camadas)
    const usuarioEmpresaService = new UsuarioEmpresaService();
    const hasPermission = await usuarioEmpresaService.verifyUserEmpresaPermission(userId, empresaId);

    // Verificar se o usuário tem permissão
    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: 'Usuário não tem permissão para acessar esta empresa'
      });
      return;
    }

    // Adicionar empresaId na request para uso posterior
    req.empresaId = empresaId;
    
    next();
  } catch (error) {
    console.error('Erro no middleware checkEmpresaPermission:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};
