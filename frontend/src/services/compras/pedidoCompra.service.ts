import api from '../../lib/axios'; // config/api';
import type { PedidoCompra, CreatePedidoCompraDTO, UpdatePedidoCompraDTO } from '../../models/compras/PedidoCompra.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class PedidoCompraService {
  async getAll(empresaId: number, page = 1, limit = 10): Promise<PaginatedResponse<PedidoCompra>> {
    const response = await api.get(
      `/empresas/${empresaId}/pedido-compras`,
      { params: { page, limit } }
    );
    
    // Map backend response structure to frontend expected structure
    const backendData = response.data.data; // Nested data from backend
    return {
      data: backendData.items,
      total: backendData.pagination.total,
      page: backendData.pagination.page,
      limit: backendData.pagination.limit
    };
  }

  async getById(empresaId: number, pedidoCompraId: number): Promise<PedidoCompra> {
    const response = await api.get(`/empresas/${empresaId}/pedido-compras/${pedidoCompraId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, dto: CreatePedidoCompraDTO): Promise<PedidoCompra> {
    const response = await api.post(`/empresas/${empresaId}/pedido-compras`, dto);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, pedidoCompraId: number, dto: UpdatePedidoCompraDTO): Promise<PedidoCompra> {
    const response = await api.put(`/empresas/${empresaId}/pedido-compras/${pedidoCompraId}`, dto);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, pedidoCompraId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/pedido-compras/${pedidoCompraId}`);
  }

  async updateStatus(empresaId: number, pedidoCompraId: number, status: string): Promise<PedidoCompra> {
    const response = await api.patch(
      `/empresas/${empresaId}/pedido-compras/${pedidoCompraId}/status`,
      { status }
    );
    return response.data.data; // Extract data from backend response
  }
}

export default new PedidoCompraService();
