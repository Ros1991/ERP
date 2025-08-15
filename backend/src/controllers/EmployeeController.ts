import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { EmployeeService } from '../services/EmployeeService';
import { EmployeeDocumentService } from '../services/EmployeeDocumentService';
import { 
  CreateEmployeeDto, 
  UpdateEmployeeDto, 
  EmployeeFilterDto,
  BulkUpdateEmployeeStatusDto,
  EmployeePayrollToggleDto,
  CreateEmployeeDocumentDto,
  UpdateEmployeeDocumentDto,
  EmployeeStatus
} from '../dtos/EmployeeDto';

export class EmployeeController extends BaseController {
  private employeeService: EmployeeService;
  private employeeDocumentService: EmployeeDocumentService;

  constructor() {
    super();
    this.employeeService = new EmployeeService();
    this.employeeDocumentService = new EmployeeDocumentService();
  }

  // CRUD de Funcionários
  create = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeService.create.bind(this.employeeService),
      serviceArgs: [companyId],
      successMessage: 'Funcionário criado com sucesso',
      successStatus: 201,
      dtoClass: CreateEmployeeDto,
      validateDto: true
    });
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeService.findByCompanyWithFilters.bind(this.employeeService),
      serviceArgs: [companyId],
      successMessage: 'Funcionários recuperados com sucesso',
      dtoClass: EmployeeFilterDto,
      validateDto: true,
      useQueryParams: true
    });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.findByIdAndCompany(employeeId, companyId),
      successMessage: 'Funcionário recuperado com sucesso'
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeService.update.bind(this.employeeService),
      serviceArgs: [employeeId, companyId],
      successMessage: 'Funcionário atualizado com sucesso',
      dtoClass: UpdateEmployeeDto,
      validateDto: true
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.delete(employeeId, companyId),
      successMessage: 'Funcionário excluído com sucesso'
    });
  };

  // Estatísticas e Relatórios
  getStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.getEmployeeStats(companyId),
      successMessage: 'Estatísticas recuperadas com sucesso'
    });
  };

  // Operações em Lote
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeService.bulkUpdateStatus.bind(this.employeeService),
      serviceArgs: [companyId],
      successMessage: 'Status dos funcionários atualizado com sucesso',
      dtoClass: BulkUpdateEmployeeStatusDto,
      validateDto: true
    });
  };

  togglePayrollStatus = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeService.togglePayrollStatus.bind(this.employeeService),
      serviceArgs: [employeeId, companyId],
      successMessage: 'Status da folha de pagamento atualizado com sucesso',
      dtoClass: EmployeePayrollToggleDto,
      validateDto: true
    });
  };

  // Filtros Específicos
  getByStatus = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { status } = req.params;
    
    // Validar status
    if (!Object.values(EmployeeStatus).includes(status as EmployeeStatus)) {
      res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
      return;
    }
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.getEmployeesByStatus(companyId, status as EmployeeStatus),
      successMessage: 'Funcionários recuperados com sucesso'
    });
  };

  getInPayroll = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.getEmployeesInPayroll(companyId),
      successMessage: 'Funcionários na folha de pagamento recuperados com sucesso'
    });
  };

  getUpcomingBirthdays = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const days = parseInt(req.query.days as string) || 30;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.getUpcomingBirthdays(companyId, days),
      successMessage: 'Aniversariantes recuperados com sucesso'
    });
  };

  getByRole = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { roleId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.getEmployeesByRole(companyId, roleId),
      successMessage: 'Funcionários do perfil recuperados com sucesso'
    });
  };

  search = async (req: Request, res: Response): Promise<void> => {
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
      serviceMethod: () => this.employeeService.searchEmployees(companyId, searchTerm),
      successMessage: 'Busca realizada com sucesso'
    });
  };

  // Gestão de Documentos
  createDocument = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    const uploadedByUserId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeDocumentService.create.bind(this.employeeDocumentService),
      serviceArgs: [employeeId, companyId, uploadedByUserId],
      successMessage: 'Documento criado com sucesso',
      successStatus: 201,
      dtoClass: CreateEmployeeDocumentDto,
      validateDto: true
    });
  };

  getDocuments = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeDocumentService.findByEmployee(employeeId, companyId),
      successMessage: 'Documentos recuperados com sucesso'
    });
  };

  getDocumentById = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId, documentId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeDocumentService.findByIdAndEmployee(documentId, employeeId, companyId),
      successMessage: 'Documento recuperado com sucesso'
    });
  };

  updateDocument = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId, documentId } = req.params;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.employeeDocumentService.update.bind(this.employeeDocumentService),
      serviceArgs: [documentId, employeeId, companyId],
      successMessage: 'Documento atualizado com sucesso',
      dtoClass: UpdateEmployeeDocumentDto,
      validateDto: true
    });
  };

  deleteDocument = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId, documentId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeDocumentService.delete(documentId, employeeId, companyId),
      successMessage: 'Documento excluído com sucesso'
    });
  };

  getDocumentsByType = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId, documentType } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeDocumentService.findByDocumentType(employeeId, companyId, documentType),
      successMessage: 'Documentos recuperados com sucesso'
    });
  };

  searchDocuments = async (req: Request, res: Response): Promise<void> => {
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
      serviceMethod: () => this.employeeDocumentService.searchDocuments(companyId, searchTerm),
      successMessage: 'Busca de documentos realizada com sucesso'
    });
  };

  getDocumentStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const { employeeId } = req.params;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeService.getEmployeeDocumentStats(employeeId, companyId),
      successMessage: 'Estatísticas de documentos recuperadas com sucesso'
    });
  };

  getCompanyDocumentStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeDocumentService.getCompanyDocumentStats(companyId),
      successMessage: 'Estatísticas de documentos da empresa recuperadas com sucesso'
    });
  };

  getAllDocuments = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.employeeDocumentService.getDocumentsByCompany(companyId),
      successMessage: 'Todos os documentos recuperados com sucesso'
    });
  };
}

