import { BaseRepository } from './BaseRepository';
import { FinancialAccount } from '@/entities/FinancialAccount';
import { FinancialFilterDto, AccountType, AccountStatus } from '@/dtos/FinancialDto';
import { PaginatedResult } from '@/utils/PaginationFactory';

export class FinancialAccountRepository extends BaseRepository<FinancialAccount> {
  constructor() {
    super(FinancialAccount);
  }

  async findByCompanyId(companyId: string): Promise<FinancialAccount[]> {
    return await this.getRepository()
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.owner_user', 'owner_user')
      .where('account.company_id = :companyId', { companyId })
      .orderBy('account.name', 'ASC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<FinancialAccount | null> {
    return await this.getRepository()
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.owner_user', 'owner_user')
      .leftJoinAndSelect('account.transactions', 'transactions')
      .where('account.id = :id', { id })
      .getOne();
  }

  async findByCompanyIdAndName(companyId: string, name: string, excludeId?: string): Promise<FinancialAccount | null> {
    const query = this.getRepository()
      .createQueryBuilder('account')
      .where('account.company_id = :companyId', { companyId })
      .andWhere('LOWER(account.name) = LOWER(:name)', { name });

    if (excludeId) {
      query.andWhere('account.id != :excludeId', { excludeId });
    }

    return await query.getOne();
  }

  async accountNameExists(companyId: string, name: string, excludeId?: string): Promise<boolean> {
    const account = await this.findByCompanyIdAndName(companyId, name, excludeId);
    return !!account;
  }

  async findWithFilters(companyId: string, filters: FinancialFilterDto): Promise<PaginatedResult<FinancialAccount>> {
    const query = this.getRepository()
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.owner_user', 'owner_user')
      .where('account.company_id = :companyId', { companyId });

    // Filtros de busca
    if (filters.search) {
      query.andWhere(
        '(LOWER(account.name) LIKE LOWER(:search) OR LOWER(account.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    // Filtros específicos
    if (filters.account_type) {
      query.andWhere('account.type = :accountType', { accountType: filters.account_type });
    }

    if (filters.account_status) {
      query.andWhere('account.status = :accountStatus', { accountStatus: filters.account_status });
    }

    // Filtros de data genéricos
    if (filters.startDate) {
      query.andWhere('account.created_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('account.created_at <= :endDate', { endDate: filters.endDate });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'ASC';
    
    if (sortBy === 'owner_name') {
      query.orderBy('owner_user.name', sortOrder);
    } else if (sortBy === 'balance') {
      query.orderBy('account.balance', sortOrder);
    } else {
      query.orderBy(`account.${sortBy}`, sortOrder);
    }

    return await this.paginateQuery(query, {
      page: filters.page || 1,
      limit: filters.limit || 20
    });
  }

  async getAccountStats(companyId: string): Promise<{
    total_accounts: number;
    active_accounts: number;
    total_balance: number;
    account_type_distribution: Record<AccountType, number>;
    accounts_by_status: Record<AccountStatus, number>;
    accounts_with_negative_balance: number;
    recent_accounts: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('account')
      .where('account.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_accounts = await baseQuery.getCount();
    
    const active_accounts = await baseQuery
      .clone()
      .andWhere('account.status = :status', { status: AccountStatus.ATIVA })
      .getCount();

    // Saldo total
    const balanceResult = await baseQuery
      .clone()
      .select('SUM(account.balance)', 'total_balance')
      .getRawOne();

    const total_balance = parseFloat(balanceResult?.total_balance || '0');

    // Distribuição por tipo de conta
    const typeResults = await baseQuery
      .clone()
      .select('account.type', 'account_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('account.type')
      .getRawMany();

    const account_type_distribution: Record<AccountType, number> = {
      [AccountType.CONTA_CORRENTE]: 0,
      [AccountType.CONTA_POUPANCA]: 0,
      [AccountType.CONTA_INVESTIMENTO]: 0,
      [AccountType.CARTAO_CREDITO]: 0,
      [AccountType.DINHEIRO]: 0,
      [AccountType.OUTROS]: 0
    };

    typeResults.forEach(result => {
      account_type_distribution[result.account_type as AccountType] = parseInt(result.count);
    });

    // Distribuição por status
    const statusResults = await baseQuery
      .clone()
      .select('account.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('account.status')
      .getRawMany();

    const accounts_by_status: Record<AccountStatus, number> = {
      [AccountStatus.ATIVA]: 0,
      [AccountStatus.INATIVA]: 0,
      [AccountStatus.BLOQUEADA]: 0
    };

    statusResults.forEach(result => {
      accounts_by_status[result.status as AccountStatus] = parseInt(result.count);
    });

    // Contas com saldo negativo
    const accounts_with_negative_balance = await baseQuery
      .clone()
      .andWhere('account.balance < 0')
      .getCount();

    // Contas criadas recentemente (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_accounts = await baseQuery
      .clone()
      .andWhere('account.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    return {
      total_accounts,
      active_accounts,
      total_balance,
      account_type_distribution,
      accounts_by_status,
      accounts_with_negative_balance,
      recent_accounts
    };
  }

  async findByType(companyId: string, type: AccountType): Promise<FinancialAccount[]> {
    return await this.findMany({ company_id: companyId, type });
  }

  async findByStatus(companyId: string, status: AccountStatus): Promise<FinancialAccount[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async findByOwner(companyId: string, ownerUserId: string): Promise<FinancialAccount[]> {
    return await this.findMany({ 
      company_id: companyId, 
      owner_user_id: ownerUserId 
    });
  }

  async updateBalance(accountId: string, newBalance: number): Promise<boolean> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(FinancialAccount)
      .set({ balance: newBalance })
      .where('id = :accountId', { accountId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async adjustBalance(accountId: string, amount: number): Promise<boolean> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(FinancialAccount)
      .set({ balance: () => `balance + ${amount}` })
      .where('id = :accountId', { accountId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async bulkUpdateStatus(accountIds: string[], status: AccountStatus): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(FinancialAccount)
      .set({ status })
      .where('id IN (:...accountIds)', { accountIds })
      .execute();

    return result.affected ?? 0;
  }

  async searchAccounts(companyId: string, searchTerm: string): Promise<FinancialAccount[]> {
    return await this.getRepository()
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.owner_user', 'owner_user')
      .where('account.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(account.name) LIKE LOWER(:searchTerm) OR
        LOWER(account.description) LIKE LOWER(:searchTerm) OR
        LOWER(owner_user.name) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('account.name', 'ASC')
      .limit(50)
      .getMany();
  }

  async getAccountsWithTransactionCount(companyId: string): Promise<Array<FinancialAccount & { transactionCount: number }>> {
    return await this.getRepository()
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.owner_user', 'owner_user')
      .leftJoin('account.transactions', 'transaction')
      .where('account.company_id = :companyId', { companyId })
      .select([
        'account.id',
        'account.name',
        'account.type',
        'account.balance',
        'account.status',
        'COUNT(transaction.id) as transactionCount'
      ])
      .groupBy('account.id')
      .addGroupBy('owner_user.id')
      .orderBy('account.name', 'ASC')
      .getRawAndEntities()
      .then(result => {
        return result.entities.map((account, index) => ({
          ...account,
          transactionCount: parseInt(result.raw[index].transactionCount) || 0
        }));
      });
  }

  async findAccountsWithLowBalance(companyId: string, threshold: number = 100): Promise<FinancialAccount[]> {
    return await this.getRepository()
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.owner_user', 'owner_user')
      .where('account.company_id = :companyId', { companyId })
      .andWhere('account.balance < :threshold', { threshold })
      .andWhere('account.status = :status', { status: AccountStatus.ATIVA })
      .orderBy('account.balance', 'ASC')
      .getMany();
  }

  async getMonthlyBalanceHistory(accountId: string, months: number = 12): Promise<Array<{
    month: string;
    balance: number;
  }>> {
    // Esta query seria mais complexa e dependeria de um histórico de saldos
    // Por enquanto, retornamos array vazio
    // Em uma implementação real, seria necessário manter um histórico de saldos
    return [];
  }
}

