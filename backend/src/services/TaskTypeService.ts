import { BaseService } from './BaseService';
import { TaskType } from '../entities/TaskType';
import { TaskTypeRepository } from '../repositories/TaskTypeRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateTaskTypeDto, 
  UpdateTaskTypeDto,
  TaskTypeStatus
} from '../dtos/TaskDto';

export class TaskTypeService extends BaseService<TaskType, CreateTaskTypeDto, UpdateTaskTypeDto> {
  constructor() {
    const taskTypeRepository = new TaskTypeRepository();
    super(taskTypeRepository);
  }

  async create(companyId: string, data: CreateTaskTypeDto): Promise<TaskType> {
    // Verificar se o nome do tipo de tarefa já existe na empresa
    const nameExists = await (this.repository as TaskTypeRepository)
      .taskTypeNameExists(companyId, data.name);
    
    if (nameExists) {
      throw AppError.conflict('Já existe um tipo de tarefa com este nome na empresa');
    }

    // Criar tipo de tarefa
    const taskTypeData = {
      company_id: companyId,
      name: data.name,
      description: data.description || null,
      color: data.color || '#3B82F6', // Azul padrão
      icon: data.icon || 'task',
      is_system: data.is_system || false,
      status: data.status || TaskTypeStatus.ATIVO
    };

    return await this.repository.create(taskTypeData);
  }

  async update(taskTypeId: string, companyId: string, data: UpdateTaskTypeDto): Promise<TaskType> {
    const taskType = await this.findByIdAndCompany(taskTypeId, companyId);

    // Não permitir alteração de tipos de sistema
    if (taskType.is_system) {
      throw AppError.badRequest('Não é possível alterar tipos de tarefa do sistema');
    }

    // Verificar nome se foi alterado
    if (data.name && data.name !== taskType.name) {
      const nameExists = await (this.repository as TaskTypeRepository)
        .taskTypeNameExists(companyId, data.name, taskTypeId);
      
      if (nameExists) {
        throw AppError.conflict('Já existe um tipo de tarefa com este nome na empresa');
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.color) updateData.color = data.color;
    if (data.icon) updateData.icon = data.icon;
    if (data.status) updateData.status = data.status;

    return await this.repository.update(taskTypeId, updateData) as TaskType;
  }

  async findByIdAndCompany(taskTypeId: string, companyId: string): Promise<TaskType> {
    const taskType = await (this.repository as TaskTypeRepository).findByIdWithDetails(taskTypeId);
    
    if (!taskType || taskType.company_id !== companyId) {
      throw AppError.notFound('Tipo de tarefa não encontrado');
    }

    return taskType;
  }

  async findByCompany(companyId: string): Promise<TaskType[]> {
    return await (this.repository as TaskTypeRepository).findByCompanyId(companyId);
  }

  async findActiveTaskTypes(companyId: string): Promise<TaskType[]> {
    return await (this.repository as TaskTypeRepository).findActiveTaskTypes(companyId);
  }

  async findSystemTaskTypes(companyId: string): Promise<TaskType[]> {
    return await (this.repository as TaskTypeRepository).findSystemTaskTypes(companyId);
  }

  async findCustomTaskTypes(companyId: string): Promise<TaskType[]> {
    return await (this.repository as TaskTypeRepository).findCustomTaskTypes(companyId);
  }

  async getTaskTypeStats(companyId: string): Promise<any> {
    return await (this.repository as TaskTypeRepository).getTaskTypeStats(companyId);
  }

  async getTaskTypesByStatus(companyId: string, status: TaskTypeStatus): Promise<TaskType[]> {
    return await (this.repository as TaskTypeRepository).findByStatus(companyId, status);
  }

  async getTaskTypesWithTaskCount(companyId: string): Promise<Array<TaskType & { taskCount: number }>> {
    return await (this.repository as TaskTypeRepository).getTaskTypesWithTaskCount(companyId);
  }

  async getPopularTaskTypes(companyId: string, limit?: number): Promise<Array<{
    task_type: TaskType;
    task_count: number;
    completion_rate: number;
  }>> {
    return await (this.repository as TaskTypeRepository).getPopularTaskTypes(companyId, limit);
  }

  async bulkUpdateStatus(companyId: string, taskTypeIds: string[], status: TaskTypeStatus): Promise<{ updated: number }> {
    // Verificar se todos os tipos de tarefa pertencem à empresa
    for (const taskTypeId of taskTypeIds) {
      const taskType = await this.findByIdAndCompany(taskTypeId, companyId);
      
      // Não permitir alteração de tipos de sistema
      if (taskType.is_system) {
        throw AppError.badRequest(`Não é possível alterar o tipo de tarefa do sistema: ${taskType.name}`);
      }
    }

    const updatedCount = await (this.repository as TaskTypeRepository)
      .bulkUpdateStatus(taskTypeIds, status);

    return { updated: updatedCount };
  }

  async searchTaskTypes(companyId: string, searchTerm: string): Promise<TaskType[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as TaskTypeRepository)
      .searchTaskTypes(companyId, searchTerm.trim());
  }

  async delete(taskTypeId: string, companyId: string): Promise<void> {
    const taskType = await this.findByIdAndCompany(taskTypeId, companyId);

    // Verificar se o tipo de tarefa pode ser excluído
    const canDelete = await (this.repository as TaskTypeRepository).canDeleteTaskType(taskTypeId);
    
    if (!canDelete) {
      if (taskType.is_system) {
        throw AppError.badRequest('Não é possível excluir tipos de tarefa do sistema');
      } else {
        throw AppError.badRequest('Não é possível excluir um tipo de tarefa que possui tarefas associadas');
      }
    }

    // Excluir tipo de tarefa
    await this.repository.delete(taskTypeId);
  }

  async createDefaultTaskTypes(companyId: string): Promise<TaskType[]> {
    const defaultTypes = [
      {
        name: 'Desenvolvimento',
        description: 'Tarefas relacionadas ao desenvolvimento de software',
        color: '#10B981',
        icon: 'code',
        is_system: true
      },
      {
        name: 'Bug Fix',
        description: 'Correção de bugs e problemas',
        color: '#EF4444',
        icon: 'bug',
        is_system: true
      },
      {
        name: 'Reunião',
        description: 'Reuniões e encontros',
        color: '#8B5CF6',
        icon: 'users',
        is_system: true
      },
      {
        name: 'Documentação',
        description: 'Criação e atualização de documentação',
        color: '#F59E0B',
        icon: 'document',
        is_system: true
      },
      {
        name: 'Teste',
        description: 'Testes e validações',
        color: '#06B6D4',
        icon: 'check',
        is_system: true
      },
      {
        name: 'Suporte',
        description: 'Atendimento e suporte ao cliente',
        color: '#84CC16',
        icon: 'support',
        is_system: true
      }
    ];

    const createdTypes: TaskType[] = [];

    for (const typeData of defaultTypes) {
      // Verificar se já existe
      const exists = await (this.repository as TaskTypeRepository)
        .taskTypeNameExists(companyId, typeData.name);
      
      if (!exists) {
        const taskType = await this.repository.create({
          company_id: companyId,
          ...typeData,
          status: TaskTypeStatus.ATIVO
        });
        createdTypes.push(taskType);
      }
    }

    return createdTypes;
  }

  async validateTaskTypeData(data: CreateTaskTypeDto | UpdateTaskTypeDto): Promise<void> {
    // Validações adicionais de negócio
    
    if ('name' in data && data.name) {
      if (data.name.trim().length < 2) {
        throw AppError.badRequest('Nome do tipo de tarefa deve ter pelo menos 2 caracteres');
      }

      if (data.name.trim().length > 50) {
        throw AppError.badRequest('Nome do tipo de tarefa deve ter no máximo 50 caracteres');
      }
    }

    if ('description' in data && data.description) {
      if (data.description.trim().length > 200) {
        throw AppError.badRequest('Descrição deve ter no máximo 200 caracteres');
      }
    }

    if ('color' in data && data.color) {
      // Validar formato de cor hexadecimal
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorRegex.test(data.color)) {
        throw AppError.badRequest('Cor deve estar no formato hexadecimal (#RRGGBB ou #RGB)');
      }
    }

    if ('icon' in data && data.icon) {
      if (data.icon.trim().length > 30) {
        throw AppError.badRequest('Ícone deve ter no máximo 30 caracteres');
      }
    }
  }

  protected async beforeCreate(data: CreateTaskTypeDto): Promise<void> {
    await this.validateTaskTypeData(data);
  }

  protected async beforeUpdate(id: string | number, data: UpdateTaskTypeDto): Promise<void> {
    await this.validateTaskTypeData(data);
  }
}

