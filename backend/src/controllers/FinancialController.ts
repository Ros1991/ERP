import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { FinancialAccountService } from '../services/FinancialAccountService';
import { CostCenterService } from '../services/CostCenterService';
import { TransactionService } from '../services/TransactionService';
import { 
  CreateFinancialAccountDto, 
  UpdateFinancialAccountDto, 
  CreateCostCenterDto,
  UpdateCostCenterDto,
  CreateTransactionDto,
  UpdateTransactionDto,
  FinancialFilterDto,
  TransferBetweenAccountsDto,
  BulkUpdateTransactionStatusDto,
  AccountType,
  AccountStatus,
  TransactionType,
  TransactionStatus
} from '../dtos/FinancialDto';

export class FinancialController extends BaseController {
  private financialAccountService: FinancialAccountService;
  private costCenterService: CostCenterService;
  private transactionService: TransactionService;

  constructor() {
    super();
    this.financialAccountService = new FinancialAccountService();
    this.costCenterService = new CostCenterService();
    this.transactionService = new TransactionService();
  }

  // ===== CONTAS FINANCEIRAS =====

  createAccount = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.financialAccountService.create.bind(this.financialAccountService),
      serviceArgs: [companyId],
      successMessage: 'Conta financeira criada com sucesso',
      successStatus: 201,
      dtoClass: CreateFinancialAccountDto,
      validateDto: true
    });
  };

  findAllAccounts = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.financialAccountService.findByCompanyWithFilters.bind(this.financialAccountService),
      serviceArgs: [companyId],
      successMessage: 'Contas financeiras recuperadas com sucesso',
      dtoClass: FinancialFilterDto,
      validateDto: true,
      useQueryParams: true
    });
  };

  findAccountById = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { accountId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.findByIdAndCompany(accountId, companyId),
      successMessage: 'Conta financeira recuperada com sucesso'
    });
  };

  updateAccount = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { accountId } = req.params;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.financialAccountService.update.bind(this.financialAccountService),
      serviceArgs: [accountId, companyId],
      successMessage: 'Conta financeira atualizada com sucesso',
      dtoClass: UpdateFinancialAccountDto,
      validateDto: true
    });
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { accountId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.delete(accountId, companyId),
      successMessage: 'Conta financeira excluída com sucesso'
    });
  };

  getAccountStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.getAccountStats(companyId),
      successMessage: 'Estatísticas das contas recuperadas com sucesso'
    });
  };

  getAccountsByType = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { type } = req.params;
    
    if (!Object.values(AccountType).includes(type as AccountType)) {
      res.status(400).json({
        success: false,
        message: 'Tipo de conta inválido'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.getAccountsByType(companyId, type as AccountType),
      successMessage: 'Contas recuperadas com sucesso'
    });
  };

  getAccountsByStatus = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { status } = req.params;
    
    if (!Object.values(AccountStatus).includes(status as AccountStatus)) {
      res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.getAccountsByStatus(companyId, status as AccountStatus),
      successMessage: 'Contas recuperadas com sucesso'
    });
  };

  updateAccountBalance = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { accountId } = req.params;
    const { balance } = req.body;
    
    if (typeof balance !== 'number') {
      res.status(400).json({
        success: false,
        message: 'Saldo deve ser um número'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.updateAccountBalance(accountId, companyId, balance),
      successMessage: 'Saldo da conta atualizado com sucesso'
    });
  };

  adjustAccountBalance = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { accountId } = req.params;
    const { amount } = req.body;
    
    if (typeof amount !== 'number') {
      res.status(400).json({
        success: false,
        message: 'Valor deve ser um número'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.adjustAccountBalance(accountId, companyId, amount),
      successMessage: 'Saldo da conta ajustado com sucesso'
    });
  };

  searchAccounts = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { q: searchTerm } = req.query;
    
    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Termo de busca é obrigatório'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.financialAccountService.searchAccounts(companyId, searchTerm),
      successMessage: 'Busca realizada com sucesso'
    });
  };

  // ===== CENTROS DE CUSTO =====

  createCostCenter = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.costCenterService.create.bind(this.costCenterService),
      serviceArgs: [companyId],
      successMessage: 'Centro de custo criado com sucesso',
      successStatus: 201,
      dtoClass: CreateCostCenterDto,
      validateDto: true
    });
  };

  findAllCostCenters = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.findByCompany(companyId),
      successMessage: 'Centros de custo recuperados com sucesso'
    });
  };

  findCostCenterHierarchy = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.findHierarchy(companyId),
      successMessage: 'Hierarquia de centros de custo recuperada com sucesso'
    });
  };

  findCostCenterById = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { costCenterId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.findByIdAndCompany(costCenterId, companyId),
      successMessage: 'Centro de custo recuperado com sucesso'
    });
  };

  updateCostCenter = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { costCenterId } = req.params;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.costCenterService.update.bind(this.costCenterService),
      serviceArgs: [costCenterId, companyId],
      successMessage: 'Centro de custo atualizado com sucesso',
      dtoClass: UpdateCostCenterDto,
      validateDto: true
    });
  };

  deleteCostCenter = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { costCenterId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.delete(costCenterId, companyId),
      successMessage: 'Centro de custo excluído com sucesso'
    });
  };

  getCostCenterStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.getCostCenterStats(companyId),
      successMessage: 'Estatísticas dos centros de custo recuperadas com sucesso'
    });
  };

  moveCostCenter = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { costCenterId } = req.params;
    const { newParentId } = req.body;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.moveCostCenter(costCenterId, companyId, newParentId || null),
      successMessage: 'Centro de custo movido com sucesso'
    });
  };

  searchCostCenters = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { q: searchTerm } = req.query;
    
    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Termo de busca é obrigatório'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.costCenterService.searchCostCenters(companyId, searchTerm),
      successMessage: 'Busca realizada com sucesso'
    });
  };

  // ===== TRANSAÇÕES =====

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.transactionService.create.bind(this.transactionService),
      serviceArgs: [companyId],
      successMessage: 'Transação criada com sucesso',
      successStatus: 201,
      dtoClass: CreateTransactionDto,
      validateDto: true
    });
  };

  findAllTransactions = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.transactionService.findByCompanyWithFilters.bind(this.transactionService),
      serviceArgs: [companyId],
      successMessage: 'Transações recuperadas com sucesso',
      dtoClass: FinancialFilterDto,
      validateDto: true,
      useQueryParams: true
    });
  };

  findTransactionById = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { transactionId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.findByIdAndCompany(transactionId, companyId),
      successMessage: 'Transação recuperada com sucesso'
    });
  };

  updateTransaction = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { transactionId } = req.params;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.transactionService.update.bind(this.transactionService),
      serviceArgs: [transactionId, companyId],
      successMessage: 'Transação atualizada com sucesso',
      dtoClass: UpdateTransactionDto,
      validateDto: true
    });
  };

  deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { transactionId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.delete(transactionId, companyId),
      successMessage: 'Transação excluída com sucesso'
    });
  };

  getTransactionStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getTransactionStats(companyId),
      successMessage: 'Estatísticas das transações recuperadas com sucesso'
    });
  };

  transferBetweenAccounts = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.transactionService.transferBetweenAccounts.bind(this.transactionService),
      serviceArgs: [companyId],
      successMessage: 'Transferência realizada com sucesso',
      dtoClass: TransferBetweenAccountsDto,
      validateDto: true
    });
  };

  bulkUpdateTransactionStatus = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.transactionService.bulkUpdateStatus.bind(this.transactionService),
      serviceArgs: [companyId],
      successMessage: 'Status das transações atualizado com sucesso',
      dtoClass: BulkUpdateTransactionStatusDto,
      validateDto: true
    });
  };

  getTransactionsByType = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { type } = req.params;
    
    if (!Object.values(TransactionType).includes(type as TransactionType)) {
      res.status(400).json({
        success: false,
        message: 'Tipo de transação inválido'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getTransactionsByType(companyId, type as TransactionType),
      successMessage: 'Transações recuperadas com sucesso'
    });
  };

  getTransactionsByStatus = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { status } = req.params;
    
    if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getTransactionsByStatus(companyId, status as TransactionStatus),
      successMessage: 'Transações recuperadas com sucesso'
    });
  };

  getTransactionsByAccount = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { accountId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getTransactionsByAccount(accountId, companyId),
      successMessage: 'Transações da conta recuperadas com sucesso'
    });
  };

  getTransactionsByCostCenter = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { costCenterId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getTransactionsByCostCenter(costCenterId, companyId),
      successMessage: 'Transações do centro de custo recuperadas com sucesso'
    });
  };

  searchTransactions = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { q: searchTerm } = req.query;
    
    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Termo de busca é obrigatório'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.searchTransactions(companyId, searchTerm),
      successMessage: 'Busca realizada com sucesso'
    });
  };

  getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { year, month } = req.params;
    
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      res.status(400).json({
        success: false,
        message: 'Ano e mês devem ser números válidos'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getMonthlyReport(companyId, yearNum, monthNum),
      successMessage: 'Relatório mensal recuperado com sucesso'
    });
  };

  getCostCenterReport = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Data inicial e final são obrigatórias'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getCostCenterReport(
        companyId, 
        new Date(startDate as string), 
        new Date(endDate as string)
      ),
      successMessage: 'Relatório por centro de custo recuperado com sucesso'
    });
  };

  getPendingTransactions = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getPendingTransactions(companyId),
      successMessage: 'Transações pendentes recuperadas com sucesso'
    });
  };

  getRecentTransactions = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.transactionService.getRecentTransactions(companyId, limit),
      successMessage: 'Transações recentes recuperadas com sucesso'
    });
  };
}

