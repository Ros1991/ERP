import { BaseService } from './BaseService';
import { CostCenter } from '../entities/CostCenter';
import { CostCenterRepository } from '../repositories/CostCenterRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateCostCenterDto, 
  UpdateCostCenterDto,
  AccountStatus
} from '../dtos/FinancialDto';

export class CostCenterService extends BaseService<CostCenter, CreateCostCenterDto, UpdateCostCenterDto> {
  constructor() {
    const costCenterRepository = new CostCenterRepository();
    super(costCenterRepository);
  }

  async create(companyId: string, data: CreateCostCenterDto): Promise<CostCenter> {
    // Verificar se o nome do centro de custo já existe na empresa
    const nameExists = await (this.repository as CostCenterRepository)
      .costCenterNameExists(companyId, data.name);
    
    if (nameExists) {
      throw AppError.conflict('Já existe um centro de custo com este nome na empresa');
    }

    // Verificar se o centro de custo pai existe (se fornecido)
    if (data.parent_id) {
      const parentCostCenter = await this.repository.findById(data.parent_id);
      if (!parentCostCenter) {
        throw AppError.notFound('Centro de custo pai não encontrado');
      }

      // Verificar se o pai pertence à mesma empresa
      if (parentCostCenter.company_id !== companyId) {
        throw AppError.badRequest('Centro de custo pai deve pertencer à mesma empresa');
      }

      // Verificar se o pai está ativo
      if (parentCostCenter.status !== AccountStatus.ATIVA) {
        throw AppError.badRequest('Centro de custo pai deve estar ativo');
      }
    }

    // Criar centro de custo
    const costCenterData = {
      company_id: companyId,
      name: data.name,
      description: data.description || null,
      parent_id: data.parent_id || null,
      status: data.status || AccountStatus.ATIVA
    };

    return await this.repository.create(costCenterData);
  }

  async update(costCenterId: string, companyId: string, data: UpdateCostCenterDto): Promise<CostCenter> {
    const costCenter = await this.findByIdAndCompany(costCenterId, companyId);

    // Verificar nome se foi alterado
    if (data.name && data.name !== costCenter.name) {
      const nameExists = await (this.repository as CostCenterRepository)
        .costCenterNameExists(companyId, data.name, costCenterId);
      
      if (nameExists) {
        throw AppError.conflict('Já existe um centro de custo com este nome na empresa');
      }
    }

    // Verificar centro de custo pai se foi alterado
    if (data.parent_id !== undefined && data.parent_id !== costCenter.parent_id) {
      if (data.parent_id) {
        const parentCostCenter = await this.repository.findById(data.parent_id);
        if (!parentCostCenter) {
          throw AppError.notFound('Centro de custo pai não encontrado');
        }

        // Verificar se o pai pertence à mesma empresa
        if (parentCostCenter.company_id !== companyId) {
          throw AppError.badRequest('Centro de custo pai deve pertencer à mesma empresa');
        }

        // Verificar se não há ciclo na hierarquia
        const isValidParent = await (this.repository as CostCenterRepository)
          .validateParentChild(data.parent_id, costCenterId);
        
        if (!isValidParent) {
          throw AppError.badRequest('Não é possível criar um ciclo na hierarquia de centros de custo');
        }
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.parent_id !== undefined) updateData.parent_id = data.parent_id;
    if (data.status) updateData.status = data.status;

    return await this.repository.update(costCenterId, updateData) as CostCenter;
  }

  async findByIdAndCompany(costCenterId: string, companyId: string): Promise<CostCenter> {
    const costCenter = await (this.repository as CostCenterRepository).findByIdWithDetails(costCenterId);
    
    if (!costCenter || costCenter.company_id !== companyId) {
      throw AppError.notFound('Centro de custo não encontrado');
    }

    return costCenter;
  }

  async findByCompany(companyId: string): Promise<CostCenter[]> {
    return await (this.repository as CostCenterRepository).findByCompanyId(companyId);
  }

  async findHierarchy(companyId: string): Promise<CostCenter[]> {
    return await (this.repository as CostCenterRepository).findHierarchy(companyId);
  }

  async findRootCostCenters(companyId: string): Promise<CostCenter[]> {
    return await (this.repository as CostCenterRepository).findRootCostCenters(companyId);
  }

  async findByParent(parentId: string, companyId: string): Promise<CostCenter[]> {
    // Verificar se o pai pertence à empresa
    await this.findByIdAndCompany(parentId, companyId);
    
    return await (this.repository as CostCenterRepository).findByParentId(parentId);
  }

  async getCostCenterStats(companyId: string): Promise<any> {
    return await (this.repository as CostCenterRepository).getCostCenterStats(companyId);
  }

  async getCostCenterWithTransactionSummary(companyId: string): Promise<any> {
    return await (this.repository as CostCenterRepository)
      .getCostCenterWithTransactionSummary(companyId);
  }

  async getCostCentersByStatus(companyId: string, status: AccountStatus): Promise<CostCenter[]> {
    return await (this.repository as CostCenterRepository).findByStatus(companyId, status);
  }

  async searchCostCenters(companyId: string, searchTerm: string): Promise<CostCenter[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as CostCenterRepository)
      .searchCostCenters(companyId, searchTerm.trim());
  }

  async bulkUpdateStatus(companyId: string, costCenterIds: string[], status: AccountStatus): Promise<{ updated: number }> {
    // Verificar se todos os centros de custo pertencem à empresa
    for (const costCenterId of costCenterIds) {
      await this.findByIdAndCompany(costCenterId, companyId);
    }

    const updatedCount = await (this.repository as CostCenterRepository)
      .bulkUpdateStatus(costCenterIds, status);

    return { updated: updatedCount };
  }

  async moveCostCenter(costCenterId: string, companyId: string, newParentId: string | null): Promise<CostCenter> {
    const costCenter = await this.findByIdAndCompany(costCenterId, companyId);

    // Verificar novo pai se fornecido
    if (newParentId) {
      const newParent = await this.findByIdAndCompany(newParentId, companyId);
      
      // Verificar se não há ciclo
      const isValidMove = await (this.repository as CostCenterRepository)
        .validateParentChild(newParentId, costCenterId);
      
      if (!isValidMove) {
        throw AppError.badRequest('Não é possível criar um ciclo na hierarquia de centros de custo');
      }
    }

    const moved = await (this.repository as CostCenterRepository)
      .moveCostCenter(costCenterId, newParentId);

    if (!moved) {
      throw AppError.internalServer('Erro ao mover centro de custo');
    }

    return await this.findByIdAndCompany(costCenterId, companyId);
  }

  async getDepth(costCenterId: string, companyId: string): Promise<number> {
    await this.findByIdAndCompany(costCenterId, companyId);
    return await (this.repository as CostCenterRepository).getDepth(costCenterId);
  }

  async getDescendants(costCenterId: string, companyId: string): Promise<CostCenter[]> {
    await this.findByIdAndCompany(costCenterId, companyId);
    return await (this.repository as CostCenterRepository).getDescendants(costCenterId);
  }

  async getAncestors(costCenterId: string, companyId: string): Promise<CostCenter[]> {
    await this.findByIdAndCompany(costCenterId, companyId);
    return await (this.repository as CostCenterRepository).getAncestors(costCenterId);
  }

  async delete(costCenterId: string, companyId: string): Promise<void> {
    const costCenter = await this.findByIdAndCompany(costCenterId, companyId);

    // Verificar se o centro de custo pode ser excluído
    const costCenterWithDetails = await (this.repository as CostCenterRepository)
      .findByIdWithDetails(costCenterId);

    // Não permitir exclusão se houver filhos
    if (costCenterWithDetails?.children && costCenterWithDetails.children.length > 0) {
      throw AppError.badRequest('Não é possível excluir um centro de custo que possui filhos');
    }

    // Não permitir exclusão se houver transações
    if (costCenterWithDetails?.transaction_splits && costCenterWithDetails.transaction_splits.length > 0) {
      throw AppError.badRequest('Não é possível excluir um centro de custo que possui transações');
    }

    // Excluir centro de custo
    await this.repository.delete(costCenterId);
  }

  async validateCostCenterData(data: CreateCostCenterDto | UpdateCostCenterDto): Promise<void> {
    // Validações adicionais de negócio
    
    if ('name' in data && data.name) {
      if (data.name.trim().length < 2) {
        throw AppError.badRequest('Nome do centro de custo deve ter pelo menos 2 caracteres');
      }

      if (data.name.trim().length > 100) {
        throw AppError.badRequest('Nome do centro de custo deve ter no máximo 100 caracteres');
      }
    }

    if ('description' in data && data.description) {
      if (data.description.trim().length > 500) {
        throw AppError.badRequest('Descrição deve ter no máximo 500 caracteres');
      }
    }
  }

  protected async beforeCreate(data: CreateCostCenterDto): Promise<void> {
    await this.validateCostCenterData(data);
  }

  protected async beforeUpdate(id: string | number, data: UpdateCostCenterDto): Promise<void> {
    await this.validateCostCenterData(data);
  }
}

