import { apiService } from './api';

export interface TaskType {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  default_manager_id?: string;
  default_priority: 'Baixa' | 'Media' | 'Alta' | 'Critica';
  estimated_duration_hours?: number;
  requires_approval: boolean;
  status: 'Ativo' | 'Inativo';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  company_id: string;
  task_type_id?: string;
  cost_center_id: string;
  title: string;
  description: string;
  status: 'A_Fazer' | 'Em_Andamento' | 'Pausada' | 'Parada' | 'Concluida' | 'Cancelada' | 'Adiada';
  priority: 'Baixa' | 'Media' | 'Alta' | 'Critica';
  estimated_start_date: string;
  estimated_duration_hours?: number;
  actual_start_date?: string;
  actual_end_date?: string;
  due_date?: string;
  frequency_type: 'Unica' | 'Diaria' | 'Semanal' | 'Mensal' | 'Trimestral' | 'Anual' | 'Personalizada';
  frequency_config?: any;
  parent_task_id?: string;
  created_by_user_id: string;
  assigned_manager_id?: string;
  approved_by_user_id?: string;
  completion_notes?: string;
  quality_rating?: number;
  assignments?: TaskAssignment[];
  task_type?: TaskType;
  cost_center?: any;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  employee_id: string;
  assignment_type: 'Principal' | 'Auxiliar' | 'Supervisor';
  estimated_hours?: number;
  actual_hours?: number;
  hourly_rate?: number;
  assigned_at: string;
  employee?: any;
}

export interface TaskHistory {
  id: string;
  task_id: string;
  user_id: string;
  employee_id?: string;
  action: string;
  previous_status: string;
  new_status: string;
  reason?: string;
  estimated_resolution_date?: string;
  location?: string;
  timestamp: string;
}

export interface CreateTaskData {
  task_type_id?: string;
  cost_center_id: string;
  title: string;
  description: string;
  priority: Task['priority'];
  estimated_start_date: string;
  estimated_duration_hours?: number;
  due_date?: string;
  frequency_type: Task['frequency_type'];
  frequency_config?: any;
  assigned_manager_id?: string;
  assignments?: {
    employee_id: string;
    assignment_type: TaskAssignment['assignment_type'];
    estimated_hours?: number;
    hourly_rate?: number;
  }[];
}

class TaskService {
  // Task Types
  async getTaskTypes(companyId: string, filters?: {
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    
    const response = await apiService.get<TaskType[]>(
      `/companies/${companyId}/task-types?${params}`
    );
    return response.data;
  }

  async createTaskType(companyId: string, data: {
    name: string;
    description?: string;
    default_manager_id?: string;
    default_priority: TaskType['default_priority'];
    estimated_duration_hours?: number;
    requires_approval: boolean;
  }) {
    const response = await apiService.post<TaskType>(
      `/companies/${companyId}/task-types`,
      data
    );
    return response.data;
  }

  async updateTaskType(taskTypeId: string, data: Partial<TaskType>) {
    const response = await apiService.put<TaskType>(
      `/task-types/${taskTypeId}`,
      data
    );
    return response.data;
  }

  async deleteTaskType(taskTypeId: string) {
    await apiService.delete(`/task-types/${taskTypeId}`);
  }

  // Tasks
  async getTasks(companyId: string, filters?: {
    status?: string;
    priority?: string;
    cost_center_id?: string;
    assigned_manager_id?: string;
    employee_id?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    
    const response = await apiService.get<{
      tasks: Task[];
      pagination?: {
        current_page: number;
        total_pages: number;
        total_records: number;
      };
    }>(`/companies/${companyId}/tasks?${params}`);
    
    return response.data;
  }

  async getTask(taskId: string) {
    const response = await apiService.get<Task>(`/tasks/${taskId}`);
    return response.data;
  }

  async createTask(companyId: string, data: CreateTaskData) {
    const response = await apiService.post<Task>(
      `/companies/${companyId}/tasks`,
      data
    );
    return response.data;
  }

  async updateTask(taskId: string, data: Partial<Task>) {
    const response = await apiService.put<Task>(
      `/tasks/${taskId}`,
      data
    );
    return response.data;
  }

  async updateTaskStatus(taskId: string, data: {
    status: Task['status'];
    reason?: string;
    estimated_resolution_date?: string;
    location?: string;
  }) {
    const response = await apiService.put<Task>(
      `/tasks/${taskId}/status`,
      data
    );
    return response.data;
  }

  async deleteTask(taskId: string) {
    await apiService.delete(`/tasks/${taskId}`);
  }

  // Task Assignments
  async assignEmployee(taskId: string, data: {
    employee_id: string;
    assignment_type: TaskAssignment['assignment_type'];
    estimated_hours?: number;
    hourly_rate?: number;
  }) {
    const response = await apiService.post(
      `/tasks/${taskId}/assignments`,
      data
    );
    return response.data;
  }

  async removeAssignment(taskId: string, assignmentId: string) {
    await apiService.delete(`/tasks/${taskId}/assignments/${assignmentId}`);
  }

  // Task History
  async getTaskHistory(taskId: string) {
    const response = await apiService.get<TaskHistory[]>(
      `/tasks/${taskId}/history`
    );
    return response.data;
  }

  // Task Time Tracking
  async startTimeTracking(taskId: string, employeeId: string) {
    const response = await apiService.post(
      `/tasks/${taskId}/time-tracking/start`,
      { employee_id: employeeId }
    );
    return response.data;
  }

  async stopTimeTracking(taskId: string, employeeId: string) {
    const response = await apiService.post(
      `/tasks/${taskId}/time-tracking/stop`,
      { employee_id: employeeId }
    );
    return response.data;
  }

  // Task Comments
  async getComments(taskId: string) {
    const response = await apiService.get(`/tasks/${taskId}/comments`);
    return response.data;
  }

  async addComment(taskId: string, data: {
    content: string;
    is_internal: boolean;
  }) {
    const response = await apiService.post(
      `/tasks/${taskId}/comments`,
      data
    );
    return response.data;
  }

  // Task Attachments
  async uploadAttachment(taskId: string, formData: FormData) {
    const response = await apiService.post(
      `/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteAttachment(taskId: string, attachmentId: string) {
    await apiService.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  }

  // Reports
  async getProductivityReport(companyId: string, filters: {
    start_date: string;
    end_date: string;
    employee_id?: string;
    cost_center_id?: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const response = await apiService.get(
      `/companies/${companyId}/task-reports/productivity?${params}`
    );
    return response.data;
  }

  async getTaskCostReport(companyId: string, filters: {
    start_date: string;
    end_date: string;
    cost_center_id?: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const response = await apiService.get(
      `/companies/${companyId}/task-reports/costs?${params}`
    );
    return response.data;
  }
}

export const taskService = new TaskService();
