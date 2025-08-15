import { BaseRepository } from './BaseRepository';
import { Task } from '@/entities/Task';
import { TaskFilterDto, TaskStatus, TaskPriority } from '@/dtos/TaskDto';
import { PaginatedResult } from '@/utils/PaginationFactory';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super(Task);
  }

  async findByCompanyId(companyId: string): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .orderBy('task.created_at', 'DESC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<Task | null> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .leftJoinAndSelect('task.time_tracking', 'time_tracking')
      .leftJoinAndSelect('time_tracking.user', 'tracking_user')
      .leftJoinAndSelect('task.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'comment_user')
      .leftJoinAndSelect('task.attachments', 'attachments')
      .leftJoinAndSelect('attachments.uploaded_by', 'attachment_user')
      .leftJoinAndSelect('task.history', 'history')
      .leftJoinAndSelect('history.user', 'history_user')
      .where('task.id = :id', { id })
      .getOne();
  }

  async findWithFilters(companyId: string, filters: TaskFilterDto): Promise<PaginatedResult<Task>> {
    const query = this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId });

    // Filtros de busca
    if (filters.search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) OR LOWER(task_type.name) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    // Filtros específicos
    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    if (filters.task_type_id) {
      query.andWhere('task.task_type_id = :taskTypeId', { taskTypeId: filters.task_type_id });
    }

    if (filters.assigned_user_id) {
      query.andWhere('assignments.user_id = :assignedUserId', { assignedUserId: filters.assigned_user_id });
    }

    // Filtros de data de vencimento
    if (filters.due_date_start) {
      query.andWhere('task.due_date >= :dueDateStart', { dueDateStart: new Date(filters.due_date_start) });
    }

    if (filters.due_date_end) {
      query.andWhere('task.due_date <= :dueDateEnd', { dueDateEnd: new Date(filters.due_date_end) });
    }

    // Filtros de percentual de conclusão
    if (filters.completion_min !== undefined) {
      query.andWhere('task.completion_percentage >= :completionMin', { completionMin: filters.completion_min });
    }

    if (filters.completion_max !== undefined) {
      query.andWhere('task.completion_percentage <= :completionMax', { completionMax: filters.completion_max });
    }

    // Filtro de tarefas vencidas
    if (filters.overdue) {
      query.andWhere('task.due_date < :now', { now: new Date() })
           .andWhere('task.status != :completedStatus', { completedStatus: TaskStatus.CONCLUIDA });
    }

    // Filtros de data genéricos
    if (filters.startDate) {
      query.andWhere('task.created_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('task.created_at <= :endDate', { endDate: filters.endDate });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    
    if (sortBy === 'task_type_name') {
      query.orderBy('task_type.name', sortOrder);
    } else if (sortBy === 'assigned_user_name') {
      query.orderBy('user.name', sortOrder);
    } else {
      query.orderBy(`task.${sortBy}`, sortOrder);
    }

    return await this.paginateQuery(query, {
      page: filters.page || 1,
      limit: filters.limit || 20
    });
  }

  async getTaskStats(companyId: string): Promise<{
    total_tasks: number;
    pending_tasks: number;
    in_progress_tasks: number;
    paused_tasks: number;
    completed_tasks: number;
    cancelled_tasks: number;
    overdue_tasks: number;
    tasks_by_status: Record<TaskStatus, number>;
    tasks_by_priority: Record<TaskPriority, number>;
    tasks_by_type: Array<{
      task_type_id: string;
      task_type_name: string;
      count: number;
    }>;
    average_completion_time: number;
    total_hours_tracked: number;
    completion_rate: number;
    recent_tasks: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('task')
      .where('task.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_tasks = await baseQuery.getCount();
    
    const pending_tasks = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.PENDENTE })
      .getCount();

    const in_progress_tasks = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.EM_ANDAMENTO })
      .getCount();

    const paused_tasks = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.PAUSADA })
      .getCount();

    const completed_tasks = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.CONCLUIDA })
      .getCount();

    const cancelled_tasks = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.CANCELADA })
      .getCount();

    // Tarefas vencidas
    const overdue_tasks = await baseQuery
      .clone()
      .andWhere('task.due_date < :now', { now: new Date() })
      .andWhere('task.status != :completedStatus', { completedStatus: TaskStatus.CONCLUIDA })
      .andWhere('task.status != :cancelledStatus', { cancelledStatus: TaskStatus.CANCELADA })
      .getCount();

    // Distribuição por status
    const statusResults = await baseQuery
      .clone()
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const tasks_by_status: Record<TaskStatus, number> = {
      [TaskStatus.PENDENTE]: 0,
      [TaskStatus.EM_ANDAMENTO]: 0,
      [TaskStatus.PAUSADA]: 0,
      [TaskStatus.CONCLUIDA]: 0,
      [TaskStatus.CANCELADA]: 0
    };

    statusResults.forEach(result => {
      tasks_by_status[result.status as TaskStatus] = parseInt(result.count);
    });

    // Distribuição por prioridade
    const priorityResults = await baseQuery
      .clone()
      .select('task.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.priority')
      .getRawMany();

    const tasks_by_priority: Record<TaskPriority, number> = {
      [TaskPriority.BAIXA]: 0,
      [TaskPriority.MEDIA]: 0,
      [TaskPriority.ALTA]: 0,
      [TaskPriority.URGENTE]: 0
    };

    priorityResults.forEach(result => {
      tasks_by_priority[result.priority as TaskPriority] = parseInt(result.count);
    });

    // Distribuição por tipo de tarefa
    const typeResults = await baseQuery
      .clone()
      .leftJoin('task.task_type', 'task_type')
      .select([
        'task_type.id as task_type_id',
        'task_type.name as task_type_name',
        'COUNT(task.id) as count'
      ])
      .groupBy('task_type.id')
      .orderBy('count', 'DESC')
      .getRawMany();

    const tasks_by_type = typeResults.map(result => ({
      task_type_id: result.task_type_id,
      task_type_name: result.task_type_name,
      count: parseInt(result.count) || 0
    }));

    // Tempo médio de conclusão (em horas)
    const completionTimeResult = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.CONCLUIDA })
      .andWhere('task.updated_at IS NOT NULL')
      .select('AVG(EXTRACT(EPOCH FROM (task.updated_at - task.created_at)) / 3600)', 'avg_hours')
      .getRawOne();

    const average_completion_time = parseFloat(completionTimeResult?.avg_hours || '0');

    // Total de horas rastreadas
    const hoursResult = await this.getRepository()
      .createQueryBuilder('task')
      .leftJoin('task.time_tracking', 'time_tracking')
      .where('task.company_id = :companyId', { companyId })
      .select('SUM(time_tracking.hours_tracked)', 'total_hours')
      .getRawOne();

    const total_hours_tracked = parseFloat(hoursResult?.total_hours || '0');

    // Taxa de conclusão
    const completion_rate = total_tasks > 0 ? (completed_tasks / total_tasks) * 100 : 0;

    // Tarefas recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_tasks = await baseQuery
      .clone()
      .andWhere('task.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    return {
      total_tasks,
      pending_tasks,
      in_progress_tasks,
      paused_tasks,
      completed_tasks,
      cancelled_tasks,
      overdue_tasks,
      tasks_by_status,
      tasks_by_priority,
      tasks_by_type,
      average_completion_time,
      total_hours_tracked,
      completion_rate,
      recent_tasks
    };
  }

  async findByStatus(companyId: string, status: TaskStatus): Promise<Task[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async findByPriority(companyId: string, priority: TaskPriority): Promise<Task[]> {
    return await this.findMany({ company_id: companyId, priority });
  }

  async findByTaskType(taskTypeId: string): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.task_type_id = :taskTypeId', { taskTypeId })
      .orderBy('task.created_at', 'DESC')
      .getMany();
  }

  async findByAssignedUser(userId: string, companyId: string): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('assignments.user_id = :userId', { userId })
      .orderBy('task.created_at', 'DESC')
      .getMany();
  }

  async findOverdueTasks(companyId: string): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('task.due_date < :now', { now: new Date() })
      .andWhere('task.status != :completedStatus', { completedStatus: TaskStatus.CONCLUIDA })
      .andWhere('task.status != :cancelledStatus', { cancelledStatus: TaskStatus.CANCELADA })
      .orderBy('task.due_date', 'ASC')
      .getMany();
  }

  async findTasksDueSoon(companyId: string, days: number = 7): Promise<Task[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('task.due_date BETWEEN :now AND :futureDate', { 
        now: new Date(), 
        futureDate 
      })
      .andWhere('task.status != :completedStatus', { completedStatus: TaskStatus.CONCLUIDA })
      .andWhere('task.status != :cancelledStatus', { cancelledStatus: TaskStatus.CANCELADA })
      .orderBy('task.due_date', 'ASC')
      .getMany();
  }

  async bulkUpdateStatus(taskIds: string[], status: TaskStatus): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(Task)
      .set({ status })
      .where('id IN (:...taskIds)', { taskIds })
      .execute();

    return result.affected ?? 0;
  }

  async searchTasks(companyId: string, searchTerm: string): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(task.title) LIKE LOWER(:searchTerm) OR
        LOWER(task.description) LIKE LOWER(:searchTerm) OR
        LOWER(task_type.name) LIKE LOWER(:searchTerm) OR
        LOWER(user.name) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('task.created_at', 'DESC')
      .limit(50)
      .getMany();
  }

  async getTasksByDateRange(companyId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('task.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('task.created_at', 'DESC')
      .getMany();
  }

  async getRecentTasks(companyId: string, limit: number = 10): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .orderBy('task.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getTasksCompletedInPeriod(companyId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    return await this.getRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.task_type', 'task_type')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('task.status = :status', { status: TaskStatus.CONCLUIDA })
      .andWhere('task.updated_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('task.updated_at', 'DESC')
      .getMany();
  }

  async getProductivityReport(companyId: string, startDate: Date, endDate: Date): Promise<{
    tasks_created: number;
    tasks_completed: number;
    tasks_in_progress: number;
    average_completion_time: number;
    productivity_by_user: Array<{
      user_id: string;
      user_name: string;
      tasks_assigned: number;
      tasks_completed: number;
      completion_rate: number;
      total_hours_tracked: number;
    }>;
    productivity_by_type: Array<{
      task_type_id: string;
      task_type_name: string;
      tasks_created: number;
      tasks_completed: number;
      completion_rate: number;
      average_completion_time: number;
    }>;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('task')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('task.created_at BETWEEN :startDate AND :endDate', { startDate, endDate });

    // Tarefas criadas no período
    const tasks_created = await baseQuery.getCount();

    // Tarefas concluídas no período
    const tasks_completed = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.CONCLUIDA })
      .getCount();

    // Tarefas em andamento
    const tasks_in_progress = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.EM_ANDAMENTO })
      .getCount();

    // Tempo médio de conclusão
    const completionTimeResult = await baseQuery
      .clone()
      .andWhere('task.status = :status', { status: TaskStatus.CONCLUIDA })
      .select('AVG(EXTRACT(EPOCH FROM (task.updated_at - task.created_at)) / 3600)', 'avg_hours')
      .getRawOne();

    const average_completion_time = parseFloat(completionTimeResult?.avg_hours || '0');

    // Produtividade por usuário
    const userProductivityResults = await this.getRepository()
      .createQueryBuilder('task')
      .leftJoin('task.assignments', 'assignment')
      .leftJoin('assignment.user', 'user')
      .leftJoin('task.time_tracking', 'time_tracking')
      .where('task.company_id = :companyId', { companyId })
      .andWhere('task.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select([
        'user.id as user_id',
        'user.name as user_name',
        'COUNT(DISTINCT task.id) as tasks_assigned',
        'COUNT(DISTINCT CASE WHEN task.status = :completedStatus THEN task.id END) as tasks_completed',
        'SUM(time_tracking.hours_tracked) as total_hours_tracked'
      ])
      .setParameter('completedStatus', TaskStatus.CONCLUIDA)
      .groupBy('user.id')
      .getRawMany();

    const productivity_by_user = userProductivityResults.map(result => ({
      user_id: result.user_id,
      user_name: result.user_name,
      tasks_assigned: parseInt(result.tasks_assigned) || 0,
      tasks_completed: parseInt(result.tasks_completed) || 0,
      completion_rate: parseInt(result.tasks_assigned) > 0 
        ? (parseInt(result.tasks_completed) / parseInt(result.tasks_assigned)) * 100 
        : 0,
      total_hours_tracked: parseFloat(result.total_hours_tracked) || 0
    }));

    // Produtividade por tipo de tarefa
    const typeProductivityResults = await baseQuery
      .clone()
      .leftJoin('task.task_type', 'task_type')
      .select([
        'task_type.id as task_type_id',
        'task_type.name as task_type_name',
        'COUNT(task.id) as tasks_created',
        'COUNT(CASE WHEN task.status = :completedStatus THEN task.id END) as tasks_completed',
        'AVG(CASE WHEN task.status = :completedStatus THEN EXTRACT(EPOCH FROM (task.updated_at - task.created_at)) / 3600 END) as avg_completion_time'
      ])
      .setParameter('completedStatus', TaskStatus.CONCLUIDA)
      .groupBy('task_type.id')
      .getRawMany();

    const productivity_by_type = typeProductivityResults.map(result => ({
      task_type_id: result.task_type_id,
      task_type_name: result.task_type_name,
      tasks_created: parseInt(result.tasks_created) || 0,
      tasks_completed: parseInt(result.tasks_completed) || 0,
      completion_rate: parseInt(result.tasks_created) > 0 
        ? (parseInt(result.tasks_completed) / parseInt(result.tasks_created)) * 100 
        : 0,
      average_completion_time: parseFloat(result.avg_completion_time) || 0
    }));

    return {
      tasks_created,
      tasks_completed,
      tasks_in_progress,
      average_completion_time,
      productivity_by_user,
      productivity_by_type
    };
  }
}

