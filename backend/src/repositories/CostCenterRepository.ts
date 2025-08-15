import { BaseRepository } from './BaseRepository';
import { CostCenter } from '@/entities/CostCenter';
import { AccountStatus } from '@/dtos/FinancialDto';

export class CostCenterRepository extends BaseRepository<CostCenter> {
  constructor() {
    super(CostCenter);
  }

  async findByCompanyId(companyId: string): Promise<CostCenter[]> {
    return await this.getRepository()
      .createQueryBuilder('costCenter')
      .leftJoinAndSelect('costCenter.parent', 'parent')
      .leftJoinAndSelect('costCenter.children', 'children')
      .where('costCenter.company_id = :companyId', { companyId })
      .orderBy('costCenter.name', 'ASC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<CostCenter | null> {
    return await this.getRepository()
      .createQueryBuilder('costCenter')
      .leftJoinAndSelect('costCenter.parent', 'parent')
      .leftJoinAndSelect('costCenter.children', 'children')
      .leftJoinAndSelect('costCenter.transaction_splits', 'transaction_splits')
      .leftJoinAndSelect('transaction_splits.transaction', 'transaction')
      .where('costCenter.id = :id', { id })
      .getOne();
  }

  async findByCompanyIdAndName(companyId: string, name: string, excludeId?: string): Promise<CostCenter | null> {
    const query = this.getRepository()
      .createQueryBuilder('costCenter')
      .where('costCenter.company_id = :companyId', { companyId })
      .andWhere('LOWER(costCenter.name) = LOWER(:name)', { name });

    if (excludeId) {
      query.andWhere('costCenter.id != :excludeId', { excludeId });
    }

    return await query.getOne();
  }

  async costCenterNameExists(companyId: string, name: string, excludeId?: string): Promise<boolean> {
    const costCenter = await this.findByCompanyIdAndName(companyId, name, excludeId);
    return !!costCenter;
  }

  async findRootCostCenters(companyId: string): Promise<CostCenter[]> {
    return await this.getRepository()
      .createQueryBuilder('costCenter')
      .leftJoinAndSelect('costCenter.children', 'children')
      .where('costCenter.company_id = :companyId', { companyId })
      .andWhere('costCenter.parent_id IS NULL')
      .orderBy('costCenter.name', 'ASC')
      .getMany();
  }

  async findByParentId(parentId: string): Promise<CostCenter[]> {
    return await this.findMany({ parent_id: parentId });
  }

  async findHierarchy(companyId: string): Promise<CostCenter[]> {
    // Buscar todos os centros de custo e organizar em hierarquia
    const allCostCenters = await this.findByCompanyId(companyId);
    
    // Organizar em estrutura hierárquica
    const rootCostCenters = allCostCenters.filter(cc => !cc.parent_id);
    
    const buildHierarchy = (parentId: string | null): CostCenter[] => {
      return allCostCenters
        .filter(cc => cc.parent_id === parentId)
        .map(cc => ({
          ...cc,
          children: buildHierarchy(cc.id)
        }));
    };

    return rootCostCenters.map(cc => ({
      ...cc,
      children: buildHierarchy(cc.id)
    }));
  }

  async findByStatus(companyId: string, status: AccountStatus): Promise<CostCenter[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async getCostCenterStats(companyId: string): Promise<{
    total_cost_centers: number;
    active_cost_centers: number;
    root_cost_centers: number;
    cost_centers_with_children: number;
    cost_centers_with_transactions: number;
    recent_cost_centers: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('costCenter')
      .where('costCenter.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_cost_centers = await baseQuery.getCount();
    
    const active_cost_centers = await baseQuery
      .clone()
      .andWhere('costCenter.status = :status', { status: AccountStatus.ATIVA })
      .getCount();

    const root_cost_centers = await baseQuery
      .clone()
      .andWhere('costCenter.parent_id IS NULL')
      .getCount();

    // Centros de custo com filhos
    const cost_centers_with_children = await baseQuery
      .clone()
      .leftJoin('costCenter.children', 'children')
      .andWhere('children.id IS NOT NULL')
      .getCount();

    // Centros de custo com transações
    const cost_centers_with_transactions = await baseQuery
      .clone()
      .leftJoin('costCenter.transaction_splits', 'transaction_splits')
      .andWhere('transaction_splits.id IS NOT NULL')
      .getCount();

    // Centros de custo criados recentemente (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_cost_centers = await baseQuery
      .clone()
      .andWhere('costCenter.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    return {
      total_cost_centers,
      active_cost_centers,
      root_cost_centers,
      cost_centers_with_children,
      cost_centers_with_transactions,
      recent_cost_centers
    };
  }

  async getCostCenterWithTransactionSummary(companyId: string): Promise<Array<{
    id: string;
    name: string;
    description: string | null;
    total_amount: number;
    transaction_count: number;
    last_transaction_date: Date | null;
  }>> {
    return await this.getRepository()
      .createQueryBuilder('costCenter')
      .leftJoin('costCenter.transaction_splits', 'split')
      .leftJoin('split.transaction', 'transaction')
      .where('costCenter.company_id = :companyId', { companyId })
      .select([
        'costCenter.id as id',
        'costCenter.name as name',
        'costCenter.description as description',
        'COALESCE(SUM(split.split_amount), 0) as total_amount',
        'COUNT(split.id) as transaction_count',
        'MAX(transaction.transaction_date) as last_transaction_date'
      ])
      .groupBy('costCenter.id')
      .orderBy('total_amount', 'DESC')
      .getRawMany()
      .then(results => 
        results.map(result => ({
          id: result.id,
          name: result.name,
          description: result.description,
          total_amount: parseFloat(result.total_amount) || 0,
          transaction_count: parseInt(result.transaction_count) || 0,
          last_transaction_date: result.last_transaction_date ? new Date(result.last_transaction_date) : null
        }))
      );
  }

  async searchCostCenters(companyId: string, searchTerm: string): Promise<CostCenter[]> {
    return await this.getRepository()
      .createQueryBuilder('costCenter')
      .leftJoinAndSelect('costCenter.parent', 'parent')
      .where('costCenter.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(costCenter.name) LIKE LOWER(:searchTerm) OR
        LOWER(costCenter.description) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('costCenter.name', 'ASC')
      .limit(50)
      .getMany();
  }

  async validateParentChild(parentId: string, childId: string): Promise<boolean> {
    // Verificar se não há ciclo na hierarquia
    const parent = await this.findById(parentId);
    if (!parent) return false;

    // Verificar se o pai não é descendente do filho
    const checkCycle = async (currentId: string, targetId: string): Promise<boolean> => {
      if (currentId === targetId) return true;
      
      const current = await this.findById(currentId);
      if (!current || !current.parent_id) return false;
      
      return await checkCycle(current.parent_id, targetId);
    };

    return !(await checkCycle(parentId, childId));
  }

  async bulkUpdateStatus(costCenterIds: string[], status: AccountStatus): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(CostCenter)
      .set({ status })
      .where('id IN (:...costCenterIds)', { costCenterIds })
      .execute();

    return result.affected ?? 0;
  }

  async getDepth(costCenterId: string): Promise<number> {
    let depth = 0;
    let currentId: string | null = costCenterId;

    while (currentId) {
      const costCenter = await this.findById(currentId);
      if (!costCenter) break;
      
      currentId = costCenter.parent_id;
      if (currentId) depth++;
    }

    return depth;
  }

  async getDescendants(costCenterId: string): Promise<CostCenter[]> {
    const descendants: CostCenter[] = [];
    
    const findChildren = async (parentId: string): Promise<void> => {
      const children = await this.findByParentId(parentId);
      
      for (const child of children) {
        descendants.push(child);
        await findChildren(child.id);
      }
    };

    await findChildren(costCenterId);
    return descendants;
  }

  async getAncestors(costCenterId: string): Promise<CostCenter[]> {
    const ancestors: CostCenter[] = [];
    let currentId: string | null = costCenterId;

    while (currentId) {
      const costCenter = await this.findById(currentId);
      if (!costCenter || !costCenter.parent_id) break;
      
      const parent = await this.findById(costCenter.parent_id);
      if (parent) {
        ancestors.unshift(parent); // Adicionar no início para manter ordem hierárquica
        currentId = parent.parent_id;
      } else {
        break;
      }
    }

    return ancestors;
  }

  async moveCostCenter(costCenterId: string, newParentId: string | null): Promise<boolean> {
    // Validar se não há ciclo
    if (newParentId && !(await this.validateParentChild(newParentId, costCenterId))) {
      return false;
    }

    const result = await this.getRepository()
      .createQueryBuilder()
      .update(CostCenter)
      .set({ parent_id: newParentId })
      .where('id = :costCenterId', { costCenterId })
      .execute();

    return (result.affected ?? 0) > 0;
  }
}

