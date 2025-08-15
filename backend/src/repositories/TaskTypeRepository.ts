import { BaseRepository } from './BaseRepository';
import { TaskType } from '@/entities/TaskType';
import { TaskTypeStatus } from '@/dtos/TaskDto';

export class TaskTypeRepository extends BaseRepository<TaskType> {
  constructor() {
    super(TaskType);
  }

  async findByCompanyId(companyId: string): Promise<TaskType[]> {
    return await this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId })
      .orderBy('task_type.name', 'ASC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<TaskType | null> {
    return await this.getRepository()
      .createQueryBuilder('task_type')
      .leftJoinAndSelect('task_type.tasks', 'tasks')
      .where('task_type.id = :id', { id })
      .getOne();
  }

  async taskTypeNameExists(companyId: string, name: string, excludeId?: string): Promise<boolean> {
    const query = this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId })
      .andWhere('LOWER(task_type.name) = LOWER(:name)', { name });

    if (excludeId) {
      query.andWhere('task_type.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  async findByStatus(companyId: string, status: TaskTypeStatus): Promise<TaskType[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async getTaskTypeStats(companyId: string): Promise<{
    total_task_types: number;
    active_task_types: number;
    inactive_task_types: number;
    system_task_types: number;
    custom_task_types: number;
    task_type_usage: Array<{
      task_type_id: string;
      task_type_name: string;
      task_count: number;
    }>;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_task_types = await baseQuery.getCount();
    
    const active_task_types = await baseQuery
      .clone()
      .andWhere('task_type.status = :status', { status: TaskTypeStatus.ATIVO })
      .getCount();

    const inactive_task_types = await baseQuery
      .clone()
      .andWhere('task_type.status = :status', { status: TaskTypeStatus.INATIVO })
      .getCount();

    const system_task_types = await baseQuery
      .clone()
      .andWhere('task_type.is_system = :isSystem', { isSystem: true })
      .getCount();

    const custom_task_types = await baseQuery
      .clone()
      .andWhere('task_type.is_system = :isSystem', { isSystem: false })
      .getCount();

    // Uso dos tipos de tarefa
    const usageResults = await this.getRepository()
      .createQueryBuilder('task_type')
      .leftJoin('task_type.tasks', 'task')
      .where('task_type.company_id = :companyId', { companyId })
      .select([
        'task_type.id as task_type_id',
        'task_type.name as task_type_name',
        'COUNT(task.id) as task_count'
      ])
      .groupBy('task_type.id')
      .orderBy('task_count', 'DESC')
      .getRawMany();

    const task_type_usage = usageResults.map(result => ({
      task_type_id: result.task_type_id,
      task_type_name: result.task_type_name,
      task_count: parseInt(result.task_count) || 0
    }));

    return {
      total_task_types,
      active_task_types,
      inactive_task_types,
      system_task_types,
      custom_task_types,
      task_type_usage
    };
  }

  async searchTaskTypes(companyId: string, searchTerm: string): Promise<TaskType[]> {
    return await this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(task_type.name) LIKE LOWER(:searchTerm) OR
        LOWER(task_type.description) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('task_type.name', 'ASC')
      .limit(50)
      .getMany();
  }

  async bulkUpdateStatus(taskTypeIds: string[], status: TaskTypeStatus): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(TaskType)
      .set({ status })
      .where('id IN (:...taskTypeIds)', { taskTypeIds })
      .execute();

    return result.affected ?? 0;
  }

  async getTaskTypesWithTaskCount(companyId: string): Promise<Array<TaskType & { taskCount: number }>> {
    const results = await this.getRepository()
      .createQueryBuilder('task_type')
      .leftJoin('task_type.tasks', 'task')
      .where('task_type.company_id = :companyId', { companyId })
      .select([
        'task_type.*',
        'COUNT(task.id) as taskCount'
      ])
      .groupBy('task_type.id')
      .orderBy('task_type.name', 'ASC')
      .getRawMany();

    return results.map(result => ({
      ...result,
      taskCount: parseInt(result.taskCount) || 0
    }));
  }

  async findActiveTaskTypes(companyId: string): Promise<TaskType[]> {
    return await this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId })
      .andWhere('task_type.status = :status', { status: TaskTypeStatus.ATIVO })
      .orderBy('task_type.name', 'ASC')
      .getMany();
  }

  async findSystemTaskTypes(companyId: string): Promise<TaskType[]> {
    return await this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId })
      .andWhere('task_type.is_system = :isSystem', { isSystem: true })
      .orderBy('task_type.name', 'ASC')
      .getMany();
  }

  async findCustomTaskTypes(companyId: string): Promise<TaskType[]> {
    return await this.getRepository()
      .createQueryBuilder('task_type')
      .where('task_type.company_id = :companyId', { companyId })
      .andWhere('task_type.is_system = :isSystem', { isSystem: false })
      .orderBy('task_type.name', 'ASC')
      .getMany();
  }

  async getPopularTaskTypes(companyId: string, limit: number = 10): Promise<Array<{
    task_type: TaskType;
    task_count: number;
    completion_rate: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('task_type')
      .leftJoin('task_type.tasks', 'task')
      .where('task_type.company_id = :companyId', { companyId })
      .andWhere('task_type.status = :status', { status: TaskTypeStatus.ATIVO })
      .select([
        'task_type.*',
        'COUNT(task.id) as task_count',
        'AVG(CASE WHEN task.status = :completedStatus THEN 1.0 ELSE 0.0 END) as completion_rate'
      ])
      .setParameter('completedStatus', 'CONCLUIDA')
      .groupBy('task_type.id')
      .having('COUNT(task.id) > 0')
      .orderBy('task_count', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map(result => ({
      task_type: result,
      task_count: parseInt(result.task_count) || 0,
      completion_rate: parseFloat(result.completion_rate) || 0
    }));
  }

  async canDeleteTaskType(taskTypeId: string): Promise<boolean> {
    const taskType = await this.getRepository()
      .createQueryBuilder('task_type')
      .leftJoinAndSelect('task_type.tasks', 'tasks')
      .where('task_type.id = :taskTypeId', { taskTypeId })
      .getOne();

    if (!taskType) {
      return false;
    }

    // Não pode excluir tipos de sistema
    if (taskType.is_system) {
      return false;
    }

    // Não pode excluir se houver tarefas associadas
    if (taskType.tasks && taskType.tasks.length > 0) {
      return false;
    }

    return true;
  }
}

