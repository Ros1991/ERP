import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString, IsArray, IsUUID, Min, Max, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BaseDto, PaginationDto, FilterDto } from './BaseDto';

export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export enum TaskPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

export enum TaskTypeStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO'
}

export class CreateTaskTypeDto extends BaseDto {
  @IsString({ message: 'Nome do tipo de tarefa é obrigatório' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Cor deve ser uma string' })
  color?: string;

  @IsOptional()
  @IsString({ message: 'Ícone deve ser uma string' })
  icon?: string;

  @IsOptional()
  @IsBoolean({ message: 'Campo de sistema deve ser um booleano' })
  is_system?: boolean;

  @IsOptional()
  @IsEnum(TaskTypeStatus, { message: 'Status inválido' })
  status?: TaskTypeStatus;
}

export class UpdateTaskTypeDto {
  @IsOptional()
  @IsString({ message: 'Nome do tipo de tarefa deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Cor deve ser uma string' })
  color?: string;

  @IsOptional()
  @IsString({ message: 'Ícone deve ser uma string' })
  icon?: string;

  @IsOptional()
  @IsEnum(TaskTypeStatus, { message: 'Status inválido' })
  status?: TaskTypeStatus;
}

export class CreateTaskDto extends BaseDto {
  @IsString({ message: 'Título da tarefa é obrigatório' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsEnum(TaskStatus, { message: 'Status da tarefa inválido' })
  status!: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Prioridade da tarefa inválida' })
  priority!: TaskPriority;

  @IsOptional()
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  due_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Horas estimadas deve ser um número' })
  @Min(0, { message: 'Horas estimadas deve ser maior ou igual a zero' })
  estimated_hours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Percentual de conclusão deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Percentual de conclusão deve ser maior ou igual a zero' })
  @Max(100, { message: 'Percentual de conclusão deve ser menor ou igual a 100' })
  completion_percentage?: number;

  @IsUUID(4, { message: 'ID do tipo de tarefa deve ser um UUID válido' })
  task_type_id!: string;

  @IsOptional()
  @IsArray({ message: 'Responsáveis deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID de responsável deve ser um UUID válido' })
  assigned_user_ids?: string[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Título da tarefa deve ser uma string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status da tarefa inválido' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridade da tarefa inválida' })
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  due_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Horas estimadas deve ser um número' })
  @Min(0, { message: 'Horas estimadas deve ser maior ou igual a zero' })
  estimated_hours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Percentual de conclusão deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Percentual de conclusão deve ser maior ou igual a zero' })
  @Max(100, { message: 'Percentual de conclusão deve ser menor ou igual a 100' })
  completion_percentage?: number;

  @IsOptional()
  @IsUUID(4, { message: 'ID do tipo de tarefa deve ser um UUID válido' })
  task_type_id?: string;

  @IsOptional()
  @IsArray({ message: 'Responsáveis deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID de responsável deve ser um UUID válido' })
  assigned_user_ids?: string[];
}

export class TaskFilterDto extends FilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status da tarefa inválido' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridade da tarefa inválida' })
  priority?: TaskPriority;

  @IsOptional()
  @IsUUID(4, { message: 'ID do tipo de tarefa deve ser um UUID válido' })
  task_type_id?: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário responsável deve ser um UUID válido' })
  assigned_user_id?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de vencimento inicial deve ser uma data válida' })
  due_date_start?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de vencimento final deve ser uma data válida' })
  due_date_end?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Percentual mínimo deve ser um número' })
  @Min(0, { message: 'Percentual mínimo deve ser maior ou igual a zero' })
  @Max(100, { message: 'Percentual mínimo deve ser menor ou igual a 100' })
  completion_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Percentual máximo deve ser um número' })
  @Min(0, { message: 'Percentual máximo deve ser maior ou igual a zero' })
  @Max(100, { message: 'Percentual máximo deve ser menor ou igual a 100' })
  completion_max?: number;

  @IsOptional()
  @IsBoolean({ message: 'Campo de vencidas deve ser um booleano' })
  overdue?: boolean;
}

export class CreateTaskTimeTrackingDto {
  @IsUUID(4, { message: 'ID da tarefa deve ser um UUID válido' })
  task_id!: string;

  @IsDateString({}, { message: 'Hora de início deve ser uma data válida' })
  start_time!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hora de fim deve ser uma data válida' })
  end_time?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Horas trabalhadas deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Horas trabalhadas deve ser maior ou igual a zero' })
  hours_tracked?: number;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class UpdateTaskTimeTrackingDto {
  @IsOptional()
  @IsDateString({}, { message: 'Hora de início deve ser uma data válida' })
  start_time?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hora de fim deve ser uma data válida' })
  end_time?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Horas trabalhadas deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Horas trabalhadas deve ser maior ou igual a zero' })
  hours_tracked?: number;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class CreateTaskCommentDto {
  @IsString({ message: 'Comentário é obrigatório' })
  comment!: string;
}

export class UpdateTaskCommentDto {
  @IsString({ message: 'Comentário é obrigatório' })
  comment!: string;
}

export class CreateTaskAttachmentDto {
  @IsString({ message: 'URL do arquivo é obrigatória' })
  file_url!: string;

  @IsString({ message: 'Nome do arquivo é obrigatório' })
  file_name!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Tamanho do arquivo deve ser um número' })
  @Min(1, { message: 'Tamanho do arquivo deve ser maior que zero' })
  file_size!: number;

  @IsString({ message: 'Tipo MIME é obrigatório' })
  mime_type!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class TaskResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  company_id!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsNumber()
  estimated_hours?: number;

  @IsOptional()
  @IsNumber()
  actual_hours?: number;

  @IsNumber()
  completion_percentage!: number;

  @IsUUID()
  task_type_id!: string;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  task_type?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };

  assignments?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    assigned_at: string;
  }>;

  time_tracking?: Array<{
    id: string;
    start_time: string;
    end_time?: string;
    hours_tracked: number;
    description?: string;
    user: {
      id: string;
      name: string;
    };
  }>;

  comments?: Array<{
    id: string;
    comment: string;
    created_at: string;
    user: {
      id: string;
      name: string;
    };
  }>;

  attachments?: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    mime_type: string;
    description?: string;
    uploaded_at: string;
    uploaded_by: {
      id: string;
      name: string;
    };
  }>;
}

export class TaskStatsDto {
  total_tasks!: number;
  pending_tasks!: number;
  in_progress_tasks!: number;
  completed_tasks!: number;
  overdue_tasks!: number;
  tasks_by_status!: Record<TaskStatus, number>;
  tasks_by_priority!: Record<TaskPriority, number>;
  tasks_by_type!: Array<{
    task_type_id: string;
    task_type_name: string;
    count: number;
  }>;
  average_completion_time!: number;
  total_hours_tracked!: number;
  recent_tasks!: TaskResponseDto[];
}

export class BulkUpdateTaskStatusDto {
  @IsArray({ message: 'IDs deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID deve ser um UUID válido' })
  task_ids!: string[];

  @IsEnum(TaskStatus, { message: 'Status da tarefa inválido' })
  status!: TaskStatus;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}

export class BulkAssignTasksDto {
  @IsArray({ message: 'IDs das tarefas deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID de tarefa deve ser um UUID válido' })
  task_ids!: string[];

  @IsArray({ message: 'IDs dos usuários deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID de usuário deve ser um UUID válido' })
  user_ids!: string[];
}

