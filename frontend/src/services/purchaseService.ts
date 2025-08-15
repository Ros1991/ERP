import { apiService } from './api';

export interface PurchaseCategory {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseRequest {
  id: string;
  company_id: string;
  request_number: string;
  title: string;
  description?: string;
  requested_by_user_id: string;
  approved_by_user_id?: string;
  priority: 'Baixa' | 'Media' | 'Alta' | 'Urgente';
  status: 'Rascunho' | 'Pendente_Aprovacao' | 'Aprovada' | 'Rejeitada' | 'Em_Compra' | 'Parcialmente_Atendida' | 'Concluida' | 'Cancelada';
  estimated_total: number;
  actual_total?: number;
  request_date: string;
  required_by_date?: string;
  approval_date?: string;
  completion_date?: string;
  notes?: string;
  items?: PurchaseItem[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: string;
  purchase_request_id: string;
  category_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchased_quantity?: number;
  purchased: boolean;
  notes?: string;
  category?: PurchaseCategory;
}

export interface CreatePurchaseRequestData {
  title: string;
  description?: string;
  priority: PurchaseRequest['priority'];
  required_by_date?: string;
  notes?: string;
  items: {
    category_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    notes?: string;
  }[];
}

class PurchaseService {
  // Categories
  async getCategories(companyId: string) {
    const response = await apiService.get<PurchaseCategory[]>(
      `/companies/${companyId}/purchase-categories`
    );
    return response.data;
  }

  async createCategory(companyId: string, data: {
    name: string;
    description?: string;
  }) {
    const response = await apiService.post<PurchaseCategory>(
      `/companies/${companyId}/purchase-categories`,
      data
    );
    return response.data;
  }

  async updateCategory(categoryId: string, data: Partial<PurchaseCategory>) {
    const response = await apiService.put<PurchaseCategory>(
      `/purchase-categories/${categoryId}`,
      data
    );
    return response.data;
  }

  async deleteCategory(categoryId: string) {
    await apiService.delete(`/purchase-categories/${categoryId}`);
  }

  // Purchase Requests
  async getRequests(companyId: string, filters?: {
    status?: string;
    priority?: string;
    requested_by?: string;
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
      requests: PurchaseRequest[];
      pagination?: {
        current_page: number;
        total_pages: number;
        total_records: number;
      };
    }>(`/companies/${companyId}/purchase-requests?${params}`);
    
    return response.data;
  }

  async getRequest(requestId: string) {
    const response = await apiService.get<PurchaseRequest>(`/purchase-requests/${requestId}`);
    return response.data;
  }

  async createRequest(companyId: string, data: CreatePurchaseRequestData) {
    const response = await apiService.post<PurchaseRequest>(
      `/companies/${companyId}/purchase-requests`,
      data
    );
    return response.data;
  }

  async updateRequest(requestId: string, data: Partial<PurchaseRequest>) {
    const response = await apiService.put<PurchaseRequest>(
      `/purchase-requests/${requestId}`,
      data
    );
    return response.data;
  }

  async deleteRequest(requestId: string) {
    await apiService.delete(`/purchase-requests/${requestId}`);
  }

  async approveRequest(requestId: string, notes?: string) {
    const response = await apiService.post(
      `/purchase-requests/${requestId}/approve`,
      { notes }
    );
    return response.data;
  }

  async rejectRequest(requestId: string, reason: string) {
    const response = await apiService.post(
      `/purchase-requests/${requestId}/reject`,
      { reason }
    );
    return response.data;
  }

  async markItemAsPurchased(requestId: string, itemId: string, quantity: number) {
    const response = await apiService.post(
      `/purchase-requests/${requestId}/items/${itemId}/mark-purchased`,
      { quantity }
    );
    return response.data;
  }

  // Comments
  async getComments(requestId: string) {
    const response = await apiService.get(
      `/purchase-requests/${requestId}/comments`
    );
    return response.data;
  }

  async addComment(requestId: string, data: {
    content: string;
    is_internal: boolean;
  }) {
    const response = await apiService.post(
      `/purchase-requests/${requestId}/comments`,
      data
    );
    return response.data;
  }

  // Attachments
  async uploadAttachment(requestId: string, formData: FormData) {
    const response = await apiService.post(
      `/purchase-requests/${requestId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteAttachment(requestId: string, attachmentId: string) {
    await apiService.delete(
      `/purchase-requests/${requestId}/attachments/${attachmentId}`
    );
  }

  // Reports
  async getPurchaseAnalysis(companyId: string, filters: {
    start_date: string;
    end_date: string;
    category_id?: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const response = await apiService.get(
      `/companies/${companyId}/purchase-reports/analysis?${params}`
    );
    return response.data;
  }
}

export const purchaseService = new PurchaseService();
