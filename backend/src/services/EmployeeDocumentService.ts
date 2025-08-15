import { BaseService } from './BaseService';
import { EmployeeDocument } from '../entities/EmployeeDocument';
import { EmployeeDocumentRepository } from '../repositories/EmployeeDocumentRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateEmployeeDocumentDto, 
  UpdateEmployeeDocumentDto,
  EmployeeDocumentResponseDto
} from '../dtos/EmployeeDto';

export class EmployeeDocumentService extends BaseService<EmployeeDocument, CreateEmployeeDocumentDto, UpdateEmployeeDocumentDto> {
  private employeeRepository: EmployeeRepository;

  constructor() {
    const employeeDocumentRepository = new EmployeeDocumentRepository();
    super(employeeDocumentRepository);
    this.employeeRepository = new EmployeeRepository();
  }

  async create(employeeId: string, companyId: string, uploadedByUserId: string, data: CreateEmployeeDocumentDto): Promise<EmployeeDocument> {
    // Verificar se o funcionário existe e pertence à empresa
    const employee = await this.employeeRepository.findByIdWithDetails(employeeId);
    
    if (!employee || employee.company_id !== companyId) {
      throw AppError.notFound('Funcionário não encontrado');
    }

    // Validar tipo de arquivo
    await this.validateFileType(data.mime_type, data.file_name);

    // Validar tamanho do arquivo (máximo 10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB em bytes
    if (data.file_size > maxFileSize) {
      throw AppError.badRequest('Arquivo muito grande. Tamanho máximo permitido: 10MB');
    }

    // Verificar se já existe um documento do mesmo tipo (para alguns tipos únicos)
    const uniqueDocumentTypes = ['CPF', 'RG', 'CNH', 'CTPS', 'TITULO_ELEITOR'];
    if (uniqueDocumentTypes.includes(data.document_type.toUpperCase())) {
      const existingDocument = await (this.repository as EmployeeDocumentRepository)
        .findByDocumentType(employeeId, data.document_type);
      
      if (existingDocument.length > 0) {
        throw AppError.conflict(`Já existe um documento do tipo ${data.document_type} para este funcionário`);
      }
    }

    // Criar documento
    const documentData = {
      employee_id: employeeId,
      document_type: data.document_type,
      file_url: data.file_url,
      file_name: data.file_name,
      file_size: data.file_size,
      mime_type: data.mime_type,
      description: data.description || null,
      uploaded_by_user_id: uploadedByUserId
    };

    return await this.repository.create(documentData);
  }

  async update(documentId: string, employeeId: string, companyId: string, data: UpdateEmployeeDocumentDto): Promise<EmployeeDocument> {
    // Verificar se o documento existe e pertence ao funcionário
    const document = await this.findByIdAndEmployee(documentId, employeeId, companyId);

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.document_type) {
      // Verificar se o novo tipo não conflita com documentos únicos existentes
      const uniqueDocumentTypes = ['CPF', 'RG', 'CNH', 'CTPS', 'TITULO_ELEITOR'];
      if (uniqueDocumentTypes.includes(data.document_type.toUpperCase())) {
        const existingDocument = await (this.repository as EmployeeDocumentRepository)
          .findByDocumentType(employeeId, data.document_type);
        
        const conflictingDoc = existingDocument.find(doc => doc.id !== documentId);
        if (conflictingDoc) {
          throw AppError.conflict(`Já existe um documento do tipo ${data.document_type} para este funcionário`);
        }
      }
      
      updateData.document_type = data.document_type;
    }
    
    if (data.description !== undefined) updateData.description = data.description;

    return await this.repository.update(documentId, updateData) as EmployeeDocument;
  }

  async findByIdAndEmployee(documentId: string, employeeId: string, companyId: string): Promise<EmployeeDocument> {
    // Verificar se o funcionário existe e pertence à empresa
    const employee = await this.employeeRepository.findByIdWithDetails(employeeId);
    
    if (!employee || employee.company_id !== companyId) {
      throw AppError.notFound('Funcionário não encontrado');
    }

    // Buscar documento
    const document = await (this.repository as EmployeeDocumentRepository)
      .findByIdAndEmployee(documentId, employeeId);
    
    if (!document) {
      throw AppError.notFound('Documento não encontrado');
    }

    return document;
  }

  async findByEmployee(employeeId: string, companyId: string): Promise<EmployeeDocument[]> {
    // Verificar se o funcionário existe e pertence à empresa
    const employee = await this.employeeRepository.findByIdWithDetails(employeeId);
    
    if (!employee || employee.company_id !== companyId) {
      throw AppError.notFound('Funcionário não encontrado');
    }

    return await (this.repository as EmployeeDocumentRepository).findByEmployeeId(employeeId);
  }

  async findByDocumentType(employeeId: string, companyId: string, documentType: string): Promise<EmployeeDocument[]> {
    // Verificar se o funcionário existe e pertence à empresa
    const employee = await this.employeeRepository.findByIdWithDetails(employeeId);
    
    if (!employee || employee.company_id !== companyId) {
      throw AppError.notFound('Funcionário não encontrado');
    }

    return await (this.repository as EmployeeDocumentRepository)
      .findByDocumentType(employeeId, documentType);
  }

  async delete(documentId: string, employeeId: string, companyId: string): Promise<void> {
    const document = await this.findByIdAndEmployee(documentId, employeeId, companyId);

    // Aqui você poderia adicionar lógica para excluir o arquivo físico do storage
    // Por exemplo, se usando AWS S3, Google Cloud Storage, etc.

    await this.repository.delete(documentId);
  }

  async bulkDelete(documentIds: string[], companyId: string): Promise<{ deleted: number }> {
    // Verificar se todos os documentos pertencem à empresa
    for (const documentId of documentIds) {
      const document = await this.repository.findById(documentId);
      if (!document) {
        throw AppError.notFound(`Documento ${documentId} não encontrado`);
      }

      // Verificar se o funcionário pertence à empresa
      const employee = await this.employeeRepository.findByIdWithDetails(document.employee_id);
      if (!employee || employee.company_id !== companyId) {
        throw AppError.forbidden(`Documento ${documentId} não pertence à empresa`);
      }
    }

    const deletedCount = await (this.repository as EmployeeDocumentRepository)
      .bulkDeleteDocuments(documentIds);

    return { deleted: deletedCount };
  }

  async searchDocuments(companyId: string, searchTerm: string): Promise<EmployeeDocument[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as EmployeeDocumentRepository)
      .searchDocuments(companyId, searchTerm.trim());
  }

  async getCompanyDocumentStats(companyId: string): Promise<any> {
    return await (this.repository as EmployeeDocumentRepository)
      .getCompanyDocumentStats(companyId);
  }

  async getDocumentsByCompany(companyId: string): Promise<EmployeeDocument[]> {
    return await (this.repository as EmployeeDocumentRepository)
      .findDocumentsByCompany(companyId);
  }

  private async validateFileType(mimeType: string, fileName: string): Promise<void> {
    // Tipos de arquivo permitidos
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw AppError.badRequest('Tipo de arquivo não permitido');
    }

    // Verificar extensão do arquivo
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.txt'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw AppError.badRequest('Extensão de arquivo não permitida');
    }

    // Verificar se a extensão corresponde ao MIME type
    const mimeExtensionMap: Record<string, string[]> = {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    };

    const expectedExtensions = mimeExtensionMap[mimeType];
    if (expectedExtensions && !expectedExtensions.includes(fileExtension)) {
      throw AppError.badRequest('Extensão do arquivo não corresponde ao tipo informado');
    }
  }

  protected async beforeCreate(data: CreateEmployeeDocumentDto): Promise<void> {
    // Validações adicionais podem ser adicionadas aqui
    if (!data.document_type || data.document_type.trim().length === 0) {
      throw AppError.badRequest('Tipo de documento é obrigatório');
    }

    if (!data.file_url || data.file_url.trim().length === 0) {
      throw AppError.badRequest('URL do arquivo é obrigatória');
    }

    if (!data.file_name || data.file_name.trim().length === 0) {
      throw AppError.badRequest('Nome do arquivo é obrigatório');
    }
  }

  protected async beforeUpdate(id: string | number, data: UpdateEmployeeDocumentDto): Promise<void> {
    // Validações adicionais para atualização
    if (data.document_type !== undefined && (!data.document_type || data.document_type.trim().length === 0)) {
      throw AppError.badRequest('Tipo de documento não pode ser vazio');
    }
  }
}

