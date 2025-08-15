import { apiService } from './api';

export interface Employee {
  id: string;
  company_id: string;
  company_member_id?: string;
  full_name: string;
  cpf: string;
  job_title: string;
  contract_type: 'CLT' | 'Diarista' | 'Empreita';
  salary_base: number;
  hire_date: string;
  termination_date?: string;
  status: 'Ativo' | 'Inativo' | 'Afastado' | 'Demitido';
  config_tracks_time: boolean;
  config_is_in_payroll: boolean;
  legal_data?: {
    address?: string;
    phone?: string;
    emergency_contact?: string;
    bank_details?: {
      bank: string;
      agency: string;
      account: string;
    };
    pis?: string;
    dependents?: any[];
  };
  user_email?: string;
  role_name?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type: string;
  file_url: string;
  description?: string;
  uploaded_at: string;
}

export interface CreateEmployeeData {
  employee_data: {
    full_name: string;
    cpf: string;
    job_title: string;
    contract_type: 'CLT' | 'Diarista' | 'Empreita';
    salary_base: number;
    hire_date: string;
    config_tracks_time: boolean;
    config_is_in_payroll: boolean;
    legal_data?: Employee['legal_data'];
  };
  access_data?: {
    grant_access: boolean;
    email?: string;
    role_id?: string;
  };
}

class EmployeeService {
  async getEmployees(companyId: string, filters?: {
    status?: string;
    contract_type?: string;
    has_access?: boolean;
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
      employees: Employee[];
      pagination: {
        current_page: number;
        total_pages: number;
        total_records: number;
      };
    }>(`/companies/${companyId}/employees?${params}`);
    
    return response.data;
  }

  async getEmployee(employeeId: string) {
    const response = await apiService.get<Employee>(`/employees/${employeeId}`);
    return response.data;
  }

  async createEmployee(companyId: string, data: CreateEmployeeData) {
    const response = await apiService.post<Employee>(
      `/companies/${companyId}/employees`,
      data
    );
    return response.data;
  }

  async updateEmployee(employeeId: string, data: Partial<Employee>) {
    const response = await apiService.put<Employee>(
      `/employees/${employeeId}`,
      data
    );
    return response.data;
  }

  async deleteEmployee(employeeId: string) {
    await apiService.delete(`/employees/${employeeId}`);
  }

  async grantAccess(employeeId: string, email: string, roleId: string) {
    const response = await apiService.put(
      `/employees/${employeeId}/grant-access`,
      { email, role_id: roleId }
    );
    return response.data;
  }

  async revokeAccess(employeeId: string) {
    const response = await apiService.put(`/employees/${employeeId}/revoke-access`);
    return response.data;
  }

  // Document Management
  async getDocuments(employeeId: string) {
    const response = await apiService.get<EmployeeDocument[]>(
      `/employees/${employeeId}/documents`
    );
    return response.data;
  }

  async uploadDocument(employeeId: string, formData: FormData) {
    const response = await apiService.post<EmployeeDocument>(
      `/employees/${employeeId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteDocument(employeeId: string, documentId: string) {
    await apiService.delete(`/employees/${employeeId}/documents/${documentId}`);
  }

  // Ledger Management
  async getLedger(employeeId: string, filters?: {
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
    
    const response = await apiService.get(`/employees/${employeeId}/ledger?${params}`);
    return response.data;
  }

  async createLedgerEntry(employeeId: string, data: {
    description: string;
    amount: number;
    entry_date: string;
    transaction_id?: string;
  }) {
    const response = await apiService.post(
      `/employees/${employeeId}/ledger-entries`,
      data
    );
    return response.data;
  }
}

export const employeeService = new EmployeeService();
