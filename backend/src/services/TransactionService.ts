import { BaseService } from './BaseService';
import { Transaction } from '../entities/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { TransactionSplitRepository } from '../repositories/TransactionSplitRepository';
import { FinancialAccountRepository } from '../repositories/FinancialAccountRepository';
import { CostCenterRepository } from '../repositories/CostCenterRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  FinancialFilterDto,
  TransferBetweenAccountsDto,
  BulkUpdateTransactionStatusDto,
  TransactionType,
  TransactionStatus,
  AccountStatus
} from '../dtos/FinancialDto';
import { PaginatedResult } from '../utils/PaginationFactory';

export class TransactionService extends BaseService<Transaction, CreateTransactionDto, UpdateTransactionDto> {
  private transactionSplitRepository: TransactionSplitRepository;
  private financialAccountRepository: FinancialAccountRepository;
  private costCenterRepository: CostCenterRepository;

  constructor() {
    const transactionRepository = new TransactionRepository();
    super(transactionRepository);
    this.transactionSplitRepository = new TransactionSplitRepository();
    this.financialAccountRepository = new FinancialAccountRepository();
    this.costCenterRepository = new CostCenterRepository();
  }

  async create(companyId: string, data: CreateTransactionDto): Promise<Transaction> {
    // Verificar se a conta financeira existe e pertence à empresa
    const financialAccount = await this.financialAccountRepository.findById(data.financial_account_id);
    if (!financialAccount || financialAccount.company_id !== companyId) {
      throw AppError.notFound('Conta financeira não encontrada');
    }

    // Verificar se a conta está ativa
    if (financialAccount.status !== AccountStatus.ATIVA) {
      throw AppError.badRequest('Não é possível criar transação em conta inativa');
    }

    // Validar divisões (splits)
    await this.validateTransactionSplits(data.splits, data.amount, companyId);

    // Criar transação
    const transactionData = {
      company_id: companyId,
      transaction_type: data.transaction_type,
      description: data.description,
      amount: data.amount,
      transaction_date: new Date(data.transaction_date),
      financial_account_id: data.financial_account_id,
      reference_number: data.reference_number || null,
      notes: data.notes || null,
      status: data.status || TransactionStatus.PENDENTE
    };

    const transaction = await this.repository.create(transactionData);

    // Criar divisões
    const splitsToCreate = data.splits.map(split => ({
      transaction_id: transaction.id,
      cost_center_id: split.cost_center_id,
      split_amount: split.amount,
      description: split.description || null
    }));

    await this.transactionSplitRepository.bulkCreateSplits(splitsToCreate);

    // Atualizar saldo da conta se a transação estiver confirmada
    if (transaction.status === TransactionStatus.CONFIRMADA) {
      await this.updateAccountBalance(transaction);
    }

    return await this.findByIdAndCompany(transaction.id, companyId);
  }

  async update(transactionId: string, companyId: string, data: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findByIdAndCompany(transactionId, companyId);

    // Verificar se a transação pode ser alterada
    if (transaction.status === TransactionStatus.CANCELADA) {
      throw AppError.badRequest('Não é possível alterar uma transação cancelada');
    }

    // Verificar conta financeira se foi alterada
    if (data.financial_account_id && data.financial_account_id !== transaction.financial_account_id) {
      const financialAccount = await this.financialAccountRepository.findById(data.financial_account_id);
      if (!financialAccount || financialAccount.company_id !== companyId) {
        throw AppError.notFound('Conta financeira não encontrada');
      }

      if (financialAccount.status !== AccountStatus.ATIVA) {
        throw AppError.badRequest('Não é possível usar conta inativa');
      }
    }

    // Validar divisões se foram alteradas
    if (data.splits) {
      const amount = data.amount || transaction.amount;
      await this.validateTransactionSplits(data.splits, amount, companyId);
    }

    // Reverter saldo anterior se a transação estava confirmada
    if (transaction.status === TransactionStatus.CONFIRMADA) {
      await this.revertAccountBalance(transaction);
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.transaction_type) updateData.transaction_type = data.transaction_type;
    if (data.description) updateData.description = data.description;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.transaction_date) updateData.transaction_date = new Date(data.transaction_date);
    if (data.financial_account_id) updateData.financial_account_id = data.financial_account_id;
    if (data.reference_number !== undefined) updateData.reference_number = data.reference_number;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status) updateData.status = data.status;

    const updatedTransaction = await this.repository.update(transactionId, updateData) as Transaction;

    // Atualizar divisões se fornecidas
    if (data.splits) {
      await this.transactionSplitRepository.updateSplitsForTransaction(transactionId, data.splits);
    }

    // Aplicar novo saldo se a transação estiver confirmada
    const finalTransaction = await this.findByIdAndCompany(transactionId, companyId);
    if (finalTransaction.status === TransactionStatus.CONFIRMADA) {
      await this.updateAccountBalance(finalTransaction);
    }

    return finalTransaction;
  }

  async findByIdAndCompany(transactionId: string, companyId: string): Promise<Transaction> {
    const transaction = await (this.repository as TransactionRepository).findByIdWithDetails(transactionId);
    
    if (!transaction || transaction.company_id !== companyId) {
      throw AppError.notFound('Transação não encontrada');
    }

    return transaction;
  }

  async findByCompanyWithFilters(companyId: string, filters: FinancialFilterDto): Promise<PaginatedResult<Transaction>> {
    return await (this.repository as TransactionRepository).findWithFilters(companyId, filters);
  }

  async getTransactionStats(companyId: string): Promise<any> {
    return await (this.repository as TransactionRepository).getTransactionStats(companyId);
  }

  async transferBetweenAccounts(companyId: string, data: TransferBetweenAccountsDto): Promise<{ 
    debitTransaction: Transaction; 
    creditTransaction: Transaction; 
  }> {
    // Verificar contas
    const fromAccount = await this.financialAccountRepository.findById(data.from_account_id);
    const toAccount = await this.financialAccountRepository.findById(data.to_account_id);

    if (!fromAccount || fromAccount.company_id !== companyId) {
      throw AppError.notFound('Conta de origem não encontrada');
    }

    if (!toAccount || toAccount.company_id !== companyId) {
      throw AppError.notFound('Conta de destino não encontrada');
    }

    if (fromAccount.status !== AccountStatus.ATIVA || toAccount.status !== AccountStatus.ATIVA) {
      throw AppError.badRequest('Ambas as contas devem estar ativas');
    }

    // Verificar centro de custo
    const costCenter = await this.costCenterRepository.findById(data.cost_center_id);
    if (!costCenter || costCenter.company_id !== companyId) {
      throw AppError.notFound('Centro de custo não encontrado');
    }

    // Criar transação de débito (saída)
    const debitTransactionData = {
      company_id: companyId,
      transaction_type: TransactionType.DESPESA,
      description: `Transferência para ${toAccount.name}: ${data.description}`,
      amount: data.amount,
      transaction_date: new Date(data.transfer_date),
      financial_account_id: data.from_account_id,
      reference_number: `TRANSF-${Date.now()}-OUT`,
      notes: data.notes || null,
      status: TransactionStatus.CONFIRMADA
    };

    const debitTransaction = await this.repository.create(debitTransactionData);

    // Criar transação de crédito (entrada)
    const creditTransactionData = {
      company_id: companyId,
      transaction_type: TransactionType.RECEITA,
      description: `Transferência de ${fromAccount.name}: ${data.description}`,
      amount: data.amount,
      transaction_date: new Date(data.transfer_date),
      financial_account_id: data.to_account_id,
      reference_number: `TRANSF-${Date.now()}-IN`,
      notes: data.notes || null,
      status: TransactionStatus.CONFIRMADA
    };

    const creditTransaction = await this.repository.create(creditTransactionData);

    // Criar divisões para ambas as transações
    const splitData = {
      cost_center_id: data.cost_center_id,
      split_amount: data.amount,
      description: 'Transferência entre contas'
    };

    await this.transactionSplitRepository.bulkCreateSplits([
      { transaction_id: debitTransaction.id, ...splitData },
      { transaction_id: creditTransaction.id, ...splitData }
    ]);

    // Atualizar saldos das contas
    await this.financialAccountRepository.adjustBalance(data.from_account_id, -data.amount);
    await this.financialAccountRepository.adjustBalance(data.to_account_id, data.amount);

    return {
      debitTransaction: await this.findByIdAndCompany(debitTransaction.id, companyId),
      creditTransaction: await this.findByIdAndCompany(creditTransaction.id, companyId)
    };
  }

  async bulkUpdateStatus(companyId: string, data: BulkUpdateTransactionStatusDto): Promise<{ updated: number }> {
    // Verificar se todas as transações pertencem à empresa
    const transactions = await Promise.all(
      data.transaction_ids.map(id => this.findByIdAndCompany(id, companyId))
    );

    // Processar mudanças de saldo se necessário
    for (const transaction of transactions) {
      if (transaction.status === TransactionStatus.CONFIRMADA && data.status !== TransactionStatus.CONFIRMADA) {
        // Reverter saldo se estava confirmada e agora não está
        await this.revertAccountBalance(transaction);
      } else if (transaction.status !== TransactionStatus.CONFIRMADA && data.status === TransactionStatus.CONFIRMADA) {
        // Aplicar saldo se não estava confirmada e agora está
        await this.updateAccountBalance(transaction);
      }
    }

    const updatedCount = await (this.repository as TransactionRepository)
      .bulkUpdateStatus(data.transaction_ids, data.status);

    return { updated: updatedCount };
  }

  async getTransactionsByType(companyId: string, type: TransactionType): Promise<Transaction[]> {
    return await (this.repository as TransactionRepository).findByType(companyId, type);
  }

  async getTransactionsByStatus(companyId: string, status: TransactionStatus): Promise<Transaction[]> {
    return await (this.repository as TransactionRepository).findByStatus(companyId, status);
  }

  async getTransactionsByAccount(accountId: string, companyId: string): Promise<Transaction[]> {
    // Verificar se a conta pertence à empresa
    const account = await this.financialAccountRepository.findById(accountId);
    if (!account || account.company_id !== companyId) {
      throw AppError.notFound('Conta financeira não encontrada');
    }

    return await (this.repository as TransactionRepository).findByFinancialAccountId(accountId);
  }

  async getTransactionsByCostCenter(costCenterId: string, companyId: string): Promise<Transaction[]> {
    // Verificar se o centro de custo pertence à empresa
    const costCenter = await this.costCenterRepository.findById(costCenterId);
    if (!costCenter || costCenter.company_id !== companyId) {
      throw AppError.notFound('Centro de custo não encontrado');
    }

    return await (this.repository as TransactionRepository).findByCostCenter(costCenterId);
  }

  async getTransactionsByDateRange(companyId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await (this.repository as TransactionRepository).findByDateRange(companyId, startDate, endDate);
  }

  async searchTransactions(companyId: string, searchTerm: string): Promise<Transaction[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as TransactionRepository)
      .searchTransactions(companyId, searchTerm.trim());
  }

  async getMonthlyReport(companyId: string, year: number, month: number): Promise<any> {
    return await (this.repository as TransactionRepository).getMonthlyReport(companyId, year, month);
  }

  async getCostCenterReport(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    return await (this.repository as TransactionRepository).getCostCenterReport(companyId, startDate, endDate);
  }

  async getPendingTransactions(companyId: string): Promise<Transaction[]> {
    return await (this.repository as TransactionRepository).getPendingTransactions(companyId);
  }

  async getRecentTransactions(companyId: string, limit?: number): Promise<Transaction[]> {
    return await (this.repository as TransactionRepository).getRecentTransactions(companyId, limit);
  }

  async delete(transactionId: string, companyId: string): Promise<void> {
    const transaction = await this.findByIdAndCompany(transactionId, companyId);

    // Verificar se a transação pode ser excluída
    if (transaction.status === TransactionStatus.CONFIRMADA) {
      throw AppError.badRequest('Não é possível excluir uma transação confirmada. Cancele-a primeiro.');
    }

    // Excluir divisões relacionadas
    await this.transactionSplitRepository.deleteByTransactionId(transactionId);

    // Excluir transação
    await this.repository.delete(transactionId);
  }

  private async validateTransactionSplits(splits: any[], totalAmount: number, companyId: string): Promise<void> {
    if (!splits || splits.length === 0) {
      throw AppError.badRequest('Pelo menos uma divisão é obrigatória');
    }

    // Verificar se a soma das divisões é igual ao valor total
    const splitsTotal = splits.reduce((sum, split) => sum + split.amount, 0);
    const tolerance = 0.01; // Tolerância para arredondamentos

    if (Math.abs(splitsTotal - totalAmount) > tolerance) {
      throw AppError.badRequest('A soma das divisões deve ser igual ao valor total da transação');
    }

    // Verificar se todos os centros de custo existem e pertencem à empresa
    for (const split of splits) {
      const costCenter = await this.costCenterRepository.findById(split.cost_center_id);
      if (!costCenter || costCenter.company_id !== companyId) {
        throw AppError.notFound(`Centro de custo ${split.cost_center_id} não encontrado`);
      }

      if (costCenter.status !== AccountStatus.ATIVA) {
        throw AppError.badRequest(`Centro de custo ${costCenter.name} deve estar ativo`);
      }

      if (split.amount <= 0) {
        throw AppError.badRequest('Valor da divisão deve ser maior que zero');
      }
    }
  }

  private async updateAccountBalance(transaction: Transaction): Promise<void> {
    let balanceChange = 0;

    switch (transaction.transaction_type) {
      case TransactionType.RECEITA:
        balanceChange = transaction.amount;
        break;
      case TransactionType.DESPESA:
        balanceChange = -transaction.amount;
        break;
      case TransactionType.TRANSFERENCIA:
        // Para transferências, o saldo já é atualizado no método transferBetweenAccounts
        return;
    }

    await this.financialAccountRepository.adjustBalance(transaction.financial_account_id, balanceChange);
  }

  private async revertAccountBalance(transaction: Transaction): Promise<void> {
    let balanceChange = 0;

    switch (transaction.transaction_type) {
      case TransactionType.RECEITA:
        balanceChange = -transaction.amount; // Reverter receita
        break;
      case TransactionType.DESPESA:
        balanceChange = transaction.amount; // Reverter despesa
        break;
      case TransactionType.TRANSFERENCIA:
        // Para transferências, seria necessário reverter ambas as contas
        return;
    }

    await this.financialAccountRepository.adjustBalance(transaction.financial_account_id, balanceChange);
  }

  protected async beforeCreate(data: CreateTransactionDto): Promise<void> {
    // Validações adicionais podem ser adicionadas aqui
    if (data.amount <= 0) {
      throw AppError.badRequest('Valor da transação deve ser maior que zero');
    }

    if (new Date(data.transaction_date) > new Date()) {
      throw AppError.badRequest('Data da transação não pode ser futura');
    }
  }

  protected async beforeUpdate(id: string | number, data: UpdateTransactionDto): Promise<void> {
    if (data.amount !== undefined && data.amount <= 0) {
      throw AppError.badRequest('Valor da transação deve ser maior que zero');
    }

    if (data.transaction_date && new Date(data.transaction_date) > new Date()) {
      throw AppError.badRequest('Data da transação não pode ser futura');
    }
  }
}

