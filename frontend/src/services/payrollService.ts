import { apiService } from './api';

export interface PayrollPeriod {
  id: string;
  company_id: string;
  period_type: 'Mensal' | 'Quinzenal' | 'Semanal';
  start_date: string;
  end_date: string;
  payment_date: string;
  status: 'Aberto' | 'Em_Processamento' | 'Calculado' | 'Aprovado' | 'Pago' | 'Cancelado';
  total_gross: number;
  total_deductions: number;
  total_net: number;
  total_employer_charges: number;
  approved_by_user_id?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollItem {
  id: string;
  payroll_period_id: string;
  employee_id: string;
  gross_salary: number;
  hours_worked?: number;
  overtime_hours?: number;
  overtime_value?: number;
  deductions: any;
  additions: any;
  employer_charges: any;
  net_salary: number;
  payment_method: 'Transferencia' | 'Dinheiro' | 'Cheque' | 'PIX';
  payment_status: 'Pendente' | 'Pago' | 'Cancelado';
  payment_date?: string;
  payment_receipt?: string;
  notes?: string;
  employee?: any;
  created_at: string;
  updated_at: string;
}

export interface CreatePayrollPeriodData {
  period_type: PayrollPeriod['period_type'];
  start_date: string;
  end_date: string;
  payment_date: string;
  notes?: string;
}

export interface PayrollCalculation {
  period_id: string;
  items: {
    employee_id: string;
    gross_salary: number;
    hours_worked: number;
    overtime_hours: number;
    overtime_value: number;
    deductions: {
      inss: number;
      irrf: number;
      advances: number;
      absences: number;
      other: number;
    };
    additions: {
      commissions: number;
      bonuses: number;
      other: number;
    };
    employer_charges: {
      inss: number;
      fgts: number;
      other: number;
    };
    net_salary: number;
  }[];
  totals: {
    gross: number;
    deductions: number;
    additions: number;
    employer_charges: number;
    net: number;
  };
}

class PayrollService {
  // Payroll Periods
  async getPeriods(companyId: string, filters?: {
    status?: string;
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
      periods: PayrollPeriod[];
      pagination?: {
        current_page: number;
        total_pages: number;
        total_records: number;
      };
    }>(`/companies/${companyId}/payroll-periods?${params}`);
    
    return response.data;
  }

  async getPeriod(periodId: string) {
    const response = await apiService.get<PayrollPeriod>(`/payroll-periods/${periodId}`);
    return response.data;
  }

  async createPeriod(companyId: string, data: CreatePayrollPeriodData) {
    const response = await apiService.post<PayrollPeriod>(
      `/companies/${companyId}/payroll-periods`,
      data
    );
    return response.data;
  }

  async updatePeriod(periodId: string, data: Partial<PayrollPeriod>) {
    const response = await apiService.put<PayrollPeriod>(
      `/payroll-periods/${periodId}`,
      data
    );
    return response.data;
  }

  async deletePeriod(periodId: string) {
    await apiService.delete(`/payroll-periods/${periodId}`);
  }

  // Payroll Calculation
  async calculatePayroll(periodId: string) {
    const response = await apiService.post<PayrollCalculation>(
      `/payroll-periods/${periodId}/calculate`
    );
    return response.data;
  }

  async approvePayroll(periodId: string) {
    const response = await apiService.post(
      `/payroll-periods/${periodId}/approve`
    );
    return response.data;
  }

  async processPayment(periodId: string, data?: {
    payment_date?: string;
    payment_method?: string;
  }) {
    const response = await apiService.post(
      `/payroll-periods/${periodId}/process-payment`,
      data
    );
    return response.data;
  }

  // Payroll Items
  async getPeriodItems(periodId: string) {
    const response = await apiService.get<PayrollItem[]>(
      `/payroll-periods/${periodId}/items`
    );
    return response.data;
  }

  async getEmployeePayrollHistory(employeeId: string, filters?: {
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
    
    const response = await apiService.get(
      `/employees/${employeeId}/payroll-history?${params}`
    );
    return response.data;
  }

  async updatePayrollItem(itemId: string, data: Partial<PayrollItem>) {
    const response = await apiService.put<PayrollItem>(
      `/payroll-items/${itemId}`,
      data
    );
    return response.data;
  }

  // Payslips
  async generatePayslip(itemId: string) {
    const response = await apiService.get(
      `/payroll-items/${itemId}/payslip`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async sendPayslipByEmail(itemId: string) {
    const response = await apiService.post(
      `/payroll-items/${itemId}/send-payslip`
    );
    return response.data;
  }

  // Reports
  async getPayrollSummaryReport(companyId: string, filters: {
    start_date: string;
    end_date: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const response = await apiService.get(
      `/companies/${companyId}/payroll-reports/summary?${params}`
    );
    return response.data;
  }

  async getPayrollCostByDepartment(companyId: string, filters: {
    start_date: string;
    end_date: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const response = await apiService.get(
      `/companies/${companyId}/payroll-reports/cost-by-department?${params}`
    );
    return response.data;
  }

  async exportPayrollToExcel(periodId: string) {
    const response = await apiService.get(
      `/payroll-periods/${periodId}/export`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export const payrollService = new PayrollService();
