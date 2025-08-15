import { BaseRepository } from './BaseRepository';
import { TransactionSplit } from '@/entities/TransactionSplit';

export class TransactionSplitRepository extends BaseRepository<TransactionSplit> {
  constructor() {
    super(TransactionSplit);
  }

  async findByTransactionId(transactionId: string): Promise<TransactionSplit[]> {
    return await this.getRepository()
      .createQueryBuilder('split')
      .leftJoinAndSelect('split.cost_center', 'cost_center')
      .where('split.transaction_id = :transactionId', { transactionId })
      .orderBy('split.split_amount', 'DESC')
      .getMany();
  }

  async findByCostCenterId(costCenterId: string): Promise<TransactionSplit[]> {
    return await this.getRepository()
      .createQueryBuilder('split')
      .leftJoinAndSelect('split.transaction', 'transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .where('split.cost_center_id = :costCenterId', { costCenterId })
      .orderBy('transaction.transaction_date', 'DESC')
      .getMany();
  }

  async deleteByTransactionId(transactionId: string): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(TransactionSplit)
      .where('transaction_id = :transactionId', { transactionId })
      .execute();

    return result.affected ?? 0;
  }

  async getTotalAmountByTransaction(transactionId: string): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder('split')
      .select('SUM(split.split_amount)', 'total_amount')
      .where('split.transaction_id = :transactionId', { transactionId })
      .getRawOne();

    return parseFloat(result?.total_amount || '0');
  }

  async getTotalAmountByCostCenter(costCenterId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const query = this.getRepository()
      .createQueryBuilder('split')
      .leftJoin('split.transaction', 'transaction')
      .select('SUM(split.split_amount)', 'total_amount')
      .where('split.cost_center_id = :costCenterId', { costCenterId })
      .andWhere('transaction.status = :status', { status: 'CONFIRMADA' });

    if (startDate) {
      query.andWhere('transaction.transaction_date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('transaction.transaction_date <= :endDate', { endDate });
    }

    const result = await query.getRawOne();
    return parseFloat(result?.total_amount || '0');
  }

  async getCostCenterSummary(costCenterId: string, year?: number, month?: number): Promise<{
    total_amount: number;
    transaction_count: number;
    average_amount: number;
    monthly_breakdown: Array<{
      month: number;
      year: number;
      amount: number;
      count: number;
    }>;
  }> {
    let query = this.getRepository()
      .createQueryBuilder('split')
      .leftJoin('split.transaction', 'transaction')
      .where('split.cost_center_id = :costCenterId', { costCenterId })
      .andWhere('transaction.status = :status', { status: 'CONFIRMADA' });

    if (year) {
      query = query.andWhere('EXTRACT(YEAR FROM transaction.transaction_date) = :year', { year });
    }

    if (month) {
      query = query.andWhere('EXTRACT(MONTH FROM transaction.transaction_date) = :month', { month });
    }

    // Total e contagem
    const totalResult = await query
      .clone()
      .select([
        'SUM(split.split_amount) as total_amount',
        'COUNT(DISTINCT split.transaction_id) as transaction_count'
      ])
      .getRawOne();

    const total_amount = parseFloat(totalResult?.total_amount || '0');
    const transaction_count = parseInt(totalResult?.transaction_count || '0');
    const average_amount = transaction_count > 0 ? total_amount / transaction_count : 0;

    // Breakdown mensal
    const monthlyResults = await this.getRepository()
      .createQueryBuilder('split')
      .leftJoin('split.transaction', 'transaction')
      .where('split.cost_center_id = :costCenterId', { costCenterId })
      .andWhere('transaction.status = :status', { status: 'CONFIRMADA' })
      .select([
        'EXTRACT(MONTH FROM transaction.transaction_date) as month',
        'EXTRACT(YEAR FROM transaction.transaction_date) as year',
        'SUM(split.split_amount) as amount',
        'COUNT(DISTINCT split.transaction_id) as count'
      ])
      .groupBy('EXTRACT(YEAR FROM transaction.transaction_date)')
      .addGroupBy('EXTRACT(MONTH FROM transaction.transaction_date)')
      .orderBy('year', 'DESC')
      .addOrderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    const monthly_breakdown = monthlyResults.map(result => ({
      month: parseInt(result.month),
      year: parseInt(result.year),
      amount: parseFloat(result.amount) || 0,
      count: parseInt(result.count) || 0
    }));

    return {
      total_amount,
      transaction_count,
      average_amount,
      monthly_breakdown
    };
  }

  async validateSplitAmounts(transactionId: string, expectedTotal: number): Promise<boolean> {
    const actualTotal = await this.getTotalAmountByTransaction(transactionId);
    
    // Permitir uma pequena diferença devido a arredondamentos
    const tolerance = 0.01;
    return Math.abs(actualTotal - expectedTotal) <= tolerance;
  }

  async bulkCreateSplits(splits: Array<{
    transaction_id: string;
    cost_center_id: string;
    split_amount: number;
    description?: string;
  }>): Promise<TransactionSplit[]> {
    const entities = splits.map(split => this.getRepository().create(split));
    return await this.getRepository().save(entities);
  }

  async updateSplitsForTransaction(transactionId: string, newSplits: Array<{
    cost_center_id: string;
    split_amount: number;
    description?: string;
  }>): Promise<TransactionSplit[]> {
    // Remover splits existentes
    await this.deleteByTransactionId(transactionId);

    // Criar novos splits
    const splitsToCreate = newSplits.map(split => ({
      transaction_id: transactionId,
      cost_center_id: split.cost_center_id,
      split_amount: split.split_amount,
      description: split.description || null
    }));

    return await this.bulkCreateSplits(splitsToCreate);
  }

  async getCostCenterUsage(companyId: string, startDate: Date, endDate: Date): Promise<Array<{
    cost_center_id: string;
    cost_center_name: string;
    usage_count: number;
    total_amount: number;
    percentage_of_total: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('split')
      .leftJoin('split.cost_center', 'cost_center')
      .leftJoin('split.transaction', 'transaction')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere('transaction.transaction_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('transaction.status = :status', { status: 'CONFIRMADA' })
      .select([
        'cost_center.id as cost_center_id',
        'cost_center.name as cost_center_name',
        'COUNT(split.id) as usage_count',
        'SUM(split.split_amount) as total_amount'
      ])
      .groupBy('cost_center.id')
      .orderBy('total_amount', 'DESC')
      .getRawMany();

    const grandTotal = results.reduce((sum, result) => sum + parseFloat(result.total_amount || '0'), 0);

    return results.map(result => ({
      cost_center_id: result.cost_center_id,
      cost_center_name: result.cost_center_name,
      usage_count: parseInt(result.usage_count) || 0,
      total_amount: parseFloat(result.total_amount) || 0,
      percentage_of_total: grandTotal > 0 ? (parseFloat(result.total_amount || '0') / grandTotal) * 100 : 0
    }));
  }

  async getTopCostCentersByAmount(companyId: string, limit: number = 10, startDate?: Date, endDate?: Date): Promise<Array<{
    cost_center_id: string;
    cost_center_name: string;
    total_amount: number;
    transaction_count: number;
    average_amount: number;
  }>> {
    let query = this.getRepository()
      .createQueryBuilder('split')
      .leftJoin('split.cost_center', 'cost_center')
      .leftJoin('split.transaction', 'transaction')
      .where('transaction.company_id = :companyId', { companyId })
      .andWhere('transaction.status = :status', { status: 'CONFIRMADA' });

    if (startDate) {
      query = query.andWhere('transaction.transaction_date >= :startDate', { startDate });
    }

    if (endDate) {
      query = query.andWhere('transaction.transaction_date <= :endDate', { endDate });
    }

    const results = await query
      .select([
        'cost_center.id as cost_center_id',
        'cost_center.name as cost_center_name',
        'SUM(split.split_amount) as total_amount',
        'COUNT(DISTINCT split.transaction_id) as transaction_count'
      ])
      .groupBy('cost_center.id')
      .orderBy('total_amount', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map(result => ({
      cost_center_id: result.cost_center_id,
      cost_center_name: result.cost_center_name,
      total_amount: parseFloat(result.total_amount) || 0,
      transaction_count: parseInt(result.transaction_count) || 0,
      average_amount: parseInt(result.transaction_count) > 0 
        ? parseFloat(result.total_amount) / parseInt(result.transaction_count) 
        : 0
    }));
  }

  async getSplitsByDateRange(costCenterId: string, startDate: Date, endDate: Date): Promise<TransactionSplit[]> {
    return await this.getRepository()
      .createQueryBuilder('split')
      .leftJoinAndSelect('split.transaction', 'transaction')
      .leftJoinAndSelect('transaction.financial_account', 'financial_account')
      .where('split.cost_center_id = :costCenterId', { costCenterId })
      .andWhere('transaction.transaction_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('transaction.status = :status', { status: 'CONFIRMADA' })
      .orderBy('transaction.transaction_date', 'DESC')
      .getMany();
  }
}

