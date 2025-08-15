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
    const response = await api.get<PaginatedResponse<PedidoCompra>>(
      `/empresas/${empresaId}/pedido-compras`,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getById(empresaId: number, pedidoCompraId: number): Promise<PedidoCompra> {
    const response = await api.get<PedidoCompra>(`/empresas/${empresaId}/pedido-compras/${pedidoCompraId}`);
    return response.data;
  }

  async create(empresaId: number, dto: CreatePedidoCompraDTO): Promise<PedidoCompra> {
    const response = await api.post<PedidoCompra>(`/empresas/${empresaId}/pedido-compras`, dto);
    return response.data;
  }

  async update(empresaId: number, pedidoCompraId: number, dto: UpdatePedidoCompraDTO): Promise<PedidoCompra> {
    const response = await api.put<PedidoCompra>(`/empresas/${empresaId}/pedido-compras/${pedidoCompraId}`, dto);
    return response.data;
  }

  async delete(empresaId: number, pedidoCompraId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/pedido-compras/${pedidoCompraId}`);
  }

  async updateStatus(empresaId: number, pedidoCompraId: number, status: string): Promise<PedidoCompra> {
    const response = await api.patch<PedidoCompra>(
      `/empresas/${empresaId}/pedido-compras/${pedidoCompraId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new PedidoCompraService();
