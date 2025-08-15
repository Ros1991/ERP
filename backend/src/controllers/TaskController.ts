import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { TaskService } from '../services/TaskService';
import { TaskTypeService } from '../services/TaskTypeService';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskFilterDto,
  BulkUpdateTaskStatusDto,
  BulkAssignTasksDto,
  CreateTaskTypeDto,
  UpdateTaskTypeDto
} from '../dtos/TaskDto';

export class TaskController extends BaseController {
  private taskService: TaskService;
  private taskTypeService: TaskTypeService;

  constructor() {
    super();
    this.taskService = new TaskService();
    this.taskTypeService = new TaskTypeService();
  }

  // Task Type endpoints
  async createTaskType(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const data: CreateTaskTypeDto = req.body;

      const taskType = await this.taskTypeService.create(companyId, data);
      
      this.sendSuccess(res, taskType, 'Tipo de tarefa criado com sucesso', 201);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTaskTypes(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const taskTypes = await this.taskTypeService.findByCompany(companyId);
      
      this.sendSuccess(res, taskTypes);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTaskTypeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      
      const taskType = await this.taskTypeService.findByIdAndCompany(id, companyId);
      
      this.sendSuccess(res, taskType);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateTaskType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      const data: UpdateTaskTypeDto = req.body;

      const taskType = await this.taskTypeService.update(id, companyId, data);
      
      this.sendSuccess(res, taskType, 'Tipo de tarefa atualizado com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteTaskType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      await this.taskTypeService.delete(id, companyId);
      
      this.sendSuccess(res, null, 'Tipo de tarefa excluído com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getActiveTaskTypes(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const taskTypes = await this.taskTypeService.findActiveTaskTypes(companyId);
      
      this.sendSuccess(res, taskTypes);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTaskTypeStats(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const stats = await this.taskTypeService.getTaskTypeStats(companyId);
      
      this.sendSuccess(res, stats);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async bulkUpdateTaskTypeStatus(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { task_type_ids, status } = req.body;

      const result = await this.taskTypeService.bulkUpdateStatus(companyId, task_type_ids, status);
      
      this.sendSuccess(res, result, 'Status dos tipos de tarefa atualizados com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async searchTaskTypes(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { q } = req.query;

      const taskTypes = await this.taskTypeService.searchTaskTypes(companyId, q as string);
      
      this.sendSuccess(res, taskTypes);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async createDefaultTaskTypes(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const taskTypes = await this.taskTypeService.createDefaultTaskTypes(companyId);
      
      this.sendSuccess(res, taskTypes, 'Tipos de tarefa padrão criados com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Task endpoints
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const data: CreateTaskDto = req.body;

      const task = await this.taskService.create(companyId, data);
      
      this.sendSuccess(res, task, 'Tarefa criada com sucesso', 201);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const filters: TaskFilterDto = req.query as any;

      const result = await this.taskService.findByCompanyWithFilters(companyId, filters);
      
      this.sendSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      
      const task = await this.taskService.findByIdAndCompany(id, companyId);
      
      this.sendSuccess(res, task);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      const data: UpdateTaskDto = req.body;

      const task = await this.taskService.update(id, companyId, data);
      
      this.sendSuccess(res, task, 'Tarefa atualizada com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      await this.taskService.delete(id, companyId);
      
      this.sendSuccess(res, null, 'Tarefa excluída com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTaskStats(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const stats = await this.taskService.getTaskStats(companyId);
      
      this.sendSuccess(res, stats);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const companyId = req.user?.companyId;
      
      const tasks = await this.taskService.getTasksByStatus(companyId, status as any);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksByPriority(req: Request, res: Response): Promise<void> {
    try {
      const { priority } = req.params;
      const companyId = req.user?.companyId;
      
      const tasks = await this.taskService.getTasksByPriority(companyId, priority as any);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksByTaskType(req: Request, res: Response): Promise<void> {
    try {
      const { taskTypeId } = req.params;
      const companyId = req.user?.companyId;
      
      const tasks = await this.taskService.getTasksByTaskType(taskTypeId, companyId);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksByAssignedUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const companyId = req.user?.companyId;
      
      const tasks = await this.taskService.getTasksByAssignedUser(userId, companyId);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const tasks = await this.taskService.getOverdueTasks(companyId);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksDueSoon(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { days } = req.query;
      
      const tasks = await this.taskService.getTasksDueSoon(companyId, days ? parseInt(days as string) : undefined);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async bulkUpdateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const data: BulkUpdateTaskStatusDto = req.body;

      const result = await this.taskService.bulkUpdateStatus(companyId, data);
      
      this.sendSuccess(res, result, 'Status das tarefas atualizados com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async bulkAssignTasks(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const data: BulkAssignTasksDto = req.body;

      const result = await this.taskService.bulkAssignTasks(companyId, data);
      
      this.sendSuccess(res, result, 'Tarefas atribuídas com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async searchTasks(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { q } = req.query;

      const tasks = await this.taskService.searchTasks(companyId, q as string);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { startDate, endDate } = req.query;

      const tasks = await this.taskService.getTasksByDateRange(
        companyId, 
        new Date(startDate as string), 
        new Date(endDate as string)
      );
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRecentTasks(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { limit } = req.query;
      
      const tasks = await this.taskService.getRecentTasks(companyId, limit ? parseInt(limit as string) : undefined);
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTasksCompletedInPeriod(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { startDate, endDate } = req.query;

      const tasks = await this.taskService.getTasksCompletedInPeriod(
        companyId, 
        new Date(startDate as string), 
        new Date(endDate as string)
      );
      
      this.sendSuccess(res, tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getProductivityReport(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { startDate, endDate } = req.query;

      const report = await this.taskService.getProductivityReport(
        companyId, 
        new Date(startDate as string), 
        new Date(endDate as string)
      );
      
      this.sendSuccess(res, report);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async completeTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const task = await this.taskService.completeTask(id, companyId);
      
      this.sendSuccess(res, task, 'Tarefa concluída com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async cancelTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const task = await this.taskService.cancelTask(id, companyId);
      
      this.sendSuccess(res, task, 'Tarefa cancelada com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async startTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const task = await this.taskService.startTask(id, companyId);
      
      this.sendSuccess(res, task, 'Tarefa iniciada com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async pauseTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const task = await this.taskService.pauseTask(id, companyId);
      
      this.sendSuccess(res, task, 'Tarefa pausada com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateTaskProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      const { percentage } = req.body;

      const task = await this.taskService.updateProgress(id, companyId, percentage);
      
      this.sendSuccess(res, task, 'Progresso da tarefa atualizado com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

