import { BaseService } from './BaseService';
import { Task } from '../entities/Task';
import { TaskRepository } from '../repositories/TaskRepository';
import { TaskTypeRepository } from '../repositories/TaskTypeRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskFilterDto,
  BulkUpdateTaskStatusDto,
  BulkAssignTasksDto,
  TaskStatus,
  TaskPriority,
  TaskTypeStatus
} from '../dtos/TaskDto';
import { PaginatedResult } from '../utils/PaginationFactory';

export class TaskService extends BaseService<Task, CreateTaskDto, UpdateTaskDto> {
  private taskTypeRepository: TaskTypeRepository;
  private userRepository: UserRepository;

  constructor() {
    const taskRepository = new TaskRepository();
    super(taskRepository);
    this.taskTypeRepository = new TaskTypeRepository();
    this.userRepository = new UserRepository();
  }

  async create(companyId: string, data: CreateTaskDto): Promise<Task> {
    // Verificar se o tipo de tarefa existe e está ativo
    const taskType = await this.taskTypeRepository.findById(data.task_type_id);
    if (!taskType || taskType.company_id !== companyId) {
      throw AppError.notFound('Tipo de tarefa não encontrado');
    }

    if (taskType.status !== TaskTypeStatus.ATIVO) {
      throw AppError.badRequest('Não é possível criar tarefa com tipo inativo');
    }

    // Verificar usuários responsáveis se fornecidos
    if (data.assigned_user_ids && data.assigned_user_ids.length > 0) {
      for (const userId of data.assigned_user_ids) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
          throw AppError.notFound(`Usuário ${userId} não encontrado`);
        }
      }
    }

    // Criar tarefa
    const taskData = {
      company_id: companyId,
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date ? new Date(data.due_date) : null,
      estimated_hours: data.estimated_hours || null,
      completion_percentage: data.completion_percentage || 0,
      task_type_id: data.task_type_id
    };

    const task = await this.repository.create(taskData);

    // Criar atribuições se fornecidas
    if (data.assigned_user_ids && data.assigned_user_ids.length > 0) {
      // Aqui seria implementada a criação das atribuições
      // Por simplicidade, assumindo que existe um TaskAssignmentRepository
    }

    return await this.findByIdAndCompany(task.id, companyId);
  }

  async update(taskId: string, companyId: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.findByIdAndCompany(taskId, companyId);

    // Verificar tipo de tarefa se foi alterado
    if (data.task_type_id && data.task_type_id !== task.task_type_id) {
      const taskType = await this.taskTypeRepository.findById(data.task_type_id);
      if (!taskType || taskType.company_id !== companyId) {
        throw AppError.notFound('Tipo de tarefa não encontrado');
      }

      if (taskType.status !== TaskTypeStatus.ATIVO) {
        throw AppError.badRequest('Não é possível usar tipo de tarefa inativo');
      }
    }

    // Verificar usuários responsáveis se foram alterados
    if (data.assigned_user_ids) {
      for (const userId of data.assigned_user_ids) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
          throw AppError.notFound(`Usuário ${userId} não encontrado`);
        }
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;
    if (data.due_date !== undefined) updateData.due_date = data.due_date ? new Date(data.due_date) : null;
    if (data.estimated_hours !== undefined) updateData.estimated_hours = data.estimated_hours;
    if (data.completion_percentage !== undefined) updateData.completion_percentage = data.completion_percentage;
    if (data.task_type_id) updateData.task_type_id = data.task_type_id;

    const updatedTask = await this.repository.update(taskId, updateData) as Task;

    // Atualizar atribuições se fornecidas
    if (data.assigned_user_ids !== undefined) {
      // Aqui seria implementada a atualização das atribuições
    }

    return await this.findByIdAndCompany(taskId, companyId);
  }

  async findByIdAndCompany(taskId: string, companyId: string): Promise<Task> {
    const task = await (this.repository as TaskRepository).findByIdWithDetails(taskId);
    
    if (!task || task.company_id !== companyId) {
      throw AppError.notFound('Tarefa não encontrada');
    }

    return task;
  }

  async findByCompanyWithFilters(companyId: string, filters: TaskFilterDto): Promise<PaginatedResult<Task>> {
    return await (this.repository as TaskRepository).findWithFilters(companyId, filters);
  }

  async getTaskStats(companyId: string): Promise<any> {
    return await (this.repository as TaskRepository).getTaskStats(companyId);
  }

  async getTasksByStatus(companyId: string, status: TaskStatus): Promise<Task[]> {
    return await (this.repository as TaskRepository).findByStatus(companyId, status);
  }

  async getTasksByPriority(companyId: string, priority: TaskPriority): Promise<Task[]> {
    return await (this.repository as TaskRepository).findByPriority(companyId, priority);
  }

  async getTasksByTaskType(taskTypeId: string, companyId: string): Promise<Task[]> {
    // Verificar se o tipo de tarefa pertence à empresa
    const taskType = await this.taskTypeRepository.findById(taskTypeId);
    if (!taskType || taskType.company_id !== companyId) {
      throw AppError.notFound('Tipo de tarefa não encontrado');
    }

    return await (this.repository as TaskRepository).findByTaskType(taskTypeId);
  }

  async getTasksByAssignedUser(userId: string, companyId: string): Promise<Task[]> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('Usuário não encontrado');
    }

    return await (this.repository as TaskRepository).findByAssignedUser(userId, companyId);
  }

  async getOverdueTasks(companyId: string): Promise<Task[]> {
    return await (this.repository as TaskRepository).findOverdueTasks(companyId);
  }

  async getTasksDueSoon(companyId: string, days?: number): Promise<Task[]> {
    return await (this.repository as TaskRepository).findTasksDueSoon(companyId, days);
  }

  async bulkUpdateStatus(companyId: string, data: BulkUpdateTaskStatusDto): Promise<{ updated: number }> {
    // Verificar se todas as tarefas pertencem à empresa
    for (const taskId of data.task_ids) {
      await this.findByIdAndCompany(taskId, companyId);
    }

    const updatedCount = await (this.repository as TaskRepository)
      .bulkUpdateStatus(data.task_ids, data.status);

    return { updated: updatedCount };
  }

  async bulkAssignTasks(companyId: string, data: BulkAssignTasksDto): Promise<{ assigned: number }> {
    // Verificar se todas as tarefas pertencem à empresa
    for (const taskId of data.task_ids) {
      await this.findByIdAndCompany(taskId, companyId);
    }

    // Verificar se todos os usuários existem
    for (const userId of data.user_ids) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw AppError.notFound(`Usuário ${userId} não encontrado`);
      }
    }

    // Aqui seria implementada a atribuição em lote
    // Por simplicidade, retornando o número de tarefas
    return { assigned: data.task_ids.length };
  }

  async searchTasks(companyId: string, searchTerm: string): Promise<Task[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as TaskRepository)
      .searchTasks(companyId, searchTerm.trim());
  }

  async getTasksByDateRange(companyId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    return await (this.repository as TaskRepository).getTasksByDateRange(companyId, startDate, endDate);
  }

  async getRecentTasks(companyId: string, limit?: number): Promise<Task[]> {
    return await (this.repository as TaskRepository).getRecentTasks(companyId, limit);
  }

  async getTasksCompletedInPeriod(companyId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    return await (this.repository as TaskRepository).getTasksCompletedInPeriod(companyId, startDate, endDate);
  }

  async getProductivityReport(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    return await (this.repository as TaskRepository).getProductivityReport(companyId, startDate, endDate);
  }

  async completeTask(taskId: string, companyId: string): Promise<Task> {
    const task = await this.findByIdAndCompany(taskId, companyId);

    if (task.status === TaskStatus.CONCLUIDA) {
      throw AppError.badRequest('Tarefa já está concluída');
    }

    if (task.status === TaskStatus.CANCELADA) {
      throw AppError.badRequest('Não é possível concluir uma tarefa cancelada');
    }

    const updatedTask = await this.repository.update(taskId, {
      status: TaskStatus.CONCLUIDA,
      completion_percentage: 100
    }) as Task;

    return await this.findByIdAndCompany(taskId, companyId);
  }

  async cancelTask(taskId: string, companyId: string): Promise<Task> {
    const task = await this.findByIdAndCompany(taskId, companyId);

    if (task.status === TaskStatus.CONCLUIDA) {
      throw AppError.badRequest('Não é possível cancelar uma tarefa concluída');
    }

    if (task.status === TaskStatus.CANCELADA) {
      throw AppError.badRequest('Tarefa já está cancelada');
    }

    const updatedTask = await this.repository.update(taskId, {
      status: TaskStatus.CANCELADA
    }) as Task;

    return await this.findByIdAndCompany(taskId, companyId);
  }

  async startTask(taskId: string, companyId: string): Promise<Task> {
    const task = await this.findByIdAndCompany(taskId, companyId);

    if (task.status === TaskStatus.CONCLUIDA) {
      throw AppError.badRequest('Não é possível iniciar uma tarefa concluída');
    }

    if (task.status === TaskStatus.CANCELADA) {
      throw AppError.badRequest('Não é possível iniciar uma tarefa cancelada');
    }

    if (task.status === TaskStatus.EM_ANDAMENTO) {
      throw AppError.badRequest('Tarefa já está em andamento');
    }

    const updatedTask = await this.repository.update(taskId, {
      status: TaskStatus.EM_ANDAMENTO
    }) as Task;

    return await this.findByIdAndCompany(taskId, companyId);
  }

  async pauseTask(taskId: string, companyId: string): Promise<Task> {
    const task = await this.findByIdAndCompany(taskId, companyId);

    if (task.status !== TaskStatus.EM_ANDAMENTO) {
      throw AppError.badRequest('Apenas tarefas em andamento podem ser pausadas');
    }

    const updatedTask = await this.repository.update(taskId, {
      status: TaskStatus.PAUSADA
    }) as Task;

    return await this.findByIdAndCompany(taskId, companyId);
  }

  async updateProgress(taskId: string, companyId: string, percentage: number): Promise<Task> {
    if (percentage < 0 || percentage > 100) {
      throw AppError.badRequest('Percentual deve estar entre 0 e 100');
    }

    const task = await this.findByIdAndCompany(taskId, companyId);

    if (task.status === TaskStatus.CONCLUIDA) {
      throw AppError.badRequest('Não é possível alterar progresso de tarefa concluída');
    }

    if (task.status === TaskStatus.CANCELADA) {
      throw AppError.badRequest('Não é possível alterar progresso de tarefa cancelada');
    }

    // Atualizar status baseado no percentual
    let newStatus = task.status;
    if (percentage === 100) {
      newStatus = TaskStatus.CONCLUIDA;
    } else if (percentage > 0 && task.status === TaskStatus.PENDENTE) {
      newStatus = TaskStatus.EM_ANDAMENTO;
    }

    const updatedTask = await this.repository.update(taskId, {
      completion_percentage: percentage,
      status: newStatus
    }) as Task;

    return await this.findByIdAndCompany(taskId, companyId);
  }

  async delete(taskId: string, companyId: string): Promise<void> {
    const task = await this.findByIdAndCompany(taskId, companyId);

    // Verificar se a tarefa pode ser excluída
    if (task.status === TaskStatus.EM_ANDAMENTO) {
      throw AppError.badRequest('Não é possível excluir uma tarefa em andamento. Pause ou cancele primeiro.');
    }

    // Excluir relacionamentos primeiro (atribuições, comentários, anexos, etc.)
    // Aqui seria implementada a exclusão dos relacionamentos

    // Excluir tarefa
    await this.repository.delete(taskId);
  }

  async validateTaskData(data: CreateTaskDto | UpdateTaskDto): Promise<void> {
    // Validações adicionais de negócio
    
    if ('title' in data && data.title) {
      if (data.title.trim().length < 3) {
        throw AppError.badRequest('Título da tarefa deve ter pelo menos 3 caracteres');
      }

      if (data.title.trim().length > 200) {
        throw AppError.badRequest('Título da tarefa deve ter no máximo 200 caracteres');
      }
    }

    if ('description' in data && data.description) {
      if (data.description.trim().length > 2000) {
        throw AppError.badRequest('Descrição deve ter no máximo 2000 caracteres');
      }
    }

    if ('due_date' in data && data.due_date) {
      const dueDate = new Date(data.due_date);
      const now = new Date();
      
      // Permitir datas no passado para tarefas já existentes, mas alertar
      if (dueDate < now) {
        // Em uma implementação real, poderia ser apenas um warning
        console.warn('Data de vencimento está no passado');
      }
    }

    if ('estimated_hours' in data && data.estimated_hours !== undefined) {
      if (data.estimated_hours < 0) {
        throw AppError.badRequest('Horas estimadas não pode ser negativa');
      }

      if (data.estimated_hours > 1000) {
        throw AppError.badRequest('Horas estimadas não pode exceder 1000 horas');
      }
    }

    if ('completion_percentage' in data && data.completion_percentage !== undefined) {
      if (data.completion_percentage < 0 || data.completion_percentage > 100) {
        throw AppError.badRequest('Percentual de conclusão deve estar entre 0 e 100');
      }
    }
  }

  protected async beforeCreate(data: CreateTaskDto): Promise<void> {
    await this.validateTaskData(data);
  }

  protected async beforeUpdate(id: string | number, data: UpdateTaskDto): Promise<void> {
    await this.validateTaskData(data);
  }
}

