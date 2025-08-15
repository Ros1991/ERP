import { BaseRepository } from './BaseRepository';
import { Transaction } from '@/entities/Transaction';
import { FinancialFilterDto, TransactionType, TransactionStatus } from '@/dtos/FinancialDto';
import { PaginatedResult } from '@/utils/PaginationFactory';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super(Transaction);
  }

  async findByCompanyId(companyId: string): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId })
      .orderBy('transaction.transaction_date', 'DESC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<Transaction | null> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('financial_account.owner_user', 'owner_user')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.id = :id', { id })
      .getOne();
  }

  async findByFinancialAccountId(financialAccountId: string): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.financial_account_id = :financialAccountId', { financialAccountId })
      .orderBy('transaction.transaction_date', 'DESC')
      .getMany();
  }

  async findWithFilters(companyId: string, filters: FinancialFilterDto): Promise<PaginatedResult<Transaction>> {
    const query = this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId });

    // Filtros de busca
    if (filters.search) {
      query.andWhere(
        '(LOWER(transaction.description) LIKE LOWER(:search) OR LOWER(transaction.reference_number) LIKE LOWER(:search) OR LOWER(financial_account.name) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    // Filtros específicos
    if (filters.transaction_type) {
      query.andWhere('transaction.transaction_type = :transactionType', { transactionType: filters.transaction_type });
    }

    if (filters.transaction_status) {
      query.andWhere('transaction.status = :transactionStatus', { transactionStatus: filters.transaction_status });
    }

    if (filters.financial_account_id) {
      query.andWhere('transaction.financial_account_id = :financialAccountId', { 
        financialAccountId: filters.financial_account_id 
      });
    }

    if (filters.cost_center_id) {
      query.andWhere('splits.cost_center_id = :costCenterId', { costCenterId: filters.cost_center_id });
    }

    // Filtros de valor
    if (filters.amount_min !== undefined) {
      query.andWhere('transaction.amount >= :amountMin', { amountMin: filters.amount_min });
    }

    if (filters.amount_max !== undefined) {
      query.andWhere('transaction.amount <= :amountMax', { amountMax: filters.amount_max });
    }

    // Filtros de data de transação
    if (filters.transaction_date_start) {
      query.andWhere('transaction.transaction_date >= :transactionDateStart', { 
        transactionDateStart: new Date(filters.transaction_date_start) 
      });
    }

    if (filters.transaction_date_end) {
      query.andWhere('transaction.transaction_date <= :transactionDateEnd', { 
        transactionDateEnd: new Date(filters.transaction_date_end) 
      });
    }

    // Filtros de data genéricos
    if (filters.startDate) {
      query.andWhere('transaction.created_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('transaction.created_at <= :endDate', { endDate: filters.endDate });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'transaction_date';
    const sortOrder = filters.sortOrder || 'DESC';
    
    if (sortBy === 'account_name') {
      query.orderBy('financial_account.name', sortOrder);
    } else if (sortBy === 'amount') {
      query.orderBy('transaction.amount', sortOrder);
    } else {
      query.orderBy(`transaction.${sortBy}`, sortOrder);
    }

    return await this.paginateQuery(query, {
      page: filters.page || 1,
      limit: filters.limit || 20
    });
  }

  async getTransactionStats(companyId: string): Promise<{
    total_transactions: number;
    pending_transactions: number;
    confirmed_transactions: number;
    cancelled_transactions: number;
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
    monthly_revenue: number;
    monthly_expenses: number;
    monthly_profit: number;
    transaction_type_distribution: Record<TransactionType, number>;
    transaction_status_distribution: Record<TransactionStatus, number>;
    recent_transactions: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('transaction')
      .where('transaction.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_transactions = await baseQuery.getCount();
    
    const pending_transactions = await baseQuery
      .clone()
      .andWhere('transaction.status = :status', { status: TransactionStatus.PENDENTE })
      .getCount();

    const confirmed_transactions = await baseQuery
      .clone()
      .andWhere('transaction.status = :status', { status: TransactionStatus.CONFIRMADA })
      .getCount();

    const cancelled_transactions = await baseQuery
      .clone()
      .andWhere('transaction.status = :status', { status: TransactionStatus.CANCELADA })
      .getCount();

    // Totais financeiros (apenas transações confirmadas)
    const confirmedQuery = baseQuery
      .clone()
      .andWhere('transaction.status = :status', { status: TransactionStatus.CONFIRMADA });

    const revenueResult = await confirmedQuery
      .clone()
      .andWhere('transaction.transaction_type = :type', { type: TransactionType.RECEITA })
      .select('SUM(transaction.amount)', 'total_revenue')
      .getRawOne();

    const expenseResult = await confirmedQuery
      .clone()
      .andWhere('transaction.transaction_type = :type', { type: TransactionType.DESPESA })
      .select('SUM(transaction.amount)', 'total_expenses')
      .getRawOne();

    const total_revenue = parseFloat(revenueResult?.total_revenue || '0');
    const total_expenses = parseFloat(expenseResult?.total_expenses || '0');
    const net_profit = total_revenue - total_expenses;

    // Totais mensais (mês atual)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyQuery = confirmedQuery
      .clone()
      .andWhere('transaction.transaction_date >= :currentMonth', { currentMonth })
      .andWhere('transaction.transaction_date < :nextMonth', { nextMonth });

    const monthlyRevenueResult = await monthlyQuery
      .clone()
      .andWhere('transaction.transaction_type = :type', { type: TransactionType.RECEITA })
      .select('SUM(transaction.amount)', 'monthly_revenue')
      .getRawOne();

    const monthlyExpenseResult = await monthlyQuery
      .clone()
      .andWhere('transaction.transaction_type = :type', { type: TransactionType.DESPESA })
      .select('SUM(transaction.amount)', 'monthly_expenses')
      .getRawOne();

    const monthly_revenue = parseFloat(monthlyRevenueResult?.monthly_revenue || '0');
    const monthly_expenses = parseFloat(monthlyExpenseResult?.monthly_expenses || '0');
    const monthly_profit = monthly_revenue - monthly_expenses;

    // Distribuição por tipo de transação
    const typeResults = await baseQuery
      .clone()
      .select('transaction.transaction_type', 'transaction_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('transaction.transaction_type')
      .getRawMany();

    const transaction_type_distribution: Record<TransactionType, number> = {
      [TransactionType.RECEITA]: 0,
      [TransactionType.DESPESA]: 0,
      [TransactionType.TRANSFERENCIA]: 0
    };

    typeResults.forEach(result => {
      transaction_type_distribution[result.transaction_type as TransactionType] = parseInt(result.count);
    });

    // Distribuição por status
    const statusResults = await baseQuery
      .clone()
      .select('transaction.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('transaction.status')
      .getRawMany();

    const transaction_status_distribution: Record<TransactionStatus, number> = {
      [TransactionStatus.PENDENTE]: 0,
      [TransactionStatus.CONFIRMADA]: 0,
      [TransactionStatus.CANCELADA]: 0
    };

    statusResults.forEach(result => {
      transaction_status_distribution[result.status as TransactionStatus] = parseInt(result.count);
    });

    // Transações recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_transactions = await baseQuery
      .clone()
      .andWhere('transaction.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    return {
      total_transactions,
      pending_transactions,
      confirmed_transactions,
      cancelled_transactions,
      total_revenue,
      total_expenses,
      net_profit,
      monthly_revenue,
      monthly_expenses,
      monthly_profit,
      transaction_type_distribution,
      transaction_status_distribution,
      recent_transactions
    };
  }

  async findByType(companyId: string, type: TransactionType): Promise<Transaction[]> {
    return await this.findMany({ company_id: companyId, transaction_type: type });
  }

  async findByStatus(companyId: string, status: TransactionStatus): Promise<Transaction[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async findByCostCenter(costCenterId: string): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoin('splits.cost_center', 'cost_center')
      .where('cost_center.id = :costCenterId', { costCenterId })
      .orderBy('transaction.transaction_date', 'DESC')
      .getMany();
  }

  async findByDateRange(companyId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere('transaction.transaction_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('transaction.transaction_date', 'DESC')
      .getMany();
  }

  async bulkUpdateStatus(transactionIds: string[], status: TransactionStatus): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(Transaction)
      .set({ status })
      .where('id IN (:...transactionIds)', { transactionIds })
      .execute();

    return result.affected ?? 0;
  }

  async searchTransactions(companyId: string, searchTerm: string): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(transaction.description) LIKE LOWER(:searchTerm) OR
        LOWER(transaction.reference_number) LIKE LOWER(:searchTerm) OR
        LOWER(financial_account.name) LIKE LOWER(:searchTerm) OR
        LOWER(cost_center.name) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('transaction.transaction_date', 'DESC')
      .limit(50)
      .getMany();
  }

  async getMonthlyReport(companyId: string, year: number, month: number): Promise<{
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
    transaction_count: number;
    transactions_by_day: Array<{
      day: number;
      revenue: number;
      expenses: number;
      transaction_count: number;
    }>;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const baseQuery = this.getRepository()
      .createQueryBuilder('transaction')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere('transaction.transaction_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('transaction.status = :status', { status: TransactionStatus.CONFIRMADA });

    // Totais do mês
    const revenueResult = await baseQuery
      .clone()
      .andWhere('transaction.transaction_type = :type', { type: TransactionType.RECEITA })
      .select('SUM(transaction.amount)', 'total_revenue')
      .getRawOne();

    const expenseResult = await baseQuery
      .clone()
      .andWhere('transaction.transaction_type = :type', { type: TransactionType.DESPESA })
      .select('SUM(transaction.amount)', 'total_expenses')
      .getRawOne();

    const total_revenue = parseFloat(revenueResult?.total_revenue || '0');
    const total_expenses = parseFloat(expenseResult?.total_expenses || '0');
    const net_profit = total_revenue - total_expenses;

    const transaction_count = await baseQuery.getCount();

    // Transações por dia
    const dailyResults = await baseQuery
      .clone()
      .select([
        'EXTRACT(DAY FROM transaction.transaction_date) as day',
        'SUM(CASE WHEN transaction.transaction_type = :revenueType THEN transaction.amount ELSE 0 END) as revenue',
        'SUM(CASE WHEN transaction.transaction_type = :expenseType THEN transaction.amount ELSE 0 END) as expenses',
        'COUNT(*) as transaction_count'
      ])
      .setParameter('revenueType', TransactionType.RECEITA)
      .setParameter('expenseType', TransactionType.DESPESA)
      .groupBy('EXTRACT(DAY FROM transaction.transaction_date)')
      .orderBy('day', 'ASC')
      .getRawMany();

    const transactions_by_day = dailyResults.map(result => ({
      day: parseInt(result.day),
      revenue: parseFloat(result.revenue) || 0,
      expenses: parseFloat(result.expenses) || 0,
      transaction_count: parseInt(result.transaction_count) || 0
    }));

    return {
      total_revenue,
      total_expenses,
      net_profit,
      transaction_count,
      transactions_by_day
    };
  }

  async getCostCenterReport(companyId: string, startDate: Date, endDate: Date): Promise<Array<{
    cost_center_id: string;
    cost_center_name: string;
    total_amount: number;
    transaction_count: number;
    percentage: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoin('transaction.splits', 'split')
      .leftJoin('split.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere('transaction.transaction_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('transaction.status = :status', { status: TransactionStatus.CONFIRMADA })
      .select([
        'cost_center.id as cost_center_id',
        'cost_center.name as cost_center_name',
        'SUM(split.split_amount) as total_amount',
        'COUNT(DISTINCT transaction.id) as transaction_count'
      ])
      .groupBy('cost_center.id')
      .orderBy('total_amount', 'DESC')
      .getRawMany();

    const totalAmount = results.reduce((sum, result) => sum + parseFloat(result.total_amount || '0'), 0);

    return results.map(result => ({
      cost_center_id: result.cost_center_id,
      cost_center_name: result.cost_center_name,
      total_amount: parseFloat(result.total_amount) || 0,
      transaction_count: parseInt(result.transaction_count) || 0,
      percentage: totalAmount > 0 ? (parseFloat(result.total_amount || '0') / totalAmount) * 100 : 0
    }));
  }

  async getPendingTransactions(companyId: string): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere('transaction.status = :status', { status: TransactionStatus.PENDENTE })
      .orderBy('transaction.transaction_date', 'ASC')
      .getMany();
  }

  async getRecentTransactions(companyId: string, limit: number = 10): Promise<Transaction[]> {
    return await this.getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .leftJoinAndSelect('transaction.splits', 'splits')
      .leftJoinAndSelect('splits.cost_center', 'cost_center')
      .where('transaction.company_id = :companyId', { companyId })
      .orderBy('transaction.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }
}

