import { BaseService } from './BaseService';
import { FinancialAccount } from '../entities/FinancialAccount';
import { FinancialAccountRepository } from '../repositories/FinancialAccountRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateFinancialAccountDto, 
  UpdateFinancialAccountDto, 
  FinancialFilterDto,
  AccountType,
  AccountStatus
} from '../dtos/FinancialDto';
import { PaginatedResult } from '../utils/PaginationFactory';

export class FinancialAccountService extends BaseService<FinancialAccount, CreateFinancialAccountDto, UpdateFinancialAccountDto> {
  private userRepository: UserRepository;

  constructor() {
    const financialAccountRepository = new FinancialAccountRepository();
    super(financialAccountRepository);
    this.userRepository = new UserRepository();
  }

  async create(companyId: string, data: CreateFinancialAccountDto): Promise<FinancialAccount> {
    // Verificar se o nome da conta já existe na empresa
    const nameExists = await (this.repository as FinancialAccountRepository)
      .accountNameExists(companyId, data.name);
    
    if (nameExists) {
      throw AppError.conflict('Já existe uma conta com este nome na empresa');
    }

    // Verificar se o usuário proprietário existe (se fornecido)
    if (data.owner_user_id) {
      const ownerUser = await this.userRepository.findById(data.owner_user_id);
      if (!ownerUser) {
        throw AppError.notFound('Usuário proprietário não encontrado');
      }
    }

    // Criar conta financeira
    const accountData = {
      company_id: companyId,
      name: data.name,
      type: data.type,
      description: data.description || null,
      balance: data.initial_balance || 0,
      bank_details: data.bank_details || null,
      owner_user_id: data.owner_user_id || null,
      status: data.status || AccountStatus.ATIVA
    };

    return await this.repository.create(accountData);
  }

  async update(accountId: string, companyId: string, data: UpdateFinancialAccountDto): Promise<FinancialAccount> {
    const account = await this.findByIdAndCompany(accountId, companyId);

    // Verificar nome se foi alterado
    if (data.name && data.name !== account.name) {
      const nameExists = await (this.repository as FinancialAccountRepository)
        .accountNameExists(companyId, data.name, accountId);
      
      if (nameExists) {
        throw AppError.conflict('Já existe uma conta com este nome na empresa');
      }
    }

    // Verificar usuário proprietário se foi alterado
    if (data.owner_user_id && data.owner_user_id !== account.owner_user_id) {
      const ownerUser = await this.userRepository.findById(data.owner_user_id);
      if (!ownerUser) {
        throw AppError.notFound('Usuário proprietário não encontrado');
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.type) updateData.type = data.type;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.bank_details !== undefined) updateData.bank_details = data.bank_details;
    if (data.owner_user_id !== undefined) updateData.owner_user_id = data.owner_user_id;
    if (data.status) updateData.status = data.status;

    return await this.repository.update(accountId, updateData) as FinancialAccount;
  }

  async findByIdAndCompany(accountId: string, companyId: string): Promise<FinancialAccount> {
    const account = await (this.repository as FinancialAccountRepository).findByIdWithDetails(accountId);
    
    if (!account || account.company_id !== companyId) {
      throw AppError.notFound('Conta financeira não encontrada');
    }

    return account;
  }

  async findByCompanyWithFilters(companyId: string, filters: FinancialFilterDto): Promise<PaginatedResult<FinancialAccount>> {
    return await (this.repository as FinancialAccountRepository).findWithFilters(companyId, filters);
  }

  async getAccountStats(companyId: string): Promise<any> {
    return await (this.repository as FinancialAccountRepository).getAccountStats(companyId);
  }

  async getAccountsByType(companyId: string, type: AccountType): Promise<FinancialAccount[]> {
    return await (this.repository as FinancialAccountRepository).findByType(companyId, type);
  }

  async getAccountsByStatus(companyId: string, status: AccountStatus): Promise<FinancialAccount[]> {
    return await (this.repository as FinancialAccountRepository).findByStatus(companyId, status);
  }

  async getAccountsByOwner(companyId: string, ownerUserId: string): Promise<FinancialAccount[]> {
    return await (this.repository as FinancialAccountRepository).findByOwner(companyId, ownerUserId);
  }

  async updateAccountBalance(accountId: string, companyId: string, newBalance: number): Promise<FinancialAccount> {
    const account = await this.findByIdAndCompany(accountId, companyId);

    // Verificar se a conta está ativa
    if (account.status !== AccountStatus.ATIVA) {
      throw AppError.badRequest('Não é possível alterar o saldo de uma conta inativa');
    }

    const updated = await (this.repository as FinancialAccountRepository)
      .updateBalance(accountId, newBalance);

    if (!updated) {
      throw AppError.internalServer('Erro ao atualizar saldo da conta');
    }

    return await this.findByIdAndCompany(accountId, companyId);
  }

  async adjustAccountBalance(accountId: string, companyId: string, amount: number): Promise<FinancialAccount> {
    const account = await this.findByIdAndCompany(accountId, companyId);

    // Verificar se a conta está ativa
    if (account.status !== AccountStatus.ATIVA) {
      throw AppError.badRequest('Não é possível ajustar o saldo de uma conta inativa');
    }

    // Verificar se o ajuste não deixará o saldo negativo (para alguns tipos de conta)
    if (account.type === AccountType.CONTA_POUPANCA && (account.balance + amount) < 0) {
      throw AppError.badRequest('Conta poupança não pode ter saldo negativo');
    }

    const updated = await (this.repository as FinancialAccountRepository)
      .adjustBalance(accountId, amount);

    if (!updated) {
      throw AppError.internalServer('Erro ao ajustar saldo da conta');
    }

    return await this.findByIdAndCompany(accountId, companyId);
  }

  async bulkUpdateStatus(companyId: string, accountIds: string[], status: AccountStatus): Promise<{ updated: number }> {
    // Verificar se todas as contas pertencem à empresa
    for (const accountId of accountIds) {
      await this.findByIdAndCompany(accountId, companyId);
    }

    const updatedCount = await (this.repository as FinancialAccountRepository)
      .bulkUpdateStatus(accountIds, status);

    return { updated: updatedCount };
  }

  async searchAccounts(companyId: string, searchTerm: string): Promise<FinancialAccount[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as FinancialAccountRepository)
      .searchAccounts(companyId, searchTerm.trim());
  }

  async getAccountsWithTransactionCount(companyId: string): Promise<Array<FinancialAccount & { transactionCount: number }>> {
    return await (this.repository as FinancialAccountRepository)
      .getAccountsWithTransactionCount(companyId);
  }

  async getAccountsWithLowBalance(companyId: string, threshold?: number): Promise<FinancialAccount[]> {
    return await (this.repository as FinancialAccountRepository)
      .findAccountsWithLowBalance(companyId, threshold);
  }

  async delete(accountId: string, companyId: string): Promise<void> {
    const account = await this.findByIdAndCompany(accountId, companyId);

    // Verificar se a conta pode ser excluída
    // Por exemplo, não permitir exclusão se houver transações
    const accountWithDetails = await (this.repository as FinancialAccountRepository)
      .findByIdWithDetails(accountId);

    if (accountWithDetails?.transactions && accountWithDetails.transactions.length > 0) {
      throw AppError.badRequest('Não é possível excluir uma conta que possui transações');
    }

    // Excluir conta
    await this.repository.delete(accountId);
  }

  async validateAccountData(data: CreateFinancialAccountDto | UpdateFinancialAccountDto): Promise<void> {
    // Validações adicionais de negócio
    
    if ('name' in data && data.name) {
      if (data.name.trim().length < 2) {
        throw AppError.badRequest('Nome da conta deve ter pelo menos 2 caracteres');
      }
    }

    if ('initial_balance' in data && data.initial_balance !== undefined) {
      // Validar saldo inicial baseado no tipo de conta
      if ('type' in data && data.type === AccountType.CONTA_POUPANCA && data.initial_balance < 0) {
        throw AppError.badRequest('Conta poupança não pode ter saldo inicial negativo');
      }
    }

    // Validar dados bancários se fornecidos
    if ('bank_details' in data && data.bank_details) {
      const { bank_details } = data;
      
      if (bank_details.account_number && bank_details.account_number.trim().length === 0) {
        throw AppError.badRequest('Número da conta bancária não pode ser vazio');
      }

      if (bank_details.agency && bank_details.agency.trim().length === 0) {
        throw AppError.badRequest('Agência não pode ser vazia');
      }
    }
  }

  protected async beforeCreate(data: CreateFinancialAccountDto): Promise<void> {
    await this.validateAccountData(data);
  }

  protected async beforeUpdate(id: string | number, data: UpdateFinancialAccountDto): Promise<void> {
    await this.validateAccountData(data);
  }
}

