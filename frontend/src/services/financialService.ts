import { apiService } from './api';

export interface FinancialAccount {
  id: string;
  company_id: string;
  name: string;
  type: 'Conta_Corrente' | 'Caixa_Fisico' | 'Cartao_Credito' | 'Conta_Socio' | 'Poupanca' | 'Investimento';
  initial_balance: number;
  current_balance: number;
  owner_user_id?: string;
  bank_details?: {
    bank_name: string;
    agency: string;
    account_number: string;
    account_type: string;
  };
  status: 'Ativa' | 'Inativa' | 'Bloqueada';
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  status: 'Ativo' | 'Inativo';
  children?: CostCenter[];
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  company_id: string;
  financial_account_id: string;
  transaction_number: string;
  description: string;
  amount: number;
  transaction_date: string;
  due_date?: string;
  category: 'Receita' | 'Despesa' | 'Transferencia' | 'Adiantamento' | 'Emprestimo';
  payment_method: 'Dinheiro' | 'PIX' | 'TED' | 'Cartao_Debito' | 'Cartao_Credito' | 'Boleto' | 'Cheque';
  related_employee_id?: string;
  invoice_number?: string;
  supplier_customer?: string;
  notes?: string;
  status: 'Pendente' | 'Confirmada' | 'Cancelada' | 'Estornada';
  splits?: TransactionSplit[];
  financial_account?: FinancialAccount;
  created_at: string;
  updated_at: string;
}

export interface TransactionSplit {
  id: string;
  transaction_id: string;
  cost_center_id: string;
  amount: number;
  percentage: number;
  description?: string;
  cost_center?: CostCenter;
}

export interface CreateTransactionData {
  financial_account_id: string;
  description: string;
  amount: number;
  transaction_date: string;
  due_date?: string;
  category: Transaction['category'];
  payment_method: Transaction['payment_method'];
  invoice_number?: string;
  supplier_customer?: string;
  notes?: string;
  related_employee_id?: string;
  splits: {
    cost_center_id: string;
    amount: number;
    percentage: number;
    description?: string;
  }[];
}

class FinancialService {
  // Financial Accounts
  async getAccounts(companyId: string, filters?: {
    type?: string;
    status?: string;
    include_balance?: boolean;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    
    const response = await apiService.get<FinancialAccount[]>(
      `/companies/${companyId}/financial-accounts?${params}`
    );
    return response.data;
  }

  async createAccount(companyId: string, data: {
    name: string;
    type: FinancialAccount['type'];
    initial_balance: number;
    owner_user_id?: string;
    bank_details?: FinancialAccount['bank_details'];
  }) {
    const response = await apiService.post<FinancialAccount>(
      `/companies/${companyId}/financial-accounts`,
      data
    );
    return response.data;
  }

  async updateAccount(accountId: string, data: Partial<FinancialAccount>) {
    const response = await apiService.put<FinancialAccount>(
      `/financial-accounts/${accountId}`,
      data
    );
    return response.data;
  }

  async getAccountStatement(accountId: string, filters: {
    start_date: string;
    end_date: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const response = await apiService.get(
      `/financial-accounts/${accountId}/statement?${params}`
    );
    return response.data;
  }

  // Cost Centers
  async getCostCenters(companyId: string, filters?: {
    include_hierarchy?: boolean;
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    
    const response = await apiService.get<CostCenter[]>(
      `/companies/${companyId}/cost-centers?${params}`
    );
    return response.data;
  }

  async createCostCenter(companyId: string, data: {
    name: string;
    description?: string;
    parent_id?: string;
  }) {
    const response = await apiService.post<CostCenter>(
      `/companies/${companyId}/cost-centers`,
      data
    );
    return response.data;
  }

  async updateCostCenter(costCenterId: string, data: Partial<CostCenter>) {
    const response = await apiService.put<CostCenter>(
      `/cost-centers/${costCenterId}`,
      data
    );
    return response.data;
  }

  async deleteCostCenter(costCenterId: string) {
    await apiService.delete(`/cost-centers/${costCenterId}`);
  }

  // Transactions
  async getTransactions(companyId: string, filters?: {
    start_date?: string;
    end_date?: string;
    financial_account_id?: string;
    category?: string;
    cost_center_id?: string;
    status?: string;
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
      transactions: Transaction[];
      pagination?: {
        current_page: number;
        total_pages: number;
        total_records: number;
      };
    }>(`/companies/${companyId}/transactions?${params}`);
    
    return response.data;
  }

  async getTransaction(transactionId: string) {
    const response = await apiService.get<Transaction>(`/transactions/${transactionId}`);
    return response.data;
  }

  async createTransaction(companyId: string, data: CreateTransactionData) {
    const response = await apiService.post<Transaction>(
      `/companies/${companyId}/transactions`,
      data
    );
    return response.data;
  }

  async updateTransaction(transactionId: string, data: Partial<Transaction>) {
    const response = await apiService.put<Transaction>(
      `/transactions/${transactionId}`,
      data
    );
    return response.data;
  }

  async deleteTransaction(transactionId: string) {
    await apiService.delete(`/transactions/${transactionId}`);
  }

  // Reports
  async getCashFlowReport(companyId: string, filters: {
    start_date: string;
    end_date: string;
    group_by?: 'day' | 'week' | 'month';
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const response = await apiService.get(
      `/companies/${companyId}/financial-reports/cash-flow?${params}`
    );
    return response.data;
  }

  async getCostCenterAnalysis(companyId: string, filters: {
    start_date: string;
    end_date: string;
    cost_center_ids?: string[];
  }) {
    const params = new URLSearchParams();
    params.append('start_date', filters.start_date);
    params.append('end_date', filters.end_date);
    if (filters.cost_center_ids) {
      filters.cost_center_ids.forEach(id => params.append('cost_center_ids', id));
    }
    
    const response = await apiService.get(
      `/companies/${companyId}/financial-reports/cost-center-analysis?${params}`
    );
    return response.data;
  }

  async getPartnerBalance(companyId: string) {
    const response = await apiService.get(
      `/companies/${companyId}/financial-reports/partner-balance`
    );
    return response.data;
  }
}

export const financialService = new FinancialService();
