import { BaseRepository } from './BaseRepository';
import { EmployeeDocument } from '@/entities/EmployeeDocument';

export class EmployeeDocumentRepository extends BaseRepository<EmployeeDocument> {
  constructor() {
    super(EmployeeDocument);
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeeDocument[]> {
    return await this.getRepository()
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.uploaded_by', 'uploaded_by')
      .where('document.employee_id = :employeeId', { employeeId })
      .orderBy('document.created_at', 'DESC')
      .getMany();
  }

  async findByIdAndEmployee(id: string, employeeId: string): Promise<EmployeeDocument | null> {
    return await this.getRepository()
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.uploaded_by', 'uploaded_by')
      .where('document.id = :id', { id })
      .andWhere('document.employee_id = :employeeId', { employeeId })
      .getOne();
  }

  async findByDocumentType(employeeId: string, documentType: string): Promise<EmployeeDocument[]> {
    return await this.findMany({ 
      employee_id: employeeId, 
      document_type: documentType 
    });
  }

  async documentTypeExists(employeeId: string, documentType: string, excludeId?: string): Promise<boolean> {
    const query = this.getRepository()
      .createQueryBuilder('document')
      .where('document.employee_id = :employeeId', { employeeId })
      .andWhere('document.document_type = :documentType', { documentType });

    if (excludeId) {
      query.andWhere('document.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  async getDocumentStats(employeeId: string): Promise<{
    total_documents: number;
    documents_by_type: Record<string, number>;
    total_file_size: number;
    recent_uploads: number;
  }> {
    const total_documents = await this.count({ employee_id: employeeId });

    // Documentos por tipo
    const typeResults = await this.getRepository()
      .createQueryBuilder('document')
      .select('document.document_type', 'document_type')
      .addSelect('COUNT(*)', 'count')
      .where('document.employee_id = :employeeId', { employeeId })
      .groupBy('document.document_type')
      .getRawMany();

    const documents_by_type: Record<string, number> = {};
    typeResults.forEach(result => {
      documents_by_type[result.document_type] = parseInt(result.count);
    });

    // Tamanho total dos arquivos
    const sizeResult = await this.getRepository()
      .createQueryBuilder('document')
      .select('SUM(document.file_size)', 'total_size')
      .where('document.employee_id = :employeeId', { employeeId })
      .getRawOne();

    const total_file_size = parseInt(sizeResult?.total_size || '0');

    // Uploads recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_uploads = await this.getRepository()
      .createQueryBuilder('document')
      .where('document.employee_id = :employeeId', { employeeId })
      .andWhere('document.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    return {
      total_documents,
      documents_by_type,
      total_file_size,
      recent_uploads
    };
  }

  async findDocumentsByCompany(companyId: string): Promise<EmployeeDocument[]> {
    return await this.getRepository()
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.employee', 'employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('document.uploaded_by', 'uploaded_by')
      .where('employee.company_id = :companyId', { companyId })
      .orderBy('document.created_at', 'DESC')
      .getMany();
  }

  async searchDocuments(companyId: string, searchTerm: string): Promise<EmployeeDocument[]> {
    return await this.getRepository()
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.employee', 'employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('document.uploaded_by', 'uploaded_by')
      .where('employee.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(document.document_type) LIKE LOWER(:searchTerm) OR
        LOWER(document.file_name) LIKE LOWER(:searchTerm) OR
        LOWER(document.description) LIKE LOWER(:searchTerm) OR
        LOWER(user.name) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('document.created_at', 'DESC')
      .limit(50)
      .getMany();
  }

  async deleteByEmployeeId(employeeId: string): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(EmployeeDocument)
      .where('employee_id = :employeeId', { employeeId })
      .execute();

    return result.affected ?? 0;
  }

  async bulkDeleteDocuments(documentIds: string[]): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(EmployeeDocument)
      .where('id IN (:...documentIds)', { documentIds })
      .execute();

    return result.affected ?? 0;
  }

  async getCompanyDocumentStats(companyId: string): Promise<{
    total_documents: number;
    total_file_size: number;
    documents_by_type: Record<string, number>;
    recent_uploads: number;
    employees_with_documents: number;
  }> {
    // Total de documentos
    const total_documents = await this.getRepository()
      .createQueryBuilder('document')
      .leftJoin('document.employee', 'employee')
      .where('employee.company_id = :companyId', { companyId })
      .getCount();

    // Tamanho total dos arquivos
    const sizeResult = await this.getRepository()
      .createQueryBuilder('document')
      .leftJoin('document.employee', 'employee')
      .select('SUM(document.file_size)', 'total_size')
      .where('employee.company_id = :companyId', { companyId })
      .getRawOne();

    const total_file_size = parseInt(sizeResult?.total_size || '0');

    // Documentos por tipo
    const typeResults = await this.getRepository()
      .createQueryBuilder('document')
      .leftJoin('document.employee', 'employee')
      .select('document.document_type', 'document_type')
      .addSelect('COUNT(*)', 'count')
      .where('employee.company_id = :companyId', { companyId })
      .groupBy('document.document_type')
      .getRawMany();

    const documents_by_type: Record<string, number> = {};
    typeResults.forEach(result => {
      documents_by_type[result.document_type] = parseInt(result.count);
    });

    // Uploads recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_uploads = await this.getRepository()
      .createQueryBuilder('document')
      .leftJoin('document.employee', 'employee')
      .where('employee.company_id = :companyId', { companyId })
      .andWhere('document.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    // Funcionários com documentos
    const employees_with_documents = await this.getRepository()
      .createQueryBuilder('document')
      .leftJoin('document.employee', 'employee')
      .select('COUNT(DISTINCT document.employee_id)', 'count')
      .where('employee.company_id = :companyId', { companyId })
      .getRawOne();

    return {
      total_documents,
      total_file_size,
      documents_by_type,
      recent_uploads,
      employees_with_documents: parseInt(employees_with_documents?.count || '0')
    };
  }
}

